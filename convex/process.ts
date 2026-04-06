import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getProcessConfig = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("processConfig").collect();
    return configs[0] || null;
  },
});

export const upsertProcessConfig = mutation({
  args: {
    id: v.optional(v.id("processConfig")),
    phases: v.optional(
      v.array(
        v.object({
          label: v.string(),
          description: v.optional(v.string()),
          order: v.number(),
        })
      )
    ),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const filtered = stripUndefined(fields);

    if (id) {
      await ctx.db.patch(id, filtered);
      return id;
    } else {
      return await ctx.db.insert("processConfig", {
        phases: fields.phases || [
          { label: "IMAGINE", order: 0 },
          { label: "RE-THINK", order: 1 },
          { label: "SHIP", order: 2 },
        ],
        visible: fields.visible ?? true,
      });
    }
  },
});
