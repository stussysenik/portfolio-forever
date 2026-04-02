import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/** All pages sorted by navOrder */
export const getAll = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("pages")
			.withIndex("by_navOrder")
			.collect();
	},
});

/** Single page by pageId */
export const getByPageId = query({
	args: { pageId: v.string() },
	handler: async (ctx, { pageId }) => {
		return await ctx.db
			.query("pages")
			.withIndex("by_pageId", (q) => q.eq("pageId", pageId))
			.unique();
	},
});

/** Nav items: visible pages sorted by navOrder */
export const getNavItems = query({
	args: {},
	handler: async (ctx) => {
		const pages = await ctx.db
			.query("pages")
			.withIndex("by_navOrder")
			.collect();
		return pages
			.filter((p) => p.navVisible && p.visible)
			.map((p) => ({
				pageId: p.pageId,
				label: p.navLabel ?? p.label,
				route: p.route,
				navOrder: p.navOrder,
			}));
	},
});

/** Create or update a page */
export const upsert = mutation({
	args: {
		pageId: v.string(),
		label: v.string(),
		route: v.string(),
		navLabel: v.optional(v.string()),
		navOrder: v.number(),
		navVisible: v.boolean(),
		visible: v.boolean(),
		sections: v.array(v.object({
			sectionType: v.string(),
			config: v.any(),
			dataTable: v.optional(v.string()),
			order: v.number(),
			themeOverrides: v.optional(v.any()),
			spacingBefore: v.optional(v.number()),
			spacingAfter: v.optional(v.number()),
		})),
		themeOverrides: v.optional(v.any()),
		meta: v.optional(v.object({
			title: v.optional(v.string()),
			description: v.optional(v.string()),
			ogImage: v.optional(v.string()),
		})),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("pages")
			.withIndex("by_pageId", (q) => q.eq("pageId", args.pageId))
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, args);
			return existing._id;
		}
		return await ctx.db.insert("pages", args);
	},
});

/** Update sections array for a page */
export const updateSections = mutation({
	args: {
		pageId: v.string(),
		sections: v.array(v.object({
			sectionType: v.string(),
			config: v.any(),
			dataTable: v.optional(v.string()),
			order: v.number(),
			themeOverrides: v.optional(v.any()),
			spacingBefore: v.optional(v.number()),
			spacingAfter: v.optional(v.number()),
		})),
	},
	handler: async (ctx, { pageId, sections }) => {
		const page = await ctx.db
			.query("pages")
			.withIndex("by_pageId", (q) => q.eq("pageId", pageId))
			.unique();
		if (!page) throw new Error(`Page "${pageId}" not found`);
		await ctx.db.patch(page._id, { sections });
	},
});

/** Reorder sections within a page (lightweight — just updates order) */
export const reorderSections = mutation({
	args: {
		pageId: v.string(),
		sectionOrder: v.array(v.number()),  // array of current indices in new order
	},
	handler: async (ctx, { pageId, sectionOrder }) => {
		const page = await ctx.db
			.query("pages")
			.withIndex("by_pageId", (q) => q.eq("pageId", pageId))
			.unique();
		if (!page) throw new Error(`Page "${pageId}" not found`);

		const reordered = sectionOrder.map((oldIndex, newOrder) => ({
			...page.sections[oldIndex],
			order: newOrder,
		}));
		await ctx.db.patch(page._id, { sections: reordered });
	},
});

/** Update config for a single section within a page */
export const updateSectionConfig = mutation({
	args: {
		pageId: v.string(),
		sectionIndex: v.number(),
		config: v.any(),
	},
	handler: async (ctx, { pageId, sectionIndex, config }) => {
		const page = await ctx.db
			.query("pages")
			.withIndex("by_pageId", (q) => q.eq("pageId", pageId))
			.unique();
		if (!page) throw new Error(`Page "${pageId}" not found`);
		if (sectionIndex < 0 || sectionIndex >= page.sections.length) {
			throw new Error(`Section index ${sectionIndex} out of bounds`);
		}

		const sections = [...page.sections];
		sections[sectionIndex] = {
			...sections[sectionIndex],
			config: { ...sections[sectionIndex].config, ...config },
		};
		await ctx.db.patch(page._id, { sections });
	},
});

/** Update spacing for a section within a page */
export const updateSectionSpacing = mutation({
	args: {
		pageId: v.string(),
		sectionIndex: v.number(),
		spacingBefore: v.optional(v.number()),
		spacingAfter: v.optional(v.number()),
	},
	handler: async (ctx, { pageId, sectionIndex, ...spacing }) => {
		const page = await ctx.db
			.query("pages")
			.withIndex("by_pageId", (q) => q.eq("pageId", pageId))
			.unique();
		if (!page) throw new Error(`Page "${pageId}" not found`);
		if (sectionIndex < 0 || sectionIndex >= page.sections.length) {
			throw new Error(`Section index ${sectionIndex} out of bounds`);
		}

		const sections = [...page.sections];
		sections[sectionIndex] = { ...sections[sectionIndex], ...spacing };
		await ctx.db.patch(page._id, { sections });
	},
});

