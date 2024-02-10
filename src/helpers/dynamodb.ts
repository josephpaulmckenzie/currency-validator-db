import AWS from 'aws-sdk';
import { DynamoDbResponse, UploadData } from '../interfaces/interfaces';

/**
 * Inserts an item into DynamoDB.
 * @async
 * @function insertIntoDynamo
 * @param {UploadData} item - The item to insert into DynamoDB.
 * @returns {Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>} A Promise that resolves upon successful insertion.
 * @throws {Error} An error if the insertion fails.
 */
async function insertIntoDynamo(item: UploadData): Promise<DynamoDbResponse> {
	const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
	const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'currency',
		Item: item,
	};

	try {
		const response = await dynamodb.put(params).promise();

		// Check if the response is defined and if it contains any error information
		if (response && response.$response && response.$response.error) {
			throw new Error('Insertion failed: ' + response.$response.error.message);
		}

		// If the response is not defined or if there's no error, consider the insertion successful
		console.log('Item added to DynamoDB successfully', response);

		return {
			status: 'success',
			item: { ...item }, // Return a copy of the input item
		};
	} catch (error) {
		console.error('Error putting item to DynamoDB:', error);
		throw new Error('Insertion failed');
	}
}

// type MockedDynamoDbResponse = UploadData & { status: string };

export { insertIntoDynamo };
