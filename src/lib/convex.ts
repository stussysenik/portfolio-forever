import { ConvexClient, ConvexHttpClient } from "convex/browser";

const DEFAULT_CONVEX_URL = "https://grandiose-skunk-977.convex.cloud";

type RuntimeEnv = {
	PUBLIC_CONVEX_URL?: string;
};

function readRuntimeEnv(): RuntimeEnv {
	const metaEnv = (import.meta as ImportMeta & { env?: RuntimeEnv }).env;
	if (metaEnv?.PUBLIC_CONVEX_URL) {
		return metaEnv;
	}
	if (typeof process !== "undefined") {
		return process.env as RuntimeEnv;
	}
	return {};
}

export function getPublicConvexUrl(): string {
	return readRuntimeEnv().PUBLIC_CONVEX_URL || DEFAULT_CONVEX_URL;
}

// Singleton Convex client for the browser
let client: ConvexClient | null = null;

export function getConvexClient(): ConvexClient | null {
	if (!client) {
		const url = getPublicConvexUrl();
		if (!url) {
			console.warn("PUBLIC_CONVEX_URL is not set. Convex features will be disabled.");
			return null;
		}
		client = new ConvexClient(url);
	}
	return client;
}

export function createConvexHttpClient(): ConvexHttpClient {
	return new ConvexHttpClient(getPublicConvexUrl());
}
