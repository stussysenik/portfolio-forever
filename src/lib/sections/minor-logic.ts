/**
 * Minor section logic — handles miscellaneous list entries.
 * Ported from clj/portfolio/sections/minor.cljs
 */
import { api } from "$lib/app-shims";

export function setupMinorSubscriptions(client: any, callbacks: any) {
	const { onMinor } = callbacks;

	const unsub = client.onUpdate(api.minor.getVisibleMinor, {}, (data: any) => {
		if (onMinor) onMinor(data);
	});

	return () => unsub();
}
