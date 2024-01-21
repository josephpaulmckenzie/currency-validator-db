// app.js
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const detectText = require('./extractNoteData'); // Adjust the path accordingly

const app = express();
const port = 3000;

app.use(fileUpload());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.file;
  const filePath = path.join(__dirname, 'uploads', uploadedFile.name);
  const outputJsonPath = './output.json'; // Replace with the desired output JSON file path

  uploadedFile.mv(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    detectText(filePath, outputJsonPath)
      .then((detectedTextData) => {
        // Handle the result or send a response
        res.status(200).json({ message: 'Text detected successfully.' });
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
