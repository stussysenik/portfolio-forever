import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

// ── Public queries (no auth required) ──

export const getVisibleCV = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("cvEntries")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();

		const languages = await ctx.db
			.query("cvLanguages")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();

		const profiles = await ctx.db.query("cvProfile").collect();
		const profile = profiles[0] ?? null;

		const sections = await ctx.db
			.query("cvSections")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();

		return {
			profile,
			entries: entries.sort((a, b) => a.order - b.order),
			languages: languages.sort((a, b) => a.order - b.order),
			sections: sections.sort((a, b) => a.order - b.order),
		};
	},
});

// ── Admin queries (all data including hidden) ──

export const getFullCV = query({
	handler: async (ctx) => {
		const entries = await ctx.db.query("cvEntries").collect();
		const languages = await ctx.db.query("cvLanguages").collect();
		const profiles = await ctx.db.query("cvProfile").collect();
		const sections = await ctx.db.query("cvSections").collect();

		return {
			profile: profiles[0] ?? null,
			entries: entries.sort((a, b) => a.order - b.order),
			languages: languages.sort((a, b) => a.order - b.order),
			sections: sections.sort((a, b) => a.order - b.order),
		};
	},
});

// ── Mutations ──

export const createEntry = mutation({
	args: {
		type: v.union(
			v.literal("work"),
			v.literal("education"),
			v.literal("award"),
			v.literal("publication"),
			v.literal("project"),
		),
		title: v.string(),
		organization: v.optional(v.string()),
		location: v.optional(v.string()),
		startDate: v.string(),
		endDate: v.optional(v.string()),
		description: v.optional(v.string()),
		highlights: v.optional(v.array(v.string())),
		tools: v.optional(v.array(v.string())),
		collaborators: v.optional(v.array(v.string())),
		url: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("cvEntries", args);
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("cvEntries"),
		title: v.optional(v.string()),
		organization: v.optional(v.string()),
		location: v.optional(v.string()),
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		description: v.optional(v.string()),
		highlights: v.optional(v.array(v.string())),
		tools: v.optional(v.array(v.string())),
		collaborators: v.optional(v.array(v.string())),
		url: v.optional(v.string()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("cvEntries") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id);
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("cvEntries") },
	handler: async (ctx, { id }) => {
		const entry = await ctx.db.get(id);
		if (entry) {
			await ctx.db.patch(id, { visible: !entry.visible });
		}
	},
});

export const reorderEntries = mutation({
	args: {
		updates: v.array(v.object({
			id: v.id("cvEntries"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			await ctx.db.patch(id, { order });
		}
	},
});

// ── Profile mutations ──

export const updateProfile = mutation({
	args: {
		id: v.id("cvProfile"),
		name: v.optional(v.string()),
		jobTitle: v.optional(v.string()),
		summary: v.optional(v.string()),
		url: v.optional(v.string()),
		sameAs: v.optional(v.array(v.string())),
		knowsAbout: v.optional(v.array(v.object({
			name: v.string(),
			proficiency: v.number(),
		}))),
		taglines: v.optional(v.array(v.object({ lang: v.string(), text: v.string() }))),
		shortBio: v.optional(v.string()),
		location: v.optional(v.string()),
		available: v.optional(v.boolean()),
		email: v.optional(v.string()),
		edition: v.optional(v.string()),
		createdDate: v.optional(v.string()),
	},
	handler: async (ctx, { id, ...fields }) => {
		await ctx.db.patch(id, stripUndefined(fields));
	},
});
