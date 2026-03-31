import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getHeroConfig = query({
    args: {},
    handler: async (ctx) => {
        const configs = await ctx.db.query("heroConfig").collect();
        return configs[0] ?? null;
    },
});

export const upsertHeroConfig = mutation({
    args: {
        id: v.optional(v.id("heroConfig")),
        showVelocity: v.optional(v.boolean()),
        showAsciiDonut: v.optional(v.boolean()),
        showPixelArt: v.optional(v.boolean()),
        layout: v.optional(v.string()),
        accentColor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        const filtered = Object.fromEntries(
            Object.entries(fields).filter(([, v]) => v !== undefined)
        );
        if (id) {
            await ctx.db.patch(id, filtered);
            return id;
        }
        const existing = await ctx.db.query("heroConfig").first();
        if (existing) {
            await ctx.db.patch(existing._id, filtered);
            return existing._id;
        }
        return await ctx.db.insert("heroConfig", {
            showVelocity: args.showVelocity ?? false,
            showAsciiDonut: args.showAsciiDonut ?? true,
            showPixelArt: args.showPixelArt ?? false,
            layout: args.layout ?? "default",
            accentColor: args.accentColor,
        });
    },
});
