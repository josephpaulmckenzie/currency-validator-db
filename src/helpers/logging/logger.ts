// Custom logger function
export function log(level: string, message: string, data?: string | undefined) {
	const logPrefix = new Date().toISOString() + ' [' + level.toUpperCase() + ']';
	const logMessage = data ? `${logPrefix} ${message} ${data}` : `${logPrefix} ${message}`;

	switch (level) {
		case 'error':
			console.error(logMessage);
			break;
		case 'warn':
			console.warn(logMessage);
			break;
		default:
			console.log(logMessage);
	}
}
