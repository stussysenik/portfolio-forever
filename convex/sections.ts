import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const createSection = mutation({
	args: {
		name: v.string(),
		type: v.string(),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("cvSections", args);
	},
});

export const updateSection = mutation({
	args: {
		id: v.id("cvSections"),
		name: v.optional(v.string()),
		type: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteSection = mutation({
	args: { id: v.id("cvSections") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const reorderSections = mutation({
	args: {
		updates: v.array(v.object({
			id: v.id("cvSections"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			await ctx.db.patch(id, { order });
		}
	},
});
