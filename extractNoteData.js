// extractNote

const { readFileSync, writeFileSync } = require("fs");
const { RekognitionClient, DetectTextCommand } = require("@aws-sdk/client-rekognition");

const rekognition = new RekognitionClient({ region: "us-east-1" }); // Replace with your AWS region

async function detectText(imagePath, outputJsonPath) {
  try {
    const params = {
      Image: { Bytes: readFileSync(imagePath) },
    };

    const command = new DetectTextCommand(params);
    const response = await rekognition.send(command);

    const detectedTextData = [];
    const filteredWordsData = readFileSync("./filteredWords.json");
    const { filteredWords } = JSON.parse(filteredWordsData);
    
    const regexPatterns = [
      /^[A-J]\s*[1-9]\d{0,2}$/,
      /^([A-Q]\s?[A-L]?|[A-L])\s?(\d{8})\s?([A-L*])$/,
      /\b(1|2|5|10|20|50|100)\b/,
      /^\d{4}\s?[AB]?$/,
      /^[AB]$/,
      /\bSERIES\b/,
      /^в\s?\d+$/ // Pattern for "B 32"
    ];
    
    function replaceCyrillic(text) {
      const cyrillicToEnglishMap = {
        'в': 'B',
        'В': 'B', 
      };
    
      const replacedText = text.replace(/[а-яА-Я]/g, (match) => cyrillicToEnglishMap[match] || match);
      return replacedText;
    }
    

    for (const text of response.TextDetections) {
      const cleanedText = replaceCyrillic(text.DetectedText.toUpperCase());
      const detectedWords = cleanedText.split();

      let foundMatchingPatternForText = detectedWords.some((word) => {
        let foundMatchingPatternForWord = false;

        regexPatterns.some((regex) => {
          const isMatch = regex.test(word);

          if (isMatch && text.Confidence >= 50 && !filteredWords.includes(word)) {
            const existingEntryIndex = detectedTextData.findIndex(
              (entry) =>
                entry.detectedText === text.DetectedText &&
                entry.boundingBox.Height === text.Geometry.BoundingBox.Height &&
                entry.boundingBox.Left === text.Geometry.BoundingBox.Left &&
                entry.boundingBox.Top === text.Geometry.BoundingBox.Top &&
                entry.boundingBox.Width === text.Geometry.BoundingBox.Width
            );

            if (existingEntryIndex === -1) {
              detectedTextData.push({
                detectedText: text.DetectedText,
                boundingBox: text.Geometry.BoundingBox,
                confidence: text.Confidence,
                filteredWord: false,
              });
            }

            foundMatchingPatternForWord = true;
            return true;
          }

          return isMatch;
        });

        return foundMatchingPatternForWord;
      });
    }

    writeFileSync(outputJsonPath, JSON.stringify(detectedTextData, null, 2));
    console.log(`Results saved to: ${outputJsonPath}`);

    return detectedTextData;
  } catch (err) {
    console.error("Error detecting text:", err);
    return [];
  }
}

module.exports = detectText;
