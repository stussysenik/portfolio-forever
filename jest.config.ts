export default {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "jsdom",
	roots: ["<rootDir>/tests/astro"],
	testMatch: ["**/*.jest.test.ts"],
	extensionsToTreatAsEsm: [".ts"],
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: true,
				tsconfig: "<rootDir>/tsconfig.astro.json",
			},
		],
	},
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
		"^\\$lib/(.*)$": "<rootDir>/src/lib/$1",
		"^\\$convex/(.*)$": "<rootDir>/convex/$1",
	},
};
