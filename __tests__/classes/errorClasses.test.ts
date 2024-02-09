import { DynamoDBInsertionError, FileNotFoundError, RouteError, S3UploadError, TextDetectionsError } from '../../src/classes/errorClasses';

describe('FileNotFoundError', () => {
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'File not found';
		const error = new FileNotFoundError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('FileNotFoundError');
	});
});

describe('S3UploadError', () => {
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'S3 upload error';
		const error = new S3UploadError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('S3UploadError');
	});
});

describe('DynamoDBInsertionError', () => {
	it('should create a new instance with the provided message', () => {
		const errorMessage = 'DynamoDB insertion error';
		const error = new DynamoDBInsertionError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('DynamoDBInsertionError');
	});
});

describe('RouteError', () => {
	it('should create a new instance with the provided status and message', () => {
		const status = 404;
		const errorMessage = 'Route error';
		const error = new RouteError(status, errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('RouteError');
		expect(error.status).toBe(status);
	});
});

describe('TextDetectionsError', () => {
	it('should create a new instance with the provided status and message', () => {
		const errorMessage = 'Text Detections error';
		const error = new TextDetectionsError(errorMessage);
		expect(error.message).toBe(errorMessage);
		expect(error.name).toBe('TextDetectionsError');
	});
});
