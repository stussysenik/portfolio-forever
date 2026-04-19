/**
 * Section Type Registry
 *
 * Maps section type IDs to their Svelte component, metadata, and category.
 * Used by the page composer to render sections and the "+ Add Section" picker.
 *
 * Section types are code-defined (Svelte components), but section instances
 * are data-defined (Convex documents in the pages.sections array).
 */

export interface SectionTypeDef {
	label: string;
	icon: string;
	category: 'content' | 'media' | 'layout';
	dataTable?: string;
	hasComponent?: boolean;  // defaults to true if omitted
	componentKey?: string;   // maps to the component lookup key; defaults to the record key
}

export const sectionTypeRegistry: Record<string, SectionTypeDef> = {
	// Content sections
	'hero':        { label: 'Hero',        icon: '◉', category: 'content' },
	'works-grid':  { label: 'Works Grid',  icon: '▦', category: 'content', dataTable: 'worksEntries', componentKey: 'works' },
	'colorful-works': { label: 'Colorful Works', icon: '★', category: 'content', dataTable: 'worksEntries', componentKey: 'works' },
	'timeline':    { label: 'Timeline',    icon: '≡', category: 'content', dataTable: 'talksEntries', componentKey: 'talks' },
	'card-list':   { label: 'Card List',   icon: '▤', category: 'content', hasComponent: false },
	'blog-feed':   { label: 'Blog Feed',   icon: '¶', category: 'content', dataTable: 'blogPosts', componentKey: 'blog' },
	'gallery':     { label: 'Gallery',     icon: '▣', category: 'content', dataTable: 'galleryItems' },
	'academia':    { label: 'Re:mix',      icon: '◈', category: 'content', dataTable: 'academicEntries' },
	'likes':       { label: 'Likes',       icon: '♥', category: 'content', dataTable: 'likesCategories' },
	'minor':       { label: 'Minor',       icon: '·', category: 'content', dataTable: 'minorEntries' },
	'labs':        { label: 'Labs',        icon: '⚗', category: 'content', dataTable: 'labEntries' },
	'gifts':       { label: 'Gifts',       icon: '✦', category: 'content', dataTable: 'giftsConfig' },
	'cv':          { label: 'CV',          icon: '≡', category: 'content', dataTable: 'cvEntries' },
	'terminal':    { label: 'Terminal',    icon: '>', category: 'content', dataTable: 'terminalConfig' },
	'process':     { label: 'Process',     icon: '⟳', category: 'content', dataTable: 'processConfig' },
	'os':          { label: 'OS',          icon: '⊞', category: 'content', dataTable: 'osConfig' },

	// Media sections (Phase 5 — stubs for now)
	'media-block': { label: 'Media Block', icon: '▶', category: 'media', hasComponent: false },
	'video-reel':  { label: 'Video Reel',  icon: '▷', category: 'media', hasComponent: false },

	// Layout sections
	'text-block':  { label: 'Text Block',  icon: 'T', category: 'layout', hasComponent: false },
	'spacer':      { label: 'Spacer',      icon: '↕', category: 'layout', hasComponent: false },
	'divider':     { label: 'Divider',     icon: '—', category: 'layout', hasComponent: false },
};

/** Get all section types grouped by category (excludes stubs without components) */
export function getSectionTypesByCategory() {
	const grouped: Record<string, Array<{ id: string } & SectionTypeDef>> = {
		content: [],
		media: [],
		layout: [],
	};
	for (const [id, def] of Object.entries(sectionTypeRegistry)) {
		if (def.hasComponent === false) continue;  // skip stubs
		grouped[def.category].push({ id, ...def });
	}
	return grouped;
}

/** Get all section types including stubs (for admin reference) */
export function getAllSectionTypes() {
	return Object.entries(sectionTypeRegistry).map(([id, def]) => ({ id, ...def }));
}

/** Resolve a registry sectionType ID to its component lookup key */
export function resolveComponentKey(sectionType: string): string {
	return sectionTypeRegistry[sectionType]?.componentKey ?? sectionType;
}
