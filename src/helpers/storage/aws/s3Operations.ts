import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
import { PathOrFileDescriptor, readFileSync } from 'fs';
import { join } from 'path'; // Import the join function from the path module

/**
 * Saves the file to Amazon S3.
 * @param {Buffer} filePath - The path of the file to upload (absolute path).
 * @param {string} filename - The key (filename) under which to store the file in S3.
 * @returns {Promise<S3UploadResult>} A Promise that resolves with the S3 object information upon successful upload.
 */

interface S3UploadResult {
	Bucket: string;
	Key: string;
	Location: string;
	ETag: string;
}
async function saveToS3(filePath: Buffer, s3Key: string): Promise<S3UploadResult> {
	const s3 = new S3({ region: 'us-east-1' });
	// const buffer = readFileSync(filePath);
	// const imageDataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
	const params = {
		Bucket: 'currencydb',
		Key: s3Key,
		Body: filePath, // Use the provided absolute file path
	};

	const response = await new Upload({
		client: s3,
		params,
	}).done();

	if (!response || !response.Bucket || !response.Key || !response.Location || !response.ETag) {
		throw new Error('Upload failed or missing response data');
	}

	const { Bucket, Key, Location, ETag } = response;

	return {
		Bucket,
		Key,
		Location,
		ETag,
	};
}

export { saveToS3 };
