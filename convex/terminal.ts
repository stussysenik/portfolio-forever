import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getTerminalConfig = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("terminalConfig").collect();
    return configs[0] || null;
  },
});

export const upsertTerminalConfig = mutation({
  args: {
    id: v.optional(v.id("terminalConfig")),
    fortunes: v.optional(v.array(v.string())),
    asciiLogo: v.optional(v.string()),
    neofetchFields: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
    }))),
    whoamiOutput: v.optional(v.string()),
    projectUrls: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
    }))),
    skills: v.optional(v.array(v.object({
      name: v.string(),
      proficiency: v.number(),
    }))),
    packages: v.optional(v.array(v.object({
      name: v.string(),
      version: v.string(),
      description: v.string(),
    }))),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const filtered = stripUndefined(fields);

    if (id) {
      await ctx.db.patch(id, filtered);
      return id;
    } else {
      return await ctx.db.insert("terminalConfig", {
        fortunes: fields.fortunes,
        asciiLogo: fields.asciiLogo,
        neofetchFields: fields.neofetchFields,
        whoamiOutput: fields.whoamiOutput,
        projectUrls: fields.projectUrls,
        skills: fields.skills,
        packages: fields.packages,
        visible: fields.visible ?? true,
      });
    }
  },
});
