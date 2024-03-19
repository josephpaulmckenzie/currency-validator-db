// errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { RouteNotFound } from '../../classes/routeClasses';
import { log } from '../logging/logger';
import { formatErrorResponse } from './errorResponse'; // Import the formatErrorResponse function

// Error logging middleware
export function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
	log('error', `${err.message} at ${req.url}`, { stack: err.stack });
	next(err);
}

// Error handling middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	let statusCode: number;
	let errorMessage: string;

	if (err instanceof RouteNotFound) {
		statusCode = 404;
		errorMessage = 'Resource Not Found';
	} else {
		statusCode = 500;
		errorMessage = 'Internal Server Error';
	}

	const errorResponse = formatErrorResponse(statusCode, errorMessage); // Format the error response
	res.status(statusCode).json(errorResponse); // Send the formatted error response
}
