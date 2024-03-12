// middleware.test.js

import { multer } from 'multer';
import { initializeMulter } from '../../server/multerInitializer';

describe('Multer Initialization', () => {
	it('should initialize multer with the correct storage engine', () => {
		const mockDiskStorage = jest.fn();
		jest.spyOn(multer, 'diskStorage').mockImplementation(mockDiskStorage);

		// Initialize multer using your initializer
		initializeMulter();

		// Verify that diskStorage was called with the correct configuration
		expect(mockDiskStorage).toHaveBeenCalledWith(
			expect.objectContaining({
				destination: expect.any(Function),
				filename: expect.any(Function),
			})
		);
	});
});
