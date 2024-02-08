import { UploadData } from '../interfaces/interfaces';
import { saveToS3 } from './s3Functions';
import { insertIntoDynamo } from './dynamodb';
import { DynamoDBInsertionError, S3UploadError } from '../classes/errorClasses';

/**
 * Service for uploading data to AWS S3 and DynamoDB.
 */
const AwsService = {
	/**
	 * Uploads data to AWS S3 and DynamoDB.
	 * @param {UploadData} details - The data to be uploaded, including detected text and other details.
	 * @param {string} s3Key - The key to use when uploading the data to S3.
	 * @returns {Promise<{ success: boolean; message?: string }>} A promise indicating the success of the upload operation.
	 */
	async uploadToAws(details: UploadData, s3Key: string): Promise<{ success: boolean; message?: string }> {
		try {
			// Upload a copy of the note image to an S3 bucket
			const s3Upload = await saveToS3(s3Key, details.serialNumber);
			// Sets the location of uploaded note image so we can include it when we insert our note data to DynamoDB
			details.s3Url = s3Upload;
		} catch (error: any) {
			if (error instanceof S3UploadError) {
				return { success: false, message: error.message };
			} else {
				console.error(error);
				return { success: false, message: 'An error occurred during S3 upload.' };
			}
		}

		try {
			// Saves detected text to DynamoDB
			await insertIntoDynamo(details);
			console.log('Upload and save completed successfully.');
			return { success: true }; // Indicate success
		} catch (error: any) {
			if (error instanceof DynamoDBInsertionError) {
				return { success: false, message: error.message };
			} else {
				console.error(error);
				return { success: false, message: 'An error occurred during DynamoDB insertion.' };
			}
		}
	},
};

export default AwsService;
