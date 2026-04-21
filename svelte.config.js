import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		alias: {
			$convex: './convex'
		},
		adapter: adapter({ strict: false, fallback: '200.html' }),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (path.startsWith('/labs/') || path === '/feed.xml' || path === '/feed.json') {
					console.warn(`Ignoring missing route: ${path}`);
					return;
				}
				throw new Error(message);
			},
			handleUnseenRoutes: ({ route }) => {
				console.warn(`Ignoring unseen route: ${route ?? 'unknown'}`);
				return;
			}
		}
	}
};

export default config;
