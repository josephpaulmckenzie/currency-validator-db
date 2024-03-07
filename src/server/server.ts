import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { AwsService } from '../helpers/storage/aws/awsServices';
import { CustomMulterOptions } from '@src/interfaces/interfaces';

/**
 * Initialize Express app.
 */
const app: express.Application = express();
app.set('view engine', 'ejs');

// Initialize multer with the storage engine
const storage: StorageEngine = multer.diskStorage({
	destination: 'public/uploads/',
	filename: (_req, file) => {
		return file.originalname;
	},
});

// Create upload middleware with multer
const uploadOptions: CustomMulterOptions = {
	storage: storage,
};

const upload = multer(uploadOptions);

/**
 * Middleware to parse urlencoded bodies and serve static files.
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route for serving the index page.
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
 */
app.post('/upload', upload.single('image'), async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
	console.log('Received file upload request'); // Add debug logging
	if (!request.file) {
		console.log('No file uploaded'); // Add debug logging
		return response.status(400).json({ message: 'No file uploaded' });
	}

	try {
		console.log('File uploaded successfully'); // Add debug logging
		const destinationDir = 'public/uploads/';
		console.log('Destination directory:', destinationDir); // Add debug logging
		const buffer = fs.readFileSync(request.file.path);
		const imageDataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
		return response.json({ success: true, dataURL: imageDataUrl });
	} catch (error) {
		console.error('Error handling file upload:', error); // Add debug logging
		next(error);
	}
});

/**
 * Route for displaying success page.
 */
app.get('/success', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const noteDetails = {};
		const dataURL: string = '';
		return res.render('success', { noteDetails, dataURL });
	} catch (error) {
		next(error);
	}
});

/**
 * Route for saving data to AWS and responding with the results.
 */
app.post('/save', async (req: Request, res: Response): Promise<Response | void> => {
	try {
		const noteDetails = req.body.noteDetails;
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
