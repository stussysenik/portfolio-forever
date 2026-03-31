import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getVisibleLabs = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("labEntries")
			.withIndex("by_order")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return entries;
	},
});

export const getFullLabs = query({
	handler: async (ctx) => {
		return await ctx.db
			.query("labEntries")
			.withIndex("by_order")
			.collect();
	},
});

export const createEntry = mutation({
	args: {
		title: v.string(),
		slug: v.optional(v.string()),
		description: v.string(),
		status: v.union(
			v.literal("stable"),
			v.literal("beta"),
			v.literal("experimental"),
			v.literal("archived"),
		),
		date: v.string(),
		sourceUrl: v.optional(v.string()),
		entryPoint: v.optional(v.string()),
		fallbackImage: v.optional(v.string()),
		tags: v.array(v.string()),
		memoryBudget: v.number(),
		requiredFeatures: v.array(v.string()),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("labEntries", args);
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("labEntries"),
		title: v.optional(v.string()),
		slug: v.optional(v.string()),
		description: v.optional(v.string()),
		status: v.optional(v.union(
			v.literal("stable"),
			v.literal("beta"),
			v.literal("experimental"),
			v.literal("archived"),
		)),
		date: v.optional(v.string()),
		sourceUrl: v.optional(v.string()),
		entryPoint: v.optional(v.string()),
		fallbackImage: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		memoryBudget: v.optional(v.number()),
		requiredFeatures: v.optional(v.array(v.string())),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("labEntries") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("labEntries") },
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
			id: v.id("labEntries"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			await ctx.db.patch(id, { order });
		}
	},
});
