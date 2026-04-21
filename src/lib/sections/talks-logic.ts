/**
 * Talks section logic — handles Convex subscriptions for speaking engagements.
 * Ported from clj/portfolio/sections/talks.cljs
 */
import { api } from "$lib/app-shims";

export function setupTalksSubscriptions(client: any, callbacks: any) {
	const { onTalks } = callbacks;

	const unsub = client.onUpdate(api.talks.getVisibleTalks, {}, (data: any) => {
		if (onTalks) onTalks(data);
	});

	return () => unsub();
}

export function sortTalks(talks: any[]) {
	if (!talks) return [];
	return [...talks].sort((a, b) => {
		const yearDiff = b.year - a.year;
		if (yearDiff !== 0) return yearDiff;
		return (b.month || 0) - (a.month || 0);
	});
}
