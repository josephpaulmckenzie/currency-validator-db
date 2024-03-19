import { Request, Response, NextFunction } from 'express';
import { RouteError } from '../../classes/errorClasses';
import { errorHandler, logErrors } from '../../helpers/errorHandling/errorHandler';
import { formatErrorResponse } from '../../helpers/errorHandling/errorFormatting';

jest.mock('../../helpers/logging/logger', () => ({
	log: jest.fn(),
}));

jest.mock('../../helpers/errorHandling/errorFormatting', () => ({
	formatErrorResponse: jest.fn(),
}));

describe('logErrors middleware', () => {
	it('should log the error and call the next function', () => {
		const err = new Error('Test error');
		const req = {} as Request;
		const res = {} as Response;
		const next = jest.fn() as NextFunction;

		logErrors(err, req, res, next);

		expect(next).toHaveBeenCalledWith(err);
		expect(next).toHaveBeenCalledTimes(1);
		expect(formatErrorResponse).not.toHaveBeenCalled();
	});
});

describe('errorHandler middleware', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should handle RouteError and return a 404 status with appropriate message', () => {
		const err = new RouteError('Route not found', 404);
		const req = {} as Request;
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		} as unknown as Response;
		const next = jest.fn() as NextFunction;

		// Mock formatErrorResponse to return the expected response
		(formatErrorResponse as jest.Mock).mockReturnValueOnce({ error: 'Resource Not Found', status: 404 });

		errorHandler(err, req, res, next);
		expect(formatErrorResponse).toHaveBeenCalledTimes(1);
		expect(formatErrorResponse).toHaveBeenCalledWith('Resource Not Found', 404);

		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(404);

		expect(res.json).toHaveBeenCalledWith({ error: 'Resource Not Found', status: 404 });
		expect(res.json).toHaveBeenCalledTimes(1);

		expect(next).not.toHaveBeenCalled();
	});

	it('should handle generic errors and return a 500 status with appropriate message', () => {
		const err = new Error('Test error');
		const req = {} as Request;
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response;
		const next = jest.fn() as NextFunction;

		// Mock formatErrorResponse to return the expected response
		(formatErrorResponse as jest.Mock).mockReturnValueOnce({ error: 'Internal Server Error' });

		errorHandler(err, req, res, next);

		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(500);

		expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

		expect(next).not.toHaveBeenCalled();

		expect(formatErrorResponse).toHaveBeenCalledWith('Internal Server Error', 500);
		expect(formatErrorResponse).toHaveBeenCalledTimes(1);
		expect(formatErrorResponse).toHaveReturnedWith({ error: 'Internal Server Error' });
	});
});
