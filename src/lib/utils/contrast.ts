/**
 * WCAG contrast utilities for accessible text on colored backgrounds.
 * Ported from clj/portfolio/utils/contrast.cljs
 */

export const dark = "#1a1a1a";
export const light = "#ffffff";

export const featuredHex: Record<string, string> = {
	yellow: "#fff5c2",
	green: "#cef3da",
	"electric-green": "#44D62C",
	orange: "#F97242",
	ocean: "#B3EBF2",
	gold: "#D2AF26",
	pink: "#FFC5D3",
	cloud: "#F0EEE9",
	red: "#691424",
};

export function hexToLinearRgb(hex: string): [number, number, number] {
	const h = hex.replace(/^#/, "");
	const full =
		h.length === 3
			? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
			: h;
	const r = parseInt(full.slice(0, 2), 16) / 255;
	const g = parseInt(full.slice(2, 4), 16) / 255;
	const b = parseInt(full.slice(4, 6), 16) / 255;

	const linearize = (c: number) =>
		c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

	return [linearize(r), linearize(g), linearize(b)];
}

export function relativeLuminance(hex: string): number {
	const [r, g, b] = hexToLinearRgb(hex);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(l1: number, l2: number): number {
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastColor(bgHex: string): string {
	const bgLum = relativeLuminance(bgHex);
	const darkRatio = contrastRatio(bgLum, relativeLuminance(dark));
	const lightRatio = contrastRatio(bgLum, relativeLuminance(light));

	if (darkRatio >= 4.5) return dark;
	if (lightRatio >= 4.5) return light;
	return lightRatio > darkRatio ? light : dark;
}

export function getHighlightTextColor(featured?: string): string | undefined {
	if (!featured) return undefined;
	const bg = featuredHex[featured];
	if (!bg) return undefined;
	return getContrastColor(bg);
}

// Aliases for parity
export const hexToRgb = hexToLinearRgb;
export const getLuminance = relativeLuminance;
export const getContrastRatio = contrastRatio;
