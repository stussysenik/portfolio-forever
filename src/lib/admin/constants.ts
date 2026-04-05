export const VIEW_MODES = ['grid', 'case-study', 'minimal-list'] as const;

/** Strip Convex system fields (_id, _creationTime) before passing to mutations */
export function stripConvexMeta<T extends Record<string, any>>(doc: T): Omit<T, '_id' | '_creationTime'> {
	const { _id, _creationTime, ...rest } = doc;
	return rest;
}

/** Default values for admin controls — used by ResetButton and ChangeBadge */
export const DEFAULTS = {
	hero: {
		heroNameSize: 3.5,
		heroNameWeight: 400,
		heroNameLetterSpacing: 0,
		heroNameLineHeight: 1.2,
		heroNameTextWrap: 'wrap',
	},
	siteConfig: {
		mode: 'multi-page',
		parallaxSpeed: 0.5,
	},
} as const;

/** Standardized line height scale */
export const LINE_HEIGHT_SCALE = [1, 1.15, 1.25, 1.375, 1.5, 1.625, 1.75, 2] as const;

/** Standardized font size scale (rem) */
export const FONT_SIZE_SCALE = [
	{ id: '2xs', rem: 0.625 }, { id: 'xs', rem: 0.75 }, { id: 'sm', rem: 0.875 },
	{ id: 'base', rem: 1 }, { id: 'lg', rem: 1.125 }, { id: 'xl', rem: 1.25 },
	{ id: '2xl', rem: 1.5 }, { id: '3xl', rem: 1.875 }, { id: '4xl', rem: 2.25 },
	{ id: '5xl', rem: 3 }, { id: '6xl', rem: 3.75 }, { id: 'display', rem: 4.5 },
] as const;

/** Default typography values for non-hero sections */
export const TYPOGRAPHY_DEFAULTS = {
	fontSize: 1,
	fontWeight: 400,
	letterSpacing: 0,
	lineHeight: 1.5,
} as const;

/** Flag categories for paginated sidebar display */
export const FLAG_CATEGORIES = [
	{
		id: 'visual',
		label: 'Visual',
		flags: ['pixel-engine', 'ascii-donut', 'parallax', 'terminal-matrix'],
	},
	{
		id: 'layout',
		label: 'Layout',
		flags: ['view-transitions', 'wip-banner', 'elevator'],
	},
	{
		id: 'system',
		label: 'System',
		flags: ['os-desktop', 'social-links', 'command-palette'],
	},
] as const;

/** Relative time formatting for change badges */
export function formatRelativeTime(timestamp: number): string {
	const diff = Date.now() - timestamp;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return 'just now';
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d ago`;
	return `${Math.floor(days / 30)}mo ago`;
}
