/**
 * @fileoverview Contains test suites for custom error classes.
 * @module ErrorClassTests
 */

import {
	DatabaseError,
	DynamoDBInsertionError,
	FileNotFoundError,
	RouteError,
	S3UploadError,
	StorageError,
	TextDetectionsError,
} from '../../classes/errorClasses';

/**
 * Test suite for FileNotFoundError class.
 */

describe('FileNotFoundError', () => {
	/**
	 * Test case: should create a new instance with the provided message.
	 */
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'File not found';
		const error = new FileNotFoundError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('FileNotFoundError');
	});
});

/**
 * Test suite for S3UploadError class.
 */
describe('S3UploadError', () => {
	/**
	 * Test case: should create a new instance with the provided message.
	 */
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'S3 upload error';
		const error = new S3UploadError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('S3UploadError');
	});
});

/**
 * Test suite for DynamoDBInsertionError class.
 */
describe('DynamoDBInsertionError', () => {
	/**
	 * Test case: should create a new instance with the provided message.
	 */
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'DynamoDB insertion error';
		const error = new DynamoDBInsertionError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('DynamoDBInsertionError');
	});
});

/**
 * Test suite for RouteError class.
 */
describe('RouteError', () => {
	/**
	 * Test case: should create a new instance with the provided status and message.
	 */
	it('should create a new instance with the provided status and message', () => {
		const status = 404;
		const errorMessage = 'Route error';
		const error = new RouteError(status, errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('RouteError');
		expect(error.status).toBe(status);
	});
});

/**
 * Test suite for TextDetectionsError class.
 */
describe('TextDetectionsError', () => {
	/**
	 * Test case: should create a new instance with the provided message.
	 */
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'Text Detections error';
		const error = new TextDetectionsError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('TextDetectionsError');
	});
});

describe('DatabaseError', () => {
	it('should create a DatabaseError instance with provided properties', () => {
		const errorMessage = 'Database error occurred';
		const errorCode = '23505';
		const errorConstraint = 'unique_key_constraint';
		const errorTable = 'users';

		const databaseError = new DatabaseError(errorMessage, errorCode, errorConstraint, errorTable);

		expect(databaseError instanceof DatabaseError).toBe(true);
		expect(databaseError.message).toBe(errorMessage);
		expect(databaseError.code).toBe(errorCode);
		expect(databaseError.constraint).toBe(errorConstraint);
		expect(databaseError.table).toBe(errorTable);
	});
});

describe('StorageError', () => {
	it('should create a StorageError instance with the provided message and code', () => {
		const errorMessage = 'An error occurred while accessing storage';
		const errorCode = 'STORAGE_ACCESS_ERROR';

		const storageError = new StorageError(errorMessage, errorCode);

		expect(storageError instanceof StorageError).toBe(true);
		expect(storageError.message).toBe(errorMessage);
		expect(storageError.code).toBe(errorCode);
		expect(storageError.name).toBe('StorageError');
	});
});
