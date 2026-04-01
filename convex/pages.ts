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
