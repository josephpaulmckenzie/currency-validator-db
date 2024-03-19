import { formatErrorResponse } from '../../helpers/errorHandling/errorFormatting';

describe('formatErrorResponse', () => {
	it('should format error response with provided status code and message', () => {
		const statusCode = 404;
		const errorMessage = 'Resource not found';

		const result = formatErrorResponse(errorMessage, statusCode);

		expect(result).toEqual({ error: errorMessage, status: statusCode });
	});

	it('should format error response with provided status code and empty message', () => {
		const statusCode = 404;
		const errorMessage = '';

		const result = formatErrorResponse(errorMessage, statusCode);

		expect(result).toEqual({ error: errorMessage, status: statusCode });
	});
});
