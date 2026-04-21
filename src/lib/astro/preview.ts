export function buildPreviewHref(route: string, document: string) {
	const params = new URLSearchParams({
		preview: "1",
		document,
	});

	return `${route}?${params.toString()}`;
}

export function buildEditorialHref(document: string) {
	const params = new URLSearchParams({
		document,
	});

	return `/admin/content?${params.toString()}`;
}

export function buildStudioSearchHref(studioPath: string, document: string) {
	const params = new URLSearchParams({
		document,
	});

	return `${studioPath}?${params.toString()}`;
}

export function buildStudioIntentHref(studioPath: string, documentId: string, documentType: string) {
	const normalizedStudioPath = studioPath.replace(/\/$/, "");

	return `${normalizedStudioPath}/intent/edit/id=${encodeURIComponent(documentId)};type=${encodeURIComponent(documentType)}/`;
}

const previewDocumentLabels: Record<string, string> = {
	heroContent: "hero content",
	profile: "profile",
	caseStudy: "case study",
	post: "blog post",
	mediaMetadata: "media metadata",
};

export function getPreviewDocumentLabel(document: string) {
	return previewDocumentLabels[document] ?? document;
}

export function parsePreviewSearch(search: string) {
	const normalized = search.startsWith("?") ? search.slice(1) : search;
	const params = new URLSearchParams(normalized);

	return {
		enabled: params.get("preview") === "1",
		document: params.get("document") ?? "",
	};
}
