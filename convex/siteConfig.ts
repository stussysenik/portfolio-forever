import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
	args: {},
	handler: async (ctx) => {
		const configs = await ctx.db.query("siteConfig").collect();
		return configs[0] ?? null;
	},
});

export const upsert = mutation({
	args: {
		mode: v.optional(
			v.union(
				v.literal("one-page"),
				v.literal("multi-page"),
				v.literal("reader")
			)
		),
		sectionOrder: v.optional(v.array(v.string())),
		parallaxSpeed: v.optional(v.number()),
		readerModeRoute: v.optional(v.string()),
		footerEdition: v.optional(v.string()),
		footerYear: v.optional(v.number()),
		navMode: v.optional(v.union(v.literal("sidebar"), v.literal("drawer"), v.literal("hybrid"))),
		heroVisual: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db.query("siteConfig").collect();
		const filtered = Object.fromEntries(
			Object.entries(args).filter(([, v]) => v !== undefined)
		);
		if (existing[0]) {
			const trackableFields = ['mode', 'parallaxSpeed'] as const;
			for (const field of trackableFields) {
				if (args[field] !== undefined && existing[0][field] !== args[field]) {
					await ctx.db.insert("adminHistory", {
						table: "siteConfig",
						field,
						oldValue: existing[0][field] ?? null,
						newValue: args[field],
						timestamp: Date.now(),
					});
				}
			}
			await ctx.db.patch(existing[0]._id, filtered);
			return existing[0]._id;
		}
		return await ctx.db.insert("siteConfig", {
			mode: args.mode ?? "multi-page",
			sectionOrder: args.sectionOrder ?? [
				"hero", "works", "talks", "terminal", "cv",
				"academia", "blog", "process", "gallery",
				"likes", "minor", "gifts", "os"
			],
			parallaxSpeed: args.parallaxSpeed ?? 0.5,
			readerModeRoute: args.readerModeRoute,
			footerEdition: args.footerEdition,
			footerYear: args.footerYear,
			navMode: args.navMode,
			heroVisual: args.heroVisual,
		});
	},
});

export const getFeatureFlags = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("featureFlags").collect();
	},
});

export const setFeatureFlag = mutation({
	args: {
		key: v.string(),
		enabled: v.boolean(),
		category: v.string(),
	},
	handler: async (ctx, { key, enabled, category }) => {
		const existing = await ctx.db
			.query("featureFlags")
			.withIndex("by_key", (q) => q.eq("key", key))
			.collect();
		if (existing[0]) {
			if (existing[0].enabled !== enabled) {
				await ctx.db.insert("adminHistory", {
					table: "featureFlags",
					field: key,
					oldValue: existing[0].enabled,
					newValue: enabled,
					timestamp: Date.now(),
				});
			}
			await ctx.db.patch(existing[0]._id, { enabled, category });
			return existing[0]._id;
		}
		return await ctx.db.insert("featureFlags", { key, enabled, category });
	},
});
