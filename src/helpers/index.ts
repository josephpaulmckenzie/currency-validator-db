import { RekognitionClient, DetectTextCommand, TextDetection } from '@aws-sdk/client-rekognition';
import { DenominationDetail, MatchedDetail, UploadData } from '../interfaces/interfaces';
import { createSerialNumberMappings, federalReserveMapping } from '../mappings/additional_mapping';
import { serialNumberPatterns, noteValidators } from '../services/serialPatterns';

function getAdditionalDetails(denomination: DenominationDetail[], serialNumber: string): MatchedDetail {
	try {
		if (!denomination) {
			throw new Error('Denomination of the note was not detected or provided.');
		}

		const matchedDetail = denomination.find((detail) => {
			const regex = typeof detail.serialNumberPrefix === 'string' ? new RegExp(detail.serialNumberPrefix) : detail.serialNumberPrefix;
			return regex.test(serialNumber.charAt(0));
		});

		if (!matchedDetail) {
			throw {
				status: 400,
				error: `'There was a problem when attempting to map the data `,
				inputDetails: {
					denomination: denomination,
					serialNumber: serialNumber,
				},
				validator: 'Treasurer and Secetary Mapping',
			};
		}

		return {
			seriesYear: matchedDetail.seriesYear,
			treasurer: matchedDetail.treasurer,
			secretary: matchedDetail.secretary,
		};
	} catch (error) {
		throw {
			status: 400,
			error: `Error obtaining additionalDetails: ${error}`,
			inputDetails: {},
			validator: 'additionalDetails',
		};
	}
}

/**
 * Retrieves text detections from an image using Amazon Rekognition.
 * @param {Buffer} imageData - The image data as either a base64 string or a Buffer.
 * @returns {Promise<UploadData>} A promise resolving to the detected text and additional details.
 * @throws {Error} If there is an error processing the image.
 */
async function getTextDetections(imageData: Buffer): Promise<UploadData> {
	try {
		// Check if the image data is valid
		validateImageData(imageData);

		// Create a DetectTextCommand using the provided image data
		const command = createDetectTextCommand(imageData);

		// Send the command to Amazon Rekognition and await the response
		const response = await new RekognitionClient({ region: 'us-east-1' }).send(command);
		const textDetections = response.TextDetections;

		// Check if any text detections are found in the response
		if (!textDetections || textDetections.length === 0) {
			throw new Error('No text detections found in the response.');
		}

		// Process the text detections and return the result
		return await processTextDetections(textDetections);
	} catch (error) {
		// Check if the caught error is an instance of the Error class
		if (error instanceof Error) {
			// If an error occurs during processing, rethrow with a more descriptive message
			throw new Error(`Error processing image: ${error.message}`);
		} else {
			// If the error is of an unknown type, throw a generic error message
			throw new Error('An unknown error occurred during image processing.');
		}
	}
}

/**
 * Validates the image data.
 * @param {Buffer} imageData - The image data.
 * @throws {Error} If the image data is invalid.
 */
function validateImageData(imageData: Buffer): void {
	if (!imageData || !Buffer.isBuffer(imageData) || imageData.length === 0) {
		throw new Error('Invalid image data. Please provide valid image data as a Buffer.');
	}
}

/**
 * Creates a DetectTextCommand using the provided image data.
 * @param {Buffer} imageData - The image data.
 * @returns {DetectTextCommand} The DetectTextCommand instance.
 */
function createDetectTextCommand(imageData: Buffer): DetectTextCommand {
	return new DetectTextCommand({
		Image: {
			Bytes: imageData,
		},
		Filters: {
			WordFilter: {
				MinConfidence: 50,
			},
		},
	});
}

/**
 * Processes the text detections and extracts relevant details.
 * @param {TextDetection[]} textDetections - The text detections.
 * @returns {Promise<UploadData>} The extracted details.
 * @throws {Error} If there is an error processing the text detections.
 */
async function processTextDetections(textDetections: TextDetection[]): Promise<UploadData> {
	try {
		// Initialize a hash to store matched words
		const matchedWordsHash: Record<string, string> = {};

		// Iterate through the text detections
		for (const text of textDetections) {
			const detectedText = text.DetectedText?.replace(/ /g, '');

			if (detectedText) {
				let correctedText = detectedText;

				// Check for possible mistaken identifiers
				const correctedWord = checkPotentialMistakenLetter(detectedText);
				if (correctedWord) {
					correctedText = correctedWord;
				}

				// Check for unique serial number patterns
				for (const patternKey in serialNumberPatterns) {
					const pattern = new RegExp(serialNumberPatterns[patternKey]);

					if (pattern.test(correctedText) && !matchedWordsHash['SerialPatternMatch']) {
						matchedWordsHash['SerialPatternMatch'] = patternKey;
					}
				}

				// Check if the detected text matches any note validators
				for (const patternKey in noteValidators) {
					const pattern = new RegExp(noteValidators[patternKey]);

					if (pattern.test(correctedText) && !matchedWordsHash[patternKey]) {
						matchedWordsHash[patternKey] = correctedText;
					}
				}
			}
		}

		// Extract relevant details from the matched words
		const denomination = matchedWordsHash.validDenomination;
		const serialNumber = matchedWordsHash.validSerialNumberPattern;

		// Assuming denomination and serialNumber are already defined
		const mappings = createSerialNumberMappings('./src/mappings/mappingfile.csv');
		const denominationKey = `$${denomination}`;
		const additionalDetails = getAdditionalDetails(mappings[denominationKey], serialNumber);

		const { seriesYear, treasurer, secretary } = additionalDetails;
		// Build the final details object
		const details: UploadData = {
			validdenomination: matchedWordsHash.validDenomination,
			frontPlateId: matchedWordsHash.frontPlateId,
			serialPatternMatch: matchedWordsHash.SerialPatternMatch,
			serialNumber: matchedWordsHash.validSerialNumberPattern,
			federalReserveId: matchedWordsHash.federalReserveId,
			federalReserveLocation: additionalDetails.federalReserveLocation,
			notePositionId: matchedWordsHash.notePositionId,
			seriesYear,
			treasurer,
			secretary,
			s3Url: '',
		};

		// Add federal reserve location if available
		if (matchedWordsHash.federalReserveId && federalReserveMapping[matchedWordsHash.federalReserveId]) {
			details.federalReserveLocation = federalReserveMapping[matchedWordsHash.federalReserveId];
		}

		return details;
	} catch (error) {
		// If there is an error, throw with additional error details
		throw new Error(`Error in processTextDetections: ${error}`);
	}
}

/**
 * Checks for potential mistaken letters and corrects them.
 * @param {string} detectedText - The detected text.
 * @returns {string | null} The corrected text, or null if no correction is needed.
 */
function checkPotentialMistakenLetter(detectedText: string): string | null {
	if (/[A-L]\s?[i]/.test(detectedText)) {
		return detectedText.replace(/Ei/g, 'E1');
	}
	return null;
}

// Export the getTextDetections function
export { getTextDetections };
