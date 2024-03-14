import request from 'supertest';
import { app } from '../../server/server';
import { getTextDetections } from '../../helpers/index';
import { NextFunction, Request, Response } from 'express';
import http from 'http';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { tmpdir } from 'os';

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
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
	console.error('An error occurred:', err.message);
	console.error('Route:', req.url);
	console.error('Stack:', err.stack);
	res.status(500).json({ error: err.message, route: req.url });
	next();
});

// Declare the server variable with the http.Server type
let server: http.Server;

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
	// Test the error handling middleware
	it('should error on  a route that does not exist', async () => {
		const response = await request(server).get('/nonexistent-route');
		// // Check if there is an error in the response
		if (response.error) {
			expect(response.error).toBeDefined();
			expect(response.error.status).toBe(404);
			expect(response.error.path).toBe('/nonexistent-route');
			expect(response.error.message).toBe('cannot GET /nonexistent-route (404)');
		}
	});
	// Test file upload route
	it('should successfully upload an image file', async () => {
		// Mock the middleware function for handling file upload
		app.post('/upload', mockMulterMiddleware(), async (req: Request, res: Response) => {
			if (!req.file) {
				return res.status(400).json({ message: 'No file uploaded' });
			}
			return res.json({ success: true, dataURL: 'mockDataURL' });
		});

		// Send a request to the upload route
		const response = await request(server).post('/upload').attach('image', mockFilePath); // Ensure mockFilePath points to a valid image file

		// Check if the response indicates a successful upload
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('success', true);
		expect(response.body).toHaveProperty('dataURL');

		// Additional assertion: Check if the returned dataURL is not empty
		expect(response.body.dataURL).toBeTruthy();
	});

	// Test the success route
	it('should render success page with note details', async () => {
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
});
