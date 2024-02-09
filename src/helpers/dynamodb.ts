import AWS from 'aws-sdk';
import { UploadData } from '../interfaces/interfaces';

/**
 * Inserts an item into DynamoDB.
 * @async
 * @function insertIntoDynamo
 * @param {UploadData} item - The item to insert into DynamoDB.
 * @returns {Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>} A Promise that resolves upon successful insertion.
 * @throws {Error} An error if the insertion fails.
 */
async function insertIntoDynamo(item: UploadData): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
	// Create a new instance of the AWS DynamoDB DocumentClient
	const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

	// Define the parameters for the putItem operation
	const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'currency', // Currently hardcoded but we will make it more versatile
		Item: item,
	};

	try {
		// Perform the putItem operation and await the response
		const response = await dynamodb.put(params).promise();

		// Log a success message if the operation completes successfully
		console.log('Item added to DynamoDB successfully');

		return response; // Return the response object
	} catch (error) {
		// If an error occurs during the operation, log it and throw the error
		console.error('Error putting item to DynamoDB:', error);
		throw new Error('Insertion failed');
	}
}

export { insertIntoDynamo };
