import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getVisibleTalks = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("talksEntries")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const getFullTalks = query({
	handler: async (ctx) => {
		const entries = await ctx.db.query("talksEntries").collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const createEntry = mutation({
	args: {
		title: v.string(),
		entryType: v.union(v.literal("talk"), v.literal("interview")),
		year: v.number(),
		month: v.optional(v.number()),
		description: v.optional(v.string()),
		links: v.optional(v.array(v.object({
			label: v.string(),
			url: v.string(),
		}))),
		featured: v.optional(v.string()),
		category: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("talksEntries", args);
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("talksEntries"),
		title: v.optional(v.string()),
		entryType: v.optional(v.union(v.literal("talk"), v.literal("interview"))),
		year: v.optional(v.number()),
		month: v.optional(v.number()),
		description: v.optional(v.string()),
		links: v.optional(v.array(v.object({
			label: v.string(),
			url: v.string(),
		}))),
		featured: v.optional(v.string()),
		category: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("talksEntries") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("talksEntries") },
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
			id: v.id("talksEntries"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			await ctx.db.patch(id, { order });
		}
	},
});
