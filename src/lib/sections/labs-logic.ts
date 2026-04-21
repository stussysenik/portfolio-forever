/**
 * Labs section logic — handles Convex subscriptions for experiments.
 * Ported from clj/portfolio/sections/labs.cljs
 */
import { api } from "$lib/app-shims";

export function setupLabsSubscriptions(client: any, callbacks: any) {
	const { onLabs } = callbacks;

	const unsub = client.onUpdate(api.labs.getVisibleLabs, {}, (data: any) => {
		if (onLabs) onLabs(data);
	});

	return () => unsub();
}
