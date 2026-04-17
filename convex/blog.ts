import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined, logHistory } from "./helpers";

export const getVisiblePosts = query({
	handler: async (ctx) => {
		const posts = await ctx.db
			.query("blogPosts")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return posts.sort((a, b) => {
			const aDate = a.publishedAt ?? "";
			const bDate = b.publishedAt ?? "";
			return bDate.localeCompare(aDate);
		});
	},
});

export const getFullPosts = query({
	handler: async (ctx) => {
		const posts = await ctx.db.query("blogPosts").collect();
		return posts.sort((a, b) => {
			const aDate = a.publishedAt ?? "";
			const bDate = b.publishedAt ?? "";
			return bDate.localeCompare(aDate);
		});
	},
});

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const post = await ctx.db
			.query("blogPosts")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.first();
		if (post && !post.visible) return null;
		return post;
	},
});

export const createPost = mutation({
	args: {
		title: v.string(),
		slug: v.string(),
		content: v.optional(v.string()),
		excerpt: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		publishedAt: v.optional(v.string()),
		coverImage: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("blogPosts", args);
		await logHistory(ctx, {
			table: "blogPosts",
			field: "create",
			oldValue: null,
			newValue: args,
		});
		return id;
	},
});

export const updatePost = mutation({
	args: {
		id: v.id("blogPosts"),
		title: v.optional(v.string()),
		slug: v.optional(v.string()),
		content: v.optional(v.string()),
		excerpt: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		publishedAt: v.optional(v.string()),
		coverImage: v.optional(v.string()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const oldPost = await ctx.db.get(id);
		const patch = stripUndefined(fields);
		await ctx.db.patch(id, patch);

		for (const [field, newValue] of Object.entries(patch)) {
			await logHistory(ctx, {
				table: "blogPosts",
				field,
				oldValue: oldPost ? (oldPost as any)[field] : null,
				newValue,
			});
		}
	},
});

export const deletePost = mutation({
	args: { id: v.id("blogPosts") },
	handler: async (ctx, { id }) => {
		const oldPost = await ctx.db.get(id);
		await ctx.db.delete(id);
		await logHistory(ctx, {
			table: "blogPosts",
			field: "delete",
			oldValue: oldPost,
			newValue: null,
		});
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("blogPosts") },
	handler: async (ctx, { id }) => {
		const post = await ctx.db.get(id);
		if (post) {
			const newValue = !post.visible;
			await ctx.db.patch(id, { visible: newValue });
			await logHistory(ctx, {
				table: "blogPosts",
				field: "visible",
				oldValue: post.visible,
				newValue,
			});
		}
	},
});
