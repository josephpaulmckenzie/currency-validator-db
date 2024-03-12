import { constants } from 'buffer';
import { fileOperations } from '../helpers/storage/localSystem/fileOperations';
import { SerialNumberMappings, FederalReserveMapping } from '../interfaces/interfaces';
import { statSync } from 'fs';
import { FileNotFoundError, InvalidFormatError } from '../classes/errorClasses';

const federalReserveMapping: FederalReserveMapping = {
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

function createSerialNumberMappings(filePath: string) {
	try {
		if (!filePath) {
			console.log('File Path is required');
			throw new FileNotFoundError('File Path is required', 500);
		}

		if (!fileOperations.fileExists(filePath)) {
			// console.log('File does not exist');
			throw new FileNotFoundError('File does not exist', 500);
		}

		try {
			const fileStats = statSync(filePath);
			if (fileStats.size === 0) {
				// console.log('File is empty');
				throw new InvalidFormatError('File is empty', 500);
			}
		} catch (error) {
			// console.error('Error checking file size:', error);
			throw new InvalidFormatError('Error checking file size', 500);
		}

		const lines = fileOperations.readFile(filePath).split('\n');
		const serialNumberMappings: SerialNumberMappings = {};
		lines.forEach((line) => {
			if (line.trim() !== '') {
				const [denomination, secretary, treasurer, seriesYear, serialNumberPrefix] = line.trim().split(',');
				if (denomination && serialNumberPrefix) {
					if (!serialNumberMappings[denomination]) {
						serialNumberMappings[denomination] = [];
					}

					serialNumberMappings[denomination].push({
						serialNumberPrefix,
						denomination,
						seriesYear,
						treasurer,
						secretary,
					});
				}
			}
		});
		console.log('serialNumberMappings', serialNumberMappings);
		return serialNumberMappings;
	} catch (error) {
		// Re-throw specific errors
		if (error instanceof FileNotFoundError || error instanceof InvalidFormatError) {
			throw error;
		} else {
			// If it's an unexpected error, re-throw it
			throw error;
		}
	}
}

export { federalReserveMapping, createSerialNumberMappings };
