/**
 * @fileoverview Contains test suites for custom error classes.
 * @module ErrorClassTests
 */

import { DynamoDBInsertionError, FileNotFoundError, RouteError, S3UploadError, TextDetectionsError } from '../../src/classes/errorClasses';

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
