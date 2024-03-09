/**
 * Handle database errors and log them appropriately.
 * @param error The error object to handle.
 * @returns A boolean indicating whether the error was successfully handled.
 */

import { DatabaseError } from '../classes/errorClasses';

/**
 * Handle database errors and log them appropriately.
 * @param error The error object to handle.
 * @returns A boolean indicating whether the error was successfully handled.
 */
function handleDatabaseError(error: unknown): boolean {
	if (error instanceof DatabaseError) {
		throw new DatabaseError(error.message, '500');
	} else {
		console.error('Unknown error:', error);
		throw new DatabaseError('An unknown error occurred.', '500');
	}
}

export { handleDatabaseError };
