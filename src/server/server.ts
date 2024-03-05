import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
// import { getTextDetections } from './helpers';
import { AwsService } from '../helpers/storage/aws/awsServices';
// import { NoteDetail, UploadData } from './interfaces/interfaces';
// import { Note } from 'aws-sdk/clients/ioteventsdata';

/**
 * Initialize Express app.
 * @const {Express.Application} app - The Express application instance.
 */
const app: express.Application = express();
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

app.post('/upload', upload.single('image'), async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
	if (!request.file) {
		return response.status(400).json({ message: 'No file uploaded' });
	}

	try {
		// Use request.file.destination to get the destination directory
		const destinationDir = request.file.destination;
		console.log('destinationDir', destinationDir);
		const buffer = fs.readFileSync(request.file.path);
		const imageDataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
		return response.json({ success: true, dataURL: imageDataUrl });
	} catch (error) {
		next(error); // Pass the error to the next middleware
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
		const noteDetails = {}; // Define noteDetails appropriately
		const dataURL: string = ''; // Define dataURL appropriately
		return res.render('success', { noteDetails, dataURL });
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
		const noteDetails = req.body.noteDetails; // Assuming the noteDetails are passed in the request body
		if (!noteDetails || !noteDetails.serialNumber) {
			return res.status(400).json({ error: 'Invalid note details' });
		}

		const s3Key = typeof noteDetails.serialNumber === 'string' ? noteDetails.serialNumber : noteDetails.serialNumber.text;
		const uploadResult = await AwsService.uploadToAws(noteDetails, s3Key);
		return res.json(uploadResult);
	} catch (error) {
		console.error('Error uploading to AWS:', error);
		return res.status(500).json({ error: 'An error occurred while uploading to AWS' });
	}
});

/**
 * Export the Express app instance.
 */
export { app };
