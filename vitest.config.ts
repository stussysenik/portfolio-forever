import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'$lib': path.resolve('./src/lib'),
			'$convex': path.resolve('./convex'),
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['src/**/*.jest.test.ts'],
		globals: true,
		environment: 'happy-dom',
	},
});
