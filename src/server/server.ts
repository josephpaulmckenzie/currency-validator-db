import express, { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { getTextDetections } from '../helpers/';
import { saveToS3 } from '../helpers/storage/aws/s3Operations';
import { NoteDetail, TextWithBoundingBox, UploadData } from '../interfaces/interfaces';

const app: express.Application = express();
app.set('view engine', 'ejs');

// Logging middleware to log incoming requests
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {
	console.error('An error occurred:', err.message);
	console.error('Route:', req.url);
	console.error('Stack:', err.stack);
	res.status(500).json({ error: err.message || 'Internal Server Error' });
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

let imageDataUrl: string = '';
let buffer: Buffer;
let noteDetails: UploadData;

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
		buffer = readFileSync(request.file.path);
		imageDataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
		return response.json({ success: true, dataURL: imageDataUrl });
	} catch (error) {
		console.error('Error handling file upload:', error);
		next(error);
	}
});

// Route handler for rendering the note details page
app.get('/success', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		noteDetails = await getTextDetections(buffer);
		return res.render('success', {
			noteDetails,
			dataURL: imageDataUrl,
		});
	} catch (error) {
		next(error);
	}
});
// Route handler for processing form submissions
app.post('/save', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		console.log('In save details');

		let serialNumber: string;

		// Check if noteDetails is not null and serialNumber is not a string
		if (!noteDetails || typeof noteDetails.serialNumber !== 'string') {
			throw new Error('Serial number is missing or invalid');
		}

		serialNumber = noteDetails.serialNumber.trim();

		if (serialNumber === '') {
			throw new Error('Serial number is missing or invalid');
		}

		const s3Key = serialNumber;
		const s3uploaded = await saveToS3(buffer, s3Key);

		// Update noteDetails with the S3 URL
		noteDetails.s3Url = s3uploaded.Location;

		// await uploadToDatabase(noteDetails);

		// Exclude serialNumber from the response since it's already included in noteDetails
		const uploadResult = { success: true, s3Results: s3uploaded, noteDetails };
		console.log('uploadResult', uploadResult);
		return res.json(uploadResult);
	} catch (error) {
		console.error('Error uploading to AWS:', error);
		next(error);
	}
});

export { app };
