import { describe, it, expect } from 'vitest';
import { getContrastColor, getHighlightTextColor } from './contrast';

describe('getContrastColor', () => {
	it('returns dark text for light backgrounds', () => {
		expect(getContrastColor('#ffffff')).toBe('#1a1a1a');
		expect(getContrastColor('#f5f5dc')).toBe('#1a1a1a'); // beige
		expect(getContrastColor('#ffeb3b')).toBe('#1a1a1a'); // yellow
	});

	it('returns light text for dark backgrounds', () => {
		expect(getContrastColor('#000000')).toBe('#ffffff');
		expect(getContrastColor('#1a1a1a')).toBe('#ffffff');
		expect(getContrastColor('#2d2d2d')).toBe('#ffffff');
	});

	it('handles 3-digit hex', () => {
		expect(getContrastColor('#fff')).toBe('#1a1a1a');
		expect(getContrastColor('#000')).toBe('#ffffff');
	});
});

describe('getHighlightTextColor', () => {
	it('returns appropriate contrast for all featured colors', () => {
		const colors = ['yellow', 'green', 'electric-green', 'orange', 'ocean', 'gold', 'pink', 'cloud', 'red'];
		for (const color of colors) {
			const result = getHighlightTextColor(color);
			expect(result).toMatch(/^#[0-9a-f]{6}$/i);
		}
	});

	it('returns null for undefined featured', () => {
		expect(getHighlightTextColor(undefined)).toBeNull();
	});
});
