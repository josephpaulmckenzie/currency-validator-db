import multer from 'multer';

describe('Multer Initialization', () => {
	it('should initialize multer with the correct storage engine', () => {
		// Mock the diskStorage function
		const mockDiskStorage = jest.fn();
		// Mock the diskStorage function to return the expected configuration
		jest.spyOn(multer, 'diskStorage').mockImplementation(mockDiskStorage);

		// Initialize multer with the storage engine
		require('../../server/server');

		// Verify that diskStorage was called with the correct configuration
		expect(mockDiskStorage).toHaveBeenCalledWith({
			destination: 'public/uploads/',
			filename: expect.any(Function), // The filename should be a function
		});
	});
});
