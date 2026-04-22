import { createClient } from "@sanity/client";
import { escapeHTML, toHTML, uriLooksSafe } from "@portabletext/to-html";
import groq from "groq";
import {
	buildEditorialHref,
	buildStudioIntentHref,
	buildStudioSearchHref,
	getPreviewDocumentLabel,
} from "../astro/preview";
import { cvProfile, fallbackRecentPosts, featuredWorks } from "../astro/site-content";
import { loadSanityQuery, type SanityPreviewState } from "./sanity-preview";

type PortableTextSpan = {
	_type: string;
	text?: string;
	marks?: string[];
};

type PortableTextMarkDefinition = {
	_key?: string;
	_type: string;
	href?: string;
};

type PortableTextBlock = {
	_type: string;
	style?: string;
	listItem?: string;
	level?: number;
	children?: PortableTextSpan[];
	markDefs?: PortableTextMarkDefinition[];
	assetUrl?: string;
	alt?: string;
	caption?: string;
};

type RawHomepageSlice = {
	hero?: {
		headline?: string;
		subheadline?: string;
		ctaLabel?: string;
		ctaHref?: string;
		eyebrow?: string;
	} | null;
	profile?: {
		name?: string;
		role?: string;
		shortBio?: string;
		location?: string;
	} | null;
};

export type RecentPost = {
	_id: string;
	title: string;
	slug: string;
	publishedAt: string;
	publishedDate: string;
	publishedDateShort: string;
	excerpt: string;
};

type EditorialDocument = {
	_id: string;
	_type: string;
};

type ProfileDocument = {
	name?: string;
	role?: string;
	location?: string;
	shortBio?: string;
};

type CaseStudyDocument = {
	_id: string;
	title?: string;
	slug?: string;
	summary?: string;
	year?: number;
};

type PostDocument = {
	_id: string;
	title?: string;
	slug?: string;
	publishedAt?: string;
	excerpt?: string | null;
	mainImageUrl?: string | null;
	mainImageAlt?: string | null;
	body?: PortableTextBlock[];
};

export type BlogPost = RecentPost & {
	html: string;
	mainImageUrl: string | null;
	mainImageAlt: string;
};

export type EditorialFocusTarget = {
	document: string;
	label: string;
	editorialHref: string;
	studioHref: string;
	resolved: boolean;
};

export type HomepageEditorialSlice = {
	source: "editorial" | "profile-default";
	eyebrow: string;
	title: string;
	role: string;
	summary: string;
	ctaLabel: string;
	ctaHref: string;
	meta: string;
};

const editorialDocumentQueryByType: Record<string, string> = {
	heroContent: `*[_type == $documentType][0]{_id, _type}`,
	profile: `*[_type == $documentType][0]{_id, _type}`,
	post: `*[_type == $documentType] | order(_updatedAt desc)[0]{_id, _type}`,
	caseStudy: `*[_type == $documentType] | order(_updatedAt desc)[0]{_id, _type}`,
	mediaMetadata: `*[_type == $documentType] | order(_updatedAt desc)[0]{_id, _type}`,
};

const publishedPreviewState: SanityPreviewState = {
	document: "",
	previewEnabled: false,
	draftModeEnabled: false,
	perspective: "published",
	visualEditingEnabled: false,
};

function getSanityClient() {
	const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
	const dataset = import.meta.env.VITE_SANITY_DATASET;

	if (!projectId || !dataset) {
		return null;
	}

	return createClient({
		projectId,
		dataset,
		apiVersion: "2025-01-01",
		useCdn: false,
	});
}

function portableTextToPlain(blocks?: PortableTextBlock[]) {
	if (!blocks?.length) {
		return "";
	}

	return blocks
		.filter((block) => block?._type === "block")
		.flatMap((block) => block.children ?? [])
		.map((span) => span.text?.trim() ?? "")
		.filter(Boolean)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();
}

function normalizePreviewState(preview?: SanityPreviewState) {
	return preview ?? publishedPreviewState;
}

function formatPublishedDate(dateValue?: string, format: "long" | "short" = "long") {
	if (!dateValue) {
		return "";
	}

	const date = new Date(dateValue);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: format === "long" ? "long" : "short",
		day: "numeric",
	});
}

function resolvePostExcerpt(post: Pick<PostDocument, "excerpt" | "body">) {
	return (
		post.excerpt?.trim() ||
		portableTextToPlain(post.body) ||
		"A short editorial note for the portfolio journal."
	);
}

function mapRecentPost(post: PostDocument): RecentPost | null {
	if (!post.slug) {
		return null;
	}

	return {
		_id: post._id,
		title: post.title ?? "Untitled post",
		slug: post.slug,
		publishedAt: post.publishedAt ?? "",
		publishedDate: formatPublishedDate(post.publishedAt, "long"),
		publishedDateShort: formatPublishedDate(post.publishedAt, "short"),
		excerpt: resolvePostExcerpt(post),
	};
}

