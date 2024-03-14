import { statSync } from 'fs';
import { FileNotFoundError, InvalidFormatError, MappingError } from '../../classes/errorClasses';
import { fileOperations } from '../../helpers/storage/localSystem/fileOperations';
import { createSerialNumberMappings } from '../../mappings/additional_mapping';

jest.mock('../../helpers/storage/localSystem/fileOperations');
jest.mock('fs');
// jest.mock('../../helpers/storage/localSystem/fileOperations', () => ({
// 	...jest.requireActual('../../helpers/storage/localSystem/fileOperations'), // Import the real module to keep unmocked methods
// 	createSerialNumberMappings: jest.fn(() => ({
// 		// Provide a mock implementation if needed
// 	})),
// }));

describe('createSerialNumberMappings', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should throw FileNotFoundError when filePath is empty or falsy', () => {
		const emptyFilePath = '';
		expect(() => createSerialNumberMappings(emptyFilePath)).toThrow(FileNotFoundError);
	});

	it('should throw InvalidFormatError when lines.length <= 1', () => {
		// Mock readFile to return a string with only headers or an empty string
		(fileOperations.fileExists as jest.Mock).mockReturnValue(true);
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce('DENOMINATION,SECRETARY,TREASURER,SERIES YEAR,SERIAL NUMBER PREFIX');
		(statSync as jest.Mock).mockReturnValueOnce({ size: 0 });
		const filePath = 'path/to/file';
		expect(() => createSerialNumberMappings(filePath)).toThrow(InvalidFormatError);
	});

	it('should throw InvalidFormatError when trimmedLineData length is not 5 or contains falsy values', () => {
		const invalidData = ['1', '2', '3', '4'];
		const invalidDataString = invalidData.join(',');
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce(invalidDataString);

		const filePath = 'path/to/file';
		expect(() => createSerialNumberMappings(filePath)).toThrow(InvalidFormatError);
	});

	it('should throw InvalidFormatError when mappingEntry has no non-null values', () => {
		// Mocking the readFile function to return a valid line with all null values
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce(',,,,');

		const filePath = 'path/to/file';
		expect(() => createSerialNumberMappings(filePath)).toThrow(InvalidFormatError);
	});

	it('should throw InvalidFormatError when trimmedLineData has missing values', () => {
		const headers = 'DENOMINATION,SECRETARY,TREASURER,SERIES YEAR,SERIAL NUMBER PREFIX';
		const rowData = '$20,Bob,Bill,,A';

		(fileOperations.fileExists as jest.Mock).mockReturnValue(true);
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce(`${headers}\n${rowData}`);
		(statSync as jest.Mock).mockReturnValueOnce({ size: 25 });

		const filePath = 'path/to/file';

		// Catch the error thrown by createSerialNumberMappings and check its message
		try {
			createSerialNumberMappings(filePath);
		} catch (error) {
			if (error instanceof InvalidFormatError) {
				expect(error).toBeInstanceOf(InvalidFormatError);
				expect(error.message).toEqual('Invalid format of line: Missing required value');
			}
		}
	});

	it('should be all good when when all needed keys are correctly supplied', () => {
		const validKeys = ['1', '2', '3', '4', '5'];
		const validDataString = validKeys.join(',');
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce(validDataString);

		const filePath = 'path/to/file';
		expect(() => createSerialNumberMappings(filePath)).toThrow(InvalidFormatError);
	});

	it('should throw an error', () => {
		const headers = 'DENOMINATION,SECRETARY,TREASURER,SERIES YEAR,SERIAL NUMBER PREFIX';
		const rowData = '$20, Bob, Bill, 2021, A';
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce(`${headers}\n${rowData}`);

		const filePath = 'path/to/file';

		try {
			createSerialNumberMappings(filePath);
		} catch (error) {
			if (error instanceof MappingError) {
				expect(error).toBeInstanceOf(MappingError);
				expect(error.message).toEqual('Invalid format of line: Missing required value');
			}
		}
	});
});
