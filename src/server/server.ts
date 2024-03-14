import express, { NextFunction, Request, Response } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { readFileSync } from 'fs';
import { getTextDetections } from '../helpers/';

const app: express.Application = express();
app.set('view engine', 'ejs');

// Logging middleware to log incoming requests
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
	console.error('An error occurred:', err.message);
	console.error('Route:', req.url);
	console.error('Stack:', err.stack);
	res.status(500).json({ error: err.message || 'Internal Server Error' }); // Ensure error message is set in the response body
	next(err); // Pass the error to the next middleware or error handler
});

const multerDiskStorage: StorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		// Set the destination folder for uploads
		cb(null, 'public/uploads/');
	},
	filename: (req, file, cb) => {
		// Set the filename to be the original filename
		cb(null, file.originalname);
	},
});

// Set up multer with the configured storage engine
const upload = multer({ storage: multerDiskStorage });

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let imageDataUrl = '';
let buffer: string | Buffer;
let noteDetails;

// Route handler for rendering the index page
app.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		console.log('Rendering index.ejs');
		return res.render('index');
	} catch (error) {
		next(error);
	}
});

// Route handler for handling file uploads
app.post('/upload', upload.single('image'), async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
	console.log('Received file upload request');
	if (!request.file) {
		console.log('No file uploaded');
		return response.status(400).json({ message: 'No file uploaded' });
	}

	try {
		console.log('File uploaded successfully');
		const destinationDir = 'public/uploads/';
		console.log('Destination directory:', destinationDir);
		buffer = readFileSync(request.file.path);
		imageDataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
		return response.json({ success: true, dataURL: imageDataUrl });
	} catch (error) {
		console.error('Error handling file upload:', error);
		next(error);
	}
});

// Route handler for rendering the success page
app.get('/success', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		noteDetails = await getTextDetections(buffer);
		console.log('noteDetails', noteDetails);
		return res.render('success', { noteDetails, dataURL: imageDataUrl });
	} catch (error) {
		next(error);
	}
});

// Route handler for processing form submissions
app.post('/save', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const noteDetails = req.body.noteDetails;
		if (!noteDetails || !noteDetails.serialNumber) {
			return res.status(400).json({ error: 'Invalid note details' });
		}

		// Mock upload result for testing
		const uploadResult = { success: true, message: 'Mock upload success' };
		return res.json(uploadResult);
	} catch (error) {
		console.error('Error uploading to AWS:', error);
		next(error); // Call next with the error
	}
});

export { app };
