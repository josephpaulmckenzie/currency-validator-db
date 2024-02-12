import { RekognitionClient, DetectTextCommand, TextDetection } from '@aws-sdk/client-rekognition';
import * as Interfaces from './interfaces/interfaces';
import { createSerialNumberMappings, federalReserveMapping } from './mappings/additional_mapping';
import { noteValidators, serialNumberPatterns } from './services/serialPatterns';
import { BoundingBox, WordDetection } from './interfaces/interfaces';

async function getTextDetections(imageData: string | Buffer): Promise<Interfaces.UploadData> {
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

		const noteDetails = await checkRegexPatterns(response.TextDetections);
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

async function checkRegexPatterns(textDetections: TextDetection[]) {
	try {
		const matchedWordsHash: Record<string, string> = {};
		const wordDetails: Record<string, WordDetection> = {};
		for (const text of textDetections) {
			const detectedText = text.DetectedText?.replace(/ /g, '');
			if (detectedText) {
				let correctedText = detectedText;

				const correctedWord = checkPotentialMistakenLetter(detectedText);
				if (correctedWord) {
					correctedText = correctedWord;
				}

				for (const patternKey in serialNumberPatterns) {
					const pattern = new RegExp(serialNumberPatterns[patternKey]);

					if (pattern.test(correctedText)) {
						matchedWordsHash['SerialPatternMatch'] = patternKey;
					}
				}

				for (const patternKey in noteValidators) {
					const pattern = new RegExp(noteValidators[patternKey]);

					if (pattern.test(correctedText)) {
						matchedWordsHash[patternKey] = correctedText;

						if (text.Geometry && text.Geometry.BoundingBox) {
							const boundingBox = {
								Width: text.Geometry.BoundingBox.Width ?? 0,
								Height: text.Geometry.BoundingBox.Height ?? 0,
								Left: text.Geometry.BoundingBox.Left ?? 0,
								Top: text.Geometry.BoundingBox.Top ?? 0,
							};

							wordDetails[patternKey] = {
								text: correctedText,
								boundingBox: boundingBox,
							};
						}
					}
				}
			}
		}

		const denomination = matchedWordsHash.validDenomination;
		const serialNumber = matchedWordsHash.validSerialNumberPattern;
		const additionalDetails = getAdditionalDetails(
			createSerialNumberMappings('./src/mappings/additionalMappingDetails.txt')[`$${denomination}`],
			serialNumber
		);

		const details: Interfaces.UploadData = {
			validDenomination: {
				text: wordDetails.validDenomination?.text ?? '',
				boundingBox: wordDetails.validDenomination?.boundingBox ?? {},
			},
			frontPlateId: {
				text: wordDetails.frontPlateId?.text ?? '',
				boundingBox: wordDetails.frontPlateId?.boundingBox ?? {},
			},
			SerialPatternMatch: {
				text: wordDetails.SerialPatternMatch?.text ?? 'Regular',
				boundingBox: wordDetails.SerialPatternMatch?.boundingBox ?? {},
			},
			serialNumber: {
				text: wordDetails.validSerialNumberPattern?.text ?? '',
				boundingBox: wordDetails.validSerialNumberPattern?.boundingBox ?? {},
			},
			federalReserveId: {
				text: wordDetails.federalReserveId?.text ?? '',
				boundingBox: wordDetails.federalReserveId?.boundingBox ?? {},
			},
			federalReserveLocation: federalReserveMapping[wordDetails.federalReserveId?.text ?? ''] ?? '',
			notePositionId: {
				text: wordDetails.notePositionId?.text ?? '',
				boundingBox: wordDetails.notePositionId?.boundingBox ?? {},
			},
			seriesYear: additionalDetails?.seriesYear ?? '',
			treasurer: additionalDetails?.treasurer ?? '',
			secretary: additionalDetails?.secretary ?? '',
			s3Url: '',
			validSerialNumberPattern: '',
			text: function (s3Key: string, text: any): unknown {
				throw new Error('Function not implemented.');
			},
		};

		if (matchedWordsHash.federalReserveId && federalReserveMapping[matchedWordsHash.federalReserveId]) {
			details.federalReserveLocation = federalReserveMapping[matchedWordsHash.federalReserveId];
		}

		console.log('wordDetails', wordDetails);
		console.log('details', details);
		return details;
	} catch (error) {
		throw new Error(`Error in checkRegexPatterns ${JSON.stringify(error)}`);
	}
}

function checkPotentialMistakenLetter(detectedText: string): string | null {
	if (/[A-L]\s?[i]/.test(detectedText)) {
		return detectedText.replace(/Ei/g, 'E1');
	}
	return null;
}

export { getTextDetections };
