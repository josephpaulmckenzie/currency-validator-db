jest.mock('../../src/helpers/s3Functions', () => ({
	saveToS3: jest.fn(),
}));

jest.mock('../../src/helpers/dynamodb', () => ({
	insertIntoDynamo: jest.fn(),
}));

import AwsService from '../../src/helpers/awsFunctions';
import { saveToS3 } from '../../src/helpers/s3Functions';
import { insertIntoDynamo } from '../../src/helpers/dynamodb';
import { UploadData } from '@root/src/interfaces/interfaces';
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
	beforeEach(() => {
		jest.clearAllMocks(); // Reset mocks before each test
	});

	describe('uploadToAws', () => {
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

		// Other test cases for error handling scenarios
	});
});
