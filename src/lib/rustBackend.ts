/**
 * Thin fetch-wrapper that mirrors the `ConvexClient` + `api.X.Y` surface used
 * throughout the app, but talks to the new Rust/Axum backend over REST.
 *
 * The goal is a one-line import swap at any Convex call site:
 *
 *   - import { getConvexClient } from "$lib/convex";
 *   - import { api } from "$convex/_generated/api";
 *   + import { getRustClient as getConvexClient, api } from "$lib/rustBackend";
 *
 * The existing `client.onUpdate(api.X.Y, args, cb)` callsites keep working
 * because we match Convex's method signature. `onUpdate` is MVP-shimmed as
 * a one-shot fetch — good enough to move reads off Convex; real live updates
 * come later (SSE or WebSocket from the Axum side).
 *
 * Rust snake_case → JS camelCase is handled by {@link camelize}: responses are
 * walked recursively and every key is converted, so consumers read
 * `config.sectionOrder` / `profile.sameAs` exactly as they did under Convex.
 */

import { env } from "$env/dynamic/public";

// ── URL resolution ────────────────────────────────────────────────────────

const DEFAULT_BASE_URL = "http://localhost:3000";

function baseUrl(): string {
	// Accessed lazily so SvelteKit's dynamic env loads per request.
	return env.PUBLIC_RUST_API_URL ?? DEFAULT_BASE_URL;
}

// ── snake_case → camelCase recursive transform ────────────────────────────

function toCamel(key: string): string {
	return key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

export function camelize<T = unknown>(value: unknown): T {
	if (Array.isArray(value)) {
		return value.map((item) => camelize(item)) as unknown as T;
	}
	if (value !== null && typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			out[toCamel(k)] = camelize(v);
		}
		return out as T;
	}
	return value as T;
}

// ── Request primitive ─────────────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/**
 * A descriptor for a single backend operation. Stand-in for Convex's
 * `FunctionReference<…>`. Path can be a template function when args need
 * to be interpolated into the URL (e.g. `/blog/slug/:slug`).
 */
export interface RustRef<TArgs = Record<string, never>, TResult = unknown> {
	method: HttpMethod;
	path: string | ((args: TArgs) => string);
	/** Optional body builder for mutations. */
	body?: (args: TArgs) => unknown;
	/** Optional query-string builder for GETs that take parameters. */
	search?: (args: TArgs) => Record<string, string | number | boolean | undefined>;
	// Phantom fields for type inference. Never assigned at runtime.
	readonly __args?: TArgs;
	readonly __result?: TResult;
}

async function execute<TArgs, TResult>(
	ref: RustRef<TArgs, TResult>,
	args: TArgs,
): Promise<TResult> {
	const pathname = typeof ref.path === "function" ? ref.path(args) : ref.path;
	const url = new URL(pathname, baseUrl());
	if (ref.search) {
		for (const [k, v] of Object.entries(ref.search(args))) {
			if (v !== undefined) url.searchParams.set(k, String(v));
		}
	}

	const init: RequestInit = {
		method: ref.method,
		headers: { "Content-Type": "application/json" },
	};
	if (ref.method !== "GET" && ref.method !== "DELETE") {
		const body = ref.body ? ref.body(args) : args;
		init.body = JSON.stringify(body);
	}

	const res = await fetch(url.toString(), init);
	if (!res.ok) {
		throw new Error(`rustBackend ${ref.method} ${pathname} → ${res.status}`);
	}
	if (res.status === 204) return undefined as TResult;
	const json = (await res.json()) as unknown;
	return camelize<TResult>(json);
}

// ── Client — drop-in for ConvexClient ─────────────────────────────────────

type Unsubscribe = () => void;

export class RustClient {
	/** One-shot query. Matches Convex `client.query(ref, args)`. */
	query<TArgs, TResult>(ref: RustRef<TArgs, TResult>, args: TArgs): Promise<TResult> {
		return execute(ref, args);
	}

	/** One-shot mutation. Matches Convex `client.mutation(ref, args)`. */
	mutation<TArgs, TResult>(ref: RustRef<TArgs, TResult>, args: TArgs): Promise<TResult> {
		return execute(ref, args);
	}

	/**
	 * Subscription shim. Fetches once, invokes the callback with the result,
	 * and returns a no-op unsubscribe. Real live updates (SSE/WebSocket)
	 * will replace this implementation later without touching callers.
	 */
	onUpdate<TArgs, TResult>(
		ref: RustRef<TArgs, TResult>,
		args: TArgs,
		onUpdate: (value: TResult) => void,
		onError?: (err: unknown) => void,
	): Unsubscribe {
		let cancelled = false;
		execute(ref, args)
			.then((result) => {
				if (!cancelled) onUpdate(result);
			})
			.catch((err) => {
				if (cancelled) return;
				if (onError) {
					onError(err);
				} else if (!(err instanceof TypeError && err.message === "Failed to fetch")) {
					console.warn(`[rustBackend] onUpdate failed:`, err);
				}
			});
		return () => { cancelled = true; };
	}
}

let cached: RustClient | null = null;

export function getRustClient(): RustClient {
	if (!cached) cached = new RustClient();
	return cached;
}

// ── Type definitions for the responses we read right now ─────────────────
//
// Field names already reflect the post-camelize shape so consumers see the
// exact Convex schema they always have. Only fields actively read by the
// current callers are listed; extend as each component is migrated.

export type SiteMode = "one-page" | "multi-page" | "reader" | "disabled";
export type NavMode = "auto" | "manual";

export interface SiteConfig {
	id: string;
	mode: SiteMode;
	sectionOrder: string[];
	parallaxSpeed: number;
	readerModeRoute?: string | null;
	footerEdition?: string | null;
	footerYear?: number | null;
	navMode?: NavMode | null;
	heroVisual?: string | null;
}

export interface FeatureFlag {
	id: string;
	key: string;
	enabled: boolean;
	category?: string;
}

export interface NavItem {
	id: string;
	route: string;
	label: string;
	navOrder?: number;
	navVisible?: boolean;
	visible?: boolean;
	archived?: boolean;
}

export interface CvProfile {
	id: string;
	name: string;
	jobTitle?: string;
	summary?: string;
	url?: string;
	sameAs?: string[];
	knowsAbout?: unknown;
	taglines?: unknown;
	shortBio?: string | null;
	location?: string | null;
	available?: boolean | null;
	email?: string | null;
	edition?: string | null;
	createdDate?: string | null;
}

export interface CvBundle {
	profile: CvProfile | null;
	entries: unknown[];
	languages: unknown[];
	sections: unknown[];
}

// ── API descriptors — mirror $convex/_generated/api shape ────────────────
//
// Usage matches Convex exactly:
//
//   client.onUpdate(api.siteConfig.get, {}, (config) => { … });
//   client.query(api.cv.getVisibleCV, {});
//
// Only the endpoints actively consumed by the frontend are mapped today.
// Each new component migration extends this object.

type NoArgs = Record<string, never>;

export const api = {
	siteConfig: {
		get: {
			method: "GET",
			path: "/api/v1/site-config",
		} as RustRef<NoArgs, SiteConfig>,
		getFeatureFlags: {
			method: "GET",
			path: "/api/v1/feature-flags",
		} as RustRef<NoArgs, FeatureFlag[]>,
	},
	pages: {
		getNavItems: {
			method: "GET",
			path: "/api/v1/pages/nav",
		} as RustRef<NoArgs, NavItem[]>,
	},
	cv: {
		getVisibleCV: {
			method: "GET",
			path: "/api/v1/cv",
		} as RustRef<NoArgs, CvBundle>,
	},
} as const;
