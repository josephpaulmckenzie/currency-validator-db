const { readFileSync, writeFileSync } = require("fs");
const { serialNumberPatterns, noteValidators } = require('./serialPatterns')
const { RekognitionClient, DetectTextCommand } = require("@aws-sdk/client-rekognition");
const fs = require("fs");

const rekognition = new RekognitionClient({ region: "us-east-1" }); // Replace with your AWS region

function replaceCyrillic(text) {
  const cyrillicToEnglishMap = {
    в: "B",
    В: "B",
    // Add more mappings as needed
  };

  const replacedText = text.replace(
    /[а-яА-Я]/g,
    (match) => cyrillicToEnglishMap[match] || match
  );
  return replacedText;
}

function createSerialNumberMappings(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw {
        status: 400,
        error: "File does not exist.",
        inputDetails: {
          filePath,
        },
        validator: "fileExistence",
      };
    }

    const mappingData = fs.readFileSync(filePath, "utf8");
    const lines = mappingData.split("\n");
    const serialNumberMappings = {};

    lines.forEach((line) => {
      if (line.trim() !== "") {
        const [
          denomination,
          secretary,
          treasurer,
          seriesYear,
          serialNumberPrefix,
        ] = line.trim().split(/\s+/);

        if (denomination && serialNumberPrefix) {
          if (!serialNumberMappings[denomination]) {
            serialNumberMappings[denomination] = [];
          }

          const escapedPrefix = serialNumberPrefix.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );

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
      validator: "createSerialNumberMappings",
    };
  }
}

function getAdditonalDetails(denomination, serialNumber) {
  let prefixLetter;

  try {
    if (denomination) {
      prefixLetter = serialNumber.charAt(0); // Extract prefix letter from serial number
      const matchedDetail = denomination.find((detail) =>
        detail.pattern.test(prefixLetter)
      );

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
      error: `Error obtaining additonalDetails, ${error}`,
      inputDetails: {},
      validator: "additonalDetails",
    };
  }
}

async function detectText(imagePath, outputJsonPath) {
  try {
    let additonalDetails;
    const command = new DetectTextCommand({
      Image: { Bytes: readFileSync(imagePath) },
    });
    const response = await rekognition.send(command);

    const detectedTextData = [];
    const { filteredWords } = JSON.parse(readFileSync("./filteredWords.json"));
    const regexPatterns = [
      /^[A-L]\s*[1-9]\d{0,2}$/,
      /^([A-Q]\s?[A-L]?|[A-L])\s?(\d{8})\s?([A-L*])$/,
      /\b(?:1|2|5|10|20|50|100)\b/,
      /^(?:FW\s*)?[A-J]\s*\d{1,3}$/,
    ];



    const { denomination, serialNumber } = await extractDenominationAndSerial(
      response.TextDetections
    );

    if (denomination && serialNumber) {
      const mappingFilePath = "./mapping_data.txt";
      additonalDetails = getAdditonalDetails(
        createSerialNumberMappings(mappingFilePath)[`\$${denomination}`],
        serialNumber
      );
    }

    for (const text of response.TextDetections) {
      const detectedWords = replaceCyrillic(
        text.DetectedText.toUpperCase()
      ).split();

      for (const word of Object.values(noteValidators)) {
        let foundMatchingPatternForWord = false;

        for (const regex of regexPatterns) {
          if ( regex.test(word) && text.Confidence >= 50 && !filteredWords.includes(word) ) {
            const existingEntryIndex = detectedTextData.findIndex((entry) => {
              return (
                entry.detectedText === text.DetectedText &&
                entry.boundingBox.Height === text.Geometry.BoundingBox.Height &&
                entry.boundingBox.Left === text.Geometry.BoundingBox.Left &&
                entry.boundingBox.Top === text.Geometry.BoundingBox.Top &&
                entry.boundingBox.Width === text.Geometry.BoundingBox.Width
              );
            });

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

    // writeFileSync(outputJsonPath, JSON.stringify(detectedTextData, null, 2));

    const formattedData = {};
    const federalReserveRegex = /^[A-L]\s*[1-9]\d{0,2}$/;
    const notePositionRegex = /^[A-J]\s*[1-5]$/;
    const frontPlateNumberRegex = /^(?:FW\s*)?[A-J]\s*\d{1,3}$/;

    let fed;
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
          federalReserveIndicator: "",
          notePosition: "",
          frontPlateNumber: "",
        };
      }

      if (federalReserveRegex.test(detectedText)) {
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

      if (notePositionRegex.test(detectedText)) {
        formattedData[key].notePosition = detectedText;
      }

      if (frontPlateNumberRegex.test(detectedText)) {
        formattedData[key].frontPlateNumber = detectedText;

        // If frontPlateNumber is the same as notePosition, use other detected text data fitting the regex pattern
        if (formattedData[key].frontPlateNumber === formattedData[key].notePosition) {
          for (const otherText of detectedTextData) {
            const { detectedText } = otherText
            
            if (frontPlateNumberRegex.test(detectedText)) {
              formattedData[key].frontPlateNumber = detectedText;
              break;
            }
          }
        }
      }
    }

    const resultArray = Object.values(formattedData);
    console.log(JSON.stringify(resultArray[0]));
    fs.appendFileSync(outputJsonPath, JSON.stringify(resultArray[0], null, 2));


    return detectedTextData;
  } catch (err) {
    console.error("Error detecting text:", err);
    return [];
  }
}

async function extractDenominationAndSerial(textDetections) {
  let detectedDenomination;
  let detectedSerialNumber;

  for (const text of textDetections) {
    const denominationMatch = text.DetectedText.match(/\b(1|2|5|10|20|50|100)\b/)
    const serialNumberMatch = text.DetectedText.match(/^([A-Q]\s?[A-L]?|[A-L])\s?(\d{8})\s?([A-L*])$/);

    if (denominationMatch) {
      detectedDenomination = denominationMatch[0];
    }

    if (serialNumberMatch) {
      detectedSerialNumber = serialNumberMatch[0];
    }
  }

  return {
    denomination: detectedDenomination,
    serialNumber: detectedSerialNumber,
  };
}

detectText('./testing/test_images/IMG_2406.jpg', './output.json')


module.exports = detectText;
