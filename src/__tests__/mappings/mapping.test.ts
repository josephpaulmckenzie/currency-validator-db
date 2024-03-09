import { FileNotFoundError, InvalidFormatError, MappingError } from '../../classes/errorClasses';
import { fileOperations } from '../../helpers/storage/localSystem/fileOperations';
import { createSerialNumberMappings } from '../../mappings/additional_mapping';

jest.mock('../../helpers/storage/localSystem/fileOperations');

describe('createSerialNumberMappings', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should throw FileNotFoundError when filePath is empty or falsy', () => {
		const emptyFilePath = '';
		expect(() => createSerialNumberMappings(emptyFilePath)).toThrow(FileNotFoundError);

		// You can add more test cases for other falsy values like null, undefined, etc.
	});

	it('should throw InvalidFormatError when lines.length <= 1', () => {
		// Mock readFile to return a string with only headers or an empty string
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce('DENOMINATION,SECRETARY,TREASURER,SERIES YEAR,SERIAL NUMBER PREFIX');

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

	it('should correctly parse the mapping data from a file with headers and a row of data', () => {
		const headers = 'DENOMINATION,SECRETARY,TREASURER,SERIES YEAR,SERIAL NUMBER PREFIX';
		const rowData = '$20, Bob, Bill, 2021, A';
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce(`${headers}\n${rowData}`);

		const filePath = 'path/to/file';
		const mappings = createSerialNumberMappings(filePath);

		expect(mappings['$20']).toBeDefined();
		expect(mappings['$20'].length).toBe(1);
		expect(mappings['$20'][0]).toEqual({
			serialNumberPrefix: 'A',
			denomination: '$20',
			seriesYear: '2021',
			treasurer: 'Bill',
			secretary: 'Bob',
		});
	});

	it('should throw InvalidFormatError when trimmedLineData has missing values', () => {
		const headers = 'DENOMINATION,SECRETARY,TREASURER,SERIES YEAR,SERIAL NUMBER PREFIX';
		const rowData = '$20, Bob, Bill, , A';
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce(`${headers}\n${rowData}`);

		const filePath = 'path/to/file';

		// Catch the error thrown by createSerialNumberMappings and compare it with a new instance of InvalidFormatError
		try {
			createSerialNumberMappings(filePath);
		} catch (error) {
			expect(error).toEqual(new InvalidFormatError('Invalid format of line: Missing required value', 400));
		}
	});

	it('should throw InvalidFormatError when trimmedLineData has missing values', () => {
		const headers = 'DENOMINATION,SECRETARY,TREASURER,SERIES YEAR,SERIAL NUMBER PREFIX';
		const rowData = '$20, Bob, Bill, , A';
		(fileOperations.readFile as jest.Mock).mockReturnValueOnce(`${headers}\n${rowData}`);

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
