import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		alias: {
			$convex: './convex'
		},
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({ strict: false, fallback: '200.html' }),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for labs experiments and feeds that don't exist yet
				if (path.startsWith('/labs/') || path === '/feed.xml' || path === '/feed.json') {
					console.warn(`Ignoring missing route: ${path}`);
					return;
				}
				// Re-throw for other errors
				throw new Error(message);
			},
			handleUnseenRoutes: ({ route }) => {
				// Ignore all unseen dynamic routes during development (no content yet)
				console.warn(`Ignoring unseen route: ${route ?? 'unknown'}`);
				return;
			}
		}
	}
};

export default config;
