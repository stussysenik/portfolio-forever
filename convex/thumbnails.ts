import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getConfig = query({
  args: { section: v.string() },
  handler: async (ctx, { section }) => {
    return (await ctx.db.query("thumbnailConfig")
      .withIndex("by_section", (q) => q.eq("section", section))
      .collect())[0] || null;
  },
});

export const getAllConfigs = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("thumbnailConfig").collect(),
});

export const upsertConfig = mutation({
  args: {
    id: v.optional(v.id("thumbnailConfig")),
    section: v.string(),
    displayMode: v.optional(v.union(v.literal("grid"), v.literal("list"), v.literal("carousel"), v.literal("masonry"))),
    columns: v.optional(v.number()),
    showPreview: v.optional(v.boolean()),
    previewOnHover: v.optional(v.boolean()),
    aspectRatio: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const filtered = stripUndefined(fields);
    if (id) {
      await ctx.db.patch(id, filtered);
      return id;
    }
    return await ctx.db.insert("thumbnailConfig", {
      section: fields.section,
      displayMode: fields.displayMode || "grid",
      columns: fields.columns,
      showPreview: fields.showPreview ?? true,
      previewOnHover: fields.previewOnHover ?? true,
      aspectRatio: fields.aspectRatio,
    });
  },
});
