/**
 * Admin Section Editor Registry
 *
 * Maps section type IDs to their admin editor metadata:
 * - columns: table column definitions for EntryTable
 * - mutations: Convex mutation paths for CRUD
 * - defaultConfig: default section config when creating
 */

export interface SectionEditorDef {
	columns?: Array<{ key: string; label: string; width?: string }>;
	mutations?: {
		create?: string;
		update?: string;
		delete?: string;
		toggleVisibility?: string;
		reorder?: string;
		getFull?: string;
	};
	defaultConfig: Record<string, any>;
}

export const sectionEditors: Record<string, SectionEditorDef> = {
	'hero': {
		columns: [
			{ key: 'title', label: 'Case Study' },
			{ key: 'role', label: 'Role', width: '80px' },
		],
		mutations: {
			create: 'heroCaseStudies:createEntry',
			update: 'heroCaseStudies:updateEntry',
			delete: 'heroCaseStudies:deleteEntry',
			toggleVisibility: 'heroCaseStudies:toggleVisibility',
			getFull: 'heroCaseStudies:getFull',
		},
		defaultConfig: { layout: 'default' },
	},
	'works-grid': {
		columns: [
			{ key: 'title', label: 'Title' },
			{ key: 'category', label: 'Cat', width: '60px' },
			{ key: 'year', label: 'Year', width: '40px' },
		],
		mutations: {
			create: 'works:createEntry',
			update: 'works:updateEntry',
			delete: 'works:deleteEntry',
			toggleVisibility: 'works:toggleVisibility',
			reorder: 'works:reorderEntries',
			getFull: 'works:getFullWorks',
		},
		defaultConfig: { viewMode: 'grid' },
	},
	'blog-feed': {
		columns: [
			{ key: 'title', label: 'Title' },
			{ key: 'slug', label: 'Slug', width: '80px' },
		],
		mutations: {
			create: 'blog:createPost',
			update: 'blog:updatePost',
			delete: 'blog:deletePost',
			toggleVisibility: 'blog:toggleVisibility',
			getFull: 'blog:getFullPosts',
		},
		defaultConfig: {},
	},
	'cv': {
		columns: [
			{ key: 'title', label: 'Title' },
			{ key: 'type', label: 'Type', width: '60px' },
		],
		mutations: {
			create: 'cv:createEntry',
			update: 'cv:updateEntry',
			delete: 'cv:deleteEntry',
			toggleVisibility: 'cv:toggleVisibility',
			reorder: 'cv:reorderEntries',
			getFull: 'cv:getFullCV',
		},
		defaultConfig: {},
	},
	'gallery': {
		columns: [
			{ key: 'title', label: 'Title' },
			{ key: 'category', label: 'Cat', width: '60px' },
		],
		mutations: {
			create: 'gallery:createEntry',
			update: 'gallery:updateEntry',
			delete: 'gallery:deleteEntry',
			toggleVisibility: 'gallery:toggleVisibility',
			reorder: 'gallery:reorderEntries',
			getFull: 'gallery:getFullGallery',
		},
		defaultConfig: {},
	},
	'timeline': {
		columns: [
			{ key: 'title', label: 'Title' },
			{ key: 'entryType', label: 'Type', width: '60px' },
			{ key: 'year', label: 'Year', width: '40px' },
		],
		mutations: {
			create: 'talks:createEntry',
			update: 'talks:updateEntry',
			delete: 'talks:deleteEntry',
			toggleVisibility: 'talks:toggleVisibility',
			reorder: 'talks:reorderEntries',
			getFull: 'talks:getFullTalks',
		},
		defaultConfig: {},
	},
	'academia': {
		columns: [
			{ key: 'title', label: 'Title' },
			{ key: 'venue', label: 'Venue', width: '80px' },
		],
		mutations: {
			create: 'academia:createEntry',
			update: 'academia:updateEntry',
			delete: 'academia:deleteEntry',
			toggleVisibility: 'academia:toggleVisibility',
			reorder: 'academia:reorderEntries',
			getFull: 'academia:getFullAcademia',
		},
		defaultConfig: {},
	},
	'likes': {
		columns: [
			{ key: 'title', label: 'Category' },
		],
		mutations: {
			create: 'likes:createCategory',
			update: 'likes:updateCategory',
			delete: 'likes:deleteCategory',
			toggleVisibility: 'likes:toggleVisibility',
			reorder: 'likes:reorderCategories',
			getFull: 'likes:getFullLikes',
		},
		defaultConfig: {},
	},
	'minor': {
		columns: [
			{ key: 'text', label: 'Text' },
			{ key: 'category', label: 'Cat', width: '60px' },
			{ key: 'year', label: 'Year', width: '40px' },
		],
		mutations: {
			create: 'minor:createEntry',
			update: 'minor:updateEntry',
			delete: 'minor:deleteEntry',
			toggleVisibility: 'minor:toggleVisibility',
			reorder: 'minor:reorderEntries',
			getFull: 'minor:getFullMinor',
		},
		defaultConfig: {},
	},
	'labs': {
		columns: [
			{ key: 'title', label: 'Title' },
			{ key: 'status', label: 'Status', width: '60px' },
		],
		mutations: {
			create: 'labs:createEntry',
			update: 'labs:updateEntry',
			delete: 'labs:deleteEntry',
			toggleVisibility: 'labs:toggleVisibility',
			reorder: 'labs:reorderEntries',
			getFull: 'labs:getFullLabs',
		},
		defaultConfig: {},
	},
	'gifts': {
		defaultConfig: {},
	},
	'terminal': {
		mutations: {
			update: 'terminal:upsertTerminalConfig',
			getFull: 'terminal:getTerminalConfig',
		},
		defaultConfig: {},
	},
	'process': {
		mutations: {
			update: 'process:upsertProcessConfig',
			getFull: 'process:getProcessConfig',
		},
		defaultConfig: {},
	},
	'os': {
		mutations: {
			update: 'os:upsertOsConfig',
			getFull: 'os:getOsConfig',
		},
		defaultConfig: {},
	},
};
