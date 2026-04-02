import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/** Return all sections sorted by order */
export const getAll = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("sectionRegistry")
			.withIndex("by_order")
			.collect();
	},
});

/** Create or update a section by sectionId */
export const upsert = mutation({
	args: {
		sectionId: v.string(),
		label: v.string(),
		route: v.string(),
		order: v.number(),
		visible: v.boolean(),
		adminVisible: v.boolean(),
		viewMode: v.string(),
		animationBg: v.string(),
		animationSpeed: v.number(),
		animationOpacity: v.number(),
		immune: v.boolean(),
		cellSpan: v.number(),
		cellAspect: v.string(),
		previewType: v.string(),
		dataTable: v.optional(v.string()),
		accentColor: v.string(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("sectionRegistry")
			.withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
			.unique();

		if (existing) {
			const trackableFields = ['viewMode', 'animationBg', 'animationSpeed', 'animationOpacity'] as const;
			for (const field of trackableFields) {
				if (args[field] !== undefined && existing[field] !== args[field]) {
					await ctx.db.insert("adminHistory", {
						table: "sectionRegistry",
						field,
						oldValue: existing[field] ?? null,
						newValue: args[field],
						timestamp: Date.now(),
					});
				}
			}
			await ctx.db.patch(existing._id, args);
			return existing._id;
		}

		return await ctx.db.insert("sectionRegistry", args);
	},
});

/** Reorder sections — takes an array of { id, order } updates */
export const reorder = mutation({
	args: {
		updates: v.array(
			v.object({
				id: v.id("sectionRegistry"),
				order: v.number(),
			}),
		),
	},
	handler: async (ctx, args) => {
		for (const update of args.updates) {
			await ctx.db.patch(update.id, { order: update.order });
		}
	},
});

/** Return a single section by its sectionId */
export const getBySectionId = query({
	args: { sectionId: v.string() },
	handler: async (ctx, { sectionId }) => {
		return await ctx.db
			.query("sectionRegistry")
			.withIndex("by_sectionId", (q) => q.eq("sectionId", sectionId))
			.unique();
	},
});

/** Toggle visible and/or adminVisible by _id */
export const toggleVisibility = mutation({
	args: {
		id: v.id("sectionRegistry"),
		field: v.union(v.literal("visible"), v.literal("adminVisible")),
	},
	handler: async (ctx, args) => {
		const section = await ctx.db.get(args.id);
		if (!section) {
			throw new Error("Section not found");
		}

		await ctx.db.patch(args.id, {
			[args.field]: !section[args.field],
		});
	},
});
