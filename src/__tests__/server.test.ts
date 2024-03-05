import { app } from '@src/server';
import request from 'supertest';

describe('Server Tests', () => {
	// Test the '/' route
	it('should respond with status 200 for GET /', async () => {
		const response = await request(app).get('/');
		expect(response.status).toBe(200);
	});

	// Test the '/upload' route with no file attached
	it('should respond with status 400 for POST /upload with no file attached', async () => {
		const response = await request(app).post('/upload');
		expect(response.status).toBe(400);
	});

	// Test the '/success' route
	it('should respond with status 200 for GET /success', async () => {
		const response = await request(app).get('/success');
		expect(response.status).toBe(200);
	});

	// Test the '/save' route with valid data
	it('should respond with status 200 for POST /save with valid data', async () => {
		const response = await request(app).post('/save').send({
			/* send valid data */
		});
		expect(response.status).toBe(200);
		// Add more assertions if needed
	});

	// Test the '/save' route with invalid data
	it('should respond with status 400 for POST /save with invalid data', async () => {
		const response = await request(app).post('/save').send({
			/* send invalid data */
		});
		expect(response.status).toBe(400);
		// Add more assertions if needed
	});

	// Add more tests for other routes and functionalities as needed
});
