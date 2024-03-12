import { statSync } from 'fs';
import { InvalidFormatError, TextDetectionsError, ValidationError } from '../../classes/errorClasses';
import { fileOperations } from '../../helpers/storage/localSystem/fileOperations';
import { createSerialNumberMappings } from '../../mappings/additional_mapping';
jest.mock('../../helpers/storage/localSystem/fileOperations');
jest.mock('fs');

afterEach(() => {
	jest.clearAllMocks();
});

describe('TextDetectionsError', () => {
	it('should create an instance of TextDetectionsError with the correct message', () => {
		const errorMessage = 'Error during text detections';
		const error = new TextDetectionsError(errorMessage);

		expect(error).toBeInstanceOf(TextDetectionsError);
		expect(error.message).toEqual(errorMessage);
	});

	it('should have the name property set to "TextDetectionsError"', () => {
		const error = new TextDetectionsError('Some error message');
		expect(error.name).toEqual('TextDetectionsError');
	});
});

describe('ValidationError', () => {
	it('should create an instance of ValidationError', () => {
		const errorMessage = 'Error during Validation';
		const error = new ValidationError(errorMessage);

		expect(error).toBeInstanceOf(ValidationError);
		expect(error.message).toEqual(errorMessage);
	});

	it('should have the name property set to "ValidationError"', () => {
		const error = new ValidationError('Some error message');
		expect(error.name).toEqual('ValidationError');
	});
});

it('should throw InvalidFormatError for an empty file', () => {
	(fileOperations.fileExists as jest.Mock).mockReturnValue(true);
	(fileOperations.readFile as jest.Mock).mockReturnValue('');
	(statSync as jest.Mock).mockReturnValueOnce({ size: 0 });

	const filePath = 'path/to/empty/file.txt';
	expect(() => createSerialNumberMappings(filePath)).toThrow(InvalidFormatError);
});

it('should throw InvalidFormatError for a file with only headers', () => {
	(fileOperations.fileExists as jest.Mock).mockReturnValue(true);
	(fileOperations.readFile as jest.Mock).mockReturnValue('DENOMINATION, SECRETARY, TREASURER, SERIES_YEAR, SERIAL_NUMBER_PREFIX');

	const filePath = 'path/to/file/with/only/headers.txt';
	expect(() => createSerialNumberMappings(filePath)).toThrow(InvalidFormatError);
});
