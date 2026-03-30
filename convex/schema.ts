import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	cvEntries: defineTable({
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
	}).index("by_type", ["type"])
		.index("by_type_order", ["type", "order"]),

	cvLanguages: defineTable({
		name: v.string(),
		level: v.string(),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	cvProfile: defineTable({
		name: v.string(),
		jobTitle: v.string(),
		summary: v.string(),
		url: v.string(),
		sameAs: v.array(v.string()),
		knowsAbout: v.array(v.object({
			name: v.string(),
			proficiency: v.number(),
		})),
	}),

	academicEntries: defineTable({
		title: v.string(),
		authors: v.string(),
		venue: v.optional(v.string()),
		year: v.number(),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		paperUrl: v.optional(v.string()),
		codeUrl: v.optional(v.string()),
		demoUrl: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	cvSections: defineTable({
		name: v.string(),
		type: v.string(),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	worksEntries: defineTable({
		title: v.string(),
		url: v.string(),
		category: v.optional(v.string()),
		preview: v.optional(v.string()),
		viewport: v.optional(v.number()),
		cam: v.optional(v.string()),
		description: v.optional(v.string()),
		tools: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		month: v.optional(v.number()),
		featured: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	talksEntries: defineTable({
		title: v.string(),
		entryType: v.union(v.literal("talk"), v.literal("interview")),
		year: v.number(),
		month: v.optional(v.number()),
		description: v.optional(v.string()),
		links: v.optional(v.array(v.object({
			label: v.string(),
			url: v.string(),
		}))),
		featured: v.optional(v.string()),
		category: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	siteConfig: defineTable({
		mode: v.union(
			v.literal("one-page"),
			v.literal("multi-page"),
			v.literal("reader")
		),
		sectionOrder: v.array(v.string()),
		parallaxSpeed: v.number(),
		readerModeRoute: v.optional(v.string()),
	}),

	featureFlags: defineTable({
		key: v.string(),
		enabled: v.boolean(),
		category: v.string(),
	}).index("by_key", ["key"]),

	// Likes — editable categories with items
	likesCategories: defineTable({
		title: v.string(),
		items: v.array(v.string()),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	// Gifts — editable manifesto content
	giftsConfig: defineTable({
		title: v.string(),
		manifesto: v.string(),
		callToAction: v.optional(v.string()),
		contactEmail: v.optional(v.string()),
		visible: v.boolean(),
	}),

	// Thumbnail display settings per section
	thumbnailConfig: defineTable({
		section: v.string(), // 'works' | 'academia' | 'likes'
		displayMode: v.union(
			v.literal("grid"),
			v.literal("list"),
			v.literal("carousel"),
			v.literal("masonry"),
		),
		columns: v.optional(v.number()),
		showPreview: v.boolean(),
		previewOnHover: v.boolean(),
		aspectRatio: v.optional(v.string()), // '16:9', '4:3', '1:1'
	}).index("by_section", ["section"]),
});
