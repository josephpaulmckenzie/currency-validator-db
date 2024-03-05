import { saveToS3 } from './s3Operations';
import { DynamoDBInsertionError, S3UploadError } from '../../../classes/errorClasses';
import { insertNoteDetail } from '../../insertRecord';
import { NoteDetail, UploadData } from '@src/interfaces/interfaces';

const AwsService = {
	async uploadToAws(details: NoteDetail | UploadData, s3Key: string): Promise<{ success: boolean; message?: string }> {
		let s3Upload;
		try {
			const serialNumberText =
				typeof details.serialNumber === 'string' ? details.serialNumber : (details.serialNumber as { text?: string })?.text ?? '';
			s3Upload = await saveToS3(s3Key, serialNumberText);
		} catch (error) {
			if (error instanceof S3UploadError) {
				return { success: false, message: error.message };
			} else {
				console.error(error);
				return { success: false, message: 'An error occurred during S3 upload.' };
			}
		}

		try {
			// We clone the details object to avoid modifying the original one
			const updatedDetails = { ...details, s3Url: s3Upload };
			await insertNoteDetail(updatedDetails);
			console.log('Upload and save completed successfully.');
			return { success: true };
		} catch (error) {
			if (error instanceof DynamoDBInsertionError) {
				return { success: false, message: error.message };
			} else {
				console.error(error);
				return { success: false, message: 'An error occurred during DynamoDB insertion.' };
			}
		}
	},
};

export { AwsService };
