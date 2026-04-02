import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Blog data is fetched client-side via Convex subscription in BlogSection
	return { posts: [] };
};
