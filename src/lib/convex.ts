import { ConvexClient } from "convex/browser";
import { env } from "$env/dynamic/public";

// Singleton Convex client for the browser
let client: ConvexClient | null = null;

export function getConvexClient(): ConvexClient | null {
	if (!client) {
		const url = env.PUBLIC_CONVEX_URL || "https://determined-manatee-425.convex.cloud";
		if (!url) {
			console.warn("PUBLIC_CONVEX_URL is not set. Convex features will be disabled.");
			return null;
		}
		client = new ConvexClient(url);
	}
	return client;
}
