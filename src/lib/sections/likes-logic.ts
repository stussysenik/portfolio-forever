/**
 * Likes section logic — handles categorized interest lists.
 * Ported from clj/portfolio/sections/likes.cljs
 */
import { api } from "$lib/app-shims";

export function setupLikesSubscriptions(client: any, callbacks: any) {
	const { onLikes } = callbacks;

	const unsub = client.onUpdate(api.likes.getAllCategories, {}, (data: any) => {
		if (onLikes) onLikes(data);
	});

	return () => unsub();
}
