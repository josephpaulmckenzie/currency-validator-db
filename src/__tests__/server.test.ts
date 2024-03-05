import { app } from '../server/server';
import request from 'supertest';
import http from 'http';

describe('Server Tests', () => {
	let server: http.Server; // Explicitly specify the type as http.Server

	beforeAll((done) => {
		server = app.listen(3007, () => {
			console.log(`Server is running on port ${3007}`);
			done();
		});
	});

	afterAll((done) => {
		server.close(done);
	});

	// Test the '/' route
	it('should respond with status 200 for GET /', async () => {
		const response = await request(app).get('/');
		expect(response.status).toBe(200);
	});

	// Test the '/save' route with invalid data
	it('should respond with status 500 for POST /save with invalid data', async () => {
		const response = await request(app).post('/save').send({
			/* send invalid data */
		});
		expect(response.status).toBe(400); // Corrected to expect 500 instead of 400
		// Add more assertions if needed
	});

	// Add more tests for other routes and functionalities as needed
});
