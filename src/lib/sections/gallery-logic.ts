/**
 * Gallery section logic — handles visual fragments and art documentation.
 * Ported from clj/portfolio/sections/gallery.cljs
 */
import { api } from "$lib/app-shims";

export function setupGallerySubscriptions(client: any, callbacks: any) {
	const { onItems } = callbacks;

	const unsub = client.onUpdate(api.gallery.getVisibleGallery, {}, (data: any) => {
		if (onItems) onItems(data);
	});

	return () => unsub();
}

export function isVideo(item: any) {
	const muxId = item.muxPlaybackId;
	const url = item.fullUrl || item.thumbnailUrl || "";
	if (muxId) return true;
	
	const ext = url.split(".").pop()?.toLowerCase();
	return ["mp4", "webm", "mov", "avi"].includes(ext || "");
}

export function filterItems(items: any[], activeFilter: string) {
	if (!items) return [];
	if (activeFilter === "all") return items;
	
	return items.filter((item) => {
		const cats = Array.isArray(item.category) ? item.category : [item.category];
		return cats.includes(activeFilter);
	});
}
