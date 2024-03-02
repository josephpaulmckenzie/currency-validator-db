/**
 * Handle database errors and log them appropriately.
 * @param error The error object to handle.
 * @returns A boolean indicating whether the error was successfully handled.
 */

import { DatabaseError } from '../classes/errorClasses';
// import { DatabaseError } from "../interfaces/interfaces";

/**
 * Handle database errors and log them appropriately.
 * @param error The error object to handle.
 * @returns A boolean indicating whether the error was successfully handled.
 */
function handleDatabaseError(error: unknown): boolean {
	if (error instanceof DatabaseError) {
		if (error instanceof DatabaseError) {
			if (error.code === '23505') {
				console.error('Duplicate key violation:', error.constraint);
				// Handle duplicate key violation error
			} else if (error.code === '42P01') {
				console.error('Table not found:', error.table);
				// Handle table not found error
			} else {
				console.error('Unknown database error:', error);
			}
			return true; // Error handled successfully
		} else {
			console.error('Unknown error:', error);
			// Handle other unknown errors
			return false; // Error not handled
		}
	} else {
		console.error('Unknown error:', error);
		return false; // Error not handled
	}
}

export { handleDatabaseError };
