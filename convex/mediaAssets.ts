import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined, logHistory } from "./helpers";

export const getVisible = query({
	handler: async (ctx) => {
		return await ctx.db
			.query("mediaAssets")
			.withIndex("by_visible", (q) => q.eq("visible", true))
			.collect();
	},
});

export const getByType = query({
	args: { type: v.union(v.literal("photo"), v.literal("video"), v.literal("gif"), v.literal("lottie"), v.literal("embed")) },
	handler: async (ctx, { type }) => {
		return await ctx.db
			.query("mediaAssets")
			.withIndex("by_type", (q) => q.eq("type", type))
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
	},
});

export const getById = query({
	args: { id: v.id("mediaAssets") },
	handler: async (ctx, { id }) => {
		return await ctx.db.get(id);
	},
});

export const getAll = query({
	handler: async (ctx) => {
		return await ctx.db.query("mediaAssets").collect();
	},
});

export const create = mutation({
	args: {
		type: v.union(v.literal("photo"), v.literal("video"), v.literal("gif"), v.literal("lottie"), v.literal("embed")),
		title: v.string(),
		url: v.optional(v.string()),
		srcset: v.optional(v.object({
			avif: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
			webp: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
			jpeg: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
		})),
		blurPlaceholder: v.optional(v.string()),
		colorProfile: v.optional(v.union(v.literal("srgb"), v.literal("display-p3"), v.literal("adobe-rgb"), v.literal("prophoto-rgb"))),
		exif: v.optional(v.object({
			exposureTime: v.optional(v.string()),
			aperture: v.optional(v.string()),
			iso: v.optional(v.number()),
			focalLength: v.optional(v.string()),
			camera: v.optional(v.string()),
			lens: v.optional(v.string()),
		})),
		muxPlaybackId: v.optional(v.string()),
		duration: v.optional(v.number()),
		chapters: v.optional(v.array(v.object({ time: v.number(), label: v.string() }))),
		deviceFrame: v.optional(v.union(v.literal("ios"), v.literal("terminal"), v.literal("browser"), v.literal("none"))),
		posterUrl: v.optional(v.string()),
		loop: v.optional(v.boolean()),
		width: v.optional(v.number()),
		height: v.optional(v.number()),
		aspectRatio: v.optional(v.string()),
		fileSizeBytes: v.optional(v.number()),
		tags: v.optional(v.array(v.string())),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("mediaAssets", args);
		await logHistory(ctx, { table: "mediaAssets", field: "create", oldValue: null, newValue: args });
		return id;
	},
});

export const update = mutation({
	args: {
		id: v.id("mediaAssets"),
		type: v.optional(v.union(v.literal("photo"), v.literal("video"), v.literal("gif"), v.literal("lottie"), v.literal("embed"))),
		title: v.optional(v.string()),
		url: v.optional(v.string()),
		srcset: v.optional(v.object({
			avif: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
			webp: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
			jpeg: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
		})),
		blurPlaceholder: v.optional(v.string()),
		colorProfile: v.optional(v.union(v.literal("srgb"), v.literal("display-p3"), v.literal("adobe-rgb"), v.literal("prophoto-rgb"))),
		exif: v.optional(v.object({
			exposureTime: v.optional(v.string()),
			aperture: v.optional(v.string()),
			iso: v.optional(v.number()),
			focalLength: v.optional(v.string()),
			camera: v.optional(v.string()),
			lens: v.optional(v.string()),
		})),
		muxPlaybackId: v.optional(v.string()),
		duration: v.optional(v.number()),
		chapters: v.optional(v.array(v.object({ time: v.number(), label: v.string() }))),
		deviceFrame: v.optional(v.union(v.literal("ios"), v.literal("terminal"), v.literal("browser"), v.literal("none"))),
		posterUrl: v.optional(v.string()),
		loop: v.optional(v.boolean()),
		width: v.optional(v.number()),
		height: v.optional(v.number()),
		aspectRatio: v.optional(v.string()),
		fileSizeBytes: v.optional(v.number()),
		tags: v.optional(v.array(v.string())),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const old = await ctx.db.get(id);
		const patch = stripUndefined(fields);
		await ctx.db.patch(id, patch);
		for (const [field, newValue] of Object.entries(patch)) {
			await logHistory(ctx, { table: "mediaAssets", field, oldValue: old ? (old as any)[field] : null, newValue });
		}
	},
});

export const remove = mutation({
	args: { id: v.id("mediaAssets") },
	handler: async (ctx, { id }) => {
		const old = await ctx.db.get(id);
		await ctx.db.delete(id);
		await logHistory(ctx, { table: "mediaAssets", field: "delete", oldValue: old, newValue: null });
	},
});
