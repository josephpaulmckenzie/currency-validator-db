import AWS from 'aws-sdk'; // Import the AWS module

import { insertIntoDynamo } from '../../src/helpers/dynamodb';
import { UploadData } from '../../src/interfaces/interfaces';

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

	it('should insert an item into DynamoDB successfully', async () => {
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

		// Call the function under test
		const result = await insertIntoDynamo(mockDetails);

		// Assert that the AWS.DynamoDB.DocumentClient.put method was called with the correct parameters
		expect(AWS.DynamoDB.DocumentClient.prototype.put).toHaveBeenCalledWith({
			TableName: 'currency',
			Item: mockDetails,
		});

		// Assert that the function returns the expected result
		expect(result).toEqual({});
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
		(AWS.DynamoDB.DocumentClient.prototype as any).put = mockPut;

		try {
			// Call the function under test and expect it to throw an error
			await insertIntoDynamo(mockDetails);
		} catch (error: any) {
			// Assert that the error message matches the expected message
			expect(error.message).toEqual('Insertion failed');
		}

		// Assert that the AWS.DynamoDB.DocumentClient.put method was called with the correct parameters
		expect(new AWS.DynamoDB.DocumentClient().put).toHaveBeenCalledWith({
			TableName: 'currency',
			Item: mockDetails,
		});
	});
});
