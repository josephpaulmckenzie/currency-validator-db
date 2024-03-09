// serverstart.test.ts

import { startServer, closeServer } from '../startServer';

jest.mock('../server/server', () => ({
	app: {
		listen: jest.fn((port: number, callback: () => void) => {
			console.log(`Mocked server is running on port ${port}`);
			callback(); // Simulate server start
		}),
	},
}));

describe('Server', () => {
	let consoleLogSpy: any;

	beforeEach(() => {
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
	});

	afterEach(() => {
		consoleLogSpy.mockRestore(); // Restore the original console.log method
		closeServer(); // Ensure the server is closed after each test
	});

	it('should log a message when the server starts', () => {
		startServer(); // Start the server
		expect(consoleLogSpy).toHaveBeenCalledWith(`Server is running on port 3000`);
	});
});
