export class FileNotFoundError extends Error {
	statusCode: number | undefined;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'FileNotFoundError';
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, FileNotFoundError.prototype);
		// Error.captureStackTrace(this, this.constructor);
	}
}

export class InvalidFormatError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'InvalidFormatError';
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, InvalidFormatError.prototype);
		// Error.captureStackTrace(this, this.constructor);
	}
}

export class MappingError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'MappingError';
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, MappingError.prototype);
		// Error.captureStackTrace(this, this.constructor);
	}
}

export class TextDetectionsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TextDetectionsError';
		Object.setPrototypeOf(this, TextDetectionsError.prototype);
		// Error.captureStackTrace(this, this.constructor);
	}
}

export class S3UploadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'S3UploadError';
		Object.setPrototypeOf(this, S3UploadError.prototype);
		// Error.captureStackTrace(this, this.constructor);
	}
}

export class DatabaseError extends Error {
	statusCode: string;
	constraint?: string;
	table?: string;

	constructor(message: string, statusCode: string, constraint?: string, table?: string) {
		super(message);
		this.name = 'DatabaseError';
		this.statusCode = statusCode;
		this.constraint = constraint;
		this.table = table;
		Object.setPrototypeOf(this, DatabaseError.prototype);
		// Error.captureStackTrace(this, this.constructor);
	}
}

export class ValidationError extends Error {
	message: string;
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
		this.message = message;
		Object.setPrototypeOf(this, ValidationError.prototype);
		// Error.captureStackTrace(this, this.constructor);
	}
}

export class RouteError extends Error {
	message: string;
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = 'RouteError';
		this.status = status;
		this.message = message;
		Object.setPrototypeOf(this, RouteError.prototype);
		// Error.captureStackTrace(this, this.constructor);
	}
}
