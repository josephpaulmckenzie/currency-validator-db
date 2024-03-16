// File: indexController.ts
import { Request, Response } from 'express';

export const renderIndexPage = (req: Request, res: Response) => {
	// Render the index page
	res.render('index');
};
