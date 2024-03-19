import request from 'supertest';
import { app } from '../../server/server';
import { NextFunction, Request, Response } from 'express';
import { getTextDetections } from '../../helpers/index';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { Server } from 'http';

// Mock the multer middleware function
const mockMulterMiddleware = () => (req: Request, _res: Response, next: NextFunction) => {
	req.file = {
		filename: 'test.jpg',
		path: 'test.jpg',
		mimetype: 'image/jpeg',
	} as Express.Multer.File;
	next();
};

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error('An error occurred:', err.message);
	console.error('Route:', req.url);
	console.error('Stack:', err.stack);
	res.status(500).json({ error: err.message, route: req.url });
	next();
});

// Declare the server variable with the http.Server type
let server: Server;

// Start the server on a random port for testing
beforeAll(() => {
	server = app.listen(0);
});

// Close the server after running tests
afterAll((done) => {
	server.close(done);
});

// Mock the getTextDetections function
jest.mock('../../helpers/index', () => ({
	getTextDetections: jest.fn(),
}));

// Test suite for the Express server
describe('Express Server', () => {
	// Create a temporary directory for the mock file
	const tempDir = mkdtempSync(path.join(tmpdir(), 'test-'));
	// Create a mock file with mock content
	const mockFilePath = path.join(tempDir, 'test.jpg');
	writeFileSync(mockFilePath, 'mock file content');

	// Test the logging middleware
	it('should log incoming requests', async () => {
		const consoleSpy = jest.spyOn(console, 'log');
		const response = await request(app).get('/');
		expect(consoleSpy).toHaveBeenCalled();
		expect(response.status).toBe(200);
	});

	// Test the success route
	it('should render the success page with note details', async () => {
		// Mock getTextDetections to return some mock data
		(getTextDetections as jest.Mock).mockResolvedValueOnce({
			validdenomination: '20',
			frontPlateId: 'FWE34',
			serialPatternMatch: 'fourTwentySerialPattern',
			serialNumber: 'MK07304200B',
			federalReserveId: 'K11',
			federalReserveLocation: 'Dallas, TX',
			notePositionId: 'E1',
			seriesYear: '2013',
			treasurer: 'Rios',
			secretary: 'Lew',
			s3Url: '',
		});

		const response = await request(app).get('/success');
		expect(response.status).toBe(200);
	});

	// Cleanup: Delete the temporary directory and its contents
	afterAll(() => {
		rmSync(tempDir, { recursive: true });
	});

	// Test file upload route
	describe('File Upload Route', () => {
		it('should return an error if no file is uploaded', async () => {
			// Mock the middleware function for handling file upload
			app.post('/upload', mockMulterMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
				if (!req.file) {
					// return res.status(400).json({ message: 'No file uploaded' });
					next();
				}
				return res.json({ success: true, dataURL: 'mockDataURL' });
			});

			const response = await request(server).post('/upload');
			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty('message', 'No file uploaded');
		});

		it('should successfully upload an image file', async () => {
			// Mock the middleware function for handling file upload
			app.post('/upload', mockMulterMiddleware(), async (req: Request, res: Response) => {
				if (!req.file) {
					return res.status(400).json({ message: 'No file uploaded' });
				}
				return res.json({ success: true, dataURL: 'mockDataURL' });
			});

			const response = await request(server).post('/upload').attach('image', mockFilePath);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('success', true);
			expect(response.body).toHaveProperty('dataURL');
			expect(response.body.dataURL).toBeTruthy();
		});
	});
});
// Test for error handling
describe('Routes with error handling', () => {
	it('should handle errors for GET route', async () => {
		// Simulate an error in the GET route handler
		app.get('/', async (_req: Request, _res: Response, next: NextFunction) => {
			try {
				const response = await request(app).get('/');

				// Check if the response indicates an error and contains the expected error message
				expect(response.status).toBe(500);
				expect(response.body).toHaveProperty('error', 'Test error');
				expect(response.body).toHaveProperty('route', '/');

				// Simulate an error (e.g., by throwing an error)
				throw new Error('Test error');
			} catch (error) {
				console.error('Error caught:', (error as Error).message);
				next(error); // Call next with the error
			}
		});
	});
});
