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
        showAsciiWave: v.optional(v.boolean()),
        showPixelArt: v.optional(v.boolean()),
        layout: v.optional(v.string()),
        accentColor: v.optional(v.string()),
        heroNameSize: v.optional(v.number()),
        heroNameWeight: v.optional(v.number()),
        heroNameLetterSpacing: v.optional(v.number()),
        heroNameLineHeight: v.optional(v.number()),
        heroNameTextWrap: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        const filtered = Object.fromEntries(
            Object.entries(fields).filter(([, v]) => v !== undefined)
        );
        if (id) {
            const doc = await ctx.db.get(id);
            if (doc) {
                const trackableFields = ['heroNameSize', 'heroNameWeight', 'heroNameLetterSpacing', 'heroNameLineHeight', 'heroNameTextWrap'] as const;
                for (const field of trackableFields) {
                    if (args[field] !== undefined && doc[field] !== args[field]) {
                        await ctx.db.insert("adminHistory", {
                            table: "hero",
                            field,
                            oldValue: doc[field] ?? null,
                            newValue: args[field],
                            timestamp: Date.now(),
                        });
                    }
                }
            }
            await ctx.db.patch(id, filtered);
            return id;
        }
        const existing = await ctx.db.query("heroConfig").first();
        if (existing) {
            const trackableFields = ['heroNameSize', 'heroNameWeight', 'heroNameLetterSpacing', 'heroNameLineHeight', 'heroNameTextWrap'] as const;
            for (const field of trackableFields) {
                if (args[field] !== undefined && existing[field] !== args[field]) {
                    await ctx.db.insert("adminHistory", {
                        table: "hero",
                        field,
                        oldValue: existing[field] ?? null,
                        newValue: args[field],
                        timestamp: Date.now(),
                    });
                }
            }
            await ctx.db.patch(existing._id, filtered);
            return existing._id;
        }
        return await ctx.db.insert("heroConfig", {
            showVelocity: args.showVelocity ?? false,
            showAsciiDonut: args.showAsciiDonut ?? true,
            showAsciiWave: args.showAsciiWave ?? false,
            showPixelArt: args.showPixelArt ?? false,
            layout: args.layout ?? "default",
            accentColor: args.accentColor,
            heroNameSize: args.heroNameSize,
            heroNameWeight: args.heroNameWeight,
            heroNameLetterSpacing: args.heroNameLetterSpacing,
            heroNameLineHeight: args.heroNameLineHeight,
            heroNameTextWrap: args.heroNameTextWrap,
        });
    },
});
