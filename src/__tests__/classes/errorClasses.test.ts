/**
 * @fileoverview Contains test suites for custom error classes.
 * @module ErrorClassTests
 */

import { ENOENT } from 'constants';
import { DatabaseError, FileNotFoundError, MappingError, RouteError, S3UploadError, TextDetectionsError } from '../../classes/errorClasses';

/**
 * Test suite for FileNotFoundError class.
 */

describe('FileNotFoundError', () => {
	/**
	 * Test case: should create a new instance with the provided message.
	 */
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'File not found';
		const error = new FileNotFoundError(errorMessage, ENOENT);
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
 * Test suite for RouteError class.
 */
describe('RouteError', () => {
	/**
	 * Test case: should create a new instance with the provided status and message.
	 */
	it('should create a new instance with the provided status and message', () => {
		const status = ENOENT;
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

describe('MappingError', () => {
	it('should have the correct properties', () => {
		const errorMessage = 'Mapping error';
		const statusCode = 500;

		const mappingError = new MappingError(errorMessage, statusCode);

		expect(mappingError.message).toBe(errorMessage);
		expect(mappingError.statusCode).toBe(statusCode);
		expect(mappingError.name).toBe('MappingError');
	});

	it('should inherit from Error', () => {
		const mappingError = new MappingError('Mapping error', 500);

		expect(mappingError instanceof Error).toBe(true);
	});
});

describe('Database Error', () => {
	/**
	 * Test case: should create a new instance with the provided message.
	 */
	it('should create a new instance with the provided message', () => {
		const databaseError = new DatabaseError('There was an error with the database', '5000');

		expect(databaseError.message).toBe('There was an error with the database');
		expect(databaseError.statusCode).toBe('5000');
		expect(databaseError.name).toBe('DatabaseError');
	});
});
