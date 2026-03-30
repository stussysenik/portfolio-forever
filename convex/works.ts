import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getVisibleWorks = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("worksEntries")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const getFullWorks = query({
	handler: async (ctx) => {
		const entries = await ctx.db.query("worksEntries").collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const createEntry = mutation({
	args: {
		title: v.string(),
		url: v.string(),
		category: v.optional(v.string()),
		preview: v.optional(v.string()),
		viewport: v.optional(v.number()),
		cam: v.optional(v.string()),
		description: v.optional(v.string()),
		tools: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		month: v.optional(v.number()),
		featured: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("worksEntries", args);
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("worksEntries"),
		title: v.optional(v.string()),
		url: v.optional(v.string()),
		category: v.optional(v.string()),
		preview: v.optional(v.string()),
		viewport: v.optional(v.number()),
		cam: v.optional(v.string()),
		description: v.optional(v.string()),
		tools: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		month: v.optional(v.number()),
		featured: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("worksEntries") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("worksEntries") },
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
			id: v.id("worksEntries"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			await ctx.db.patch(id, { order });
		}
	},
});
