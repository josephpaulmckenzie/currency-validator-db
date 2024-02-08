import { fileOperations } from '../helpers/fileOperations';
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

function createSerialNumberMappings(filePath: string): SerialNumberMappings {
	try {
		const lines = fileOperations.readFile(filePath).split('\n');
		const serialNumberMappings: SerialNumberMappings = {};

		lines.forEach((line) => {
			if (line.trim() !== '') {
				const [denomination, secretary, treasurer, seriesYear, serialNumberPrefix] = line.trim().split(/\s+/);

				if (denomination && serialNumberPrefix) {
					if (!serialNumberMappings[denomination]) {
						serialNumberMappings[denomination] = [];
					}

					const escapedPrefix = serialNumberPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

					serialNumberMappings[denomination].push({
						pattern: new RegExp(`^${escapedPrefix}`),
						denomination,
						seriesYear,
						treasurer,
						secretary,
					});
				}
			}
		});
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
