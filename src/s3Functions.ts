import * as fs from 'fs';
import * as dynamo from './dynamodb';
import AWS = require('aws-sdk');

async function uploadToS3(filePath: string, Key: string): Promise<string> {
  const s3 = new AWS.S3();
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: 'currencydb',
    Key: Key,
    Body: fileContent,
  };

  try {
    const response: AWS.S3.ManagedUpload.SendData = await s3
      .upload(params)
      .promise();

    return response.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

async function uploadingToS3(details: {
  s3Url: string;
  serialNumber: string;
}): Promise<String> {
  try {
    const fileURL = await uploadToS3('./MK.jpeg', details.serialNumber);
    details.s3Url = fileURL;
    await dynamo.insertIntoDynamo(details);
    return details.s3Url;
  } catch (error) {
    console.error('An error occurred:', error);
    throw new Error('Failed to upload to S3'); // Throw an error instead of returning undefined
  }
}

export {uploadToS3, uploadingToS3};
