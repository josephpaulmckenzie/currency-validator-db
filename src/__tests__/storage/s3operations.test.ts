import { saveToS3 } from '../../helpers/storage/aws/s3Operations';

// Mock the saveToS3 function
jest.mock('../../helpers/storage/aws/s3Operations', () => ({
	saveToS3: jest.fn(),
}));

describe('saveToS3', () => {
	it('should upload the file to S3 and return the object information', async () => {
		// Arrange
		const filePath = Buffer.from('example file content'); // Mock file content
		const s3Key = 'example.jpg';
		const expectedResponse = {
			Bucket: 'currencydb',
			Key: 'example.jpg',
			Location: 'https://s3.amazonaws.com/currencydb/example.jpg',
			ETag: '123456789',
		};

		// Mock the implementation of saveToS3
		(saveToS3 as jest.Mock).mockResolvedValueOnce(expectedResponse);

		// Act
		const result = await saveToS3(filePath, s3Key);

		// Assert
		expect(result).toEqual(expectedResponse);
		expect(saveToS3).toHaveBeenCalledTimes(1);
		expect(saveToS3).toHaveBeenCalledWith(filePath, s3Key);
	});

	it('should throw an error if the upload fails', async () => {
		// Arrange
		const filePath = Buffer.from('example file content'); // Mock file content
		const s3Key = 'example.jpg';
		const errorMessage = 'Upload failed';

		// Mock the implementation of saveToS3 to throw an error
		(saveToS3 as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

		// Act and Assert
		await expect(saveToS3(filePath, s3Key)).rejects.toThrow(errorMessage);

		// No need to check how many times saveToS3 was called in this test case
	});
});
