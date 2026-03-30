import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getVisibleAcademia = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("academicEntries")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const getFullAcademia = query({
	handler: async (ctx) => {
		const entries = await ctx.db.query("academicEntries").collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const createEntry = mutation({
	args: {
		title: v.string(),
		authors: v.string(),
		venue: v.optional(v.string()),
		year: v.number(),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		paperUrl: v.optional(v.string()),
		codeUrl: v.optional(v.string()),
		demoUrl: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("academicEntries", args);
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("academicEntries"),
		title: v.optional(v.string()),
		authors: v.optional(v.string()),
		venue: v.optional(v.string()),
		year: v.optional(v.number()),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		paperUrl: v.optional(v.string()),
		codeUrl: v.optional(v.string()),
		demoUrl: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("academicEntries") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("academicEntries") },
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
			id: v.id("academicEntries"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			await ctx.db.patch(id, { order });
		}
	},
});
