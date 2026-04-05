import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getVisible = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("heroCaseStudies")
			.withIndex("by_order")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return entries;
	},
});

export const getFull = query({
	handler: async (ctx) => {
		return await ctx.db.query("heroCaseStudies").withIndex("by_order").collect();
	},
});

export const createEntry = mutation({
	args: {
		title: v.string(),
		role: v.optional(v.string()),
		timeToShip: v.optional(v.string()),
		framework: v.optional(v.string()),
		problem: v.string(),
		constraint: v.string(),
		result: v.string(),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const all = await ctx.db.query("heroCaseStudies").collect();
		return await ctx.db.insert("heroCaseStudies", {
			...args,
			order: args.order ?? all.length,
			visible: args.visible ?? false,
		});
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("heroCaseStudies"),
		title: v.optional(v.string()),
		role: v.optional(v.string()),
		timeToShip: v.optional(v.string()),
		framework: v.optional(v.string()),
		problem: v.optional(v.string()),
		constraint: v.optional(v.string()),
		result: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("heroCaseStudies") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("heroCaseStudies") },
	handler: async (ctx, { id }) => {
		const entry = await ctx.db.get(id);
		if (entry) {
			await ctx.db.patch(id, { visible: !entry.visible });
		}
	},
});
