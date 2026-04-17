/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/src'],
	testMatch: ['**/*.jest.test.ts'],
	moduleNameMapper: {
		'^\\$lib/(.*)$': '<rootDir>/src/lib/$1',
		'^\\$convex/(.*)$': '<rootDir>/convex/$1',
	},
};
