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
export class RouteError extends Error {
	/**
	 * Creates a new instance of RouteError.
	 * @param {number} status - The HTTP status code.
	 * @param {string} message - The error message.
	 */
	constructor(status: number, message: string) {
		super(message);
		this.name = 'RouteError';
		this.status = status;
	}
	status: number;
}