function getFallbackRecentPosts(limit = 4): RecentPost[] {
	return fallbackRecentPosts.slice(0, limit).map((post) => ({
		_id: post._id,
		title: post.title,
		slug: post.slug,
		publishedAt: post.publishedAt,
		publishedDate: formatPublishedDate(post.publishedAt, "long"),
		publishedDateShort: formatPublishedDate(post.publishedAt, "short"),
		excerpt: post.excerpt,
	}));
}

function renderPortableTextHtml(blocks?: PortableTextBlock[]) {
	if (!blocks?.length) {
		return "";
	}

	return toHTML(blocks, {
		onMissingComponent: false,
		components: {
			marks: {
				link: ({ children, value }) => {
					const href = typeof value?.href === "string" ? value.href : "";
					if (!href || !uriLooksSafe(href)) {
						return children;
					}

					const rel = href.startsWith("/") ? undefined : "noreferrer noopener";
					const relAttribute = rel ? ` rel="${rel}"` : "";

					return `<a href="${escapeHTML(href)}"${relAttribute}>${children}</a>`;
				},
			},
			types: {
				image: ({ value }) => {
					const assetUrl = typeof value?.assetUrl === "string" ? value.assetUrl : "";
					if (!assetUrl || !uriLooksSafe(assetUrl)) {
						return "";
					}

					const alt = escapeHTML(typeof value?.alt === "string" ? value.alt : "");
					const caption =
						typeof value?.caption === "string" && value.caption.trim()
							? `<figcaption>${escapeHTML(value.caption)}</figcaption>`
							: "";

					return `<figure class="blog-prose__figure"><img src="${escapeHTML(assetUrl)}" alt="${alt}" loading="lazy" />${caption}</figure>`;
				},
			},
		},
	});
}

function mapBlogPost(post: PostDocument): BlogPost | null {
	const summary = mapRecentPost(post);
	if (!summary) {
		return null;
	}

	const fallbackHtml = `<p>${escapeHTML(summary.excerpt)}</p>`;

	return {
		...summary,
		html: renderPortableTextHtml(post.body) || fallbackHtml,
		mainImageUrl: post.mainImageUrl ?? null,
		mainImageAlt: post.mainImageAlt ?? summary.title,
	};
}

function getFallbackBlogPost(slug: string): BlogPost | null {
	const fallbackPost = fallbackRecentPosts.find((post) => post.slug === slug);
	if (!fallbackPost) {
		return null;
	}

	const summary = getFallbackRecentPosts(fallbackRecentPosts.length).find((post) => post.slug === slug);
	if (!summary) {
		return null;
	}

	return {
		...summary,
		html: `<p>${escapeHTML(summary.excerpt)}</p><p>This post is currently served from the local editorial archive until the matching Sanity document is published.</p>`,
		mainImageUrl: null,
		mainImageAlt: fallbackPost.title,
	};
}

function mergeFeaturedWorks(caseStudies: CaseStudyDocument[]) {
	if (!caseStudies.length) {
		return featuredWorks;
	}

	return featuredWorks.map((work, index) => {
		const caseStudy = caseStudies[index];
		if (!caseStudy) {
			return work;
		}

		return {
			...work,
			title: caseStudy.title ?? work.title,
			summary: caseStudy.summary ?? work.summary,
			year: caseStudy.year ? String(caseStudy.year) : work.year,
		};
	});
}

export function getSanityWorkspaceConfig() {
	const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "py21y2h1";
	const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";
	const studioPath = "/admin/content/studio";

	return {
		projectId,
		dataset,
		configured: Boolean(import.meta.env.VITE_SANITY_PROJECT_ID && import.meta.env.VITE_SANITY_DATASET),
		studioPath,
		presentationPath: `${studioPath}/presentation`,
	};
}

export function getSanityWorkspaceStatus() {
	const workspace = getSanityWorkspaceConfig();
	const draftModeReady = Boolean(import.meta.env.SANITY_API_READ_TOKEN);
	const visualEditingAllowed = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED !== "false";

	return {
		...workspace,
		draftModeReady,
		visualEditingAllowed,
		visualEditingReady: draftModeReady && visualEditingAllowed,
		studioRouteReady: true,
		presentationRouteReady: true,
	};
}

export async function getEditorialFocusTarget(document: string): Promise<EditorialFocusTarget> {
	const workspace = getSanityWorkspaceConfig();
	const label = getPreviewDocumentLabel(document);
	const fallbackTarget: EditorialFocusTarget = {
		document,
		label,
		editorialHref: buildEditorialHref(document),
		studioHref: buildStudioSearchHref(workspace.studioPath, document),
		resolved: false,
	};

	const query = editorialDocumentQueryByType[document];
	if (!query) {
		return fallbackTarget;
	}

	const client = getSanityClient();
	if (!client) {
		return fallbackTarget;
	}

	try {
		const resolvedDocument = await client.fetch<EditorialDocument | null>(groq`${query}`, {
			documentType: document,
		});

		if (!resolvedDocument?._id || !resolvedDocument?._type) {
			return fallbackTarget;
		}

		return {
			...fallbackTarget,
			studioHref: buildStudioIntentHref(workspace.studioPath, resolvedDocument._id, resolvedDocument._type),
			resolved: true,
		};
	} catch (_error) {
		return fallbackTarget;
	}
}

