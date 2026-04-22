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
		taglines: v.optional(v.array(v.object({ lang: v.string(), text: v.string() }))),
		shortBio: v.optional(v.string()),
		location: v.optional(v.string()),
		available: v.optional(v.boolean()),
		email: v.optional(v.string()),
		edition: v.optional(v.string()),
		createdDate: v.optional(v.string()),
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
		styleOverrides: v.optional(v.object({
			accentColor: v.optional(v.string()),
			httpColor: v.optional(v.string()),
			secondaryHighlight: v.optional(v.string()),
			badgeStyle: v.optional(v.string()),
			impactMetrics: v.optional(v.array(v.object({
				label: v.string(),
				value: v.string(),
			}))),
		})),
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
			v.literal("reader"),
			v.literal("disabled")
		),
		sectionOrder: v.array(v.string()),
		parallaxSpeed: v.number(),
		readerModeRoute: v.optional(v.string()),
		footerEdition: v.optional(v.string()),
		footerYear: v.optional(v.number()),
		navMode: v.optional(v.union(v.literal("sidebar"), v.literal("drawer"), v.literal("hybrid"))),
		heroVisual: v.optional(v.string()),
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

	// Process — editable process cycle phases
	processConfig: defineTable({
		phases: v.array(v.object({
			label: v.string(),
			description: v.optional(v.string()),
			order: v.number(),
		})),
		visible: v.boolean(),
	}),

	// OS desktop config — icons + initial windows for Win95 simulation
	osConfig: defineTable({
		icons: v.array(v.object({
			label: v.string(),
			icon: v.string(),
			content: v.optional(v.string()),
			action: v.optional(v.string()),
			order: v.number(),
		})),
		initialWindows: v.array(v.object({
			title: v.string(),
			content: v.string(),
			x: v.number(),
			y: v.number(),
		})),
		desktopColor: v.optional(v.string()),
		visible: v.boolean(),
	}),

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

	// Per-section display mode + animation + immunity
	displayConfig: defineTable({
		section: v.string(),
		viewMode: v.union(
			v.literal("grid"),
			v.literal("case-study"),
			v.literal("minimal-list"),
			v.literal("pixel-universe"),
		),
		animationBg: v.union(
			v.literal("none"),
			v.literal("conway"),
			v.literal("kanagawa"),
			v.literal("balatro"),
		),
		animationSpeed: v.number(),
		animationOpacity: v.number(),
		immune: v.boolean(),
	}).index("by_section", ["section"]),

	// Hero display settings (single doc)
	heroConfig: defineTable({
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
		archived: v.optional(v.boolean()),
	}),

	// Gallery items
	galleryItems: defineTable({
		title: v.string(),
		thumbnailUrl: v.optional(v.string()),
		fullUrl: v.optional(v.string()),
		category: v.optional(v.array(v.string())),
		year: v.optional(v.number()),
		description: v.optional(v.string()),
		muxPlaybackId: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	// Minor things lists
	minorEntries: defineTable({
		category: v.string(),
		text: v.string(),
		year: v.optional(v.number()),
		note: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_category_and_order", ["category", "order"]),

	// Lab experiments
	labEntries: defineTable({
		title: v.string(),
		slug: v.optional(v.string()),
		description: v.string(),
		status: v.union(
			v.literal("stable"),
			v.literal("beta"),
			v.literal("experimental"),
			v.literal("archived"),
		),
		date: v.string(),
		sourceUrl: v.optional(v.string()),
		entryPoint: v.optional(v.string()),
		fallbackImage: v.optional(v.string()),
		tags: v.array(v.string()),
		memoryBudget: v.number(),
		requiredFeatures: v.array(v.string()),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	// Hero case studies — data-driven flagship shipments
	heroCaseStudies: defineTable({
		title: v.string(),
		role: v.optional(v.string()),
		timeToShip: v.optional(v.string()),
		framework: v.optional(v.string()),
		problem: v.string(),
		constraint: v.string(),
		result: v.string(),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_order", ["order"]),

	// Blog posts (replaces Sanity)
	blogPosts: defineTable({
		title: v.string(),
		slug: v.string(),
		content: v.optional(v.string()),
		excerpt: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		publishedAt: v.optional(v.string()),
		coverImage: v.optional(v.string()),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_slug", ["slug"])
		.index("by_order", ["order"]),

	// Section registry — controls bento grid layout and site navigation
	sectionRegistry: defineTable({
		sectionId: v.string(),
		label: v.string(),
		route: v.string(),
		order: v.number(),
		visible: v.boolean(),
		adminVisible: v.boolean(),
		viewMode: v.string(),
		animationBg: v.string(),
		animationSpeed: v.number(),
		animationOpacity: v.number(),
		immune: v.boolean(),
		cellSpan: v.number(),
		cellAspect: v.string(),
		previewType: v.string(),
		dataTable: v.optional(v.string()),
		accentColor: v.string(),
	}).index("by_sectionId", ["sectionId"])
		.index("by_order", ["order"]),

	// Pages — composable page-first platform
	pages: defineTable({
		pageId: v.string(),
		label: v.string(),
		route: v.string(),
		navLabel: v.optional(v.string()),
		navOrder: v.number(),
		navVisible: v.boolean(),
		visible: v.boolean(),
		archived: v.optional(v.boolean()),
		sections: v.array(v.object({
			sectionType: v.string(),
			config: v.any(),
			dataTable: v.optional(v.string()),
			order: v.number(),
			themeOverrides: v.optional(v.any()),
			spacingBefore: v.optional(v.number()),
			spacingAfter: v.optional(v.number()),
		})),
		themeOverrides: v.optional(v.any()),
		meta: v.optional(v.object({
			title: v.optional(v.string()),
			description: v.optional(v.string()),
			ogImage: v.optional(v.string()),
		})),
	}).index("by_pageId", ["pageId"])
		.index("by_navOrder", ["navOrder"])
		.index("by_route", ["route"]),

	// Themes — layered theme system
	themes: defineTable({
		themeId: v.string(),
		label: v.string(),
		type: v.union(v.literal("light"), v.literal("dark")),
		colors: v.any(),
		fonts: v.optional(v.any()),
		spacing: v.optional(v.any()),
		borders: v.optional(v.any()),
		isBuiltIn: v.boolean(),
		isDefault: v.boolean(),
	}).index("by_themeId", ["themeId"]),

	// Admin change history — tracks config modifications for undo/audit
	adminHistory: defineTable({
		table: v.string(),
		field: v.string(),
		oldValue: v.any(),
		newValue: v.any(),
		user: v.optional(v.string()), // Added user field
		timestamp: v.number(),
	}).index("by_table_field", ["table", "field"])
		.index("by_user", ["user"]),

	// Terminal — configurable data for the portfolio terminal
	terminalConfig: defineTable({
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
		visible: v.boolean(),
	}),

	// GitHub projects — synced from GitHub API
	githubProjects: defineTable({
		repoName: v.string(),
		description: v.string(),
		language: v.optional(v.string()),
		url: v.string(),
		category: v.string(),
		enabled: v.boolean(),
		featured: v.boolean(),
		order: v.number(),
		lastSynced: v.number(),
	}).index("by_repoName", ["repoName"])
		.index("by_order", ["order"]),

	mediaAssets: defineTable({
		type: v.union(
			v.literal("photo"),
			v.literal("video"),
			v.literal("gif"),
			v.literal("lottie"),
			v.literal("embed"),
		),
		title: v.string(),
		url: v.optional(v.string()),
		srcset: v.optional(v.object({
			avif: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
			webp: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
			jpeg: v.optional(v.array(v.object({ width: v.number(), url: v.string() }))),
		})),
		blurPlaceholder: v.optional(v.string()),
		colorProfile: v.optional(v.union(
			v.literal("srgb"),
			v.literal("display-p3"),
			v.literal("adobe-rgb"),
			v.literal("prophoto-rgb"),
		)),
		exif: v.optional(v.object({
			exposureTime: v.optional(v.string()),
			aperture: v.optional(v.string()),
			iso: v.optional(v.number()),
			focalLength: v.optional(v.string()),
			camera: v.optional(v.string()),
			lens: v.optional(v.string()),
		})),
		muxPlaybackId: v.optional(v.string()),
		duration: v.optional(v.number()),
		chapters: v.optional(v.array(v.object({
			time: v.number(),
			label: v.string(),
		}))),
		deviceFrame: v.optional(v.union(
			v.literal("ios"),
			v.literal("terminal"),
			v.literal("browser"),
			v.literal("none"),
		)),
		posterUrl: v.optional(v.string()),
		loop: v.optional(v.boolean()),
		width: v.optional(v.number()),
		height: v.optional(v.number()),
		aspectRatio: v.optional(v.string()),
		fileSizeBytes: v.optional(v.number()),
		tags: v.optional(v.array(v.string())),
		order: v.number(),
		visible: v.boolean(),
	}).index("by_type", ["type"])
		.index("by_order", ["order"])
		.index("by_visible", ["visible", "order"]),

	projectShowcases: defineTable({
		slug: v.string(),
		title: v.string(),
		tagline: v.optional(v.string()),
		description: v.string(),
		githubUrl: v.optional(v.string()),
		liveUrl: v.optional(v.string()),
		languages: v.array(v.string()),
		categories: v.array(v.string()),
		year: v.optional(v.number()),
		captureType: v.union(
			v.literal("terminal-recording"),
			v.literal("ios-simulator"),
			v.literal("web-embed"),
			v.literal("screen-recording"),
			v.literal("photo-gallery"),
			v.literal("mixed"),
		),
		media: v.array(v.object({
			assetId: v.id("mediaAssets"),
			label: v.string(),
			featured: v.optional(v.boolean()),
		})),
		tier: v.union(v.literal(1), v.literal(2), v.literal(3)),
		layout: v.optional(v.union(
			v.literal("editorial"),
			v.literal("grid"),
			v.literal("filmstrip"),
			v.literal("longform"),
		)),
		visible: v.boolean(),
		order: v.number(),
	}).index("by_tier", ["tier"])
		.index("by_order", ["order"])
		.index("by_slug", ["slug"])
		.index("by_visible", ["visible", "order"]),

	photoCollections: defineTable({
		slug: v.string(),
		title: v.string(),
		description: v.optional(v.string()),
		coverAssetId: v.optional(v.id("mediaAssets")),
		assetIds: v.array(v.id("mediaAssets")),
		layout: v.optional(v.union(
			v.literal("masonry"),
			v.literal("grid"),
			v.literal("filmstrip"),
			v.literal("editorial"),
		)),
		visible: v.boolean(),
		order: v.number(),
	}).index("by_order", ["order"])
		.index("by_slug", ["slug"])
		.index("by_visible", ["visible", "order"]),
});
