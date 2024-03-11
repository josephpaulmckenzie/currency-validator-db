import express, { NextFunction, Request, Response } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { AwsService } from '../helpers/storage/aws/awsServices';
import { readFileSync } from 'fs';
import { getTextDetections } from '../helpers';
import { UploadData } from '../interfaces/interfaces';

const app: express.Application = express();
app.set('view engine', 'ejs');

// Logging middleware to log incoming requests
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});
// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error('An error occurred:', err);
	res.status(500).json({ error: 'Internal Server Error' });
});

const storage: StorageEngine = multer.diskStorage({
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
const upload = multer({ storage: storage });
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let imageDataUrl = '';
let buffer: string | Buffer;
let detectedText: any;
let fileName: string;
let noteDetails;
app.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		console.log('Rendering index.ejs');

		return res.render('index');
	} catch (error) {
		next(error);
	}
});

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

app.get('/success', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		noteDetails = await getTextDetections(buffer);
		console.log('noteDetails', noteDetails);
		return res.render('success', { noteDetails, dataURL: imageDataUrl });
	} catch (error) {
		next(error);
	}
});

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

export { app };
