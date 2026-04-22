import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedMedia = mutation({
	handler: async (ctx) => {
		// Check if already seeded
		const existingAssets = await ctx.db.query("mediaAssets").take(1);
		if (existingAssets.length > 0) {
			return { status: "already seeded", assets: 0, showcases: 0, collections: 0 };
		}

		// 1. Seed Media Assets
		const assetIds = [];
		
		// Photos
		const photo1Id = await ctx.db.insert("mediaAssets", {
			type: "photo",
			title: "VFX Engine Architecture",
			url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
			colorProfile: "srgb",
			order: 1,
			visible: true,
		});
		assetIds.push(photo1Id);

		const photo2Id = await ctx.db.insert("mediaAssets", {
			type: "photo",
			title: "Interface Study 01",
			url: "https://images.unsplash.com/photo-1581291518655-9523bb99a9f4?q=80&w=2070&auto=format&fit=crop",
			colorProfile: "display-p3",
			order: 2,
			visible: true,
		});
		assetIds.push(photo2Id);

		// Videos
		const video1Id = await ctx.db.insert("mediaAssets", {
			type: "video",
			title: "VFX Demo",
			muxPlaybackId: "DS00Spx1CV902MCt979R69id898B688v6984sIn01nZbg",
			deviceFrame: "terminal",
			order: 3,
			visible: true,
		});
		assetIds.push(video1Id);

		// GIFs
		const gif1Id = await ctx.db.insert("mediaAssets", {
			type: "gif",
			title: "Pixel Animation",
			url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndnB3bWJnd3B3bWJnd3B3bWJnd3B3bWJnd3B3bWJnd3B3JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxx5G7XW6vK/giphy.gif",
			order: 4,
			visible: true,
		});
		assetIds.push(gif1Id);

		// 2. Seed Project Showcases
		const vfxShowcaseId = await ctx.db.insert("projectShowcases", {
			slug: "vfx",
			title: "vfx — Terminal Graphics Engine",
			tagline: "High-performance Braille-based rendering for the terminal",
			description: "A Rust and Go based graphics engine that renders complex 3D scenes using Braille characters, achieving 60fps in standard terminal emulators.",
			languages: ["Rust", "Go", "C++"],
			categories: ["Visual Computing", "Terminal", "System Tools"],
			year: 2026,
			captureType: "terminal-recording",
			media: [
				{ assetId: video1Id, label: "Terminal Demo", featured: true },
				{ assetId: photo1Id, label: "System Architecture" },
			],
			tier: 1,
			layout: "editorial",
			visible: true,
			order: 1,
		});

		const interfaceShowcaseId = await ctx.db.insert("projectShowcases", {
			slug: "interface-studies",
			title: "Interface Design Studies",
			tagline: "Exploring the boundary of physical and digital controls",
			description: "A series of interactive prototypes exploring custom hardware-inspired UI components in the browser.",
			languages: ["TypeScript", "Svelte", "GLSL"],
			categories: ["Design Engineering", "UI/UX"],
			year: 2025,
			captureType: "mixed",
			media: [
				{ assetId: photo2Id, label: "Knob Prototype", featured: true },
				{ assetId: gif1Id, label: "Interaction Loop" },
			],
			tier: 2,
			layout: "grid",
			visible: true,
			order: 2,
		});

		// 3. Seed Photo Collections
		await ctx.db.insert("photoCollections", {
			slug: "archival-scans",
			title: "Archival Scans 2024-2026",
			description: "A collection of 35mm film scans and digital captures exploring texture and light.",
			coverAssetId: photo1Id,
			assetIds: [photo1Id, photo2Id],
			layout: "masonry",
			visible: true,
			order: 1,
		});

		return { 
			status: "seeded", 
			assets: assetIds.length, 
			showcases: 2, 
			collections: 1 
		};
	},
});
