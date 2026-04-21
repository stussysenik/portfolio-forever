/**
 * Section depth filtering — visual diagnostic for information density.
 * Ported from clj/portfolio/utils/depth_filter.cljs
 */

export const screenPassSections = new Set(["hero", "works", "cv"]);

export const filterByDepth = (sections: string[], depth: string) => {
	if (depth === "5-min") {
		return sections.filter((s) => screenPassSections.has(s));
	}
	return sections;
};

export const isScreenPass = (depth: string) => depth === "5-min";
export const isDeepDive = (depth: string) => depth === "15-min";
export const isFullArchive = (depth: string) => depth === "full";
