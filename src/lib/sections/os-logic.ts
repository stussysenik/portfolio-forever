/**
 * OS section logic — handles desktop environment state and windows.
 * Ported from clj/portfolio/sections/os.cljs
 */
import { api } from "$lib/app-shims";

export function setupOsSubscriptions(client: any, callbacks: any) {
	const { onConfig } = callbacks;

	const unsub = client.onUpdate(api.os.getConfig, {}, (data: any) => {
		if (onConfig) onConfig(data);
	});

	return () => unsub();
}
