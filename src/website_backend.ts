import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { getTextDetections } from '.';
import { DetectedText } from '../src/interfaces/interfaces';
import { awsUpload } from './helpers/awsFunctions';

const app = express();
app.set('view engine', 'ejs');

// Configure multer for handling file uploads

const storage = multer.diskStorage({
    /**
     * Determines the destination directory for storing uploaded files.
     * @param {Express.Request} req - The Express request object.
     * @param {Express.Multer.File} file - The uploaded file object.
     * @param {(error: Error | null, destination: string) => void} cb - The callback function to be invoked when the destination is determined.
     */
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, 'uploads/');
    },
    /**
     * Generates the filename for storing the uploaded file.
     * @param {Express.Request} req - The Express request object.
     * @param {Express.Multer.File} file - The uploaded file object.
     * @param {(error: Error | null, filename: string) => void} cb - The callback function to be invoked when the filename is generated.
     */
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, file.originalname); // Use the original filename
    },
});

/**
 * Multer configuration for handling file uploads.
 */
const upload = multer({ storage: storage });

/**
 * The data URL representing the uploaded file.
 * @type {string}
 */
let dataURL: string;

/**
 * The buffer containing the uploaded file data.
 * @type {Buffer}
 */
let buffer: Buffer;

/**
 * The filename of the uploaded file.
 * @type {string}
 */
let fileName: string;

/**
 * The detected text from the uploaded image.
 * @type {DetectedText}
 */
let detectedText: DetectedText;


/**
 * Middleware to parse urlencoded bodies.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Middleware to serve static files from the 'public' directory.
 * @param {string} 'public' - The directory from which to serve static files.
 */
app.use(express.static('public'));

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
 */
app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			throw res.status(400).json({ message: 'No file uploaded' });
		}

		// Read file and convert to data URL
		fileName = req.file.filename;
		buffer = fs.readFileSync(req.file.path);
		dataURL = `data:image/jpeg;base64,${buffer.toString('base64')}`;
		res.json({ success: true, dataURL: dataURL });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ message: `Failed to upload image ${fileName}` });
	}
});

/**
 * Route for rendering the success page.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.get('/success', async (req: Request, res: Response) => {
	// Detect text in the uploaded image
	detectedText = await getTextDetections(buffer, `uploads/${fileName}`);
	res.render('success', { detectedText: detectedText, dataURL: dataURL });
});

/**
 * Route for saving data to AWS and responding with the results.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.post('/save', async (req: Request, res: Response) => {
	try {
		// Upload data to AWS
		const awsUploadResults = await awsUpload(detectedText, fileName);
		res.json({ success: true, awsUploadResults: awsUploadResults });
		console.log('AWS Upload Results:', awsUploadResults);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ message: `Failed to upload image ${fileName}` });
	}
});

// Start the server
app.listen(3000, () => {
	console.log(`Server is running on port ${3000}`);
});
