// errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { log } from '../logging/logger';
import { formatErrorResponse } from './errorFormatting';
import { RouteError } from '../../classes/errorClasses';

// Error logging middleware
export function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
	log('error', `${err.message} at ${req.url}`, { stack: err.stack });
	next(err);
}

// Error handling middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	let statusCode: number;
	let errorMessage: string;

	if (err instanceof RouteError) {
		statusCode = 404;
		errorMessage = 'Resource Not Found';
	} else {
		statusCode = 500;
		errorMessage = 'Internal Server Error';
	}

	const errorResponse = formatErrorResponse(errorMessage, statusCode);
	res.status(statusCode).json(errorResponse);
}
