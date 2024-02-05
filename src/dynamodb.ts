//dynamodb.ts

import AWS = require('aws-sdk');
import {DynamoDBItem} from './interfaces/interfaces';
import { getTextDetections } from '.';

async function putItemToDynamoDB(
  item: DynamoDBItem,
  tableName: string
): Promise<void> {
  const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: item,
  };

  try {
    await dynamodb.put(params).promise();
    // console.log('Item added to DynamoDB successfully');
  } catch (error) {
    console.error('Error putting item to DynamoDB:', error);
    throw error;
  }
}

async function insertIntoDynamo(item: DynamoDBItem) {
  try {
    await putItemToDynamoDB(item, 'currency');
    // console.log('Item added to DynamoDB');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export {putItemToDynamoDB, insertIntoDynamo};
