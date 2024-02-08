// awsService.ts

import { UploadData } from '../interfaces/interfaces';
import { saveToS3 } from './s3Functions';
import { insertIntoDynamo } from './dynamodb';
import { DynamoDBInsertionError, S3UploadError } from '../classes/errorClasses';

const AwsService = {
	async uploadToAws(details: UploadData, s3Key: string): Promise<{ success: boolean; message?: string }> {
		try {
			// Upload a copy of the note to a S3 bucket
			const s3Upload = await saveToS3(s3Key, details.serialNumber);
			details.s3Url = s3Upload;
		} catch (error: any) {
			if (error instanceof S3UploadError) {
				return { success: false, message: error.message };
			} else {
				console.log(error);
				return { success: false, message: 'An error occurred during S3 upload.' };
			}
		}

		try {
			// Save the detected text to DynamoDB
			await insertIntoDynamo(details);

			console.log('Upload and save completed successfully.');
			return { success: true }; // Indicate success
		} catch (error: any) {
			if (error instanceof DynamoDBInsertionError) {
				return { success: false, message: error.message };
			} else {
				return { success: false, message: 'An error occurred during DynamoDB insertion.' };
			}
		}
	},
};

export default AwsService;
