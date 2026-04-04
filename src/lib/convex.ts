import { ConvexClient } from "convex/browser";
import { env } from "$env/dynamic/public";

// Singleton Convex client for the browser
let client: ConvexClient | null = null;

export function getConvexClient(): ConvexClient {
	if (!client) {
		const url = env.PUBLIC_CONVEX_URL;
		if (!url) throw new Error("PUBLIC_CONVEX_URL is not set");
		client = new ConvexClient(url);
	}
	return client;
}
