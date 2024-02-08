import * as dynamo from './dynamodb';
import { UploadData } from '../interfaces/interfaces';
import { saveToS3 } from './s3Functions';
import { DynamoDBInsertionError } from '../classes/errorClasses';

/**
 * Uploads the file to Amazon S3 and saves the detected text to DynamoDB.
 * @param {UploadData} details - The detected text details to save.
 * @param {string} s3Key - The key (filename) under which to store the file in S3.
 * @returns {Promise<{ success: boolean, message?: string }>} A Promise that resolves with a status object indicating the success or failure of the operations.
 */
async function awsUpload(details: UploadData, s3Key: string): Promise<{ success: boolean; message?: string }> {
	try {
		// Upload a copy of the note to S3
		const s3Upload = await saveToS3(s3Key, details.serialNumber);
		details.s3Url = s3Upload;

		// Save detected text to DynamoDB
		await dynamo.insertIntoDynamo(details);

		console.log('Upload and save completed successfully.');
		return { success: true }; // Indicate success
	} catch (error: any) {
		// Handle specific types of errors
		if (error instanceof DynamoDBInsertionError) {
			return { success: false, message: error.message };
		} else {
			return { success: false, message: 'An error occurred during DynamoDB insertion.' };
		}
	}
}

export { awsUpload };
