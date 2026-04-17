import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined, logHistory } from "./helpers";
import { Id } from "./_generated/dataModel";

export const getVisibleWorks = query({
	handler: async (ctx) => {
		const entries = await ctx.db
			.query("worksEntries")
			.filter((q) => q.eq(q.field("visible"), true))
			.collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

export const getFullWorks = query({
	handler: async (ctx) => {
		const entries = await ctx.db.query("worksEntries").collect();
		return entries.sort((a, b) => a.order - b.order);
	},
});

const styleOverridesValidator = v.optional(
	v.object({
		accentColor: v.optional(v.string()),
		httpColor: v.optional(v.string()),
		secondaryHighlight: v.optional(v.string()),
		badgeStyle: v.optional(v.string()),
		impactMetrics: v.optional(
			v.array(
				v.object({
					label: v.string(),
					value: v.string(),
				})
			)
		),
	})
);

export const createEntry = mutation({
	args: {
		title: v.string(),
		url: v.string(),
		linkLabel: v.optional(v.string()),
		category: v.optional(v.string()),
		preview: v.optional(v.string()),
		previewMode: v.optional(v.union(v.literal("live"), v.literal("static"), v.literal("video"))),
		videoPreview: v.optional(v.string()),
		viewport: v.optional(v.number()),
		cam: v.optional(v.string()),
		objectPosition: v.optional(v.string()),
		description: v.optional(v.string()),
		tools: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		month: v.optional(v.number()),
		featured: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		focalX: v.optional(v.number()),
		focalY: v.optional(v.number()),
		zoom: v.optional(v.number()),
		order: v.number(),
		visible: v.boolean(),
		styleOverrides: styleOverridesValidator,
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("worksEntries", args);
		await logHistory(ctx, {
			table: "worksEntries",
			field: "create",
			oldValue: null,
			newValue: args,
		});
		return id;
	},
});

export const updateEntry = mutation({
	args: {
		id: v.id("worksEntries"),
		title: v.optional(v.string()),
		url: v.optional(v.string()),
		linkLabel: v.optional(v.string()),
		category: v.optional(v.string()),
		preview: v.optional(v.string()),
		previewMode: v.optional(v.union(v.literal("live"), v.literal("static"), v.literal("video"))),
		videoPreview: v.optional(v.string()),
		viewport: v.optional(v.number()),
		cam: v.optional(v.string()),
		objectPosition: v.optional(v.string()),
		description: v.optional(v.string()),
		tools: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		month: v.optional(v.number()),
		featured: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		focalX: v.optional(v.number()),
		focalY: v.optional(v.number()),
		zoom: v.optional(v.number()),
		order: v.optional(v.number()),
		visible: v.optional(v.boolean()),
		styleOverrides: styleOverridesValidator,
	},
	handler: async (ctx, { id, ...fields }) => {
		const oldEntry = await ctx.db.get(id);
		const patch = stripUndefined(fields);
		await ctx.db.patch(id, patch);

		// Log each modified field
		for (const [field, newValue] of Object.entries(patch)) {
			await logHistory(ctx, {
				table: "worksEntries",
				field,
				oldValue: oldEntry ? (oldEntry as any)[field] : null,
				newValue,
			});
		}
	},
});

export const deleteEntry = mutation({
	args: { id: v.id("worksEntries") },
	handler: async (ctx, { id }) => {
		const oldEntry = await ctx.db.get(id);
		await ctx.db.delete(id);
		await logHistory(ctx, {
			table: "worksEntries",
			field: "delete",
			oldValue: oldEntry,
			newValue: null,
		});
	},
});

export const toggleVisibility = mutation({
	args: { id: v.id("worksEntries") },
	handler: async (ctx, { id }) => {
		const entry = await ctx.db.get(id);
		if (entry) {
			const newValue = !entry.visible;
			await ctx.db.patch(id, { visible: newValue });
			await logHistory(ctx, {
				table: "worksEntries",
				field: "visible",
				oldValue: entry.visible,
				newValue,
			});
		}
	},
});

export const reorderEntries = mutation({
	args: {
		updates: v.array(v.object({
			id: v.id("worksEntries"),
			order: v.number(),
		})),
	},
	handler: async (ctx, { updates }) => {
		for (const { id, order } of updates) {
			const oldEntry = await ctx.db.get(id);
			await ctx.db.patch(id, { order });
			await logHistory(ctx, {
				table: "worksEntries",
				field: "order",
				oldValue: oldEntry?.order,
				newValue: order,
			});
		}
	},
});
