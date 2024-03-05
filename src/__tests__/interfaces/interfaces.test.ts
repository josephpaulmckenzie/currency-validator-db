import fs from 'fs';
import {
	RegExValidators,
	SerialNumberMappings,
	NoteDetails,
	MatchedDetail,
	DenominationDetail,
	DetectedText,
	UploadData,
	FederalReserveMapping,
	FileOperations,
	RouteError,
} from '../../interfaces/interfaces';

/**
 * Mock the AWS SDK for testing purposes
 */
jest.mock('aws-sdk', () => ({
	S3: jest.fn().mockImplementation(() => ({
		putObject: jest.fn().mockReturnThis(),
		promise: jest.fn().mockResolvedValue({ Location: 's3Url' }),
	})),
}));

/**
 * @test {SerialNumberMappings}
 */
describe('SerialNumberMappings', () => {
	/**
	 * @test {SerialNumberMappings}#key1
	 * @test {SerialNumberMappings}#key2
	 */
	it('should have string keys and an array of objects with specific properties', () => {
		const serialNumberMappings: SerialNumberMappings = {
			key1: [{ pattern: /pattern1/, denomination: 'denom1', seriesYear: 'year1', treasurer: 'treasurer1', secretary: 'secretary1' }],
			key2: [{ pattern: /pattern2/, denomination: 'denom2', seriesYear: 'year2', treasurer: 'treasurer2', secretary: 'secretary2' }],
		};
		expect(serialNumberMappings).toHaveProperty('key1');
		expect(serialNumberMappings).toHaveProperty('key2');
		expect(serialNumberMappings.key1).toBeInstanceOf(Array);
		expect(serialNumberMappings.key2).toBeInstanceOf(Array);
		expect(serialNumberMappings.key1[0]).toHaveProperty('pattern');
		expect(serialNumberMappings.key1[0]).toHaveProperty('denomination');
		expect(serialNumberMappings.key1[0]).toHaveProperty('seriesYear');
		expect(serialNumberMappings.key1[0]).toHaveProperty('treasurer');
		expect(serialNumberMappings.key1[0]).toHaveProperty('secretary');
		expect(serialNumberMappings.key1[0].pattern).toBeInstanceOf(RegExp);
	});
});

/**
 * @test {FederalReserveMapping}
 */
describe('FederalReserveMapping', () => {
	/**
	 * @test {FederalReserveMapping}#key1
	 * @test {FederalReserveMapping}#key2
	 */
	it('should have string keys and string values', () => {
		const federalReserveMapping: FederalReserveMapping = {
			key1: 'value1',
			key2: 'value2',
		};
		expect(federalReserveMapping).toHaveProperty('key1');
		expect(federalReserveMapping).toHaveProperty('key2');
		expect(typeof federalReserveMapping.key1).toBe('string');
		expect(typeof federalReserveMapping.key2).toBe('string');
	});
});

/**
 * @test {NoteDetails}
 */
describe('NoteDetails', () => {
	/**
	 * @test {NoteDetails}#validDenomination
	 * @test {NoteDetails}#frontPlateId
	 * @test {NoteDetails}#SerialPatternMatch
	 * @test {NoteDetails}#validSerialNumberPattern
	 * @test {NoteDetails}#federalReserveId
	 * @test {NoteDetails}#notePositionId
	 * @test {NoteDetails}#seriesYear
	 * @test {NoteDetails}#treasurer
	 * @test {NoteDetails}#secretary
	 */
	it('should have specific properties', () => {
		const noteDetails: NoteDetails = {
			validDenomination: 'denom',
			frontPlateId: 'frontId',
			SerialPatternMatch: 'pattern',
			validSerialNumberPattern: 'pattern',
			federalReserveId: 'id',
			notePositionId: 'position',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
		};
		expect(noteDetails).toHaveProperty('validDenomination');
		expect(noteDetails).toHaveProperty('frontPlateId');
		expect(noteDetails).toHaveProperty('SerialPatternMatch');
		expect(noteDetails).toHaveProperty('validSerialNumberPattern');
		expect(noteDetails).toHaveProperty('federalReserveId');
		expect(noteDetails).toHaveProperty('notePositionId');
		expect(noteDetails).toHaveProperty('seriesYear');
		expect(noteDetails).toHaveProperty('treasurer');
		expect(noteDetails).toHaveProperty('secretary');
	});
});

