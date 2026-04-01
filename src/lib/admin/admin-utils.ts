/** Keyboard handler for a11y on clickable non-button elements */
export function a11yClick(handler: () => void) {
	return (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
	};
}

/** Generic reorder via swap — works with any Convex reorder mutation */
export async function reorderEntry(
	entries: any[],
	id: string,
	direction: -1 | 1,
	client: any,
	mutation: any,
) {
	const sorted = [...entries].sort((a, b) => a.order - b.order);
	const idx = sorted.findIndex((e: any) => e._id === id);
	const swapIdx = idx + direction;
	if (swapIdx < 0 || swapIdx >= sorted.length) return;
	await client.mutation(mutation, {
		updates: [
			{ id: sorted[idx]._id, order: swapIdx },
			{ id: sorted[swapIdx]._id, order: idx },
		],
	});
}

/** Parse edit buffer value based on field type */
export function parseFieldValue(
	field: string,
	raw: string,
	opts: { arrays?: string[]; numbers?: string[] } = {},
): any {
	if (opts.arrays?.includes(field)) {
		return raw.split(',').map(s => s.trim()).filter(Boolean);
	}
	if (opts.numbers?.includes(field)) {
		return parseFloat(raw) || 0;
	}
	return raw;
}

/** Named color palette — the canonical set for featured/accent colors */
export const NAMED_COLORS = [
	'orange', 'green', 'electric-green', 'ocean', 'gold', 'pink', 'cloud', 'red', 'yellow',
] as const;

export type NamedColor = typeof NAMED_COLORS[number];

/** CSS custom property for a named color */
export const COLOR_CSS: Record<NamedColor, string> = {
	orange: '#F97242',
	green: '#44D62C',
	'electric-green': '#44D62C',
	ocean: '#B3EBF2',
	gold: '#D2AF26',
	pink: '#FFC5D3',
	cloud: '#F0EEE9',
	red: '#691424',
	yellow: '#D2AF26',
};

/** WYSIWYG label validation — trim only, no case changes */
export function validateLabel(raw: string): { valid: boolean; value: string; error?: string } {
	const value = raw.trim();
	if (!value) return { valid: false, value, error: 'Label cannot be empty' };
	return { valid: true, value };
}

/** Route validation — must start with /, lowercase, hyphens/colons allowed */
export function validateRoute(raw: string): { valid: boolean; value: string; error?: string } {
	const value = raw.trim();
	if (!value) return { valid: false, value, error: 'Route cannot be empty' };
	if (!/^\/[a-z0-9\-:]*$/.test(value)) {
		return { valid: false, value, error: 'Route must start with / and contain only lowercase letters, numbers, hyphens, colons' };
	}
	return { valid: true, value };
}
