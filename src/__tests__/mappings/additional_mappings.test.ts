import { fileOperations } from '../../helpers/fileOperations';
import { createSerialNumberMappings } from '../../mappings/additional_mapping';

// Mock the fileOperations module
jest.mock('../../helpers/fileOperations', () => ({
	fileOperations: {
		readFile: jest.fn(),
	},
}));

describe('createSerialNumberMappings', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create serial number mappings from file content', () => {
		// Mock file content and file reading behavior
		(fileOperations.readFile as jest.Mock).mockReturnValue('10 20 30 40 A1\n20 30 40 50 B2');

		// Call the function with a mock file path
		const serialNumberMappings = createSerialNumberMappings('mockFilePath');

		// Check if the mappings are created correctly
		expect(serialNumberMappings).toEqual({
			'10': [{ pattern: /^A1/, denomination: '10', seriesYear: '20', treasurer: '30', secretary: '40' }],
			'20': [{ pattern: /^B2/, denomination: '20', seriesYear: '30', treasurer: '40', secretary: '50' }],
		});
	});

	it('should throw an error if file reading fails', () => {
		// Mock file reading to throw an error
		(fileOperations.readFile as jest.Mock).mockImplementation(() => {
			throw new Error('File reading error');
		});

		// Expect the function to throw an error
		expect(() => createSerialNumberMappings('mockFilePath')).toThrow('File reading error');
	});

	it('should throw an error if file content is invalid', () => {
		// Mock file content with invalid format
		(fileOperations.readFile as jest.Mock).mockReturnValue('Invalid content');

		// Expect the function to throw an error
		expect(() => createSerialNumberMappings('mockFilePath')).toThrow('Error creating Serial Number Mappings Error: Invalid content');
	});
});
