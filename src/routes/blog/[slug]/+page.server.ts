import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// Post data is fetched client-side via Convex in the page component
	return { slug: params.slug };
};
