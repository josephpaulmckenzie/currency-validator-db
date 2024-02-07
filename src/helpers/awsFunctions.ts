import * as dynamo from './dynamodb';
import { DetectedText, ExtendedDetectedText, UploadData } from '../interfaces/interfaces'; 
import { saveToS3 } from './s3Functions';


/**
 * Uploads the file to Amazon S3 and saves the detected text to DynamoDB.
 * @param {UploadData} details - The detected text details to save.
 * @param {string} s3Key - The key (filename) under which to store the file in S3.
 * @returns {Promise<void>} A Promise that resolves when the upload and save operations are completed successfully.
 */
async function awsUpload(details: UploadData, s3Key: string): Promise<void> {
    try {
        // Upload a copy of the note to S3
        const s3Upload = await saveToS3(s3Key, details.serialNumber);
        details.s3Url = s3Upload;

        // Save detected text to DynamoDB
        await dynamo.insertIntoDynamo(details);

        console.log('Upload and save completed successfully.');
    } catch (error) {
        console.error('Error in awsUpload:', error);
    }
}

export { awsUpload };
