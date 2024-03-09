export class FileNotFoundError extends Error {
	statusCode: number | undefined;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'FileNotFoundError';
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, FileNotFoundError.prototype);
	}
}

export class InvalidFormatError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'InvalidFormatError';
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, InvalidFormatError.prototype);
	}
}

export class MappingError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'MappingError';
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, MappingError.prototype);
	}
}

export class TextDetectionsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TextDetectionsError';
		Object.setPrototypeOf(this, TextDetectionsError.prototype);
	}
}

export class S3UploadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'S3UploadError';
		Object.setPrototypeOf(this, S3UploadError.prototype);
	}
}

export class DatabaseError extends Error {
	code: string;
	constraint?: string;
	table?: string;

	constructor(message: string, code: string, constraint?: string, table?: string) {
		super(message);
		this.code = code;
		this.constraint = constraint;
		this.table = table;
	}
}

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
		Object.setPrototypeOf(this, ValidationError.prototype);
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
