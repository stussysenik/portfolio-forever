import { api } from "../../../convex/_generated/api";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { WorkActionLink, WorkEntry, WorkPreviewSurface } from "../astro/site-content";
import { featuredWorks } from "../astro/site-content";
import { createConvexHttpClient } from "../convex";

type ConvexWork = {
	title: string;
	url: string;
	linkLabel?: string;
	category?: string;
	preview?: string;
	previewMode?: "live" | "static" | "video";
	videoPreview?: string;
	description?: string;
	tools?: string[];
	year?: number;
	month?: number;
	muxPlaybackId?: string;
	styleOverrides?: {
		accentColor?: string;
	};
};

export type PublicWork = WorkEntry;

function normalizeString(value: string) {
	return value
		.toLowerCase()
		.replace(/https?:\/\//g, "")
		.replace(/^www\./, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function toKey(title?: string, href?: string) {
	if (href) {
		return normalizeString(href);
	}

	return normalizeString(title ?? "");
}

function slugify(title: string) {
	return normalizeString(title);
}

function toSurface(accent: string) {
	const normalized = accent.replace("#", "");
	if (normalized.length !== 6) {
		return "rgba(17, 17, 17, 0.06)";
	}

	const r = Number.parseInt(normalized.slice(0, 2), 16);
	const g = Number.parseInt(normalized.slice(2, 4), 16);
	const b = Number.parseInt(normalized.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, 0.08)`;
}

function formatYear(year?: number, month?: number, fallback?: string) {
	if (!year) {
		return fallback ?? "Now";
	}

	if (!month) {
		return String(year);
	}

	return `${year}.${String(month).padStart(2, "0")}`;
}

function assetExists(src?: string) {
	if (!src) {
		return false;
	}

	if (!src.startsWith("/")) {
		return true;
	}

	const publicPath = join(process.cwd(), "public", src.slice(1));
	const staticPath = join(process.cwd(), "static", src.slice(1));

	return existsSync(publicPath) || existsSync(staticPath);
}

function resolveInternalHref(url?: string, title?: string) {
	const normalizedUrl = (url ?? "").toLowerCase();
	const normalizedTitle = (title ?? "").toLowerCase();

	if (
		normalizedUrl.includes("clean-writer") ||
		normalizedUrl.includes("clean typewriter") ||
		normalizedTitle.includes("typewriter")
	) {
		return "/works/typewriter";
	}

	return undefined;
}

function createActionLink(href: string | undefined, label: string, external = false): WorkActionLink | undefined {
	if (!href) {
		return undefined;
	}

	return {
		href,
		label,
		external,
	};
}

function resolvePreviewSurface(work: {
	slug: string;
	internalRoute?: WorkActionLink;
	muxPlaybackId?: string;
	videoPreview?: string;
	preview?: string;
}): WorkPreviewSurface {
	if (work.internalRoute) {
		return {
			type: "internal",
			label: "Interactive route",
			href: work.internalRoute.href,
		};
	}

	if (work.muxPlaybackId) {
		return {
			type: "mux",
			label: "Mux playback",
			playbackId: work.muxPlaybackId,
			poster: assetExists(work.preview) ? work.preview : undefined,
		};
	}

	// We prefer the 'embed' type for the 'live-embedded' feel, 
	// using the branded placeholder iframe as the primary surface.
	return {
		type: "embed",
		label: "Live surface",
		href: `/embed/${work.slug}`,
	};
}

function buildFallbackIndex() {
	const index = new Map<string, WorkEntry>();

	for (const work of featuredWorks) {
		index.set(toKey(work.title), work);
		index.set(toKey(work.slug), work);
		index.set(toKey(undefined, work.liveHref), work);
		if (work.internalHref) {
			index.set(toKey(undefined, work.internalHref), work);
		}
		if (work.externalHref) {
			index.set(toKey(undefined, work.externalHref), work);
		}

		// Historical aliases keep older Convex/runtime rows mapped to the frozen reference data.
		if (work.slug === "curate-your-own-network") {
			index.set(toKey("BYOA — Build Your Own Algorithm"), work);
			index.set(toKey(undefined, "https://mymind-clone-production.up.railway.app/"), work);
		}
	}

	return index;
}

function hydrateFallbackWork(work: WorkEntry): PublicWork {
	const internalRoute =
		work.internalRoute ??
		createActionLink(work.internalHref, work.linkLabel ?? "Open route");
	const externalLink =
		work.externalLink ??
		createActionLink(
			work.externalHref ?? (work.liveHref.startsWith("/") ? undefined : work.liveHref),
			"Open original",
			true,
		);
	const primaryAction =
		work.primaryAction ??
		internalRoute ??
		createActionLink(
			work.liveHref,
			work.linkLabel ?? (work.liveHref.startsWith("/") ? "Open route" : "Open live"),
			!work.liveHref.startsWith("/"),
		);
	const previewSurface =
		work.previewSurface ??
		resolvePreviewSurface({
			slug: work.slug,
			internalRoute,
			muxPlaybackId: work.muxPlaybackId,
			videoPreview: work.videoPreview,
			preview: work.preview,
		});

	return {
		...work,
		internalHref: internalRoute?.href,
		externalHref: externalLink?.href,
		internalRoute,
		externalLink,
		primaryAction,
		previewSurface,
	};
}

function enrichWork(entry: ConvexWork, fallbackIndex: Map<string, WorkEntry>): PublicWork {
	const detectedInternalHref = resolveInternalHref(entry.url, entry.title);
	const fallback =
		fallbackIndex.get(toKey(undefined, entry.url)) ??
		fallbackIndex.get(toKey(entry.title)) ??
		(detectedInternalHref ? featuredWorks.find((work) => work.internalHref === detectedInternalHref) : undefined);

	const title = entry.title ?? fallback?.title ?? "Untitled work";
	const slug = fallback?.slug ?? slugify(title);
	const accent = entry.styleOverrides?.accentColor ?? fallback?.accent ?? "#111111";
	const category = entry.category ?? fallback?.client ?? "Project";
	const internalRoute = createActionLink(
		detectedInternalHref ?? fallback?.internalRoute?.href ?? fallback?.internalHref,
		fallback?.internalRoute?.label ?? "Open route",
	);
	const fallbackExternalHref = fallback?.externalLink?.href ?? fallback?.externalHref;
	const externalHref =
		entry.url && (!internalRoute || entry.url !== internalRoute.href) ? entry.url : fallbackExternalHref;
	const externalLink = createActionLink(externalHref, fallback?.externalLink?.label ?? "Open original", true);
	const primaryAction =
		internalRoute ??
		externalLink ??
		createActionLink(
			fallback?.liveHref ?? entry.url,
			entry.linkLabel ?? fallback?.linkLabel ?? "Open live",
			Boolean((fallback?.liveHref ?? entry.url) && !(fallback?.liveHref ?? entry.url)?.startsWith("/")),
		);
	const liveHref = primaryAction?.href ?? "#";
	const resolvedPreview = assetExists(entry.preview ?? fallback?.preview) ? entry.preview ?? fallback?.preview : undefined;
	const resolvedVideoPreview =
		assetExists(entry.videoPreview ?? fallback?.videoPreview) ? entry.videoPreview ?? fallback?.videoPreview : undefined;
	const previewSurface = resolvePreviewSurface({
		slug,
		internalRoute,
		muxPlaybackId: entry.muxPlaybackId ?? fallback?.muxPlaybackId,
		videoPreview: resolvedVideoPreview,
		preview: resolvedPreview,
	});

	return {
		slug,
		title,
		client: fallback?.client ?? category,
		year: formatYear(entry.year, entry.month, fallback?.year),
		status: fallback?.status ?? "Live",
		summary:
			entry.description ??
			fallback?.summary ??
			"A public work entry without editorial summary yet.",
		accent,
		surface: fallback?.surface ?? toSurface(accent),
		stack: entry.tools?.length ? entry.tools : fallback?.stack ?? [],
		outcomes: fallback?.outcomes ?? [],
		liveHref,
		internalHref: internalRoute?.href,
		externalHref: externalLink?.href,
		internalRoute,
		externalLink,
		primaryAction,
		preview: resolvedPreview,
		previewMode: entry.previewMode ?? fallback?.previewMode,
		videoPreview: resolvedVideoPreview,
		muxPlaybackId: entry.muxPlaybackId ?? fallback?.muxPlaybackId,
		linkLabel: entry.linkLabel ?? fallback?.linkLabel,
		category,
		previewSurface,
		embed: fallback?.embed ?? {
			eyebrow: category,
			headline: title,
			caption: entry.description ?? "Open the full surface for the real interaction.",
			metrics: [
				{ label: "mode", value: entry.previewMode ?? previewSurface.type },
				{ label: "stack", value: entry.tools?.[0] ?? "web" },
				{ label: "status", value: "current" },
			],
		},
	};
}

export async function getPublicWorks(): Promise<PublicWork[]> {
	const fallbackIndex = buildFallbackIndex();

	try {
		const client = createConvexHttpClient();
		const works = await client.query(api.works.getVisibleWorks, {});

		if (!Array.isArray(works) || works.length === 0) {
			return featuredWorks.map(hydrateFallbackWork);
		}

		return works.map((entry) => enrichWork(entry as ConvexWork, fallbackIndex));
	} catch (_error) {
		return featuredWorks.map(hydrateFallbackWork);
	}
}

export async function getPublicWorkBySlug(slug: string): Promise<PublicWork | undefined> {
	const works = await getPublicWorks();
	return works.find((work) => work.slug === slug);
}
