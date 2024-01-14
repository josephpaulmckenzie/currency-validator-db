const { readFileSync, writeFileSync } = require("fs");
const {
  RekognitionClient,
  DetectTextCommand,
} = require("@aws-sdk/client-rekognition");
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
      error: `Error with mapping the serial number `,
      inputDetails: {},
      validator: "serialNumberMapping",
    };
  }
}
 


  function getAdditonalDetails(denominationDetails, serialNumber) {
    let prefixLetter;
    try {
      if (denominationDetails) {
        prefixLetter = serialNumber.charAt(0); // Extract prefix letter from serial number
        const matchedDetail = denominationDetails.find((detail) => {
          return detail.pattern.test(prefixLetter);
        });

        if (matchedDetail) {
          const additonalDetails = {
            seriesYear: matchedDetail.seriesYear,
            treasurer: matchedDetail.treasurer,
            secretary: matchedDetail.secretary,
          };
          return additonalDetails;
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
    const params = {
      Image: { Bytes: readFileSync(imagePath) },
    };
    let additonalDetails;
    const command = new DetectTextCommand(params);
    const response = await rekognition.send(command);

    const detectedTextData = [];
    const filteredWordsData = readFileSync("./filteredWords.json");
    const { filteredWords } = JSON.parse(filteredWordsData);
    const regexPatterns = [
      /^[A-J]\s*[1-9]\d{0,2}$/,
      /^([A-Q]\s?[A-L]?|[A-L])\s?(\d{8})\s?([A-L*])$/,
      /\b(1|2|5|10|20|50|100)\b/,
    ];

    const detectedDenominationAndSerial = await extractDenominationAndSerial(
      response.TextDetections
    );
    console.log(detectedDenominationAndSerial);
    if (
      detectedDenominationAndSerial.denomination  &&
      detectedDenominationAndSerial.serialNumber
    ) {
      const { serialNumber } = detectedDenominationAndSerial;

      const mappingFilePath = "./mapping_data.txt";
      const denominationDetails =
        createSerialNumberMappings(mappingFilePath)["$10"];

      additonalDetails = getAdditonalDetails(
        denominationDetails,
        serialNumber
      );

      // console.log("Denomination:", detectedDenominationAndSerial.denomination);
      // console.log("Serial Number:", detectedDenominationAndSerial.serialNumber);
      // console.log("Series Year:", additonalDetails.seriesYear);
      // console.log("Treasurer:", additonalDetails.treasurer);
      // console.log("Secretary:", additonalDetails.secretary);
    }

    for (const text of response.TextDetections) {
      const cleanedText = replaceCyrillic(text.DetectedText.toUpperCase());
      const detectedWords = cleanedText.split();
      for (const word of detectedWords) {
        
        let foundMatchingPatternForWord = false;

        for (const regex of regexPatterns) {
          const isMatch = regex.test(word);

          if (
            isMatch &&
            text.Confidence >= 50 &&
            !filteredWords.includes(word)
          ) {
            const existingEntryIndex = detectedTextData.findIndex(
              (entry) =>
                entry.detectedText === text.DetectedText &&
                entry.boundingBox.Height === text.Geometry.BoundingBox.Height &&
                entry.boundingBox.Left === text.Geometry.BoundingBox.Left &&
                entry.boundingBox.Top === text.Geometry.BoundingBox.Top &&
                entry.boundingBox.Width === text.Geometry.BoundingBox.Width
            );
            const cleanedText =   replaceCyrillic(text.DetectedText.toUpperCase())
            if (existingEntryIndex === -1) {
              detectedTextData.push({
                detectedText: cleanedText,
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

    writeFileSync(outputJsonPath, JSON.stringify(detectedTextData, null, 2));
    

    const formattedData = {};

    const federalReserveRegex = /^[A-J]\s*[1-9]\d{0,2}$/;
    const notePositionRegex = /^[A-J]\s*[1-5]$/
    const frontPlateNumberRegex = /^[A-J]\s*\d{1,3}$/;
   
    let fed; 
    for (const text of detectedTextData) {
      // Check if the text matches the federal reserve regex pattern
     
  // if (federalReserveRegex.test(text.detectedText)) {
  //   console.log("!!!!!", text.detectedText)
  //   if (text.detectedText.charAt(0) === detectedDenominationAndSerial.serialNumber.charAt(1)) {
  //     // fed = text.detectedText;
  //     console.log("federalreserveIndicator",text.detectedText)
  //   } else if (notePositionRegex.test(text.detectedText)) {
  //    console.log("Note Position",text.detectedText) // Resetting the indicator if condition is not met
  //   } else if (frontPlateNumberRegex.test(text.detectedText)){
  //     console.log("Front Plate Number",text.detectedText)
    
  //   }

      const key = `${detectedDenominationAndSerial.denomination}-${detectedDenominationAndSerial.serialNumber}`;
      

      if (!formattedData[key]) {
        formattedData[key] = {
          Denomination: detectedDenominationAndSerial.denomination,
          SerialNumber: detectedDenominationAndSerial.serialNumber,
          SeriesYear: additonalDetails.seriesYear,
          Treasurer: additonalDetails.treasurer,
          Secretary: additonalDetails.secretary,
          federalReserveIndicator: "", // Initialize federalReserveIndicator
          notePosition: "", // Initialize notePosition
          frontPlateNumber: "", // Initialize frontPlateNumber"
          
        };
      }
      
// Check if the text matches the federal reserve regex pattern
if (federalReserveRegex.test(text.detectedText)) {
  if (text.detectedText.charAt(0) === detectedDenominationAndSerial.serialNumber.charAt(1)) {
    console.log("!!!!!", text.detectedText);
    formattedData[key].federalReserveIndicator = text.detectedText;
    console.log("federalReserveIndicator", text.detectedText);
  }
}

// Check if the text matches the note position regex pattern
if (notePositionRegex.test(text.detectedText)) {
  console.log("Note Position", text.detectedText);
  // Resetting the indicator if condition is not met
  formattedData[key].notePosition = text.detectedText;
}

// Check if the text matches the front plate number regex pattern
if (frontPlateNumberRegex.test(text.detectedText)) {
  console.log("Front Plate Number", text.detectedText);
  const frontPlateLetter = text.detectedText.charAt(0);

  // Check if the front plate letter is different from the note position letter
  // if (frontPlateLetter !== detectedDenominationAndSerial.serialNumber.charAt(0)) {
  //   throw new Error("Note and Front Plate Numbers must start with the same letter.");
  // }

  // Resetting the indicator if condition is not met
  formattedData[key].frontPlateNumber = text.detectedText;

  // If frontPlateNumber is the same as notePosition, use other detected text data
  if (formattedData[key].frontPlateNumber === formattedData[key].notePosition) {
    // Loop through the detectedTextData to find matching data based on the regex pattern
    for (const otherText of detectedTextData) {
      if (frontPlateNumberRegex.test(otherText.detectedText)) {
        // Use other detected text data that fits the same regex pattern
        formattedData[key].frontPlateNumber = otherText.detectedText;
        break; // Assuming you want to use the first matching data
      }
    }
  }
}

// formattedData[key].texts.push(text.detectedText);

  }


    
    const resultArray = Object.values(formattedData);
    console.log(JSON.stringify(resultArray[0]));
    
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
    const denominationMatch = text.DetectedText.match(
      /\b(1|2|5|10|20|50|100)\b/
    );
    if (denominationMatch && denominationMatch[0]) {
      detectedDenomination = text.DetectedText;
    }

    const serialNumberMatch = text.DetectedText.match(
      /^([A-Q]\s?[A-L]?|[A-L])\s?(\d{8})\s?([A-L*])$/
    );
    if (serialNumberMatch && serialNumberMatch[0]) {
      detectedSerialNumber = serialNumberMatch[0];
      // break; // Assuming you want to break after finding the first serial number
    }
  }

  return {
    denomination: detectedDenomination,
    serialNumber: detectedSerialNumber,
  };
}

module.exports = detectText;
