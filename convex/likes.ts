import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("likesCategories").withIndex("by_order").collect())
      .filter((c) => c.visible);
  },
});

export const getFullLikes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("likesCategories").withIndex("by_order").collect();
  },
});

export const createCategory = mutation({
  args: { title: v.string(), items: v.array(v.string()), order: v.number(), visible: v.boolean() },
  handler: async (ctx, args) => await ctx.db.insert("likesCategories", args),
});

export const updateCategory = mutation({
  args: {
    id: v.id("likesCategories"),
    title: v.optional(v.string()),
    items: v.optional(v.array(v.string())),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, stripUndefined(fields));
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("likesCategories") },
  handler: async (ctx, { id }) => await ctx.db.delete(id),
});

export const toggleVisibility = mutation({
  args: { id: v.id("likesCategories") },
  handler: async (ctx, { id }) => {
    const entry = await ctx.db.get(id);
    if (entry) await ctx.db.patch(id, { visible: !entry.visible });
  },
});

export const reorderCategories = mutation({
  args: { updates: v.array(v.object({ id: v.id("likesCategories"), order: v.number() })) },
  handler: async (ctx, { updates }) => {
    for (const { id, order } of updates) await ctx.db.patch(id, { order });
  },
});
