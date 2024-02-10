import AWS from 'aws-sdk'; // Import the AWS module
import { insertIntoDynamo } from '../../helpers/dynamodb';
import { UploadData, DynamoDbResponse } from '../../interfaces/interfaces';

// Mocking AWS.DynamoDB.DocumentClient
jest.mock('aws-sdk', () => {
	const mockPut = jest.fn().mockReturnValue({
		promise: jest.fn().mockResolvedValue({}),
	});

	return {
		DynamoDB: {
			DocumentClient: jest.fn(() => ({
				put: mockPut,
			})),
		},
	};
});

describe('insertIntoDynamo', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Test case for successful insertion into DynamoDB.
	it('should insert an item into DynamoDB successfully', async () => {
		// Mocked input item
		const mockDetails: UploadData = {
			serialNumber: 'MK07304200B',
			federalReserveId: 'K11',
			federalReserveLocation: 'Dallas, TX',
			frontPlateId: 'FWE34',
			notePositionId: 'E1',
			s3Url: 'https://currencydb.s3.amazonaws.com/MK07304200B',
			secretary: 'Lew',
			SerialPatternMatch: 'fourTwentySerialPattern',
			seriesYear: '2013',
			treasurer: 'Rios',
			validDenomination: '20',
		};

		// Call the function under test
		const response: DynamoDbResponse = await insertIntoDynamo(mockDetails);

		// Expect the response to match the expected structure
		expect(response.status).toEqual('success');
		expect(response.item).toEqual(mockDetails);
	});

	it('should throw an error when insertion fails', async () => {
		// Mocked input item
		const mockDetails: UploadData = {
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

		// Mocking AWS.DynamoDB.DocumentClient.put to throw an error
		const mockPut = jest.fn().mockImplementation(() => ({
			promise: jest.fn().mockRejectedValueOnce(new Error('Insertion failed')),
		}));
		(AWS.DynamoDB.DocumentClient.prototype as AWS.DynamoDB.DocumentClient).put = mockPut;

		try {
			// Call the function under test and expect it to throw an error
			await insertIntoDynamo(mockDetails);
		} catch (error) {
			// Check if the error is an instance of Error
			if (error instanceof Error) {
				// Assert that the error message matches the expected message
				expect(error.message).toEqual('Insertion failed');
			} else {
				// Handle the case where 'error' is not an instance of Error
				throw error; // Re-throw the error
			}
		}
		// Assert that the AWS.DynamoDB.DocumentClient.put method was called with the correct parameters
		expect(new AWS.DynamoDB.DocumentClient().put).toHaveBeenCalledWith({
			TableName: 'currency',
			Item: mockDetails,
		});
	});
});
