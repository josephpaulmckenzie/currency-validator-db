"use strict";
const fs = require("fs");


module.exports.validateData = async (event) => {
  // Function to validate JSON safety
function isSafeJSON(jsonString) {
  try {
 
    return true;
  } catch (error) {
    // JSON parsing failed, indicating invalid JSON format
    return false;
  }
}

// Validate and parse the event body securely
let requestBody = {};
if (event.body) {
  try {
    const isValidJSON = isSafeJSON(event.body);
    if (isValidJSON) {
      requestBody = JSON.parse(event.body);
    } else {
      throw new Error('Invalid JSON format in the request body');
    }
  } catch (parseError) {
    // Handle parsing error or malicious input
    return {
      statusCode: 400,
      body: 'Invalid JSON format in the request body',
    };
  }
}

  
  const {
    denomination,
    serialNumber,
    federalReserveIndicator,
    notePosition,
    frontPlateNumber,
    backPlateNumber,
  } = requestBody;

  // Validation for denomination
  function validateDenomination(denomination) {
    const validAmounts = ["$1", "$2", "$5", "$10", "$20", "$50", "$100"];

    if (!validAmounts.includes(denomination)) {
      throw {
        status: 400,
        error:
          "Invalid denomination. Please provide a valid denomination ($1, $2, $5, $10, $20, $50, or $100).",
        inputDetails: { denomination },
        validator: "denomination",
      };
    }

    return denomination;
  }

  // Validates that the serial number is at least in the proper format for the entered denomination

  function validateSerialNumberFormat(serialNumber, denomination) {
    let validSerialNumberRegex;

    if (denomination === "$1" || denomination === "$2") {
      validSerialNumberRegex = /^[A-Z]{1}\d{8}[A-Z]$/;
    } else if (["$5", "$10", "$20", "$50", "$100"].includes(denomination)) {
      validSerialNumberRegex = /^[A-Z]{2}\d{8}[A-Z]$/;
    }

    if (!validSerialNumberRegex.test(serialNumber)) {
      throw {
        status: 400,
        error: `Invalid Serial Number Format. The format for the serial number ${serialNumber} does not match for the denomination ${denomination}.`,
        inputDetails: {
          serialNumber,
          denomination,
        },
        validator: "serialNumber",
      };
    }

    return serialNumber;
  }

  function validateFederalReserveIndicator(
    serialNumber,
    seriesYear,
    userProvidedIndicator
  ) {
    const isSeries1996Onwards = parseInt(seriesYear) >= 1996;
    let fedReserveLetterFromSerial;

    if (isSeries1996Onwards) {
      fedReserveLetterFromSerial = serialNumber[1];
    } else {
      fedReserveLetterFromSerial = serialNumber[0];
    }

    const reserveBankLetters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
    ];
    const reserveBankNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const fedReserveLetterIndex = reserveBankLetters.indexOf(
      fedReserveLetterFromSerial
    );
    if (
      fedReserveLetterIndex !== -1 &&
      reserveBankNumbers[fedReserveLetterIndex] ===
      parseInt(userProvidedIndicator[1])
    ) {
      return userProvidedIndicator;
    } else {
      throw {
        status: 400,
        error: `Invalid Federal Reserve Indicator. The provided indicator does not match the Federal Reserve Bank designation for the serial number.`,
        inputDetails: {
          serialNumber,
          denomination,
        },
        validator: "federalReserveIndicator",
      };
    }
  }

  function validateNotePosition(notePosition) {
    let notePositionRegex = /^[A-L][1-4]$/; // Default regex for most denominations

    if (notePositionRegex.test(notePosition)) {
      return notePosition;
    } else {
      throw {
        status: 400,
        error:
          "Invalid Note position Format. Please enter a valid note position ((A-L)-(1-5) e.g; A5) for most denominations).",
        inputDetails: {
          notePosition,
        },
        validator: "notePosition",
      };
    }
  }

  function validateFrontPlateNumber(frontPlateNumber) {
    let fortWorthNote;
    let frontPlateRegex;
    let frontPlateDetails;
    if (frontPlateNumber.includes("FW")) {
      fortWorthNote = true;
      frontPlateRegex = /^FW\s?[A-H]\s?\d{1,3}$/;
    } else {
      fortWorthNote = false;
      frontPlateRegex = /^[A-H]\s?\d{1,3}$/;
    }
    if (frontPlateRegex.test(frontPlateNumber)) {
      frontPlateDetails = { fortWorthNote, frontPlateNumber };
      return frontPlateDetails;
    } else {
      throw {
        status: 400,
        error: `Invalid Front Plate Number Format.`,
        inputDetails: {},
        validator: "frontPlateValidator",
      };
    }
  }

  function validateBackPlateNumber(backPlateNumber) {
    let backPlateRegex = /^\d{1,3}$/;

    if (backPlateRegex.test(backPlateNumber)) {
      return backPlateNumber;
    } else {
      throw {
        status: 400,
        error: `Invalid Back Plate Number Format.`,
        inputDetails: {},
        validator: "backPlateValidator",
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


  try {
    const validatedDenomination = validateDenomination(denomination);
    const validatedSerialNumber = validateSerialNumberFormat(
      serialNumber,
      validatedDenomination
    );
  
    const mappingFilePath = "./mapping_data.txt";
    const additonalDetails = getAdditonalDetails(
      createSerialNumberMappings(mappingFilePath)[denomination],
      serialNumber
    );
  
    const { seriesYear, treasurer, secretary } = additonalDetails;
    const validatedFederalReserveIndicator = validateFederalReserveIndicator(
      serialNumber,
      seriesYear,
      federalReserveIndicator
    );
  
    const validatedNotePosition = validateNotePosition(notePosition);
    const validatedFrontPlateNumber = validateFrontPlateNumber(frontPlateNumber);
    const validatedBackPlateNumber = validateBackPlateNumber(backPlateNumber);
  
  
    
    const validatedData = {
      message: "Data validated and inserted successfully",
      denomination: validatedDenomination,
      serialNumber: validatedSerialNumber,
      seriesYear,
      federalReserveIndicator: validatedFederalReserveIndicator,
      notePosition: validatedNotePosition,
      frontPlateNumber: validatedFrontPlateNumber.frontPlateNumber,
      backPlateNumber: validatedBackPlateNumber,
      fortWorthNote: validatedFrontPlateNumber.fortWorthNote,
      treasurer: treasurer,
      secretary: secretary,
    };
  
    
    return {
      statusCode: 200,
      body: JSON.stringify({ validatedData }),
    };
  } catch (error){
// console.log(error, "!!!!!!!!!!!")
   return {
     statusCode: error.status,
     body: error.error
    
  }
  }
}