export async function getHomepageEditorialSlice(preview: SanityPreviewState) {
	const query = groq`{
		"hero": *[_type == "heroContent"][0]{
			headline,
			subheadline,
			ctaLabel,
			ctaHref,
			eyebrow
		},
		"profile": *[_type == "profile"][0]{
			name,
			role,
			shortBio,
			location
		}
	}`;

	const defaultSlice: HomepageEditorialSlice = {
		source: "profile-default",
		eyebrow: "~/portfolio available",
		title: cvProfile.name,
		role: cvProfile.role,
		summary: cvProfile.summary,
		ctaLabel: "Open selected works",
		ctaHref: "/works",
		meta: cvProfile.location,
	};

	try {
		const { data } = await loadSanityQuery<RawHomepageSlice>({
			query,
			preview,
		});

		return {
			source: data.hero || data.profile ? "editorial" : defaultSlice.source,
			eyebrow: data.hero?.eyebrow?.trim() || defaultSlice.eyebrow,
			title: data.hero?.headline?.trim() || data.profile?.name?.trim() || defaultSlice.title,
			role: data.profile?.role?.trim() || defaultSlice.role,
			summary: data.hero?.subheadline?.trim() || data.profile?.shortBio?.trim() || defaultSlice.summary,
			ctaLabel: data.hero?.ctaLabel?.trim() || defaultSlice.ctaLabel,
			ctaHref: data.hero?.ctaHref?.trim() || defaultSlice.ctaHref,
			meta: data.profile?.location?.trim() || defaultSlice.meta,
		};
	} catch (_error) {
		return defaultSlice;
	}
}

export async function getProfileEditorialSlice(preview: SanityPreviewState) {
	const query = groq`*[_type == "profile"][0]{
		name,
		role,
		location,
		shortBio
	}`;

	try {
		const { data } = await loadSanityQuery<ProfileDocument | null>({
			query,
			preview,
		});

		if (!data) {
			return cvProfile;
		}

		return {
			...cvProfile,
			name: data.name ?? cvProfile.name,
			role: data.role ?? cvProfile.role,
			location: data.location ?? cvProfile.location,
			summary: data.shortBio ?? cvProfile.summary,
		};
	} catch (_error) {
		return cvProfile;
	}
}

export async function getFeaturedCaseStudies(preview: SanityPreviewState) {
	const query = groq`*[_type == "caseStudy"] | order(coalesce(year, 0) desc, _updatedAt desc)[0...3]{
		_id,
		title,
		"slug": slug.current,
		summary,
		year
	}`;

	try {
		const { data } = await loadSanityQuery<CaseStudyDocument[]>({
			query,
			preview,
		});

		return mergeFeaturedWorks(data ?? []);
	} catch (_error) {
		return featuredWorks;
	}
}

export async function getRecentPosts(limit = 4, preview?: SanityPreviewState) {
	const query = groq`*[_type == "post"] | order(publishedAt desc)[0...$limit]{
		_id,
		title,
		"slug": slug.current,
		publishedAt,
		excerpt,
		body
	}`;

	try {
		const { data } = await loadSanityQuery<PostDocument[]>({
			query,
			params: { limit },
			preview: normalizePreviewState(preview),
		});

		const posts = data?.map(mapRecentPost).filter(Boolean) as RecentPost[] | undefined;
		return posts?.length ? posts : getFallbackRecentPosts(limit);
	} catch (_error) {
		return getFallbackRecentPosts(limit);
	}
}

export async function getPostBySlug(slug: string, preview?: SanityPreviewState) {
	const query = groq`*[_type == "post" && slug.current == $slug][0]{
		_id,
		title,
		"slug": slug.current,
		publishedAt,
		excerpt,
		"mainImageUrl": mainImage.asset->url,
		"mainImageAlt": coalesce(mainImage.alt, title),
		body[]{
			...,
			markDefs[]{
				...,
				href
			},
			_type == "image" => {
				...,
				"assetUrl": asset->url
			}
		}
	}`;

	try {
		const { data } = await loadSanityQuery<PostDocument | null>({
			query,
			params: { slug },
			preview: normalizePreviewState(preview),
		});

		if (!data) {
			return getFallbackBlogPost(slug);
		}

		return mapBlogPost(data) ?? getFallbackBlogPost(slug);
	} catch (_error) {
		return getFallbackBlogPost(slug);
	}
}
