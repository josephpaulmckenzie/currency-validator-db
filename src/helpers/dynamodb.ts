import AWS from 'aws-sdk';
import { UploadData } from '../interfaces/interfaces';

/**
 * Inserts an item into DynamoDB.
 * @parma tableName The table name to insert item into. // Currently hardcoded but we will make it more veristable
 * @param item The item to insert into DynamoDB.
 * @returns A Promise that resolves upon successful insertion.
 * @throws An error if the insertion fails.
 */
async function insertIntoDynamo(item: UploadData): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
	// Create a new instance of the AWS DynamoDB DocumentClient
	const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

	// Define the parameters for the putItem operation
	const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'currency',
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
		throw error;
	}
}

export { insertIntoDynamo };
