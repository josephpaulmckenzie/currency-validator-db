// app.js
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const detectText = require('./extractNoteData');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFiles = req.files.file;
  const outputJsonPath = './output.json'; // Replace with the desired output JSON file path

  // Handle multiple files
  if (Array.isArray(uploadedFiles)) {
    uploadedFiles.forEach((file) => {
      const filePath = path.join(__dirname, 'uploads', file.name);

      file.mv(filePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }

        detectText(filePath, outputJsonPath)
          .then((detectedTextData) => {
            const serialNumber = getSerialNumber(detectedTextData); // Extract serial number
            const newFileName = `${serialNumber}.jpg`; // Use serial number as the new filename

            const newFilePath = path.join(__dirname, 'uploads', newFileName);

            // Rename the file using the serial number
            fs.renameSync(filePath, newFilePath);

            console.log(`Text detected successfully for ${newFileName}`);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
      });
    });

    res.status(200).json({ message: 'Text detection started for uploaded files.' });
  } else {
    // For a single file
    const filePath = path.join(__dirname, 'uploads', uploadedFiles.name);

    uploadedFiles.mv(filePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      detectText(filePath, outputJsonPath)
        .then((detectedTextData) => {
          const serialNumber = getSerialNumber(detectedTextData); // Extract serial number
          const newFileName = `${serialNumber}.jpg`; // Use serial number as the new filename

          const newFilePath = path.join(__dirname, 'uploads', newFileName);

          // Rename the file using the serial number
          fs.renameSync(filePath, newFilePath);

          console.log(`Text detected successfully for ${newFileName}`);
          res.status(200).json({ message: 'Text detected successfully.' });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to extract serial number from detected text data
// Function to extract serial number from detected text data
function getSerialNumber(detectedTextData) {
    // Implement your logic to extract the serial number from detectedTextData
    const serialNumberRegex = /(?:[A-Q]\s?[A-L]?\s?|\s)?(\d*420\d*)(?:\s?[A-Q])?/;
  
    for (const entry of detectedTextData) {
      const match = entry.detectedText.match(serialNumberRegex);
      if (match) {
        return match[1]; // Assuming the serial number is captured in the first capturing group
      }
    }
  
    return 'UnknownSerialNumber';
  }
  
  