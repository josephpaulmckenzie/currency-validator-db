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
		Object.setPrototypeOf(this, TextDetectionsError.prototype);
	}
}
