import { DatabaseError } from 'pg';
import { AwsService } from '../../helpers/storage/aws/awsServices';
import { saveToS3 } from '../../helpers/storage/aws/s3Operations';
import { insertNoteDetail } from '../../helpers/insertRecord';
import { S3UploadError } from '../../classes/errorClasses';

jest.mock('../../helpers/storage/aws/s3Operations');
jest.mock('../../helpers/insertRecord');

describe('AwsService', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should upload to AWS and save details successfully', async () => {
		// Mock successful S3 upload
		const mockS3Upload = 'https://example.com/image.jpg';
		(saveToS3 as jest.Mock).mockResolvedValueOnce(mockS3Upload);

		// Mock successful database insertion

		// Test data
		const mockDetails = {
			serialNumber: '12345',
			validdenomination: '10',
			federalReserveId: '123',
			federalReserveLocation: 'New York',
			frontPlateId: '678',
			notePositionId: '1',
			serialPatternMatch: 'ABC',
			seriesYear: '2022',
			treasurer: 'John Doe',
			secretary: 'Jane Doe',
			s3Url: 'https://example.com/image.jpg', // Corrected property name to match SQL query
		};
		(insertNoteDetail as jest.Mock).mockResolvedValueOnce(mockDetails);
		const mockS3Key = 'example.jpg';

		// Call the function
		const result = await AwsService.uploadToAws(mockDetails, mockS3Key);

		// Assertions
		expect(saveToS3).toHaveBeenCalledWith(mockS3Key, mockDetails.serialNumber);
		expect(insertNoteDetail).toHaveBeenCalledWith({ ...mockDetails, s3Url: mockS3Upload });
		expect(result).toEqual({ success: true });
	});

	it('should handle S3 upload error', async () => {
		// Mock S3 upload error
		const mockError = new S3UploadError('S3 upload failed');
		(saveToS3 as jest.Mock).mockRejectedValueOnce(mockError);

		// Test data
		const mockDetails = {
			serialNumber: '12345',
			validdenomination: '10',
			federalReserveId: '123',
			federalReserveLocation: 'New York',
			frontPlateId: '678',
			notePositionId: '1',
			serialPatternMatch: 'ABC',
			seriesYear: '2022',
			treasurer: 'John Doe',
			secretary: 'Jane Doe',
			s3Url: 'https://example.com/image.jpg', // Corrected property name to match SQL query
		};
		const mockS3Key = 'example.jpg';

		// Call the function
		const result = await AwsService.uploadToAws(mockDetails, mockS3Key);

		// Assertions
		expect(saveToS3).toHaveBeenCalledWith(mockS3Key, mockDetails.serialNumber);
		expect(insertNoteDetail).not.toHaveBeenCalled();
		expect(result).toEqual({ success: false, message: 'S3 upload failed' });
	});

	it('should handle database insertion error', async () => {
		// Mock successful S3 upload
		const mockS3Upload = 'https://example.com/image.jpg';
		(saveToS3 as jest.Mock).mockResolvedValueOnce(mockS3Upload);

		// Mock database insertion error
		const mockError = new DatabaseError('Database insertion failed');
		(insertNoteDetail as jest.Mock).mockRejectedValueOnce(mockError);

		// Test data
		const mockDetails = {
			serialNumber: '12345',
			validdenomination: '10',
			federalReserveId: '123',
			federalReserveLocation: 'New York',
			frontPlateId: '678',
			notePositionId: '1',
			serialPatternMatch: 'ABC',
			seriesYear: '2022',
			treasurer: 'John Doe',
			secretary: 'Jane Doe',
			s3Url: 'https://example.com/image.jpg', // Corrected property name to match SQL query
		};
		const mockS3Key = 'example.jpg';

		// Call the function
		const result = await AwsService.uploadToAws(mockDetails, mockS3Key);

		// Assertions
		expect(saveToS3).toHaveBeenCalledWith(mockS3Key, mockDetails.serialNumber);
		expect(insertNoteDetail).toHaveBeenCalledWith({ ...mockDetails, s3Url: mockS3Upload });
		expect(result).toEqual({ success: false, message: 'Database insertion failed' });
	});
});
