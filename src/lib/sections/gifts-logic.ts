/**
 * Gifts section logic — handles registry configuration.
 * Ported from clj/portfolio/sections/gifts.cljs
 */
import { api } from "$lib/app-shims";

export function setupGiftsSubscriptions(client: any, callbacks: any) {
	const { onConfig } = callbacks;

	const unsub = client.onUpdate(api.gifts.getConfig, {}, (data: any) => {
		if (onConfig) onConfig(data);
	});

	return () => unsub();
}
