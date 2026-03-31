import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getVisibleGallery = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("galleryItems")
			.withIndex("by_order")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return entries;
	},
});

export const getFullGallery = query({
	handler: async (ctx) => {
		return await ctx.db
			.query("galleryItems")
			.withIndex("by_order")
			.collect();
	},
});

export const createEntry = mutation({
	args: {
		title: v.string(),
		thumbnailUrl: v.optional(v.string()),
		fullUrl: v.optional(v.string()),
		category: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		description: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("galleryItems", args);
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("galleryItems"),
		title: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		fullUrl: v.optional(v.string()),
		category: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		description: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("galleryItems") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("galleryItems") },
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
			id: v.id("galleryItems"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			await ctx.db.patch(id, { order });
		}
	},
});
