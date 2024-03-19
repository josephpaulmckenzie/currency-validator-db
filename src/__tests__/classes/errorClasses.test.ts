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

describe('TextDetectionsError', () => {
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'Text Detections error';
		const error = new TextDetectionsError(errorMessage);

		expect(error).toBeInstanceOf(TextDetectionsError);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('TextDetectionsError');
	});
});

describe('FileNotFoundError', () => {
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'File not found';
		const error = new FileNotFoundError(errorMessage, ENOENT);

		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('FileNotFoundError');
	});
});

describe('S3UploadError', () => {
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'S3 upload error';
		const error = new S3UploadError(errorMessage);

		expect(error).toBeInstanceOf(S3UploadError);
		expect(error.name).toBe('S3UploadError');
		expect(error.message).toBe(errorMessage);
	});
});

describe('ValidationError', () => {
	it('should create a new instance with the provided message', () => {
		const errorMessage = ' Error Uploading To S3';
		const error = new ValidationError(errorMessage);
		expect(error).toBeInstanceOf(ValidationError);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('ValidationError');
	});
});

describe('RouteError', () => {
	it('should create a new instance with the provided status and message', () => {
		const status = ENOENT;
		const errorMessage = 'Route error';
		const error = new RouteError(errorMessage, status); // Corrected the order of parameters

		expect(error).toBeInstanceOf(RouteError);
		expect(error.name).toBe('RouteError');
		expect(error.message).toBe(errorMessage);
		expect(error.status).toBe(status);
	});
});

describe('RouteNotFound error', () => {
	it('should create an instance with the provided message and status', () => {
		const errorMessage = 'Route not found';
		const status = 404;
		const error = new RouteError(errorMessage, status);

		expect(error).toBeInstanceOf(RouteError);
		expect(error.message).toBe(errorMessage);
		expect(error.status).toBe(status);
	});

	it('should have the correct name property', () => {
		const error = new RouteError('Route not found', 404);
		expect(error.name).toBe('RouteError');
	});
});

describe('MappingError', () => {
	it('should have the correct properties', () => {
		const errorMessage = 'There was a problem when trying to map out note details';
		const statusCode = 500;
		const name = 'MappingError';

		const mappingError = new MappingError(errorMessage, statusCode);

		expect(mappingError.message).toBe(errorMessage);
		expect(mappingError.statusCode).toBe(statusCode);
		expect(mappingError.name).toBe(name);
	});

	it('should inherit from Error', () => {
		const mappingError = new MappingError('Mapping error', 500);

		expect(mappingError instanceof Error).toBe(true);
	});
});

describe('Database Error', () => {
	it('should create a new instance with the provided message', () => {
		const databaseError = new DatabaseError('There was an error with the database', '5000');

		expect(databaseError.message).toBe('There was an error with the database');
		expect(databaseError.statusCode).toBe('5000');
		expect(databaseError.name).toBe('DatabaseError');
	});

	it('should throw an error in the else block', async () => {
		try {
			throw new Error('Expected error message');
		} catch (error) {
			if (error instanceof DatabaseError) {
				expect(error).toBeInstanceOf(DatabaseError);
				expect(error.message).toEqual('Expected error message');
			} else {
				expect(error).toBeInstanceOf(Error);
			}
		}
	});
});
