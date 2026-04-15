import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/** All themes */
export const getAll = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("themes").collect();
	},
});

/** Single theme by themeId */
export const getByThemeId = query({
	args: { themeId: v.string() },
	handler: async (ctx, { themeId }) => {
		return await ctx.db
			.query("themes")
			.withIndex("by_themeId", (q) => q.eq("themeId", themeId))
			.unique();
	},
});

/** Get the default theme */
export const getDefault = query({
	args: {},
	handler: async (ctx) => {
		const themes = await ctx.db.query("themes").collect();
		return themes.find((t) => t.isDefault) ?? themes[0] ?? null;
	},
});

/** Create or update a theme */
export const upsert = mutation({
	args: {
		themeId: v.string(),
		label: v.string(),
		type: v.union(v.literal("light"), v.literal("dark")),
		colors: v.any(),
		fonts: v.optional(v.any()),
		spacing: v.optional(v.any()),
		borders: v.optional(v.any()),
		isBuiltIn: v.boolean(),
		isDefault: v.boolean(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("themes")
			.withIndex("by_themeId", (q) => q.eq("themeId", args.themeId))
			.unique();

		// If setting as default, clear other defaults
		if (args.isDefault) {
			const allThemes = await ctx.db.query("themes").collect();
			for (const t of allThemes) {
				if (t.isDefault && t.themeId !== args.themeId) {
					await ctx.db.patch(t._id, { isDefault: false });
				}
			}
		}

		if (existing) {
			await ctx.db.patch(existing._id, args);
			return existing._id;
		}
		return await ctx.db.insert("themes", args);
	},
});

/** Set a theme as the default */
export const setDefault = mutation({
	args: { themeId: v.string() },
	handler: async (ctx, { themeId }) => {
		const allThemes = await ctx.db.query("themes").collect();
		for (const t of allThemes) {
			await ctx.db.patch(t._id, { isDefault: t.themeId === themeId });
		}
	},
});

/** Seed built-in themes (idempotent) */
export const seedBuiltIn = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query("themes").take(1);
		if (existing.length > 0) return;

		const builtIn = [
			{
				themeId: "minimal",
				label: "Minimal",
				type: "light" as const,
				isBuiltIn: true,
				isDefault: true,
				colors: {
					bg: "#FAFAF9",
					bgAlt: "#F5F5F4",
					surface: "#FFFFFF",
					surfaceRaised: "#FFFFFF",
					text: "#1C1917",
					textSecondary: "#44403C",
					textMuted: "#78716C",
					textSubtle: "#A8A29E",
					accent: "#2563EB",
					accentHover: "#1D4ED8",
					accentSubtle: "oklch(0.65 0.18 260 / 0.12)",
					success: "#16A34A",
					warning: "#D97706",
					danger: "#DC2626",
					electricGreen: "#44D62C",
				},
			},
			{
				themeId: "studio",
				label: "Studio",
				type: "light" as const,
				isBuiltIn: true,
				isDefault: false,
				colors: {
					bg: "#F5F5F5",
					bgAlt: "#ECECEC",
					surface: "#FFFFFF",
					surfaceRaised: "#FFFFFF",
					text: "#1A1A1A",
					textSecondary: "#4A4A4A",
					textMuted: "#737373",
					textSubtle: "#A3A3A3",
					accent: "#333333",
					accentHover: "#1A1A1A",
					success: "#16A34A",
					warning: "#D97706",
					danger: "#DC2626",
					electricGreen: "#44D62C",
				},
			},
			{
				themeId: "terminal",
				label: "Terminal",
				type: "dark" as const,
				isBuiltIn: true,
				isDefault: false,
				colors: {
					bg: "#0D1117",
					bgAlt: "#161B22",
					surface: "#1C2128",
					surfaceRaised: "#2D333B",
					text: "#E6EDF3",
					textSecondary: "#B1BAC4",
					textMuted: "#8B949E",
					textSubtle: "#6E7681",
					accent: "#00D9FF",
					accentHover: "#00BFDF",
					success: "#3FB950",
					warning: "#D29922",
					danger: "#F85149",
					electricGreen: "#44D62C",
				},
			},
			{
				themeId: "darkroom",
				label: "Darkroom",
				type: "dark" as const,
				isBuiltIn: true,
				isDefault: false,
				colors: {
					bg: "#141414",
					bgAlt: "#1C1C1C",
					surface: "#242424",
					surfaceRaised: "#2C2C2C",
					text: "#E8E8E8",
					textSecondary: "#B0B0B0",
					textMuted: "#808080",
					textSubtle: "#606060",
					accent: "#00D9FF",
					accentHover: "#00BFDF",
					success: "#3FB950",
					warning: "#D29922",
					danger: "#F85149",
					electricGreen: "#44D62C",
				},
			},
			{
				themeId: "accessible",
				label: "Accessible",
				type: "light" as const,
				isBuiltIn: true,
				isDefault: false,
				colors: {
					bg: "#FFFFFF",
					bgAlt: "#F0F0F0",
					surface: "#FFFFFF",
					surfaceRaised: "#FFFFFF",
					text: "#000000",
					textSecondary: "#1A1A1A",
					textMuted: "#333333",
					textSubtle: "#555555",
					accent: "#0066CC",
					accentHover: "#004C99",
					success: "#008000",
					warning: "#996600",
					danger: "#CC0000",
					electricGreen: "#008000",
				},
			},
			{
				themeId: "carbon",
				label: "Carbon",
				type: "light" as const,
				isBuiltIn: true,
				isDefault: false,
				colors: {
					bg: "#ffffff",
					bgAlt: "#f4f4f4",
					surface: "#ffffff",
					surfaceRaised: "#f4f4f4",
					text: "#161616",
					textSecondary: "#525252",
					textMuted: "#6f6f6f",
					textSubtle: "#a8a8a8",
					accent: "#0f62fe",
					accentHover: "#0043ce",
					accentSubtle: "#edf5ff",
					success: "#24a148",
					warning: "#f1c21b",
					danger: "#da1e28",
					electricGreen: "#24a148",
				},
			},
		];

		for (const theme of builtIn) {
			await ctx.db.insert("themes", theme);
		}
	},
});
