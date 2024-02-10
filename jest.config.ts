import path from 'path';

export default {
	roots: [path.resolve(__dirname, 'src')],
	testMatch: [path.resolve(__dirname, 'src', '__tests__', '**', '*.test.ts')],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
};
