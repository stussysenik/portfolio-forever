import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'$lib': path.resolve('./src/lib'),
			'$convex': path.resolve('./convex'),
			'$app/navigation': path.resolve('./tests/mocks/app-navigation.ts'),
			'$app/environment': path.resolve('./tests/mocks/app-environment.ts'),
			'$env/dynamic/public': path.resolve('./tests/mocks/env-dynamic-public.ts'),
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
		exclude: ['src/**/*.jest.test.ts'],
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./tests/vitest-setup.ts']
	},
});
