import { constants } from 'buffer';
import { fileOperations } from '../helpers/storage/localSystem/fileOperations';
import { SerialNumberMappings, FederalReserveMapping } from '../interfaces/interfaces';

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
	// console.log('in create mappinsgs (file path)', filePath);
	try {
		const lines = fileOperations.readFile(filePath).split('\n');
		const serialNumberMappings: SerialNumberMappings = {};
		// console.log('lines', lines);
		lines.forEach((line) => {
			// console.log('line', line);
			if (line.trim() !== '') {
				const [denomination, secretary, treasurer, seriesYear, serialNumberPrefix] = line.trim().split(',');
				// console.log('denomination', denomination);
				// console.log('secretary', secretary);
				// console.log('treasurer', treasurer);
				// console.log('seriesYear', seriesYear);
				// console.log('serialNumberPrefix', serialNumberPrefix);
				if (denomination && serialNumberPrefix) {
					if (!serialNumberMappings[denomination]) {
						serialNumberMappings[denomination] = [];
					}

					// const escapedPrefix = serialNumberPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
		// consosle.log('serialNumberMappings', serialNumberMappings);
		return serialNumberMappings;
	} catch (error) {
		throw {
			status: 400,
			error: `Error creating Serial Number Mappings ${error} `,
			inputDetails: {},
			validator: 'createSerialNumberMappings',
		};
	}
}

export { federalReserveMapping, createSerialNumberMappings };
