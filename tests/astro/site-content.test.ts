import { describe, expect, it } from "vitest";
import { featuredWorks, previewTargets } from "../../src/lib/astro/site-content";
import { buildPreviewHref, parsePreviewSearch } from "../../src/lib/astro/preview";

describe("Astro site content", () => {
	it("keeps featured works aligned with preview expectations", () => {
		expect(featuredWorks.length).toBeGreaterThanOrEqual(3);
		expect(featuredWorks.every((work) => work.outcomes.length >= 3)).toBe(true);
		expect(featuredWorks.slice(0, 3).map((work) => work.slug)).toEqual([
			"curate-your-own-network",
			"ipod-emulator",
			"spinning-wheel-filter",
		]);
	});

	it("builds stable preview links for each target", () => {
		const hrefs = previewTargets.map((target) => buildPreviewHref(target.route, target.document));
		expect(hrefs).toContain("/?preview=1&document=heroContent");
		expect(hrefs).toContain("/works?preview=1&document=caseStudy");
		expect(hrefs).toContain("/blog?preview=1&document=post");
	});

	it("parses preview search strings into explicit state", () => {
		expect(parsePreviewSearch("?preview=1&document=profile")).toEqual({
			enabled: true,
			document: "profile",
		});
		expect(parsePreviewSearch("document=heroContent")).toEqual({
			enabled: false,
			document: "heroContent",
		});
	});
});
