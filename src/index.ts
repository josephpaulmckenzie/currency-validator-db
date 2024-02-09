import { RekognitionClient, DetectTextCommand, TextDetection } from '@aws-sdk/client-rekognition';
import * as Interfaces from './interfaces/interfaces';
import { createSerialNumberMappings, federalReserveMapping } from './mappings/additional_mapping';
import { noteValidators, serialNumberPatterns } from './services/serialPatterns';

/**
 * Retrieves text detections from an image using Amazon Rekognition.
 * @param {string | Buffer} imageData - The image data as either a base64 string or a Buffer.
 * @returns {Promise<Interfaces.UploadData>} A promise resolving to the detected text and additional details.
 * @throws {Error} If there is an error processing the image.
 */
async function getTextDetections(imageData: string | Buffer): Promise<Interfaces.UploadData> {
	try {
		// Check if the image data is empty or undefined
		if (!imageData || (typeof imageData === 'string' && imageData.length === 0) || (Buffer.isBuffer(imageData) && imageData.length === 0)) {
			throw new Error('Image data is empty or undefined.');
		}

		// Create a DetectTextCommand using the Rekognition client
		const command = new DetectTextCommand({
			Image: {
				Bytes: Buffer.isBuffer(imageData) ? imageData : Buffer.from(imageData, 'base64'),
			},
			Filters: {
				WordFilter: {
					MinConfidence: 50,
				},
			},
		});

		// Send the command and await the response
		const response = await new RekognitionClient({ region: 'us-east-1' }).send(command);

		// Check if there are any text detections in the response
		if (!response.TextDetections || response.TextDetections.length === 0) {
			throw new Error('No text detections found in the response.');
		}

		// Process the text detections and return the result
		const noteDetails = await checkRegexPatterns(response.TextDetections);
		return noteDetails;
	} catch (error: unknown) {
		if (error instanceof Error) {
			// If the error is an instance of Error, throw it
			throw new Error(`Error processing image: ${error.message}`);
		} else {
			// Otherwise, throw an unknown error
			throw new Error('Unknown error occurred');
		}
	}
}

/**
 * Retrieves additional details based on the detected denomination and serial number.
 * @param {Interfaces.DenominationDetail[]} denomination - The detected denomination details.
 * @param {string} serialNumber - The detected serial number.
 * @returns {Interfaces.MatchedDetail} The matched detail.
 * @throws {Error} If there is an error obtaining additional details.
 */
function getAdditionalDetails(denomination: Interfaces.DenominationDetail[], serialNumber: string): Interfaces.MatchedDetail {
	try {
		// Check if the denomination is empty
		if (!denomination) {
			throw new Error('Denomination of the note was not detected or provided.');
		}

		// Find the matched detail based on the serial number pattern
		const matchedDetail = denomination.find((detail) => {
			const regex = typeof detail.pattern === 'string' ? new RegExp(detail.pattern) : detail.pattern;
			return regex.test(serialNumber.charAt(0));
		});

		// If no matched detail is found, throw an error
		if (!matchedDetail) {
			throw new Error('No matching detail found');
		}

		// Return the matched detail
		return {
			seriesYear: matchedDetail.seriesYear,
			treasurer: matchedDetail.treasurer,
			secretary: matchedDetail.secretary,
		};
	} catch (error) {
		// If there is an error, throw with additional error details
		throw {
			status: 400,
			error: `Error obtaining additionalDetails: ${error}`,
			inputDetails: {},
			validator: 'additionalDetails',
		};
	}
}

/**
 * Processes the text detections and extracts relevant details.
 * @param {TextDetection[]} textDetections - The text detections.
 * @returns {Interfaces.UploadData} The extracted details.
 * @throws {Error} If there is an error processing the text detections.
 */
async function checkRegexPatterns(textDetections: TextDetection[]): Promise<Interfaces.UploadData> {
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

					if (pattern.test(correctedText)) {
						matchedWordsHash['SerialPatternMatch'] = patternKey;
					}
				}

				// Check if the detected text matches any note validators
				for (const patternKey in noteValidators) {
					const pattern = new RegExp(noteValidators[patternKey]);

					if (pattern.test(correctedText)) {
						matchedWordsHash[patternKey] = correctedText;
					}
				}
			}
		}

		// Extract relevant details from the matched words
		const denomination = matchedWordsHash.validDenomination;
		const serialNumber = matchedWordsHash.validSerialNumberPattern;
		const additionalDetails = getAdditionalDetails(
			createSerialNumberMappings('./src/mappings/additionalMappingDetails.txt')[`$${denomination}`],
			serialNumber
		);

		// Build the final details object
		const details: Interfaces.UploadData = {
			validDenomination: matchedWordsHash.validDenomination,
			frontPlateId: matchedWordsHash.frontPlateId,
			SerialPatternMatch: matchedWordsHash.SerialPatternMatch,
			serialNumber: matchedWordsHash.validSerialNumberPattern,
			federalReserveId: matchedWordsHash.federalReserveId,
			federalReserveLocation: '',
			notePositionId: matchedWordsHash.notePositionId,
			seriesYear: additionalDetails?.seriesYear,
			treasurer: additionalDetails?.treasurer,
			secretary: additionalDetails?.secretary,
			s3Url: '',
		};

		// Add federal reserve location if available
		if (matchedWordsHash.federalReserveId && federalReserveMapping[matchedWordsHash.federalReserveId]) {
			details.federalReserveLocation = federalReserveMapping[matchedWordsHash.federalReserveId];
		}

		return details;
	} catch (error) {
		// If there is an error, throw with additional error details
		throw new Error(`Error in checkRegexPatterns ${JSON.stringify(error)}`);
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

export { getTextDetections };
