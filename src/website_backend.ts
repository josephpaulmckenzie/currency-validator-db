import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { getTextDetections } from '.';
import { UploadData } from '../src/interfaces/interfaces';
import AwsService from './helpers/awsFunctions';
import { RouteError } from './classes/errorClasses';
import { handleRouteError } from './middleware/errorHandler';

const app = express();
app.set('view engine', 'ejs');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
	destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
		cb(null, 'uploads/');
	},
	filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

let dataURL: string;
let buffer: Buffer;
let fileName: string;
let detectedText: UploadData;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(handleRouteError);
/**
 * Route for serving the HTML form.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.get('/', (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Route for handling file upload.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.

 */
app.post('/upload', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.file) {
			throw new RouteError(400, 'No file uploaded');
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
 * Route for rendering the success page.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.get('/success', async (req: Request, res: Response) => {
	detectedText = await getTextDetections(buffer, `uploads/${fileName}`);
	res.render('success', { detectedText: detectedText, dataURL: dataURL });
});

/**
 * Route for saving data to AWS and responding with the results.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
app.post('/save', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const uploadResult = await AwsService.uploadToAws(detectedText, fileName);
		res.json(uploadResult);
		console.log('AWS Upload Results:', uploadResult);
	} catch (error) {
		next(error); // Pass the error to the next middleware (errorHandler)
	}
});

// Start the server
app.listen(3000, () => {
	console.log(`Server is running on port ${3000}`);
});
