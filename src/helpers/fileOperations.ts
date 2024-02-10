import { existsSync, readFileSync } from 'fs';
import { FileNotFoundError } from '../classes/errorClasses';
import { FileOperations } from '../interfaces/interfaces';

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
	checkFileExists(filePath: string): boolean {
		if (existsSync(filePath)) {
			return true;
		} else {
			throw new FileNotFoundError(`File not found at path: ${filePath}`);
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
			this.checkFileExists(filePath);
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
