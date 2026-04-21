import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
			$convex: path.resolve("./convex"),
		},
	},
	test: {
		include: ["tests/astro/**/*.test.ts"],
		exclude: ["tests/astro/**/*.jest.test.ts"],
		globals: true,
		environment: "node",
	},
});