/**
 * @test {RegExValidators}
 */
describe('RegExValidators', () => {
	/**
	 * @test {RegExValidators}#key1
	 * @test {RegExValidators}#key2
	 */
	it('should have string keys and RegExp values', () => {
		const regexValidators: RegExValidators = {
			key1: /pattern1/,
			key2: /pattern2/,
		};
		expect(regexValidators).toHaveProperty('key1');
		expect(regexValidators).toHaveProperty('key2');
		expect(regexValidators.key1).toBeInstanceOf(RegExp);
		expect(regexValidators.key2).toBeInstanceOf(RegExp);
	});
});

/**
 * @test {MatchedDetail}
 */
describe('MatchedDetail', () => {
	/**
	 * @test {MatchedDetail}#seriesYear
	 * @test {MatchedDetail}#treasurer
	 * @test {MatchedDetail}#secretary
	 */
	it('should have specific properties', () => {
		const matchedDetail: MatchedDetail = {
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
		};
		expect(matchedDetail).toHaveProperty('seriesYear');
		expect(matchedDetail).toHaveProperty('treasurer');
		expect(matchedDetail).toHaveProperty('secretary');
		expect(typeof matchedDetail.seriesYear).toBe('string');
		expect(typeof matchedDetail.treasurer).toBe('string');
		expect(typeof matchedDetail.secretary).toBe('string');
	});
});

/**
 * @test {DenominationDetail}
 */
describe('DenominationDetail', () => {
	/**
	 * @test {DenominationDetail}#seriesYear
	 * @test {DenominationDetail}#treasurer
	 * @test {DenominationDetail}#secretary
	 * @test {DenominationDetail}#pattern
	 */
	it('should have specific properties', () => {
		const denominationDetail: DenominationDetail = {
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			pattern: /regexPattern/,
		};
		expect(denominationDetail).toHaveProperty('seriesYear');
		expect(denominationDetail).toHaveProperty('treasurer');
		expect(denominationDetail).toHaveProperty('secretary');
		expect(denominationDetail).toHaveProperty('pattern');
		expect(typeof denominationDetail.seriesYear).toBe('string');
		expect(typeof denominationDetail.treasurer).toBe('string');
		expect(typeof denominationDetail.secretary).toBe('string');
		expect(denominationDetail.pattern).toBeInstanceOf(RegExp);
	});
});

/**
 * @test {DetectedText}
 */
describe('DetectedText', () => {
	/**
	 * @test {DetectedText}#validDenomination
	 * @test {DetectedText}#frontPlateId
	 * @test {DetectedText}#SerialPatternMatch
	 * @test {DetectedText}#serialNumber
	 * @test {DetectedText}#federalReserveId
	 * @test {DetectedText}#notePositionId
	 */
	it('should have specific properties', () => {
		const detectedText: DetectedText = {
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			federalReserveLocation: 'Federal Reserve Loacation ',
			seriesYear: 'Series Year',
			treasurer: 'Treasurer',
			secretary: 'Secretary',
		};
		expect(detectedText).toHaveProperty('validDenomination');
		expect(detectedText).toHaveProperty('frontPlateId');
		expect(detectedText).toHaveProperty('SerialPatternMatch');
		expect(detectedText).toHaveProperty('serialNumber');
		expect(detectedText).toHaveProperty('federalReserveId');
		expect(detectedText).toHaveProperty('notePositionId');
		expect(detectedText).toHaveProperty('federalReserveLocation');
		expect(detectedText).toHaveProperty('seriesYear');
		expect(detectedText).toHaveProperty('treasurer');
		expect(detectedText).toHaveProperty('secretary');
	});
});

/**
 * @test {ExtendedDetectedText}
 */
