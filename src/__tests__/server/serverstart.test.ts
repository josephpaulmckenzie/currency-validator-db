import { startServer, stopServer } from '../../startServer';

// Test suite for the server functionality
describe('Server', () => {
	let consoleLogSpy: jest.SpyInstance<void, Parameters<typeof console.log>>;

	// Before each test, mock console.log and reset the spy
	beforeEach(async () => {
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
		await startServer();
	});

	// After each test stop the server
	afterEach(async () => {
		await stopServer();
	});

	// Test to check if the server logs a startup message
	it('should log a message when the server starts', async () => {
		// Wait for a short delay to ensure that the server has started
		await new Promise((resolve) => {
			return setTimeout(resolve, 100);
		});

		expect(consoleLogSpy).toHaveBeenCalledWith(`Server is running on port 3000`);
	});

	it('should log a message when the server stops', async () => {
		expect(consoleLogSpy).toHaveBeenCalledWith(`Server stopped`);
	});
});
