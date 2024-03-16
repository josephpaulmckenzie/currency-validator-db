// loggingMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { log } from '../../helpers/logging/logger';

export function middlewareLogs(req: Request, res: Response, next: NextFunction): void {
	log('info', `Received ${req.method} request at ${req.url}`);
	next();
}