/** Update themeOverrides (CSS box model properties) for a section */
export const updateSectionThemeOverrides = mutation({
	args: {
		pageId: v.string(),
		sectionIndex: v.number(),
		themeOverrides: v.any(),
	},
	handler: async (ctx, { pageId, sectionIndex, themeOverrides }) => {
		const page = await ctx.db
			.query("pages")
			.withIndex("by_pageId", (q) => q.eq("pageId", pageId))
			.unique();
		if (!page) throw new Error(`Page "${pageId}" not found`);
		if (sectionIndex < 0 || sectionIndex >= page.sections.length) {
			throw new Error(`Section index ${sectionIndex} out of bounds`);
		}

		const sections = [...page.sections];
		sections[sectionIndex] = {
			...sections[sectionIndex],
			themeOverrides: { ...sections[sectionIndex].themeOverrides, ...themeOverrides },
		};
		await ctx.db.patch(page._id, { sections });
	},
});

/** Delete a page */
export const deletePage = mutation({
	args: { pageId: v.string() },
	handler: async (ctx, { pageId }) => {
		const page = await ctx.db
			.query("pages")
			.withIndex("by_pageId", (q) => q.eq("pageId", pageId))
			.unique();
		if (page) await ctx.db.delete(page._id);
	},
});

/** Known pages — canonical set matching the frontend section registry */
const KNOWN_PAGES = [
	{ pageId: "home", label: "Home", route: "/", navOrder: 0, navVisible: false, sectionType: "hero", dataTable: undefined },
	{ pageId: "works", label: "Works", route: "/works", navOrder: 1, navVisible: true, sectionType: "works-grid", dataTable: "worksEntries" },
	{ pageId: "blog", label: "Blog", route: "/blog", navOrder: 2, navVisible: true, sectionType: "blog-feed", dataTable: "blogPosts" },
	{ pageId: "cv", label: "CV", route: "/cv", navOrder: 3, navVisible: true, sectionType: "cv", dataTable: "cvEntries" },
	{ pageId: "academia", label: "re:mix", route: "/academia", navOrder: 4, navVisible: true, sectionType: "academia", dataTable: "academicEntries" },
	{ pageId: "terminal", label: "Terminal", route: "/terminal", navOrder: 5, navVisible: true, sectionType: "terminal", dataTable: undefined },
	{ pageId: "process", label: "Process", route: "/process", navOrder: 6, navVisible: true, sectionType: "process", dataTable: undefined },
	{ pageId: "talks", label: "Talks", route: "/talks", navOrder: 7, navVisible: true, sectionType: "timeline", dataTable: "talksEntries" },
	{ pageId: "likes", label: "Likes", route: "/likes", navOrder: 8, navVisible: true, sectionType: "likes", dataTable: "likesCategories" },
	{ pageId: "gifts", label: "Gifts", route: "/gifts", navOrder: 9, navVisible: true, sectionType: "gifts", dataTable: "giftsConfig" },
	{ pageId: "gallery", label: "Gallery", route: "/gallery", navOrder: 10, navVisible: true, sectionType: "gallery", dataTable: "galleryItems" },
	{ pageId: "labs", label: "Labs", route: "/labs", navOrder: 11, navVisible: true, sectionType: "labs", dataTable: "labEntries" },
	{ pageId: "minor", label: "Minor", route: "/minor", navOrder: 12, navVisible: true, sectionType: "minor", dataTable: "minorEntries" },
	{ pageId: "os", label: "OS", route: "/os", navOrder: 13, navVisible: false, sectionType: "os", dataTable: undefined },
];

/** Public seed — ensures pages exist (idempotent). Uses hardcoded list + sectionRegistry fallback. */
export const ensureSeeded = mutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query("pages").take(2);
		// If more than just "Home" exists, already fully seeded
		if (existing.length > 1) return;

		// Delete the lone Home page if it's the only one (incomplete seed)
		if (existing.length === 1 && existing[0].pageId === "home") {
			await ctx.db.delete(existing[0]._id);
		}

		// Seed all known pages
		for (const pg of KNOWN_PAGES) {
			const exists = await ctx.db
				.query("pages")
				.withIndex("by_pageId", (q) => q.eq("pageId", pg.pageId))
				.unique();
			if (exists) continue;

			await ctx.db.insert("pages", {
				pageId: pg.pageId,
				label: pg.label,
				route: pg.route,
				navOrder: pg.navOrder,
				navVisible: pg.navVisible,
				visible: true,
				sections: [{
					sectionType: pg.sectionType,
					config: {},
					dataTable: pg.dataTable,
					order: 0,
				}],
			});
		}
	},
});

/** Seed pages from sectionRegistry (idempotent) — internal version */
export const seedFromRegistry = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query("pages").take(1);
		if (existing.length > 0) return; // Already seeded

		const sections = await ctx.db
			.query("sectionRegistry")
			.withIndex("by_order")
			.collect();

		// Add home page first
		await ctx.db.insert("pages", {
			pageId: "home",
			label: "Home",
			route: "/",
			navOrder: 0,
			navVisible: false,
			visible: true,
			sections: [{
				sectionType: "hero",
				config: { layout: "default" },
				order: 0,
			}],
		});

		// Create pages from registry
		for (const section of sections) {
			await ctx.db.insert("pages", {
				pageId: section.sectionId,
				label: section.label,
				route: section.route,
					navOrder: section.order,
				navVisible: section.visible,
				visible: section.visible,
				sections: [{
					sectionType: section.sectionId,
					config: { viewMode: section.viewMode },
					dataTable: section.dataTable,
					order: 0,
				}],
			});
		}
	},
});
