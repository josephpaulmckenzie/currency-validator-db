import { FileNotFoundError, InvalidFormatError, MappingError } from '../classes/errorClasses';
import { fileOperations } from '../helpers/storage/localSystem/fileOperations';
import { SerialNumberMappings, FederalReserveMapping } from '../interfaces/interfaces';

export const federalReserveMapping: FederalReserveMapping = {
	A1: 'Boston, MA',
	B2: 'New York City, NY',
	C3: 'Philadelphia, PA',
	D4: 'Cleveland, OH',
	E5: 'Richmond, VA',
	F6: 'Atlanta, GA',
	G7: 'Chicago, IL',
	H8: 'St. Louis, MO',
	I9: 'Minneapolis, ME',
	J10: 'Kansas City, MO',
	K11: 'Dallas, TX',
	L12: 'San Francisco, CAs',
};

export function createSerialNumberMappings(filePath: string): SerialNumberMappings {
	const serialNumberMappings: SerialNumberMappings = {};
	const fileContent = fileOperations.readFile(filePath);

	try {
		if (!filePath) throw new FileNotFoundError('Mapping File not found', 404);

		const lines = fileContent.split('\n');

		if (lines.length <= 1) {
			throw new InvalidFormatError('Mapping File is empty or contains only headers', 400);
		}

		lines.slice().map((line: string, lineNumber: number) => {
			if ((lines[0].startsWith('DENOMINATION') && lineNumber === 0) || line.trim() === '') return;

			// Split the line into fields using comma as delimiter
			const lineData = line.split(',');
			// Remove leading/trailing whitespace from each field
			const trimmedLineData = lineData.map((field: string) => field.trim());

			// Validate the format of the line
			if (trimmedLineData.length !== 5 || !trimmedLineData.every(Boolean)) {
				throw new InvalidFormatError('Invalid format of line: Missing required value', 400);
			}

			// Extract data from the line
			const [denomination, secretary, treasurer, seriesYear, serialNumberPrefix] = trimmedLineData;

			// Initialize denomination mappings if it doesn't exist
			if (!serialNumberMappings[denomination]) {
				serialNumberMappings[denomination] = [];
			}

			// Construct the mapping entry
			const mappingEntry = {
				serialNumberPrefix,
				denomination,
				seriesYear,
				treasurer,
				secretary,
			};

			// Check if all required keys have non-null values
			if (Object.values(mappingEntry).length === 0) {
				throw new MappingError('Error creating mapping entry: Missing required keys or values', 500);
			}

			// Add the mapping entry to the denomination mappings
			serialNumberMappings[denomination].push(mappingEntry);
		});

		return serialNumberMappings;
	} catch (error) {
		if (error instanceof FileNotFoundError || error instanceof InvalidFormatError) {
			throw error;
		} else {
			throw new Error('Error creating serial number mappings');
		}
	}
}
