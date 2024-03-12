import path from 'path';
import { FileNotFoundError, InvalidFormatError } from '../../classes/errorClasses';
import { fileOperations } from '../../helpers/storage/localSystem/fileOperations';
import { existsSync, readFileSync, statSync } from 'fs';

jest.mock('fs');

describe('fileOperations', () => {
	describe('checkFileExists', () => {
		it('should return true if the file exists', () => {
			const filePath = 'existing/file.txt';
			(existsSync as jest.Mock).mockReturnValue(true);

			const fileExists = fileOperations.fileExists(filePath);
			expect(fileExists).toBe(true);
		});

		it('should throw FileNotFoundError if the file does not exist', () => {
			const filePath = 'nonexistent/file.txt';
			(existsSync as jest.Mock).mockReturnValue(false);

			expect(() => fileOperations.fileExists(filePath)).toThrow(FileNotFoundError);
		});
	});

	describe('Test reading files', () => {
		it('should throw an error if there are issues reading the file', () => {
			const filePath = 'nonexistent/file.txt';
			(existsSync as jest.Mock).mockReturnValue(true);
			(statSync as jest.Mock).mockReturnValueOnce({ size: 10 });
			(readFileSync as jest.Mock).mockImplementation(() => {
				throw new Error('Error reading file');
			});

			expect(() => fileOperations.readFile(filePath)).toThrow();
		});

		it('should throw InvalidFormatError if the file is empty', () => {
			const filePath = 'empty/file.txt';
			(existsSync as jest.Mock).mockReturnValue(true);
			(statSync as jest.Mock).mockReturnValueOnce({ size: 0 });

			expect(() => fileOperations.readFile(filePath)).toThrow(InvalidFormatError);
		});

		it('should read the contents of the file', () => {
			const filePath = 'existing/file.txt';
			const fileContents = 'This is the file content.';
			(existsSync as jest.Mock).mockReturnValue(true);
			(statSync as jest.Mock).mockReturnValueOnce({ size: fileContents.length });
			(readFileSync as jest.Mock).mockReturnValue(fileContents);

			const content = fileOperations.readFile(filePath);
			expect(content).toBe(fileContents);
		});
	});
});
