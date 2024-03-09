import path from 'path';

module.exports = {
	moduleDirectories: ['node_modules', 'src'],
	roots: [path.resolve(__dirname, 'src')],
	testMatch: [path.resolve(__dirname, 'src', '**', '*.test.ts')],
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.test.ts', // Exclude test files
		'!src/**/index.ts', // Exclude index files
	],
	coverageDirectory: path.resolve(__dirname, 'coverage'),
	coverageReporters: ['text', 'lcov', 'html'],
	coveragePathIgnorePatterns: ['/node_modules/', '/__fixtures__/'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
};
