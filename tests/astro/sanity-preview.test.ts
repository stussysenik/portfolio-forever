import { describe, expect, it } from "vitest";
import { getSanityPreviewState } from "../../src/lib/server/sanity-preview";

describe("sanity preview state", () => {
	it("treats the preview query flag as UI-only preview without draft cookies", () => {
		const state = getSanityPreviewState({
			url: new URL("http://localhost:4321/cv?preview=1&document=profile"),
			cookies: {
				get: () => undefined,
			},
		});

		expect(state.previewEnabled).toBe(true);
		expect(state.draftModeEnabled).toBe(false);
		expect(state.document).toBe("profile");
		expect(state.perspective).toBe("drafts");
	});

	it("enables draft mode when the Sanity perspective cookie is present", () => {
		const state = getSanityPreviewState({
			url: new URL("http://localhost:4321/"),
			cookies: {
				get: (name: string) =>
					name === "sanity-preview-perspective" ? { value: "published" } : undefined,
			},
		});

		expect(state.previewEnabled).toBe(true);
		expect(state.draftModeEnabled).toBe(true);
		expect(state.perspective).toBe("published");
	});
});
