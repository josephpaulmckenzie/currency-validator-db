/**
 * @fileoverview Test suite for AwsService functions.
 * @module AwsServiceTests
 */

// Mocking dependencies
jest.mock('../../src/helpers/s3Functions', () => ({
	saveToS3: jest.fn(), // Mock saveToS3 function
}));

jest.mock('../../src/helpers/dynamodb', () => ({
	insertIntoDynamo: jest.fn(), // Mock insertIntoDynamo function
}));

// Importing dependencies and interfaces
import AwsService from '../../src/helpers/awsFunctions';
import { saveToS3 } from '../../src/helpers/s3Functions';
import { insertIntoDynamo } from '../../src/helpers/dynamodb';
import { UploadData } from '../../src/interfaces/interfaces'; // Assuming the correct path to interfaces
import { DynamoDBInsertionError, S3UploadError } from '../../src/classes/errorClasses'; // Assuming the correct path to error classes

// Mock data
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

const mockS3Key: string = 'TESTNOTE';

describe('AwsService', () => {
	// Reset mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Test suite for the uploadToAws function.
	 */
	describe('uploadToAws', () => {
		/**
		 * Test case: Upload data to S3 and insert into DynamoDB successfully.
		 */
		it('should upload data to S3 and insert into DynamoDB successfully', async () => {
			// Mocking saveToS3 to resolve with a value
			(saveToS3 as jest.Mock).mockResolvedValueOnce('mockS3Url');

			// Mocking insertIntoDynamo to resolve without an error
			(insertIntoDynamo as jest.Mock).mockResolvedValueOnce(undefined);

			// Call the function under test
			const result = await AwsService.uploadToAws(mockDetails, mockS3Key);

			// Assert that saveToS3 was called with the correct parameters
			expect(saveToS3).toHaveBeenCalledWith(mockS3Key, mockDetails.serialNumber);

			// Assert that insertIntoDynamo was called with the correct parameters
			expect(insertIntoDynamo).toHaveBeenCalledWith(mockDetails);

			// Assert the result
			expect(result).toEqual({ success: true });
		});

		/**
		 * Test case: Handle S3 upload error.
		 */
		it('should handle S3 upload error', async () => {
			// Mocking saveToS3 to reject with an error
			const errorMessage = 'S3 upload error';
			(saveToS3 as jest.Mock).mockRejectedValueOnce(new S3UploadError(errorMessage));

			// Call the function under test
			const result = await AwsService.uploadToAws(mockDetails, mockS3Key);

			// Assert that the function returns the expected result
			expect(result).toEqual({ success: false, message: errorMessage });
		});

		/**
		 * Test case: Handle DynamoDB insertion error.
		 */
		it('should handle DynamoDB insertion error', async () => {
			// Mocking saveToS3 to resolve with a value
			(saveToS3 as jest.Mock).mockResolvedValueOnce('mockS3Url');

			// Mocking insertIntoDynamo to reject with an error
			const errorMessage = 'DynamoDB insertion error';
			(insertIntoDynamo as jest.Mock).mockRejectedValueOnce(new DynamoDBInsertionError(errorMessage));

			// Call the function under test
			const result = await AwsService.uploadToAws(mockDetails, mockS3Key);

			// Assert that the function returns the expected result
			expect(result).toEqual({ success: false, message: errorMessage });
		});

		// Add more test cases for other error scenarios if needed
	});
});
