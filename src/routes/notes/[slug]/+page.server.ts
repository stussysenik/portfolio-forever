import type { PageServerLoad } from './$types';
import { client } from '$lib/sanity/client';
import { POST_BY_SLUG_QUERY } from '$lib/sanity/queries';
import type { SanityPost } from '$lib/sanity/types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
        const post = await client.fetch<SanityPost | null>(POST_BY_SLUG_QUERY, { slug: params.slug });

        if (!post) {
                throw error(404, 'Note not found');
        }

        return { post };
};
