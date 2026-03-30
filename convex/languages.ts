import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const createLanguage = mutation({
	args: {
		name: v.string(),
		level: v.string(),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("cvLanguages", args);
	},
});

export const updateLanguage = mutation({
	args: {
		id: v.id("cvLanguages"),
		name: v.optional(v.string()),
		level: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteLanguage = mutation({
	args: { id: v.id("cvLanguages") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});
