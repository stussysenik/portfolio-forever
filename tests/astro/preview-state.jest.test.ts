import { describe, expect, it } from "@jest/globals";
import {
	buildEditorialHref,
	buildPreviewHref,
	buildStudioIntentHref,
	buildStudioSearchHref,
	parsePreviewSearch,
} from "../../src/lib/astro/preview";

describe("preview helpers", () => {
	it("generates a query-driven preview URL", () => {
		expect(buildPreviewHref("/cv", "profile")).toBe("/cv?preview=1&document=profile");
	});

	it("builds editorial handoff URLs", () => {
		expect(buildEditorialHref("profile")).toBe("/admin/content?document=profile");
		expect(buildStudioSearchHref("/admin/content/studio", "profile")).toBe(
			"/admin/content/studio?document=profile",
		);
		expect(buildStudioIntentHref("/admin/content/studio", "profileDoc", "profile")).toBe(
			"/admin/content/studio/intent/edit/id=profileDoc;type=profile/",
		);
	});

	it("reads preview state from URL search strings", () => {
		expect(parsePreviewSearch("?preview=1&document=caseStudy")).toEqual({
			enabled: true,
			document: "caseStudy",
		});
	});
});
