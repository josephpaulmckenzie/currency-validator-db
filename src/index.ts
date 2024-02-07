//index.ts

import { RekognitionClient, DetectTextCommand, TextDetection } from '@aws-sdk/client-rekognition';
import { createSerialNumberMappings, federalReserveMapping } from './mappings/additional_mapping';
import * as Interfaces from './interfaces/interfaces';
import { noteValidators, serialNumberPatterns } from './services/serialPatterns';

async function getTextDetections(imageData: string | Buffer, fileName: string) {
	try {
		if (!imageData || (typeof imageData === 'string' && imageData.length === 0) || (Buffer.isBuffer(imageData) && imageData.length === 0)) {
			throw new Error('Image data is empty or undefined.');
		}

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

		const response = await new RekognitionClient({ region: 'us-east-1' }).send(command);

		if (!response.TextDetections || response.TextDetections.length === 0) {
			throw new Error('No text detections found in the response.');
		}

		const noteDetails = await checkRegexPatterns(response.TextDetections, fileName);

		return noteDetails;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Error processing image: ${error.message}`);
		} else {
			throw new Error('Unknown error occurred');
		}
	}
}

function getAdditionalDetails(denomination: Interfaces.DenominationDetail[], serialNumber: string): Interfaces.MatchedDetail {
    try {
        if (!denomination) {
            throw new Error('Denomination of the note was not detected or provided.');
        }

        const matchedDetail = denomination.find((detail) => {
            // Checks if the pattern is already a RegExp or if it is a string creates a RegExp object
            const regex = typeof detail.pattern === 'string' ? new RegExp(detail.pattern) : detail.pattern;
            return regex.test(serialNumber.charAt(0));
        });

        if (!matchedDetail) {
            throw new Error('No matching detail found');
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


async function checkRegexPatterns(textDetections: TextDetection[], fileName: string) {
	try {
		const matchedWordsHash: Record<string, string> = {};

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

				// Check to make sure that all detected identifiers match the expected format
				for (const patternKey in noteValidators) {
					const pattern = new RegExp(noteValidators[patternKey]);

					if (pattern.test(correctedText)) {
						matchedWordsHash[patternKey] = correctedText;
					}
				}
			}
		}

		const denomination = matchedWordsHash.validDenomination;
		const serialNumber = matchedWordsHash.validSerialNumberPattern;

		// Get the series year,secetary and treasurer from our mapping details in the event that we couldn't read them off the uploaded note.
		const additionalDetails = getAdditionalDetails(
			createSerialNumberMappings('./src/mappings/additionalMappingDetails.txt')[`$${denomination}`],
			serialNumber
		);

		// Upload image to S3 and get the location of the upload from the buccket
		// const s3Url = await uploadingToS3({ s3Url: '', serialNumber }, fileName);

		const details = {
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

		if (matchedWordsHash.federalReserveId && federalReserveMapping[matchedWordsHash.federalReserveId]) {
			details.federalReserveLocation = federalReserveMapping[matchedWordsHash.federalReserveId];
		}


		return details;
	} catch (error) {
		throw new Error(`Error in checkRegexPatterns ${JSON.stringify(error)}`);
	}
}

function checkPotentialMistakenLetter(detectedText: string) {
	if (/[A-L]\s?[i]/.test(detectedText)) {
		return detectedText.replace(/Ei/g, 'E1');
	}
	return null;
}

export { getTextDetections };
// getTextDetections('./MK.jpeg');
