import { ConvexClient } from "convex/browser";
import { PUBLIC_CONVEX_URL } from "$env/static/public";

// Singleton Convex client for the browser
let client: ConvexClient | null = null;

export function getConvexClient(): ConvexClient {
	if (!client) {
		client = new ConvexClient(PUBLIC_CONVEX_URL);
	}
	return client;
}
