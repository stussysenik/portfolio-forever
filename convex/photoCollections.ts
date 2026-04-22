import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined, logHistory } from "./helpers";

export const getVisible = query({
	handler: async (ctx) => {
		const collections = await ctx.db
			.query("photoCollections")
			.withIndex("by_visible", (q) => q.eq("visible", true))
			.collect();
		
		return await Promise.all(
			collections.map(async (c) => ({
				...c,
				coverAsset: c.coverAssetId ? await ctx.db.get(c.coverAssetId) : null,
			}))
		);
	},
});

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const collection = await ctx.db
			.query("photoCollections")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.unique();
		
		if (!collection) return null;

		return {
			...collection,
			assets: await Promise.all(
				collection.assetIds.map(async (id) => await ctx.db.get(id))
			),
		};
	},
});

export const getAll = query({
	handler: async (ctx) => {
		return await ctx.db.query("photoCollections").collect();
	},
});

export const update = mutation({
	args: {
		id: v.id("photoCollections"),
		slug: v.optional(v.string()),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		coverAssetId: v.optional(v.id("mediaAssets")),
		assetIds: v.optional(v.array(v.id("mediaAssets"))),
		layout: v.optional(v.union(
			v.literal("masonry"),
			v.literal("grid"),
			v.literal("filmstrip"),
			v.literal("editorial"),
		)),
		visible: v.optional(v.boolean()),
		order: v.optional(v.number()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const old = await ctx.db.get(id);
		const patch = stripUndefined(fields);
		await ctx.db.patch(id, patch);
		for (const [field, newValue] of Object.entries(patch)) {
			await logHistory(ctx, { table: "photoCollections", field, oldValue: old ? (old as any)[field] : null, newValue });
		}
	},
});

export const remove = mutation({
	args: { id: v.id("photoCollections") },
	handler: async (ctx, { id }) => {
		const old = await ctx.db.get(id);
		await ctx.db.delete(id);
		await logHistory(ctx, { table: "photoCollections", field: "delete", oldValue: old, newValue: null });
	},
});
