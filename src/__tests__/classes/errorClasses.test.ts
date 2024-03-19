// File: errorClasses.test.ts
import { ENOENT } from 'constants';
import {
	DatabaseError,
	FileNotFoundError,
	MappingError,
	RouteError,
	S3UploadError,
	TextDetectionsError,
	ValidationError,
} from '../../classes/errorClasses';
import { RouteNotFound } from '../../classes/routeClasses';

describe('TextDetectionsError', () => {
	// Test case: TextDetectionsError should create a new instance with the provided message
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'Text Detections error';
		const error = new TextDetectionsError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('TextDetectionsError');
	});
});

describe('FileNotFoundError', () => {
	// Test case: FileNotFoundError should create a new instance with the provided message
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'File not found';
		const error = new FileNotFoundError(errorMessage, ENOENT);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('FileNotFoundError');
	});
});

describe('S3UploadError', () => {
	// Test case: S3UploadError should create a new instance with the provided message
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'S3 upload error';
		const error = new S3UploadError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('S3UploadError');
	});
});

describe('ValidationError', () => {
	// Test case: S3UploadError should create a new instance with the provided message
	it('should create a new instance with the provided message', () => {
		const errorMessage = ' Validation error';
		const error = new ValidationError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('ValidationError');
	});
});

describe('RouteError', () => {
	// Test case: RouteError should create a new instance with the provided status and message
	it('should create a new instance with the provided status and message', () => {
		const status = ENOENT;
		const errorMessage = 'Route error';
		const error = new RouteError(status, errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('RouteError');
		expect(error.status).toBe(status);
	});
});

describe('RouteNotFound error', () => {
	it('should create an instance with the provided message and status', () => {
		const errorMessage = 'Route not found';
		const status = 404;
		const error = new RouteNotFound(errorMessage, status);

		expect(error).toBeInstanceOf(RouteNotFound);
		expect(error.message).toBe(errorMessage);
		expect(error.status).toBe(status);
	});

	it('should have the correct name property', () => {
		const error = new RouteNotFound('Route not found', 404);
		expect(error.name).toBe('RouteNotFound');
	});

	it('should capture the stack trace', () => {
		// Mock Error.captureStackTrace to verify it's called
		const originalCaptureStackTrace = Error.captureStackTrace;
		Error.captureStackTrace = jest.fn();

		// Create a RouteNotFound instance
		const error = new RouteNotFound('Route not found', 404);

		// Verify that Error.captureStackTrace was called with the error instance
		expect(Error.captureStackTrace).toHaveBeenCalledWith(error, error.constructor);

		// Restore the original Error.captureStackTrace implementation
		Error.captureStackTrace = originalCaptureStackTrace;
	});
});

describe('MappingError', () => {
	// Test case 1: MappingError should have the correct properties
	it('should have the correct properties', () => {
		const errorMessage = 'Mapping error';
		const statusCode = 500;

		const mappingError = new MappingError(errorMessage, statusCode);

		expect(mappingError.message).toBe(errorMessage);
		expect(mappingError.statusCode).toBe(statusCode);
		expect(mappingError.name).toBe('MappingError');
	});

	// Test case 2: MappingError should inherit from Error
	it('should inherit from Error', () => {
		const mappingError = new MappingError('Mapping error', 500);

		expect(mappingError instanceof Error).toBe(true);
	});
});

describe('Database Error', () => {
	// Test case: DatabaseError should create a new instance with the provided message
	it('should create a new instance with the provided message', () => {
		const databaseError = new DatabaseError('There was an error with the database', '5000');

		expect(databaseError.message).toBe('There was an error with the database');
		expect(databaseError.statusCode).toBe('5000');
		expect(databaseError.name).toBe('DatabaseError');
	});
});
