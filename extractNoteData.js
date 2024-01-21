const { readFileSync, writeFileSync, appendFileSync, existsSync } = require('fs');
const { serialNumberPatterns, noteValidators } = require('./serialPatterns');
const { RekognitionClient, DetectTextCommand } = require('@aws-sdk/client-rekognition');
const { Console } = require('console');

const rekognition = new RekognitionClient({ region: 'us-east-1' }); // Replace with your AWS region

// Replace Cyrillic characters with English equivalents
// This is because sometimes the little letters from note position & front plate identifers were coming back weird // Hopefully this is just a temp fix
function replaceCyrillic(text) {
	const cyrillicToEnglishMap = {
		в: 'B',
		В: 'B',
	};

	return text.replace(/[а-яА-Я]/g, (match) => cyrillicToEnglishMap[match] || match);
}

function checkFileExists(filePath) {
	try {
		if (!existsSync(filePath)) {
			throw new Error('File does not exist.');
		}
	} catch (error) {
		throw {
			status: 400,
			error: error.message,
			inputDetails: {
				filePath,
			},
			validator: 'Check existence of file',
		};
	}
}

function readFile(filePath) {
	try {
		checkFileExists(filePath);
		return readFileSync(filePath, 'utf8');
	} catch (error) {
		throw {
			status: 400,
			error: `Error reading file: ${error.message}`,
			inputDetails: {
				filePath,
			},
			validator: 'fileExistence',
		};
	}
}

// Create mappings using both the denomination as well as the series letter from the serial number
function createSerialNumberMappings(filePath) {
	try {
		// const mappingData = readFile(filePath);
		// const lines = mappingData.split('\n');

		// Using inline vaariables instead - I wanted to give an example of how they did look not using them and how they do using them.
		// Like pemas in math at school
		const lines = readFile(filePath).split('\n');
		const serialNumberMappings = {};

		lines.forEach((line) => {
			if (line.trim() !== '') {
				const [denomination, secretary, treasurer, seriesYear, serialNumberPrefix] = line.trim().split(/\s+/);

				if (denomination && serialNumberPrefix) {
					if (!serialNumberMappings[denomination]) {
						serialNumberMappings[denomination] = [];
					}

					const escapedPrefix = serialNumberPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

					serialNumberMappings[denomination].push({
						pattern: new RegExp(`^${escapedPrefix}`),
						denomination,
						seriesYear,
						treasurer,
						secretary,
					});
				}
			}
		});

		return serialNumberMappings;
	} catch (error) {
		throw {
			status: 400,
			error: `Error creating Serial Number Mappings ${error} `,
			inputDetails: {},
			validator: 'createSerialNumberMappings',
		};
	}
}

// Get additional details based on denomination and serial number
function getAdditonalDetails(denomination, serialNumber) {
	try {
		if (denomination) {
			const matchedDetail = denomination.find((detail) => {
				return detail.pattern.test(serialNumber.charAt(0));
			});

			if (matchedDetail) {
				return {
					seriesYear: matchedDetail.seriesYear,
					treasurer: matchedDetail.treasurer,
					secretary: matchedDetail.secretary,
				};
			}
		}
	} catch (error) {
		throw {
			status: 400,
			error: `Error obtaining additionalDetails, ${error}`,
			inputDetails: {},
			validator: 'additionalDetails',
		};
	}
}

