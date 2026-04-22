import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined, logHistory } from "./helpers";

export const getVisible = query({
	handler: async (ctx) => {
		const showcases = await ctx.db
			.query("projectShowcases")
			.withIndex("by_visible", (q) => q.eq("visible", true))
			.collect();
		
		// Hydrate media assets
		return await Promise.all(
			showcases.map(async (s) => ({
				...s,
				media: await Promise.all(
					s.media.map(async (m) => ({
						...m,
						asset: await ctx.db.get(m.assetId),
					}))
				),
			}))
		);
	},
});

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const showcase = await ctx.db
			.query("projectShowcases")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.unique();
		
		if (!showcase) return null;

		// Hydrate media assets
		return {
			...showcase,
			media: await Promise.all(
				showcase.media.map(async (m) => ({
					...m,
					asset: await ctx.db.get(m.assetId),
				}))
			),
		};
	},
});

export const getAll = query({
	handler: async (ctx) => {
		return await ctx.db.query("projectShowcases").collect();
	},
});

export const create = mutation({
	args: {
		slug: v.string(),
		title: v.string(),
		tagline: v.optional(v.string()),
		description: v.string(),
		githubUrl: v.optional(v.string()),
		liveUrl: v.optional(v.string()),
		languages: v.array(v.string()),
		categories: v.array(v.string()),
		year: v.optional(v.number()),
		captureType: v.union(
			v.literal("terminal-recording"),
			v.literal("ios-simulator"),
			v.literal("web-embed"),
			v.literal("screen-recording"),
			v.literal("photo-gallery"),
			v.literal("mixed"),
		),
		media: v.array(v.object({
			assetId: v.id("mediaAssets"),
			label: v.string(),
			featured: v.optional(v.boolean()),
		})),
		tier: v.union(v.literal(1), v.literal(2), v.literal(3)),
		layout: v.optional(v.union(
			v.literal("editorial"),
			v.literal("grid"),
			v.literal("filmstrip"),
			v.literal("longform"),
		)),
		visible: v.boolean(),
		order: v.number(),
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("projectShowcases", args);
		await logHistory(ctx, { table: "projectShowcases", field: "create", oldValue: null, newValue: args });
		return id;
	},
});

export const update = mutation({
	args: {
		id: v.id("projectShowcases"),
		slug: v.optional(v.string()),
		title: v.optional(v.string()),
		tagline: v.optional(v.string()),
		description: v.optional(v.string()),
		githubUrl: v.optional(v.string()),
		liveUrl: v.optional(v.string()),
		languages: v.optional(v.array(v.string())),
		categories: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		captureType: v.optional(v.union(
			v.literal("terminal-recording"),
			v.literal("ios-simulator"),
			v.literal("web-embed"),
			v.literal("screen-recording"),
			v.literal("photo-gallery"),
			v.literal("mixed"),
		)),
		media: v.optional(v.array(v.object({
			assetId: v.id("mediaAssets"),
			label: v.string(),
			featured: v.optional(v.boolean()),
		}))),
		tier: v.optional(v.union(v.literal(1), v.literal(2), v.literal(3))),
		layout: v.optional(v.union(
			v.literal("editorial"),
			v.literal("grid"),
			v.literal("filmstrip"),
			v.literal("longform"),
		)),
		visible: v.optional(v.boolean()),
		order: v.optional(v.number()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const old = await ctx.db.get(id);
		const patch = stripUndefined(fields);
		await ctx.db.patch(id, patch);
		for (const [field, newValue] of Object.entries(patch)) {
			await logHistory(ctx, { table: "projectShowcases", field, oldValue: old ? (old as any)[field] : null, newValue });
		}
	},
});

export const remove = mutation({
	args: { id: v.id("projectShowcases") },
	handler: async (ctx, { id }) => {
		const old = await ctx.db.get(id);
		await ctx.db.delete(id);
		await logHistory(ctx, { table: "projectShowcases", field: "delete", oldValue: old, newValue: null });
	},
});
