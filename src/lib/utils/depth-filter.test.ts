import { describe, it, expect } from "vitest";
import { filterByDepth } from "./depth-filter";

const ALL_SECTIONS = [
	"hero", "works", "talks", "terminal", "cv", "academia",
	"blog", "process", "gallery", "likes", "minor", "gifts", "os", "labs",
];

describe("filterByDepth", () => {
	it("returns all sections for 'full' depth", () => {
		expect(filterByDepth(ALL_SECTIONS, "full")).toEqual(ALL_SECTIONS);
	});

	it("returns all sections for '15-min' depth", () => {
		expect(filterByDepth(ALL_SECTIONS, "15-min")).toEqual(ALL_SECTIONS);
	});

	it("returns only hero, works, cv for '5-min' depth", () => {
		expect(filterByDepth(ALL_SECTIONS, "5-min")).toEqual(["hero", "works", "cv"]);
	});

	it("preserves original order", () => {
		const reversed = [...ALL_SECTIONS].reverse();
		const result = filterByDepth(reversed, "5-min");
		expect(result).toEqual(["cv", "works", "hero"]);
	});

	it("handles empty sections", () => {
		expect(filterByDepth([], "5-min")).toEqual([]);
		expect(filterByDepth([], "full")).toEqual([]);
	});
});
