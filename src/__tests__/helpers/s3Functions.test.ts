import * as fs from 'fs';
import AWS from 'aws-sdk';
import { saveToS3 } from '../../helpers/s3Functions';

jest.mock('fs'); // Mock the fs module
jest.mock('aws-sdk'); // Mock the AWS SDK

describe('saveToS3', () => {
	it('should upload a file to Amazon S3 and return the object URL', async () => {
		// Mock the file path and key
		const filePath = 'test.txt';
		const Key = 'test/test.txt';

		// Mock the file content
		const fileContent = 'This is a test file.';
		(fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

		// Mock the S3 upload function
		const uploadPromiseMock = jest.fn().mockResolvedValue({
			Location: 'https://s3.amazonaws.com/currencydb/test/test.txt',
		});
		const uploadMock = jest.fn().mockReturnValue({
			promise: uploadPromiseMock,
		});
		AWS.S3.prototype.upload = uploadMock;

		// Call the function
		const result = await saveToS3(filePath, Key);

		// Assert the result
		expect(result).toEqual('https://s3.amazonaws.com/currencydb/test/test.txt');

		// Assert that the S3 upload function was called with the correct parameters
		expect(AWS.S3.prototype.upload).toHaveBeenCalledWith({
			Bucket: 'currencydb',
			Key: 'test/test.txt',
			Body: 'This is a test file.',
		});
	});

	it('should throw an error if there are issues uploading the file to S3', async () => {
		// Mock the file path and key
		const filePath = 'test.txt';
		const Key = 'test/test.txt';

		// Mock the file content
		const fileContent = 'This is a test file.';
		(fs.readFileSync as jest.Mock).mockReturnValue(fileContent);

		// Mock the S3 upload function to throw an error
		const errorMessage = 'Error uploading file to S3.';
		const uploadPromiseMock = jest.fn().mockRejectedValue(new Error(errorMessage));
		const uploadMock = jest.fn().mockReturnValue({
			promise: uploadPromiseMock,
		});
		AWS.S3.prototype.upload = uploadMock;

		// Call the function and expect it to throw an error
		await expect(saveToS3(filePath, Key)).rejects.toThrowError(errorMessage);
	});
});
