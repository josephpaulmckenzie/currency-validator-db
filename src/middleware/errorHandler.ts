import { Response, Request, NextFunction } from 'express';
import { RouteError } from '../classes/errorClasses';

/**
 * Handle errors in routes by sending an appropriate response.
 * @param {Error} error - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */
function handleRouteError(error: Error, req: Request, res: Response, next: NextFunction) {
	if (error instanceof RouteError) {
		res.status(error.status).json({ message: error.message });
	} else {
		// Redirect based on the context or type of error
		if (req.originalUrl.startsWith('/upload')) {
			res.redirect('/'); // Redirect to the upload page
		} else if (req.originalUrl.startsWith('/success')) {
			res.redirect('/'); // Redirect to the upload page
		} else if (req.originalUrl.startsWith('/save')) {
			res.redirect('/success'); // Redirect to the success page
		} else {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
}

export { handleRouteError };
