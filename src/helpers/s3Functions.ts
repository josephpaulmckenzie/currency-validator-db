// s3Functions.ts

import * as fs from 'fs';
import AWS from 'aws-sdk';

/**
 * Saves the file to Amazon S3.
 * @param {string} filePath - The path of the file to upload.
 * @param {string} Key - The key (filename) under which to store the file in S3.
 * @returns {Promise<string>} A Promise that resolves with the S3 object URL upon successful upload.
 */

async function saveToS3(filePath: string, Key: string): Promise<string> {
    const s3 = new AWS.S3();
    const fileContent = fs.readFileSync(`uploads/${filePath}`);

    const params = {
        Bucket: 'currencydb',
        Key: Key,
        Body: fileContent,
    };

    try {
        const response = await s3.upload(params).promise();
        console.log('S3 Response:', response);
        return response.Location; // Return the S3 object URL
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error; // Re-throw the error
    }
}

export { saveToS3 };
