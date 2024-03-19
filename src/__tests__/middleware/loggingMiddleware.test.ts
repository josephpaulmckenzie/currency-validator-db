import { Request, Response, NextFunction } from 'express';
import { log } from '../../helpers/logging/logger';
import { middlewareLogs } from '../../middleware/logging/loggingMidleware';

jest.mock('../../helpers/logging/logger', () => ({
	log: jest.fn(),
}));

describe('middlewareLogs', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: jest.MockedFunction<NextFunction>;

	beforeEach(() => {
		req = {
			method: 'GET',
			url: '/test',
		};
		res = {} as Partial<Response>;
		next = jest.fn();
	});

	it('should log the request information', () => {
		middlewareLogs(req as Request, res as Response, next);

		expect(log).toHaveBeenCalledWith('info', expect.stringContaining('GET request at /test'));
		expect(next).toHaveBeenCalled();
	});
});
