interface LogOptions {
	level: string;
	message: string;
	data?: Record<string, unknown>;
}

export function log(levelOrOptions: string | LogOptions, message?: string, data?: Record<string, any>) {
	let level: string;
	if (typeof levelOrOptions === 'string') {
		level = levelOrOptions;
	} else {
		level = levelOrOptions.level;
		message = levelOrOptions.message;
		data = levelOrOptions.data;
	}

	const logPrefix = new Date().toISOString() + ' [' + level.toUpperCase() + ']';
	const logMessage = data ? `${logPrefix} ${message} ${JSON.stringify(data)}` : `${logPrefix} ${message}`;

	switch (level) {
		case 'error':
			console.error(logMessage);
			break;
		case 'warn':
			console.warn(logMessage);
			break;
		case 'info':
			console.info(logMessage);
			break;
		case 'debug':
			console.debug(logMessage);
			break;
		case 'trace':
			console.trace(logMessage);
			break;
		default:
			console.log(logMessage);
	}
}
