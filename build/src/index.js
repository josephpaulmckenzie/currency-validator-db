"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextDetections = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// serialPatterns.js
const client_rekognition_1 = require("@aws-sdk/client-rekognition");
const fs_1 = require("fs");
const errorClasses_1 = require("./classes/errorClasses");
function checkFileExists(filePath) {
    if (!(0, fs_1.existsSync)(filePath)) {
        throw new errorClasses_1.FileNotFoundError('File does not exist.');
    }
}
function readFile(filePath) {
    try {
        checkFileExists(filePath);
        return (0, fs_1.readFileSync)(filePath, 'utf8');
    }
    catch (error) {
        if (error instanceof errorClasses_1.FileNotFoundError) {
            throw new Error(`Error reading file: ${error.message}`);
        }
        else {
            throw new Error(`Error reading file: ${error}`);
        }
    }
}
async function getTextDetections(filePath) {
    try {
        const client = new client_rekognition_1.RekognitionClient({ region: 'us-east-1' });
        const command = new client_rekognition_1.DetectTextCommand({
            Image: { Bytes: (0, fs_1.readFileSync)(filePath) },
            Filters: {
                WordFilter: {
                    MinConfidence: 50,
                },
            },
        });
        const response = await client.send(command);
        // console.log('response',response)
        if (!response ||
            !response.TextDetections ||
            response.TextDetections.length === 0) {
            throw new Error('No text detections found in the response.');
        }
        const noteDetails = checkRegexPatterns(response.TextDetections);
        const federalReserveMapping = {
            A1: 'Boston, MA',
            B2: 'New York City, NY',
            C3: 'Philadelphia, PA',
            D4: 'Cleveland, OH',
            E5: 'Richmond, VA',
            F6: 'Atlanta, GA',
            G7: 'Chicago, IL',
            H8: 'St. Louis, MO',
            I9: 'Minneapolis, ME',
            J10: 'Kansas City, MO',
            K11: 'Dallas, TX',
            L12: 'San Francisco, CAs',
        };
        if (noteDetails.federalReserveId &&
            federalReserveMapping[noteDetails.federalReserveId]) {
            noteDetails.federalReserveLocation =
                federalReserveMapping[noteDetails.federalReserveId];
        }
        console.log('!!!!!Note Details!!!!!!', noteDetails);
        return noteDetails;
    }
    catch (error) {
        // console.log(error);
        if (error) {
            throw new Error('File does not exist.');
        }
        else {
            // console.log(error);
            throw new Error(`${JSON.stringify(error)}`);
        }
    }
}
exports.getTextDetections = getTextDetections;
function createSerialNumberMappings(filePath) {
    try {
        const lines = readFile(filePath).split('\n');
        const serialNumberMappings = {};
        lines.forEach(line => {
            if (line.trim() !== '') {
                const [denomination, secretary, treasurer, seriesYear, serialNumberPrefix,] = line.trim().split(/\s+/);
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
        // console.log(serialNumberMappings)
        return serialNumberMappings;
    }
    catch (error) {
        throw {
            status: 400,
            error: `Error creating Serial Number Mappings ${error} `,
            inputDetails: {},
            validator: 'createSerialNumberMappings',
        };
    }
}
// Function to get additional details
function getAdditionalDetails(denomination, serialNumber) {
    try {
        if (denomination) {
            const matchedDetail = denomination.find(detail => {
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
        throw new Error('Error');
    }
    catch (error) {
        throw {
            status: 400,
            error: `Error obtaining additionalDetails, ${error}`,
            inputDetails: {},
            validator: 'additionalDetails',
        };
    }
}
function checkRegexPatterns(textDetections) {
    var _a;
    try {
        // console.log('Text detections:', textDetections); // Log the entire array of text detections
        const matchedWordsHash = {};
        for (const text of textDetections) {
            const detectedText = (_a = text.DetectedText) === null || _a === void 0 ? void 0 : _a.replace(/ /g, '');
            // console.log('Detected text:', text); // Log each detected text
            if (detectedText) {
                let correctedText = detectedText;
                // Check for potential mistaken letters
                const correctedWord = checkPotentialMistakenLetter(detectedText);
                if (correctedWord) {
                    correctedText = correctedWord;
                }
                // Check against unique serial number patterns
                for (const patternKey in serialNumberPatterns) {
                    const pattern = new RegExp(serialNumberPatterns[patternKey]);
                    if (pattern.test(correctedText)) {
                        matchedWordsHash['SerialPatternMatch'] = patternKey;
                    }
                }
                // Check against the note validators patterns
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
        const additionalDetails = getAdditionalDetails(createSerialNumberMappings('./mapping_data.txt')[`$${denomination}`], serialNumber);
        const details = {
            validDenomination: matchedWordsHash.validDenomination,
            frontPlateId: matchedWordsHash.frontPlateId,
            SerialPatternMatch: matchedWordsHash.SerialPatternMatch,
            validSerialNumberPattern: matchedWordsHash.validSerialNumberPattern,
            federalReserveId: matchedWordsHash.federalReserveId,
            federalReserveLocation: '',
            notePositionId: matchedWordsHash.notePositionId,
            seriesYear: additionalDetails === null || additionalDetails === void 0 ? void 0 : additionalDetails.seriesYear,
            treasurer: additionalDetails === null || additionalDetails === void 0 ? void 0 : additionalDetails.treasurer,
            secretary: additionalDetails === null || additionalDetails === void 0 ? void 0 : additionalDetails.secretary,
        };
        // console.log('Details:', details); // Log the extracted details
        return details;
    }
    catch (error) {
        // console.error(`Error in checkRegexPatterns: ${error}`);
        throw new Error(`Error in checkRegexPatterns ${JSON.stringify(error)}`);
    }
}
function checkPotentialMistakenLetter(detectedText) {
    // Check if the detected text contains a potential mistaken letter
    if (/[A-L]\s?[i]/.test(detectedText)) {
        // Replace "Ei" with "E1"
        return detectedText.replace(/Ei/g, 'E1');
    }
    return null;
}
const serialNumberPatterns = {
    // Example: Check if a serial number matches the low serial number pattern
    isLowSerialNumberPattern: /^[A-Q]?[A-L]\s?0{4}\d{4}\s?[A-Q]$/,
    // Examples: ' AB00000011C, BL 00001234 D , DA 00000001L'
    // Example: Check if a serial number matches the high serial number pattern
    isHighSerialNumberPattern: /^[A-Q]?[A-L]\s?9{4}\d{4}\s?[A-Q]$/,
    // Examples: 'AB99999911C, BL 99991234 D , DA 99999991L'
    // Example: Check if a serial number matches the ladder pattern
    isLadderSerialPattern: /^(?:\d{8}|01234567|12345678|23456789|87654321|98765432)$/,
    // Examples: 'A12345678D,DL98765432D'
    // Checks to see if a serial number contains all the same digits.
    isASolidNumberSerialPattern: /^(?:[A-Q]?[A-L](?:\s?(\d)\1{7})(?:\s?[A-Q])|(\d)\2{7})$/,
    // Examples:',A11111111D,BA77777777C,CD22222222A'
    // Radar Serial Number - A radar is where the second four digits are the reverse of the first four digits.
    isRadarSerialPattern: /^[A-Q]?[A-L](?:\s?(\d)(\d)(\d)(\d)\4\3\2\1)(?:\s?(\d)(\d)(\d)(\d)\1\2\3\4)(?:\s?[A-Q])$/,
    // // Examples: 'AC11188111G,LA20066002I,LM12344321A'
    // Radar Repeater - A radar repeater is both a radar and a repeater.
    isRadarRepeaterSerialPattern: /^[A-Q]?[A-L](?:\s?(?=\d*$)\d*(\d{4})\d*\1\d*)(?:[[:blank:]][A-Q])$/,
    // Examples: '01100110,02200220,98899889'
    // Super Radar - In a super radar, the interior digits are all the same.
    isSuperRadarSerialPattern: /^[A-Q]?[A-L](?:\s?(\d)\1*([^\1]\1*))(?:[[:blank:]][A-Q])$/,
    // Examples: '71111117,98888889,21111112'
    // // Super Repeater - In a super repeater, the first two digits are repeated four times.
    isSuperRepeaterSerialPattern: /^[A-Q]?[A-L](?:\s?(\d{2})\1{3})(?:[[:blank:]][A-Q])$/,
    // Examples: '01010101, 02020202, 03030303'
    // Double Quad - In a double quad serial number, the first four digits and the second four digits are the same.
    isDoubleQuadSerialPattern: /^[A-Q]?[A-L](?:\s?(\d{4})\1)(?:[[:blank:]][A-Q])$/,
    // Examples: '12341234,08800880,24202420'
    // Seven-Of-A-Kind - In a seven-of-a-kind serial number, seven digits are all the same.
    isSevenOfAKindSerialPattern: /^[A-Q]?[A-L](?:\s?(\d)(?:.*?\1){6})(?:[[:blank:]][A-Q])$/,
    // // Example: '11112111'
    // Seven-In-A-Row - In a seven-in-a-row serial number, seven consecutive digits are all the same.
    isSevenInArowSerialPattern: /^[A-Q]?[A-L](?:\s?(\d)\1{6})(?:[[:blank:]][A-Q])$/,
    // // Example: '11111110'
    // Binary - In a binary serial number, only two numbers appear.
    isBinarySerialPattern: /^[A-Q]?[A-L](?:\s?(?!(\d)\1*$)([0-9])\d*([0-9])\d*)(?:[[:blank:]][A-Q])$/,
    // // Examples: '10101010,12122112,34343434'
    // True Binary - In a true binary serial number, those two numbers are zero and one.
    isTrueBinarySerialPattern: /^[A-Q]?[A-L](?:\s?(01|10)+)(?:[[:blank:]][A-Q])$/,
    // Example: '01010101'
    // Example: Check if a serial number contains the number 420
    fourTwentySerialPattern: /^(?:[A-Q]\s?[A-L]?(?:\s?|\s)(\d*420\d*)(?:\s?[A-Q]))$/,
};
const noteValidators = {
    // Valid Serial Number Pattern - Check if a serial number matches the serial number pattern(s)
    validSerialNumberPattern: /^[A-Q]?[A-L]\s?\d{8}\s?[A-K]$/,
    // Examples: 'AB12345678C,AB 12345678 C, PA42003287 D, LD 56709823E'
    // Makes Sure that the federal reserve ID is in the correct format(s).
    federalReserveId: /^A1$|^B2$|^C3$|^D4$|^E5$|^F6$|^G7$|^H8$|^I9$|^J10$|^K11$|^L12$/,
    // Checks that note position has a Letter ranging from A-J followed by any number from ranging 1-5
    notePositionId: /^([A-J])\S?[1-5]$/,
    // Examples- 'F3,B2,H 2'
    frontPlateId: /^(FW)\s?([A-J])\s?(\d{1,4})$/,
    // Examples - 'FW A 1, B2, E 5, FW L 122, FW B999'
    validDenomination: /^(?:1|2|5|10|20|50|100)$/,
    // Examples - '1,2,5,10,20,50,100's
};
// getTextDetections('./MK.jpeg');
//# sourceMappingURL=index.js.map