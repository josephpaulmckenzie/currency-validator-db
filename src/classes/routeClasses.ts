export class RouteNotFound extends Error {
	status: number;
	message: string;
	constructor(message: string, status: number) {
		super(message);
		this.name = 'RouteNotFound';
		this.status = status;
		this.message = message;
		// Ensure the error class name appears in the stack trace
		Error.captureStackTrace(this, this.constructor);
	}
}
