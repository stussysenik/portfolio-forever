/**
 * WCAG contrast utilities for accessible text on colored backgrounds.
 *
 * Parses hex colors, computes relative luminance per WCAG 2.1,
 * and returns a dark or light text color to meet AA contrast (4.5:1).
 */

/** Convert a hex color (#RGB or #RRGGBB) to linear-light sRGB channels [0..1]. */
function hexToLinearRGB(hex: string): [number, number, number] {
	const h = hex.replace('#', '');
	const full = h.length === 3
		? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
		: h;
	const r = parseInt(full.slice(0, 2), 16) / 255;
	const g = parseInt(full.slice(2, 4), 16) / 255;
	const b = parseInt(full.slice(4, 6), 16) / 255;

	// sRGB to linear
	const linearize = (c: number) =>
		c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

	return [linearize(r), linearize(g), linearize(b)];
}

/** Relative luminance per WCAG 2.1 (0 = black, 1 = white). */
function relativeLuminance(hex: string): number {
	const [r, g, b] = hexToLinearRGB(hex);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two luminances (always >= 1). */
function contrastRatio(l1: number, l2: number): number {
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

const DARK = '#1a1a1a';
const LIGHT = '#ffffff';

/**
 * Return a text color (dark or light) that meets WCAG AA (4.5:1)
 * against the given hex background.
 */
export function getContrastColor(bgHex: string): string {
	const bgLum = relativeLuminance(bgHex);
	const darkRatio = contrastRatio(bgLum, relativeLuminance(DARK));
	const lightRatio = contrastRatio(bgLum, relativeLuminance(LIGHT));
	return darkRatio >= 4.5 ? DARK : lightRatio >= 4.5 ? LIGHT : (lightRatio > darkRatio ? LIGHT : DARK);
}

/**
 * Map of featured color names to their resolved hex values.
 * Must stay in sync with the CSS custom properties in app.css.
 */
const FEATURED_HEX: Record<string, string> = {
	yellow: '#fff5c2',         // hsl(50, 100%, 88%)
	green: '#cef3da',          // hsl(140, 60%, 88%)
	'electric-green': '#44D62C',
	orange: '#F97242',
	ocean: '#B3EBF2',
	gold: '#D2AF26',
	pink: '#FFC5D3',
	cloud: '#F0EEE9',
	red: '#691424',
};

/**
 * Given a featured color name from an Entry, return the appropriate
 * text color for WCAG AA contrast.
 */
export function getHighlightTextColor(featured: string | undefined): string | null {
	if (!featured) return null;
	const bg = FEATURED_HEX[featured];
	if (!bg) return null;
	return getContrastColor(bg);
}
