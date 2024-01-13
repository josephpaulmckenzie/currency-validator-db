// Assuming your data is stored in a variable called 'textData'
const textData = [
  {
    "detectedText": "SERIES",
    "boundingBox": {
      "Height": 0.021260617300868034,
      "Left": 0.1076446995139122,
      "Top": 0.6952885389328003,
      "Width": 0.03483998775482178
    },
    "confidence": 98.82347106933594,
    "filteredWord": false
  },
  {
    "detectedText": "2017",
    "boundingBox": {
      "Height": 0.017578125,
      "Left": 0.11467437446117401,
      "Top": 0.7177734375,
      "Width": 0.02033233642578125
    },
    "confidence": 99.32259368896484,
    "filteredWord": false
  },
  {
    "detectedText": "B 2",
    "boundingBox": {
      "Height": 0.029188774526119232,
      "Left": 0.07252049446105957,
      "Top": 0.7319064140319824,
      "Width": 0.02005983516573906
    },
    "confidence": 56.585514068603516,
    "filteredWord": false
  },
  {
    "detectedText": "A",
    "boundingBox": {
      "Height": 0.017578125,
      "Left": 0.1219940185546875,
      "Top": 0.73828125,
      "Width": 0.0065063475631177425
    },
    "confidence": 98.02386474609375,
    "filteredWord": false
  },
  // ... other text items
];
// Assuming your data is stored in the 'textData' array
// Assuming your data is stored in the 'textData' array

const threshold = 0.02; // You may need to adjust this value based on your specific case

const groups = [];
let currentGroup = [];

const seriesYearRegex = /\bSERIES\b|\b\d{4}\b|\bA\b/; // Adjust as needed

for (let i = 0; i < textData.length; i++) {
    const currentText = textData[i];
    const currentTop = currentText.boundingBox.Top;

    if (currentGroup.length === 0) {
        // If the current group is empty, add the text to a new group
        currentGroup.push(currentText);
    } else {
        // Check if the current text is close to the texts in the current group
        const closeToGroup = currentGroup.some((groupText) => Math.abs(groupText.boundingBox.Top - currentTop) < threshold);

        if (closeToGroup) {
            // If close, add to the current group
            currentGroup.push(currentText);
        } else {
            // If not close, filter out texts that don't match the criteria
            const filteredGroup = currentGroup.filter((groupText) => seriesYearRegex.test(groupText.detectedText));
            
            // Add the filtered group to the result if it's not empty
            if (filteredGroup.length > 0) {
                groups.push(filteredGroup);
            }

            // Start a new group
            currentGroup = [currentText];
        }
    }
}

// Add the last group
const filteredGroup = currentGroup.filter((groupText) => seriesYearRegex.test(groupText.detectedText));
if (filteredGroup.length > 0) {
    groups.push(filteredGroup);
}

console.log(groups); // Outputs the groups of texts that match the criteria
console.log(groups.map(group => group.map(text => ({
  detectedText: textData.detectedText,
  boundingBox: textData.boundingBox,
  confidence: textData.confidence,
  filteredWord: textData.filteredWord
}))));
