/**
 * Academia section logic — handles Convex subscriptions for research papers.
 * Ported from clj/portfolio/sections/academia.cljs
 */
import { api } from "$lib/app-shims";

export function setupAcademiaSubscriptions(client: any, callbacks: any) {
	const { onAcademia } = callbacks;

	const unsub = client.onUpdate(
		api.academia.getVisibleAcademia,
		{},
		(data: any) => {
			if (onAcademia) onAcademia(data);
		}
	);

	return () => unsub();
}
