import { FileNotFoundError } from '../../classes/errorClasses';
import { fileOperations } from '../../helpers/storage/localSystem/fileOperations';
import { existsSync, readFileSync } from 'fs';

jest.mock('fs');

describe('fileOperations', () => {
	beforeEach(() => {
		jest.resetAllMocks(); // Reset all mocks before each test
	});

	describe('checkFileExists', () => {
		it('should return true if the file exists', () => {
			const filePath = 'mockedpathlocation/directory_structure.txt';
			(existsSync as jest.Mock).mockReturnValue(true); // Mock existsSync to return true
			const fileExists = fileOperations.checkFileExists(filePath);
			expect(fileExists).toBe(true);
		});

		it('should throw FileNotFoundError if the file does not exist', () => {
			const filePath = 'path/to/nonexistent/file.txt';
			(existsSync as jest.Mock).mockReturnValue(false); // Mock existsSync to return false
			expect(() => fileOperations.checkFileExists(filePath)).toThrow(FileNotFoundError);
		});
	});

	describe('readFile', () => {
		it('should read the contents of the file', () => {
			const filePath = 'mockedpathlocation/directory_structure.txt';
			const fileContents = 'This is the file content.';
			(existsSync as jest.Mock).mockReturnValue(true); // Mock existsSync to return true
			(readFileSync as jest.Mock).mockReturnValue(fileContents); // Mock readFileSync to return file contents
			const content = fileOperations.readFile(filePath);
			expect(content).toBe(fileContents);
		});

		it('should throw FileNotFoundError if the file does not exist', () => {
			const filePath = 'path/to/nonexistent/file.txt';
			(existsSync as jest.Mock).mockReturnValue(false); // Mock existsSync to return false
			expect(() => fileOperations.readFile(filePath)).toThrow(FileNotFoundError);
		});

		it('should throw an error if there are issues reading the file', () => {
			const filePath = 'mockedpathlocation/directory_structure.txt';
			const errorMessage = 'Error reading file.';
			(existsSync as jest.Mock).mockReturnValue(true); // Mock existsSync to return true
			(readFileSync as jest.Mock).mockImplementation(() => {
				throw new Error(errorMessage); // Mock readFileSync to throw an error
			});
			expect(() => fileOperations.readFile(filePath)).toThrow(Error);
			expect(() => fileOperations.readFile(filePath)).toThrow(errorMessage);
		});
	});
});
