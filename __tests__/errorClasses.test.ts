import { FileNotFoundError, TextDetectionsError, S3UploadError, DynamoDBInsertionError, RouteError } from '../src/classes/errorClasses';

describe('Custom Error Classes', () => {
	describe('FileNotFoundError', () => {
		it('should create a new instance with the provided message', () => {
			const errorMessage = 'File not found';
			const error = new FileNotFoundError(errorMessage);
			expect(error.message).toBe(errorMessage);
			expect(error.name).toBe('FileNotFoundError');
		});
	});

	describe('TextDetectionsError', () => {
		it('should create a new instance with the provided message', () => {
			const errorMessage = 'Text detection error';
			const error = new TextDetectionsError(errorMessage);
			expect(error.message).toBe(errorMessage);
			expect(error.name).toBe('TextDetectionsError');
		});
	});

	// Write similar tests for other error classes (S3UploadError, DynamoDBInsertionError, RouteError)
});
