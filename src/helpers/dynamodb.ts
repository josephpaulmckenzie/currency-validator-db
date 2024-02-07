import AWS from 'aws-sdk';
import { DynamoDBItem } from '../interfaces/interfaces';

/**
 * Inserts an item into DynamoDB.
 * @param item The item to insert into DynamoDB.
 * @returns A Promise that resolves when the item is successfully inserted.
 * @throws An error if the insertion fails.
 */
async function insertIntoDynamo(item: DynamoDBItem): Promise<void> {
    // Create a new instance of the AWS DynamoDB DocumentClient
    const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

    // Define the parameters for the putItem operation
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'currency', // Specify the table name
        Item: item, // Specify the item to insert
    };

    try {
        // Perform the putItem operation and await the response
        await dynamodb.put(params).promise();
        // Log a success message if the operation completes successfully
        console.log('Item added to DynamoDB successfully');
    } catch (error) {
        // If an error occurs during the operation, log it and throw the error
        console.error('Error putting item to DynamoDB:', error);
        throw error;
    }
}

// Export the insertIntoDynamo function for use in other modules
export { insertIntoDynamo };