// Detects text in an image and tests and verifies the results found are at least in expected format
async function detectText(imagePath, outputJsonPath) {
	try {
		let additonalDetails;
		const command = new DetectTextCommand({
			Image: { Bytes: readFileSync(imagePath) },
		});
		const response = await rekognition.send(command);

		const detectedTextData = [];
		const { filteredWords } = JSON.parse(readFileSync('./filteredWords.json'));

		const regexPatterns = [
			/^[A-L]\s*[1-9]\d{0,2}$/,
			/^([A-Q]\s?[A-L]?|[A-L])\s?(\d{8})\s?([A-L*])$/,
			/\b(?:1|2|5|10|20|50|100)\b/,
			/^(?:FW[[:blank:]]?)?([A-J])[[:blank:]]?(\d{1,4})$/,
			/^(?:[A-Q]\s?[A-L]?\s?|\s)?(\d*420\d*)(?:\s?[A-Q])?$/,
		];

		// Gets denomination and serial number from the text detections
		const { denomination, serialNumber } = await extractDenominationAndSerial(response.TextDetections);

		// If denomination and serial number both came back right, get additional details
		if (denomination && serialNumber) {
			const mappingFilePath = './mapping_data.txt';
			additonalDetails = getAdditonalDetails(createSerialNumberMappings(mappingFilePath)[`\$${denomination}`], serialNumber);
		}

		for (const text of response.TextDetections) {
			detectedWords = replaceCyrillic(text.DetectedText.toUpperCase()).split();

			for (const word of Object.values(noteValidators)) {
				let foundMatchingPatternForWord = false;

				for (const regex of regexPatterns) {
					// Checks to see if any detected text is in the filtered list
					if (regex.test(word) && text.Confidence >= 50 && !filteredWords.includes(word)) {
						const existingEntryIndex = detectedTextData.findIndex((entry) => {
							return (
								entry.detectedText === text.DetectedText &&
								entry.boundingBox.Height === text.Geometry.BoundingBox.Height &&
								entry.boundingBox.Left === text.Geometry.BoundingBox.Left &&
								entry.boundingBox.Top === text.Geometry.BoundingBox.Top &&
								entry.boundingBox.Width === text.Geometry.BoundingBox.Width
							);
						});

						// If it doesn't exist, add it to the detected text data
						if (existingEntryIndex === -1) {
							detectedTextData.push({
								detectedText: replaceCyrillic(text.DetectedText.toUpperCase()),
								boundingBox: text.Geometry.BoundingBox,
								confidence: text.Confidence,
								filteredWord: false,
							});
						}
						foundMatchingPatternForWord = true;
						break;
					}
				}

				if (foundMatchingPatternForWord) {
					break;
				}
			}
		}

		const formattedData = {};
		const federalReserveRegex = /^[A-L]\s*[1-9]\d{0,2}$/;
		const notePositionRegex = /^[A-J]\s*[1-5]$/;
		const frontPlateNumberRegex = /^(?:FW\s*)?[A-J]\s*\d{1,4}$/;

		// Loop through all detected text data and check via our regex patterns for matches
		for (const text of detectedTextData) {
			const { detectedText } = text;
			const key = `${denomination}-${serialNumber}`;

			if (!formattedData[key]) {
				formattedData[key] = {
					Denomination: denomination,
					SerialNumber: serialNumber,
					SeriesYear: additonalDetails.seriesYear,
					Treasurer: additonalDetails.treasurer,
					Secretary: additonalDetails.secretary,
					federalReserveIndicator: '',
					notePosition: '',
					frontPlateNumber: '',
				};
			}

			const fourtwenty = /^(?:[A-Q]\s?[A-L]?\s?|\s)?(\d*420\d*)(?:\s?[A-Q])?$/;

			if (fourtwenty.test(serialNumber)) {
				formattedData[key].uniqueSerialNumberType = 'Detected a 420 note';
			}

			// Checks if detected mnatches our federal reserve regex pattern
			if (federalReserveRegex.test(detectedText)) {
				// Makes sure the federalReserveIndicator isn't already set and if it is don't update it again
				if (!formattedData[key].federalReserveIndicator) {
					const letterToNumberMapping = {
						A: 1,
						B: 2,
						C: 3,
						D: 4,
						E: 5,
						F: 6,
						G: 7,
						H: 8,
						I: 9,
						J: 10,
						K: 11,
						L: 12,
					};
					const letter = serialNumber.charAt(1);
					const correspondingNumber = letterToNumberMapping[letter];
					formattedData[key].federalReserveIndicator = `${letter}${correspondingNumber}`;
				}
			}

	// Check if the detected text matches the note position pattern
if (notePositionRegex.test(detectedText.replace(/[I.]/g, '1'))) {
  // Check if the detected text is not equal to federalReserveIndicator
  if (detectedText !== formattedData[key].federalReserveIndicator) {
    // If it's not equal, then update the notePosition
    formattedData[key].notePosition = detectedText.replace(/[I.]/g, '1');
  }
} else {
  // else check if it matches any other patterns that'll help us ensure the odd formats on some notes are accounted for too
}


			if (frontPlateNumberRegex.test(detectedText.replace(/\s/g, ''))) {
				if (detectedText !== formattedData[key].notePosition && detectedText !== formattedData[key].federalReserveIndicator) {
					formattedData[key].frontPlateNumber = detectedText;
				}
			}
		}

		const resultArray = Object.values(formattedData);
		console.log(JSON.stringify(resultArray[0]));

		// Appends the results to the output JSON files
		appendFileSync(outputJsonPath, JSON.stringify(resultArray[0], null, 2));

		return detectedTextData;
	} catch (err) {
		console.error('Error detecting text:', err);
		return [];
	}
}

// Gets the denomination and serial number
async function extractDenominationAndSerial(textDetections) {
	let detectedDenomination;
	let detectedSerialNumber;

	try {
    for (const text of textDetections) {
      // console.log(text)
			// Checks for valid denominations ($1,$2,$5,$10,$20,$50,$100) * without the $ sign *
      const denominationMatch = text.DetectedText.match(/^(1|2|5|10|20|50|100)$/);
			// Makes sure that the serial number came back as a valid pattern. 1-2 Letters followed by 8 digits follwed by 1 Letter (or a star)
			const serialNumberMatch = text.DetectedText.match(/^([A-Q]\s?[A-L]?|[A-L])\s?(\d{8})\s?([A-L*])$/);

      if (denominationMatch) {
				detectedDenomination = denominationMatch[0];
			}

      if (serialNumberMatch) {
				detectedSerialNumber = serialNumberMatch[0];
			}
		}
  } catch (error) {
    console.log(error)
  }

	return {
		denomination: detectedDenomination,
		serialNumber: detectedSerialNumber,
	};
}

// detectText('./testing/test_images/IMG_2461.jpg', './output.json');

module.exports = detectText;
