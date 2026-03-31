import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

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
		return await ctx.db
			.query("blogPosts")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.first();
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
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("blogPosts", args);
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
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deletePost = mutation({
	args: { id: v.id("blogPosts") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("blogPosts") },
	handler: async (ctx, { id }) => {
		const post = await ctx.db.get(id);
		if (post) {
			await ctx.db.patch(id, { visible: !post.visible });
		}
	},
});
