import { log } from '../../helpers/logging/logger';

describe('log', () => {
	let consoleErrorSpy: jest.SpyInstance;
	let consoleWarnSpy: jest.SpyInstance;
	let consoleInfoSpy: jest.SpyInstance;
	let consoleDebugSpy: jest.SpyInstance;
	let consoleTraceSpy: jest.SpyInstance;
	let consoleLogSpy: jest.SpyInstance;

	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
		consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
		consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
		consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
		consoleTraceSpy = jest.spyOn(console, 'trace').mockImplementation();
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
		consoleWarnSpy.mockRestore();
		consoleInfoSpy.mockRestore();
		consoleDebugSpy.mockRestore();
		consoleTraceSpy.mockRestore();
		consoleLogSpy.mockRestore();
	});

	it('should log message with level "error"', () => {
		log('error', 'Test error message');
		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Test error message'));
	});

	it('should log message with level "error" and data', () => {
		log({
			level: 'error',
			message: 'Test error message with data',
			data: { key1: 'value1', key2: 'value2' },
		});
		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR] Test error message with data {"key1":"value1","key2":"value2"}'));
	});

	it('should log message with level "warn"', () => {
		log('warn', 'Test warning message');
		expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Test warning message'));
	});

	it('should log message with level "warn" and data', () => {
		log({
			level: 'warn',
			message: 'Test warning message with data',
			data: { key1: 'value1', key2: 'value2' },
		});
		expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('[WARN] Test warning message with data {"key1":"value1","key2":"value2"}'));
	});

	it('should log message with level "info"', () => {
		log('info', 'Test info message');
		expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('Test info message'));
	});

	it('should log message with level "info" and data', () => {
		log({
			level: 'info',
			message: 'Test info message with data',
			data: { key1: 'value1', key2: 'value2' },
		});
		expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO] Test info message with data {"key1":"value1","key2":"value2"}'));
	});

	it('should log message with level "debug"', () => {
		log('debug', 'Test debug message');
		expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('Test debug message'));
	});

	it('should log message with level "debug" and data', () => {
		log({
			level: 'debug',
			message: 'Test debug message with data',
			data: { key1: 'value1', key2: 'value2' },
		});
		expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG] Test debug message with data {"key1":"value1","key2":"value2"}'));
	});

	it('should log message with level "trace"', () => {
		log('trace', 'Test trace message');
		expect(consoleTraceSpy).toHaveBeenCalledWith(expect.stringContaining('Test trace message'));
	});

	it('should log message with level "trace" and data', () => {
		log({
			level: 'trace',
			message: 'Test trace message with data',
			data: { key1: 'value1', key2: 'value2' },
		});
		expect(consoleTraceSpy).toHaveBeenCalledWith(expect.stringContaining('[TRACE] Test trace message with data {"key1":"value1","key2":"value2"}'));
	});

	it('should log message with default level', () => {
		log('unknown', 'Test unknown message'); // Providing an unknown log level
		expect(consoleLogSpy).toHaveBeenCalled(); // Since log level is unknown, it should use console.log
		expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test unknown message'));
	});

	it('should log message with default level and data', () => {
		log({
			level: 'unknown',
			message: 'Test unknown message with data',
			data: { key1: 'value1', key2: 'value2' },
		}); // Providing an unknown log level with data
		expect(consoleLogSpy).toHaveBeenCalled(); // Since log level is unknown, it should use console.log
		expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test unknown message with data {"key1":"value1","key2":"value2"}'));
	});

	it('should include data in log message if present', () => {
		log('info', 'Test info message with data', { key1: 'value1', key2: 'value2' });
		expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('value1'));
	});

	it('should handle absence of data', () => {
		log('info', 'Test info message without data');
		expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('Test info message without data'));
	});
});
