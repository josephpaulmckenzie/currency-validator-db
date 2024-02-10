/**
 * Custom error class for file not found errors.
 * Extends the built-in Error class.
 */
export class FileNotFoundError extends Error {
	/**
	 * Creates a new instance of FileNotFoundError.
	 * @param {string} message - The error message.
	 */
	constructor(message: string) {
		super(message);
		this.name = 'FileNotFoundError';
		Object.setPrototypeOf(this, FileNotFoundError.prototype);
	}
}

/**
 * Custom error class for text detection errors.
 * Extends the built-in Error class.
 */
export class TextDetectionsError extends Error {
	/**
	 * Creates a new instance of TextDetectionsError.
	 * @param {string} message - The error message.
	 */
	constructor(message: string) {
		super(message);
		this.name = 'TextDetectionsError';
		Object.setPrototypeOf(this, TextDetectionsError.prototype);
	}
}

/**
 * Custom error class for S3 upload errors.
 * Extends the built-in Error class.
 */
export class S3UploadError extends Error {
	/**
	 * Creates a new instance of S3UploadError.
	 * @param {string} message - The error message.
	 */
	constructor(message: string) {
		super(message);
		this.name = 'S3UploadError';
		Object.setPrototypeOf(this, S3UploadError.prototype);
	}
}

/**
 * Custom error class for DynamoDB insertion errors.
 * Extends the built-in Error class.
 */
export class DynamoDBInsertionError extends Error {
	/**
	 * Creates a new instance of DynamoDBInsertionError.
	 * @param {string} message - The error message.
	 */
	constructor(message: string) {
		super(message);
		this.name = 'DynamoDBInsertionError';
		Object.setPrototypeOf(this, DynamoDBInsertionError.prototype);
	}
}

/**
 * Custom error class for route errors.
 * Extends the built-in Error class.
 */
class RouteError extends Error {
	status: number; // Change the type to number
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export { RouteError };

export class MappingError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}
