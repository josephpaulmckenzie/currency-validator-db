// Import the startServer function from startServer.ts

// Import the Express app
import { app } from '../../server/server';

// Import request from supertest
import testRequest from 'supertest';
import { startServer, stopServer } from '../../startServer';
import fs from 'fs';

import path from 'path';

// Inside the test case
const filePath = path.resolve(__dirname, '../../public/uploads/MK.jpeg');
console.log('Resolved file path:', filePath);
const res = testRequest(app).post('/upload').attach('image', filePath);

// Call startServer before running the tests
// Call startServer before each test case
beforeEach(async () => {
	await startServer();
});

// Call stopServer after each test case to stop the server
afterEach(async () => {
	await stopServer();
});

// Now you can write your test cases
describe('Index Page Route', () => {
	// Test the GET '/' route
	describe('GET /', () => {
		it('responds with status 200 and renders the index page', async () => {
			const res = await testRequest(app).get('/');
			expect(res.status).toBe(200);
			// Add your expectations for rendering the index page here
		});
		it('serves static assets along with the index page', async () => {
			const res = await testRequest(app).get('/');
			expect(res.status).toBe(200);
			expect(res.text).toContain('<title>Upload Image</title>');
			// expect(res.text).toContain('<script src="/script.js"></script>');
		});

		it('sets caching headers for the index page', async () => {
			const res = await testRequest(app).get('/');
			expect(res.status).toBe(200);
			expect(res.headers['cache-control']).toBeUndefined();
		});
	});
});
describe('Upload Route', () => {
	describe('POST /upload', () => {
		it('responds with success message and data URL on successful file upload', async () => {
			console.log('Request object:', testRequest);
			const res = await testRequest(app).post('/upload').attach('image', '../../public/uploads/MK.jpeg');

			// Verify response status and body
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body).toHaveProperty('dataURL');

			// Verify that the uploaded file is stored in the correct destination directory
			const uploadedFilePath = res.body.dataURL.split(',')[1]; // Extract base64 data
			const buffer = Buffer.from(uploadedFilePath, 'base64');
			const destinationDir = 'public/uploads/';
			expect(fs.existsSync(destinationDir)).toBe(true);
			expect(fs.readFileSync(destinationDir + 'MK.jpeg')).toEqual(buffer); // Update the file name here
		});

		// Remaining test cases
	});
});
