import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
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
	FileOperations,
	AWSService,
	MockedDynamoDbResponse,
	DynamoDbResponse,
	RouteError,
} from '../../interfaces/interfaces';

/**
 * Mock the AWS SDK for testing purposes
 */
jest.mock('aws-sdk', () => ({
	S3: jest.fn().mockImplementation(() => ({
		putObject: jest.fn().mockReturnThis(),
		promise: jest.fn().mockResolvedValue({ Location: 's3Url' }), // Return a dummy S3 URL
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
		};
		expect(detectedText).toHaveProperty('validDenomination');
		expect(detectedText).toHaveProperty('frontPlateId');
		expect(detectedText).toHaveProperty('SerialPatternMatch');
		expect(detectedText).toHaveProperty('serialNumber');
		expect(detectedText).toHaveProperty('federalReserveId');
		expect(detectedText).toHaveProperty('notePositionId');
		expect(typeof detectedText.validDenomination).toBe('string');
		expect(typeof detectedText.frontPlateId).toBe('string');
		expect(typeof detectedText.SerialPatternMatch).toBe('string');
		expect(typeof detectedText.serialNumber).toBe('string');
		expect(typeof detectedText.federalReserveId).toBe('string');
		expect(typeof detectedText.notePositionId).toBe('string');
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
		const extendedDetectedText: ExtendedDetectedText = {
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
		};
		expect(extendedDetectedText).toHaveProperty('validDenomination');
		expect(extendedDetectedText).toHaveProperty('frontPlateId');
		expect(extendedDetectedText).toHaveProperty('SerialPatternMatch');
		expect(extendedDetectedText).toHaveProperty('serialNumber');
		expect(extendedDetectedText).toHaveProperty('federalReserveId');
		expect(extendedDetectedText).toHaveProperty('notePositionId');
		expect(extendedDetectedText).toHaveProperty('seriesYear');
		expect(extendedDetectedText).toHaveProperty('treasurer');
		expect(extendedDetectedText).toHaveProperty('secretary');
		expect(extendedDetectedText).toHaveProperty('federalReserveLocation');
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
			s3Url: 's3Url',
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
	/**
	 * @test {FileOperations}#checkFileExists
	 * @test {FileOperations}#readFile
	 */
	it('should have methods for checking file existence and reading files', () => {
		const fileOperations: FileOperations = {
			checkFileExists: () => {
				// Dummy implementation for test
				return true;
			},
			readFile: function (): string {
				throw new Error('Function not implemented.');
			},
		};
		// Call the method and assert its behavior
		expect(fileOperations.checkFileExists('/path/to/file')).toBe(true);
	});
});

/**
 * @test {FileChecker}#checkFileExists
 */
describe('FileChecker', () => {
	/**
	 * Test case to ensure the FileChecker interface has a checkFileExists method
	 */
	it('should have a checkFileExists method', () => {
		const fileChecker: FileChecker = {
			checkFileExists: () => {
				// Omit the filePath parameter
				// Dummy implementation for test
				return true;
			},
		};
		expect(fileChecker.checkFileExists('/path/to/file')).toBe(true);
	});
});

/**
 * @test {AWSService}
 */
describe('AWSService', () => {
	/**
	 * @test {AWSService}#insertIntoDynamo
	 * @test {AWSService}#saveToS3
	 */
	it('should have methods for inserting into DynamoDB and saving to S3', async () => {
		const awsService: AWSService = {
			insertIntoDynamo: async (): Promise<PutItemOutput> => {
				// Dummy implementation for test
				return {
					// Populate with appropriate properties of PutItemOutput
					// This is just an example, replace it with actual properties
					ConsumedCapacity: {
						CapacityUnits: 1,
					},
					ItemCollectionMetrics: {},
				};
			},

			saveToS3: async () => {
				// Dummy implementation for test
				return 's3Url';
			},
		};
		// Call the methods and assert their behavior
		const dataToInsert: UploadData = {
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
			s3Url: 's3Url',
		};
		// Call the methods and assert their behavior
		const dynamoDbResponse = await awsService.insertIntoDynamo(dataToInsert);
		const s3Url = await awsService.saveToS3('filePath', 'Key');

		// Adjust assertions based on the actual structure of the response
		expect(dynamoDbResponse).toBeDefined(); // Check if the response exists
		expect(s3Url).toBe('s3Url');
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

/**
 * @test {MockedDynamoDbResponse}
 */
describe('MockedDynamoDbResponse', () => {
	/**
	 * @test {MockedDynamoDbResponse}#status
	 * @test {MockedDynamoDbResponse}#item
	 */
	it('should have specific properties and a method item', () => {
		const mockedDynamoDbResponse: MockedDynamoDbResponse = {
			status: 'success',
			item: (item: UploadData) => ({ status: 'success', item }),
			s3Url: '',
			validDenomination: '',
			frontPlateId: '',
			SerialPatternMatch: '',
			serialNumber: '',
			federalReserveId: '',
			notePositionId: '',
			seriesYear: '',
			treasurer: '',
			secretary: '',
			federalReserveLocation: '',
		};
		// Assert the properties and method of the mocked response
		expect(mockedDynamoDbResponse).toHaveProperty('status', 'success');
		expect(typeof mockedDynamoDbResponse.item).toBe('function');
	});
});

/**
 * @test {DynamoDbResponse}
 */
describe('DynamoDbResponse', () => {
	/**
	 * @test {DynamoDbResponse}#status
	 * @test {DynamoDbResponse}#item
	 */
	it('should have specific properties', () => {
		const dynamoDbResponse: DynamoDbResponse = {
			status: 'success',
			item: {
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
				s3Url: 's3Url',
			},
		};
		expect(dynamoDbResponse).toHaveProperty('status', 'success');
		expect(dynamoDbResponse.item).toEqual({
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
			s3Url: 's3Url',
		});
	});
});
