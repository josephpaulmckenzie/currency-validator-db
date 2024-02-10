import {
	RegExValidators,
	SerialNumberMappings,
	NoteDetails,
	MatchedDetail,
	DenominationDetail,
	DetectedText,
	ExtendedDetectedText,
	UploadData,
	FederalReserveMapping,
	FileChecker,
	FileReader,
	AWSService,
	RouteErrors,
	MockedDynamoDbResponse,
	DynamoDbResponse,
	FileOperations,
} from '../../interfaces/interfaces';

describe('Interfaces', () => {
	describe('SerialNumberMappings', () => {
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

	describe('FederalReserveMapping', () => {
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

	describe('NoteDetails', () => {
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

	describe('RegExValidators', () => {
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
});
