import { createSerialNumberMappings } from '../../mappings/additional_mapping';
import { fileOperations } from '../../helpers/storage/localSystem/fileOperations';
import { CustomError } from '../../interfaces/interfaces';
import { InvalidFormatError } from '../../classes/errorClasses';

jest.mock('../../helpers/storage/localSystem/fileOperations');

describe('createSerialNumberMappings', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	it('should correctly parse the mapping data from the file', () => {
		// Mock the readFile function to return mock mapping data
		(fileOperations.readFile as jest.Mock).mockReturnValue(
			`
			$1, Rubin, Withrow, 1996, *
			$20, Rubin, Withrow, 1996, A
			$50, Rubin, Withrow, 1996, A
			`.trim()
		);

		const filePath = 'fakepath/additionalMappingDetails.csv';
		const mappings = createSerialNumberMappings(filePath);

		// Assert specific mapping entries
		expect(mappings['$1']).toBeDefined();
		expect(mappings['$1'].length).toBe(1);
		expect(mappings['$1'][0]).toEqual({
			denomination: '$1',
			secretary: 'Rubin',
			treasurer: 'Withrow',
			seriesYear: '1996',
			serialNumberPrefix: '*',
		});
		expect(mappings['$20']).toBeDefined();
		expect(mappings['$20'].length).toBe(1);
		expect(mappings['$20'][0]).toEqual({
			denomination: '$20',
			secretary: 'Rubin',
			treasurer: 'Withrow',
			seriesYear: '1996',
			serialNumberPrefix: 'A',
		});
		// Add more specific assertions based on your expected outcomes
	});

	it('should correctly parse the mapping data from a file with headers', () => {
		// Mock the readFile function to return mock mapping data with headers
		(fileOperations.readFile as jest.Mock).mockReturnValue(
			`
			DENOMINATION,SECRETARY,TREASURER,SERIES YEAR,SERIAL NUMBER PREFIX
			$20,Rubin,Withrow,1996,A
			$50,Rubin,Withrow,1996,A
			$100,Rubin,Withrow,1996,A
			$1,Summers,Withrow,1999,*
			`.trim()
		);

		const filePath = 'fakepath/additionalMappingDetails.csv';
		const mappings = createSerialNumberMappings(filePath);

		expect(mappings['$20']).toBeDefined();
		expect(mappings['$20'].length).toBe(1);
		expect(mappings['$20'][0]).toEqual({
			denomination: '$20',
			secretary: 'Rubin',
			treasurer: 'Withrow',
			seriesYear: '1996',
			serialNumberPrefix: 'A',
		});
	});

	it('should handle an empty file', () => {
		const filePath = 'path/to/empty/file.txt';
		try {
			createSerialNumberMappings(filePath);
		} catch (error) {
			if (error instanceof InvalidFormatError) {
				// Asserting type to InvalidFormatError
				expect(error.message).toEqual('Mapping File is empty or contains only headers');
				expect(error.statusCode).toEqual(400);
			} else {
				// Handle other error types if needed
				fail('Expected error to be an instance of InvalidFormatError');
			}
		}
	});

	it('should handle a file with invalid format', () => {
		// Mock the readFile function to return mock mapping data with invalid format
		(fileOperations.readFile as jest.Mock).mockReturnValue(
			`
            $20,Rubin,Withrow,1996,A
            Rubin,Withrow,1996,A
        `.trim()
		);

		const filePath = 'fakepath/additionalMappingDetails.txt';

		// Expect createSerialNumberMappings to throw an error
		expect(() => createSerialNumberMappings(filePath)).toThrow(InvalidFormatError);
	});
});
