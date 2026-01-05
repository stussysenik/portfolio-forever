import type { PageServerLoad } from './$types';
import { client } from '$lib/sanity/client';
import { POSTS_QUERY } from '$lib/sanity/queries';
import type { SanityPost } from '$lib/sanity/types';

export const load: PageServerLoad = async () => {
        const posts = await client.fetch<SanityPost[]>(POSTS_QUERY);
        return { posts };
};
