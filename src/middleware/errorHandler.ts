import { Response } from 'express';
import { RouteError } from '../classes/errorClasses';

/**
 * Handle errors in routes by sending an appropriate response.
 * @param {Error} error - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */
function handleRouteError(error: Error, res: Response) {
	if (error instanceof RouteError) {
		res.status(error.status).json({ message: error.message });
	} else {
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

export { handleRouteError };
