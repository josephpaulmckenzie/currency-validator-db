import { RouteError } from '../../classes/errorClasses';
import { handleRouteError } from '../../middleware/errorHandler';
import { Response } from 'express';

// Mock the Response object
const mockResponse: Partial<Response> = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn(),
};

describe('handleRouteError', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should handle RouteError and return the appropriate status code and message', () => {
		const routeError = new RouteError(404, 'Not Found');
		handleRouteError(routeError, mockResponse as Response);

		// Expect status code and message to be returned correctly
		expect(mockResponse.status).toHaveBeenCalledWith(404);
		expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Not Found' });
	});

	it('should handle other types of errors and return a generic error message', () => {
		const error = new Error('Unexpected error occurred');
		handleRouteError(error, mockResponse as Response);

		// Expect status code 500 and a generic error message
		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
	});
});
