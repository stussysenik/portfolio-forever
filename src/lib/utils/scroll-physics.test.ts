import { describe, it, expect } from "vitest";
import { getParallaxMultiplier, getScrollBehavior } from "./scroll-physics";

describe("getParallaxMultiplier", () => {
	it("returns 0.1 for spring (matches current hardcoded value)", () => {
		expect(getParallaxMultiplier("spring")).toBe(0.1);
	});

	it("returns 0 for frictionless (disables parallax)", () => {
		expect(getParallaxMultiplier("frictionless")).toBe(0);
	});

	it("returns 0.25 for string (exaggerated parallax)", () => {
		expect(getParallaxMultiplier("string")).toBe(0.25);
	});
});

describe("getScrollBehavior", () => {
	it("returns smooth for spring", () => {
		expect(getScrollBehavior("spring")).toBe("smooth");
	});

	it("returns auto for frictionless (instant)", () => {
		expect(getScrollBehavior("frictionless")).toBe("auto");
	});

	it("returns smooth for string", () => {
		expect(getScrollBehavior("string")).toBe("smooth");
	});
});
