import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getVisibleMinor = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("minorEntries")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const getFullMinor = query({
	handler: async (ctx) => {
		const entries = await ctx.db.query("minorEntries").collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const getByCategory = query({
	args: { category: v.string() },
	handler: async (ctx, { category }) => {
		return await ctx.db
			.query("minorEntries")
			.withIndex("by_category_and_order", (q) => q.eq("category", category))
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
	},
});

export const createEntry = mutation({
	args: {
		category: v.string(),
		text: v.string(),
		year: v.optional(v.number()),
		note: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("minorEntries", args);
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("minorEntries"),
		category: v.optional(v.string()),
		text: v.optional(v.string()),
		year: v.optional(v.number()),
		note: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("minorEntries") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("minorEntries") },
	handler: async (ctx, { id }) => {
		const entry = await ctx.db.get(id);
		if (entry) {
			await ctx.db.patch(id, { visible: !entry.visible });
		}
	},
});

export const reorderEntries = mutation({
	args: {
		updates: v.array(v.object({
			id: v.id("minorEntries"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			await ctx.db.patch(id, { order });
		}
	},
});
