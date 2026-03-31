import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getConfig = query({
    args: { section: v.string() },
    handler: async (ctx, { section }) => {
        return await ctx.db
            .query("displayConfig")
            .withIndex("by_section", (q) => q.eq("section", section))
            .first();
    },
});

export const getAllConfigs = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("displayConfig").collect();
    },
});

export const upsertConfig = mutation({
    args: {
        id: v.optional(v.id("displayConfig")),
        section: v.string(),
        viewMode: v.optional(v.union(
            v.literal("grid"), v.literal("case-study"),
            v.literal("minimal-list"), v.literal("pixel-universe"),
        )),
        animationBg: v.optional(v.union(
            v.literal("none"), v.literal("conway"),
            v.literal("kanagawa"), v.literal("balatro"),
        )),
        animationSpeed: v.optional(v.number()),
        animationOpacity: v.optional(v.number()),
        immune: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, section, ...fields } = args;
        const filtered = Object.fromEntries(
            Object.entries(fields).filter(([, v]) => v !== undefined)
        );
        if (id) {
            await ctx.db.patch(id, filtered);
            return id;
        }
        return await ctx.db.insert("displayConfig", {
            section,
            viewMode: args.viewMode ?? "grid",
            animationBg: args.animationBg ?? "none",
            animationSpeed: args.animationSpeed ?? 1.0,
            animationOpacity: args.animationOpacity ?? 0.5,
            immune: args.immune ?? false,
        });
    },
});
