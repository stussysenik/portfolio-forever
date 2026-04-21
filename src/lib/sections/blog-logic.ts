/**
 * Blog section logic — handles project transformations and view modes.
 * Ported from clj/portfolio/sections/blog.cljs
 */
import { api } from "$lib/app-shims";

export function setupBlogSubscriptions(client: any, callbacks: any) {
	const { onPosts } = callbacks;

	const unsub = client.onUpdate(api.blog.getVisiblePosts, {}, (data: any) => {
		if (onPosts) onPosts(data);
	});

	return () => unsub();
}

export function sortPosts(posts: any[]) {
	if (!posts) return [];
	return [...posts].sort((a, b) => {
		return (
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
		);
	});
}

export function getAllTags(posts: any[]) {
	if (!posts) return [];
	const tags = new Set<string>();
	posts.forEach((post) => {
		if (post.tags && Array.isArray(post.tags)) {
			post.tags.forEach((tag: string) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
}

export function filterPostsByTag(posts: any[], tag: string | null) {
	if (!posts || !tag) return posts;
	return posts.filter((post) => {
		const postTags = new Set(post.tags || []);
		return postTags.has(tag);
	});
}
