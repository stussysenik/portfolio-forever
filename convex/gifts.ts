import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getGiftsConfig = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("giftsConfig").collect();
    return configs[0] || null;
  },
});

export const upsertGiftsConfig = mutation({
  args: {
    id: v.optional(v.id("giftsConfig")),
    title: v.optional(v.string()),
    manifesto: v.optional(v.string()),
    callToAction: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const filtered = stripUndefined(fields);

    if (id) {
      await ctx.db.patch(id, filtered);
      return id;
    } else {
      return await ctx.db.insert("giftsConfig", {
        title: fields.title || "The Promise",
        manifesto: fields.manifesto || "",
        callToAction: fields.callToAction,
        contactEmail: fields.contactEmail,
        visible: fields.visible ?? true,
      });
    }
  },
});
