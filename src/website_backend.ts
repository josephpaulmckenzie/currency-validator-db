//website_backend.ts

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer'; // For handling file uploads
import path from 'path';
// import {getTextDetections} from '.';
import fs, { unlink } from 'fs'; // Import the fs module
import {getTextDetections} from '.';

const app = express();
const port = 3000;
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});




let result: {
  validDenomination: string;
  frontPlateId: string;
  SerialPatternMatch: string;
  serialNumber: string;
  federalReserveId: string;
  federalReserveLocation: string;
  notePositionId: string;
  seriesYear: string;
  treasurer: string;
  secretary: string;
  s3Url: String;
};
let dataURL: string;
let buffer: string | Buffer;
const upload = multer({storage: storage});
let fileName: string;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post(
  '/upload',
  upload.single('image'),
  async (req: Request, res: Response) => {

    try {
      if (!req.file) {
        throw res.status(400).json({message: 'No file uploaded'});
      }
      fileName = req.file.filename;
      const imagePath = req.file.path;
      buffer = fs.readFileSync(imagePath);
      dataURL = `data:image/jpeg;base64,${buffer.toString('base64')}`;      
      res.json({success: true, dataURL: dataURL});
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({message: `Failed to upload image ${fileName}`});
    }
  }
);

app.get('/success', async (req: Request, res: Response) => {
  result = await getTextDetections(buffer,`uploads/${fileName}`);
  unlink(`uploads/${fileName}`, (err) => {
    if (err) throw err;
    console.log(`uploads/${fileName} was deleted`);
  }); 
  res.render('success', {result: result, dataURL: dataURL}); 
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
