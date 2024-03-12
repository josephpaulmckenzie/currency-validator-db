import { existsSync, readFileSync, statSync } from 'fs';
import { FileNotFoundError, InvalidFormatError } from '../../../classes/errorClasses';
import { FileOperations } from '../../../interfaces/interfaces';

/**
 * Object combining file checking and reading operations.
 * @type {FileOperations}
 */
const fileOperations: FileOperations = {
	/**
	 * Checks if a file exists at the specified path.
	 * @param {string} filePath - The path of the file to check.
	 * @returns {boolean} True if the file exists, false otherwise.
	 * @throws {FileNotFoundError} Throws an error if the file does not exist.
	 */
	fileExists(filePath: string): boolean {
		if (existsSync(filePath)) {
			return true;
		} else {
			throw new FileNotFoundError(`File not found at path: ${filePath}`, 404);
		}
	},

	/**
	 * Reads the contents of a file.
	 * @param {string} filePath - The path of the file to read.
	 * @returns {string} The content of the file as a string.
	 * @throws {Error} Throws an error if there are any issues reading the file.
	 */
	readFile(filePath: string): string {
		try {
			if (!existsSync(filePath)) {
				throw new FileNotFoundError('File does not exist', 500);
			}
			if (existsSync(filePath)) {
				const stats = statSync(filePath);

				if (stats.size === 0) {
					// console.log('File is empty');
					throw new InvalidFormatError('File is empty', 500);
				}
			}

			return readFileSync(filePath, 'utf8');
		} catch (error) {
			if (error instanceof FileNotFoundError) {
				throw error;
			}
			throw error;
		}
	},
};

export { fileOperations };
