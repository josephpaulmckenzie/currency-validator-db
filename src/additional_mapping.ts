import {readFile} from './fileOperations';
import * as Interfaces from '@interfaces/interfaces';

const federalReserveMapping: Record<string, string> = {
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

function createSerialNumberMappings(
  filePath: string
): Interfaces.SerialNumberMappings {
  try {
    const lines = readFile(filePath).split('\n');
    const serialNumberMappings: Interfaces.SerialNumberMappings = {};

    lines.forEach(line => {
      if (line.trim() !== '') {
        const [
          denomination,
          secretary,
          treasurer,
          seriesYear,
          serialNumberPrefix,
        ] = line.trim().split(/\s+/);

        if (denomination && serialNumberPrefix) {
          if (!serialNumberMappings[denomination]) {
            serialNumberMappings[denomination] = [];
          }

          const escapedPrefix = serialNumberPrefix.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
          );

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

export {federalReserveMapping, createSerialNumberMappings
};
