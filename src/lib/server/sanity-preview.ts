import type { ClientPerspective, QueryParams } from "@sanity/client";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";

type CookieReader = {
	get(name: string): { value: string } | undefined;
};

type PreviewContext = {
	cookies: CookieReader;
	url: URL;
};

export type SanityPreviewState = {
	document: string;
	previewEnabled: boolean;
	draftModeEnabled: boolean;
	perspective: ClientPerspective;
	visualEditingEnabled: boolean;
};

const visualEditingAllowed = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED !== "false";
const readToken = import.meta.env.SANITY_API_READ_TOKEN;

function parsePerspectiveCookie(value?: string): ClientPerspective {
	if (!value) {
		return "drafts";
	}

	if (value === "published" || value === "drafts" || value === "raw") {
		return value;
	}

	try {
		const parsed = JSON.parse(value);
		if (Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string")) {
			return parsed;
		}
	} catch (_error) {
		// Ignore invalid cookie payloads and fall back to draft perspective.
	}

	return "drafts";
}

export function getSanityPreviewState(context: PreviewContext): SanityPreviewState {
	const previewDocument = context.url.searchParams.get("document") ?? "";
	const queryPreviewEnabled = context.url.searchParams.get("preview") === "1";
	const perspectiveCookie = context.cookies.get(perspectiveCookieName)?.value;
	const draftModeEnabled = Boolean(perspectiveCookie);

	return {
		document: previewDocument,
		previewEnabled: queryPreviewEnabled || draftModeEnabled,
		draftModeEnabled,
		perspective: parsePerspectiveCookie(perspectiveCookie),
		visualEditingEnabled: draftModeEnabled && visualEditingAllowed && Boolean(readToken),
	};
}

export async function loadSanityQuery<QueryResponse>({
	query,
	params,
	preview,
}: {
	query: string;
	params?: QueryParams;
	preview: SanityPreviewState;
}) {
	const visualEditingEnabled = preview.visualEditingEnabled;
	const perspective = visualEditingEnabled ? preview.perspective : "published";
	const { sanityClient } = await import("sanity:client");

	const client = visualEditingEnabled
		? sanityClient.withConfig({ token: readToken, useCdn: false })
		: sanityClient.withConfig({ useCdn: true });

	const { result, resultSourceMap } = await client.fetch<QueryResponse>(query, params ?? {}, {
		filterResponse: false,
		perspective,
		resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,
		stega: visualEditingEnabled,
	});

	return {
		data: result,
		sourceMap: resultSourceMap,
		perspective,
		visualEditingEnabled,
	};
}
