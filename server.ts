import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { getTextDetections } from '.';
import { UploadData } from '../src/interfaces/interfaces';
import AwsService from './helpers/awsFunctions';

/**
 * Initialize Express app.
 */
const app = express();
const port = 3000;
app.set('view engine', 'ejs');

/**
 * Configure multer for handling file uploads.
 */
const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (_req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage });

let dataURL = '';
let buffer: string | Buffer;
let fileName = '';
let detectedText: UploadData;

/**
 * Middleware to parse urlencoded bodies and serve static files.
 */
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route for serving the index page.
 */
app.get('/', async (_req, res) => {
	res.render('index');
});

/**
 * Route for handling file upload.
 */
app.post('/upload', upload.single('image'), async (req, res, next) => {
	try {
		if (!req.file) {
			// Send a JSON response with the error message
			return res.status(400).json({ message: 'No file uploaded' });
		}

		fileName = req.file.filename;
		buffer = fs.readFileSync(req.file.path);
		dataURL = `data:image/jpeg;base64,${buffer.toString('base64')}`;
		res.json({ success: true, dataURL: dataURL });
	} catch (error) {
		next(error);
	}
});

/**
 * Route for displaying success page.
 */
app.get('/success', async (_req, res) => {
	detectedText = await getTextDetections(buffer);
	res.render('success', { detectedText, dataURL });
});

/**
 * Route for saving data to AWS and responding with the results.
 */
app.post('/save', async (_req, res, next) => {
	try {
		const uploadResult = await AwsService.uploadToAws(detectedText, fileName);
		res.json(uploadResult);
		console.log('AWS Upload Results:', uploadResult);
	} catch (error) {
		next(error); // Pass the error to the next middleware (errorHandler)
	}
});

/**
 * Start the server.
 */
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export { app };
