// errorHandler.ts
import { Request, Response } from 'express';
import { RouteNotFound } from '../../classes/routeClasses';
import { log } from '../logging/logger';

export function errorHandler(err: Error, req: Request, res: Response) {
	let statusCode: number;
	let errorMessage: string;

	if (err instanceof RouteNotFound) {
		statusCode = 404;
		errorMessage = 'Resource Not Found';
	} else {
		statusCode = 500;
		errorMessage = 'Internal Server Error';
	}

	log('error', `${err.message} at ${req.url}`, err.stack);
	res.status(statusCode).json({ error: errorMessage });
}
