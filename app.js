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

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFiles = req.files.file;
  const outputJsonPath = './output.json';

  // Handle multiple files
  if (Array.isArray(uploadedFiles)) {
    const results = [];

    for (const file of uploadedFiles) {
      const filePath = path.join(__dirname, 'uploads', file.name);

      file.mv(filePath, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }

        try {
          const detectedTextData = await detectText(filePath, outputJsonPath);

          // Encode the image as Base64
          const imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });
          detectedTextData.imageBase64 = imageBase64;

          results.push(detectedTextData);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    }

    // Use Promise.all to wait for all async operations to complete
    await Promise.all(results);

    res.status(200).json({ message: 'Text detection completed for uploaded files.', results });
  } else {
    // For a single file
    const filePath = path.join(__dirname, 'uploads', uploadedFiles.name);

    uploadedFiles.mv(filePath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      try {
        const detectedTextData = await detectText(filePath, outputJsonPath);

        // Encode the image as Base64
        const imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });
        detectedTextData.imageBase64 = imageBase64;

        res.json({ detectedTextData }); // Send as JSON object
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
