// s3Functions.ts

import * as fs from 'fs';
import * as dynamo from './dynamodb';
import AWS from 'aws-sdk';
import { DynamoDBItem } from '../interfaces/interfaces';

async function uploadToS3(filePath: string, Key: string): Promise<string> {
  const s3 = new AWS.S3();
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: 'currencydb',
    Key: Key,
    Body: fileContent,
  };

  try {
    const response: AWS.S3.ManagedUpload.SendData = await s3.upload(params).promise();
    return response.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

async function uploadingToS3(details: DynamoDBItem, fileName: string): Promise<string> {
  try {

    // console.log('details',details)
    // Upload file to S3
    const fileURL = await uploadToS3(fileName, details.serialNumber);
    
    // Update details with S3 URL
    details.s3Url = fileURL;

    // Insert item into DynamoDB
    await dynamo.insertIntoDynamo(details);

    return details.s3Url;
  } catch (error) {
    console.error('An error occurred:', error);
    throw new Error('Failed to upload to S3 and DynamoDB');
  }
}

export { uploadToS3, uploadingToS3 };
