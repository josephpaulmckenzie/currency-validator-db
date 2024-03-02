import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { UploadData } from '../src/interfaces/interfaces';
import { getTextDetections } from './helpers';
// import AwsService from './helpers/awsFunctions';

/**
 * Initialize Express app.
 * @const {Express.Application} app - The Express application instance.
 */
const app: express.Application = express();
const port: number = 3000;
app.set('view engine', 'ejs');

// Initialize multer with the storage engine
const upload = multer({
	storage: multer.diskStorage({
		destination: function (_req, _file, cb) {
			cb(null, 'public/uploads/');
		},
		filename: function (_req, file, cb) {
			cb(null, file.originalname);
		},
	}),
});

/**
 * Data URL for uploaded file.
 * @type {string|null} - Data URL for uploaded file.
 */
let imageDataUrl: string | null = null;

/**
 * Buffer for uploaded file.
 * @type {string | Buffer} - Buffer for uploaded file.
 */
let buffer: string | Buffer;

/**
 * Filename of the uploaded file.
 * @type {string} - Filename of the uploaded file.
 */
let fileName: string;

/**
 * Detected text from the uploaded image.
 * @type {UploadData} - Detected text from the uploaded image.
 */
let detectedText: UploadData;

/**
 * Middleware to parse urlencoded bodies and serve static files.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route for serving the index page.
 * @name GET /
 * @function
 * @memberof module:app
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response | void >} The Express response object.
 */
app.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		return res.render('index');
	} catch (error) {
		next(error);
	}
});

/**
 * Route for handling file upload.
 * @name POST /upload
 * @function
 * @memberof module:app
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<Response | void>} The Express response object.
 */
app.post('/upload', async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}

		const { filename, path } = req.file;
		const buffer = fs.readFileSync(path);
		const imageDataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;

		return res.json({
			success: true,
			dataURL: imageDataUrl,
		});
	} catch (err) {
		next(err);
	}
});

/**
 * Route for displaying success page.
 * @name GET /success
 * @function
 * @param {Request} request - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response | void>} The Express response object.
 */
app.get('/success', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		detectedText = await getTextDetections(buffer);
		return res.render('success', { detectedText, dataURL: imageDataUrl });
	} catch (error) {
		next(error);
	}
});
/**
 * Route for saving data to AWS and responding with the results.
 * @name POST /save
 * @function
 * @memberof module:app
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response | void>} The Express response object.
 */
app.post('/save', async (req: Request, res: Response): Promise<Response | void> => {
	try {
		console.log('detected', detectedText);
		// const uploadResult = await AwsService.uploadToAws(detectedText, fileName);
		// return res.json(uploadResult);
	} catch (error) {
		console.error('Error uploading to AWS:', error);
		return res.status(500).json({ error: 'An error occurred while uploading to AWS' });
	}
});

/**
 * Start the server.
 */
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export { app };