describe('ExtendedDetectedText', () => {
	/**
	 * @test {ExtendedDetectedText}#validDenomination
	 * @test {ExtendedDetectedText}#frontPlateId
	 * @test {ExtendedDetectedText}#SerialPatternMatch
	 * @test {ExtendedDetectedText}#serialNumber
	 * @test {ExtendedDetectedText}#federalReserveId
	 * @test {ExtendedDetectedText}#notePositionId
	 * @test {ExtendedDetectedText}#seriesYear
	 * @test {ExtendedDetectedText}#treasurer
	 * @test {ExtendedDetectedText}#secretary
	 * @test {ExtendedDetectedText}#federalReserveLocation
	 */
	it('should extend DetectedText and MappedData interfaces', () => {
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('validDenomination');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('frontPlateId');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('SerialPatternMatch');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('serialNumber');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('federalReserveId');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('notePositionId');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('seriesYear');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('treasurer');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('secretary');
		expect({
			validDenomination: '20',
			frontPlateId: 'frontPlateId',
			SerialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
		}).toHaveProperty('federalReserveLocation');
	});
});

/**
 * @test {UploadData}
 */
describe('UploadData', () => {
	/**
	 * @test {UploadData}#validDenomination
	 * @test {UploadData}#frontPlateId
	 * @test {UploadData}#SerialPatternMatch
	 * @test {UploadData}#serialNumber
	 * @test {UploadData}#federalReserveId
	 * @test {UploadData}#notePositionId
	 * @test {UploadData}#seriesYear
	 * @test {UploadData}#treasurer
	 * @test {UploadData}#secretary
	 * @test {UploadData}#federalReserveLocation
	 * @test {UploadData}#s3Url
	 */
	it('should have specific properties', () => {
		const uploadData: UploadData = {
			validdenomination: '20',
			frontPlateId: 'frontPlateId',
			serialPatternMatch: 'SerialPatternMatch',
			serialNumber: 'serialNumber',
			federalReserveId: 'federalReserveId',
			notePositionId: 'notePositionId',
			seriesYear: 'year',
			treasurer: 'treasurer',
			secretary: 'secretary',
			federalReserveLocation: 'federalReserveLocation',
			s3Url: 's3Url',
			validSerialNumberPattern: '',
		};
		expect(uploadData).toHaveProperty('validDenomination');
		expect(uploadData).toHaveProperty('frontPlateId');
		expect(uploadData).toHaveProperty('SerialPatternMatch');
		expect(uploadData).toHaveProperty('serialNumber');
		expect(uploadData).toHaveProperty('federalReserveId');
		expect(uploadData).toHaveProperty('notePositionId');
		expect(uploadData).toHaveProperty('seriesYear');
		expect(uploadData).toHaveProperty('treasurer');
		expect(uploadData).toHaveProperty('secretary');
		expect(uploadData).toHaveProperty('federalReserveLocation');
		expect(uploadData).toHaveProperty('s3Url');
	});
});

/**
 * @test {FileOperations}
 */
describe('FileOperations', () => {
	it('should return true if the file exists', () => {
		// Replace the implementation of checkFileExists with actual file existence check
		const fileOperations: FileOperations = {
			checkFileExists: (filePath: string) => fs.existsSync(filePath),
			readFile: () => {
				throw new Error('Function not implemented.');
			},
		};
		// Provide a valid file path that exists in the file system
		const existingFilePath = '/Users/josephmckenzie/Documents/Code/currency-validator-db/directory_structure.txt';
		expect(fileOperations.checkFileExists(existingFilePath)).toBe(true);
	});

	it('should return false if the file does not exist', () => {
		const fileOperations: FileOperations = {
			checkFileExists: () => false,
			readFile: () => {
				throw new Error('Function not implemented.');
			},
		};
		expect(fileOperations.checkFileExists('/path/to/nonexistent/file')).toBe(false);
	});

	it('should throw an error if the file path is invalid', () => {
		const fileOperations: FileOperations = {
			checkFileExists: () => {
				throw new Error('Invalid file path.');
			},
			readFile: () => {
				throw new Error('Function not implemented.');
			},
		};
		expect(() => fileOperations.checkFileExists('/invalid/file/path')).toThrow('Invalid file path.');
	});
});

/**
 * @test {RouteError}
 */
describe('RouteError', () => {
	/**
	 * @test {RouteError}#status
	 */
	it('should be an instance of Error and have a status property', () => {
		// Create an instance of the custom error class RouteError
		const routeError: RouteError = new RouteError('Route error', 404);
		// Assert the properties of the error
		expect(routeError).toBeInstanceOf(Error);
		expect(routeError).toHaveProperty('status', 404);
	});
});
