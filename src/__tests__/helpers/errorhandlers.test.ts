import { DatabaseError } from '../../classes/errorClasses';
import { handleDatabaseError } from '../../helpers/errorHandlers';

describe('handleDatabaseError function', () => {
	let consoleErrorSpy: jest.SpyInstance;

	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	it('should handle duplicate key violation error', () => {
		const error = new DatabaseError('Duplicate key violation', '23505', 'constraint');
		const result = handleDatabaseError(error);

		expect(result).toBe(true);
		expect(consoleErrorSpy).toHaveBeenCalledWith('Duplicate key violation:', 'constraint');
	});

	it('should handle table not found error', () => {
		const error = new DatabaseError('Table not found', '42P01', undefined, 'table_name');
		const result = handleDatabaseError(error);

		expect(result).toBe(true);
		expect(consoleErrorSpy).toHaveBeenCalledWith('Table not found:', 'table_name');
	});

	it('should handle unknown database error', () => {
		const error = new DatabaseError('Unknown database error', 'XYZ');
		const result = handleDatabaseError(error);

		expect(result).toBe(true);
		expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown database error:', error);
	});

	it('should handle other unknown errors', () => {
		const error = new Error('Some other error');
		const result = handleDatabaseError(error);

		expect(result).toBe(false);
		expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown error:', error);
	});

	it('should handle error not being an instance of DatabaseError', () => {
		const error = new Error('Some other error');
		const result = handleDatabaseError(error);

		expect(result).toBe(false);
		expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown error:', error);
	});
});
