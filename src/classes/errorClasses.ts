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
		// Call the constructor of the base class (Error) with the provided message
		super(message);
		// Set the name property of the error
		this.name = 'FileNotFoundError';
		// Ensure that the prototype chain is properly set
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
		// Call the constructor of the base class (Error) with the provided message
		super(message);
		// Set the name property of the error
		this.name = 'TextDetectionsError';
		// Ensure that the prototype chain is properly set
		Object.setPrototypeOf(this, TextDetectionsError.prototype);
	}
}

/**
 * Custom error class for S3 errors.
 * Extends the built-in Error class.
 */
export class S3UploadError extends Error {
	/**
	 * Creates a new instance of S3UploadError.
	 * @param {string} message - The error message.
	 */
	constructor(message: string) {
		// Call the constructor of the base class (Error) with the provided message
		super(message);
		// Set the name property of the error
		this.name = 'S3UploadError';
		// Ensure that the prototype chain is properly set
		Object.setPrototypeOf(this, S3UploadError.prototype);
	}
}

/**
 * Custom error class for DynamnodDB errors.
 * Extends the built-in Error class.
 */
export class DynamoDBInsertionError extends Error {
	/**
	 * Creates a new instance of TextDetectionsError.
	 * @param {string} message - The error message.
	 */
	constructor(message: string) {
		// Call the constructor of the base class (Error) with the provided message
		super(message);
		// Set the name property of the error
		this.name = 'DynamoDBInsertionError';
		// Ensure that the prototype chain is properly set
		Object.setPrototypeOf(this, DynamoDBInsertionError.prototype);
	}
}

export class RouteError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'RouteError';
		this.status = status;
	}
}
