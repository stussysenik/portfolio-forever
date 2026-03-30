import { mutation } from "./_generated/server";

export const seedWorks = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("worksEntries").first();
		if (existing) return "Works already seeded";

		const projects = [
			{ title: "mymind.com clone", url: "https://curate-your-own-network.stussysenik.com", category: "personal software", preview: "/previews/curate-your-own-network.png", featured: "orange", year: 2026, month: 1 },
			{ title: "iPod emulator", url: "https://ipod-music.vercel.app", category: "tool", viewport: 2.0, cam: "center 30%", featured: "cloud", year: 2026, month: 1, tools: ["JavaScript", "WebGL", "ARKit"] },
			{ title: "spinning wheel AR face filter lottery", url: "https://spinning-wheel-filter.vercel.app", category: "tool", viewport: 2.5, cam: "center center", featured: "ocean", year: 2026, month: 1, tools: ["JavaScript", "WebGL", "ARKit"] },
			{ title: "uyr-problem", url: "https://uyr-problem.vercel.app", category: "tool", viewport: 2.5, cam: "top center", featured: "cloud", year: 2025, month: 12, tools: ["JavaScript", "WebGL"] },
			{ title: "infinite checklist", url: "https://infinite-checklist.vercel.app", category: "tool", viewport: 2.5, cam: "top center", year: 2025, month: 12 },
			{ title: "typewriter that doesn't delete, or can't go back", url: "https://clean-writer.vercel.app", category: "tool", viewport: 2.5, cam: "top left", featured: "gold", year: 2025, month: 12 },
			{ title: "ARE YOU HAVING A CREATIVE BLOCK?", url: "https://creative-block.vercel.app", category: "art", viewport: 2.5, cam: "center center", featured: "ocean", year: 2025, month: 12 },
			{ title: "AR b-boy filter", url: "https://bboy-filter.vercel.app", category: "AR/XR", viewport: 2.5, cam: "center center", featured: "pink", year: 2025, month: 12 },
			{ title: "PH-213 - Electricity, Current and Magnetism concepts viz", url: "https://ph213.vercel.app", category: "science", viewport: 2.5, cam: "top center", featured: "electric-green", year: 2024, month: 11 },
			{ title: "DVD corner video animation", url: "https://dvd-video-animation.vercel.app", category: "art", viewport: 2.5, cam: "center center", year: 2025, month: 2, tools: ["Three.js", "WebGL"] },
			{ title: "@WAVELENGTH RADIO", url: "https://wavelength-radio.vercel.app", category: "music DJ", viewport: 2.0, cam: "center center", featured: "cloud", year: 2024, month: 10 },
		];

		for (let i = 0; i < projects.length; i++) {
			await ctx.db.insert("worksEntries", { ...projects[i], order: i, visible: true });
		}
		return `Seeded ${projects.length} works`;
	},
});

export const seedTalks = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("talksEntries").first();
		if (existing) return "Talks already seeded";

		const entries = [
			{ title: "26' season", entryType: "talk" as const, year: 2025, month: 12, links: [{ label: "info", url: "#" }] },
			{ title: "good things are coming (soon)", entryType: "interview" as const, year: 2025, month: 12, links: [{ label: "link", url: "#" }] },
		];

		for (let i = 0; i < entries.length; i++) {
			await ctx.db.insert("talksEntries", { ...entries[i], order: i, visible: true });
		}
		return `Seeded ${entries.length} talks`;
	},
});

export const seedAcademia = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("academicEntries").collect();
		if (existing.length > 1) return "Academia already seeded";

		const papers = [
			{
				title: "WHAC: World-grounded Humans and Cameras",
				authors: "Stüssy Senik (re-implementation)",
				venue: "ECCV",
				year: 2024,
				description: "Re-implementation of pose estimation in crowds — rethinking multi-person 3D human pose and shape recovery with world-grounded coordinates.",
				paperUrl: "https://arxiv.org/abs/2403.12959",
				codeUrl: "https://github.com/stussysenik",
			},
			{
				title: "ProMoT HMR: Prompt-based Motion Transformer for Human Mesh Recovery",
				authors: "Stüssy Senik (re-implementation)",
				year: 2024,
				description: "Re-implementation exploring prompt-based conditioning for temporal human mesh recovery with motion transformers.",
				codeUrl: "https://github.com/stussysenik",
			},
			{
				title: "SAM 3D: Segment Anything in 3D",
				authors: "Stüssy Senik (re-implementation)",
				year: 2024,
				description: "Re-implementation of extending Segment Anything Model to 3D point clouds and volumetric data for zero-shot 3D segmentation.",
				paperUrl: "https://arxiv.org/abs/2306.03908",
				codeUrl: "https://github.com/stussysenik",
			},
			{
				title: "GVHMR: World-Grounded Human Motion Recovery via Gravity-View Coordinates",
				authors: "Stüssy Senik (re-implementation)",
				venue: "SIGGRAPH",
				year: 2024,
				description: "Re-implementation of gravity-aware coordinate system for robust global human motion recovery from monocular video.",
				paperUrl: "https://arxiv.org/abs/2409.06662",
				codeUrl: "https://github.com/stussysenik",
			},
			{
				title: "JOSH: Joint Supervised and Self-Supervised Human Mesh Recovery",
				authors: "Stüssy Senik (re-implementation)",
				year: 2024,
				description: "Re-implementation combining supervised and self-supervised losses for more robust human mesh recovery without full 3D annotation.",
				codeUrl: "https://github.com/stussysenik",
			},
			{
				title: "DPVO: Deep Patch Visual Odometry",
				authors: "Stüssy Senik (re-implementation)",
				venue: "NeurIPS",
				year: 2023,
				description: "Re-implementation of deep patch-based visual odometry using recurrent neural networks for accurate camera trajectory estimation.",
				paperUrl: "https://arxiv.org/abs/2208.04726",
				codeUrl: "https://github.com/stussysenik",
			},
			{
				title: "MotionBERT: Unified Pretraining for Human Motion Analysis",
				authors: "Stüssy Senik (re-implementation)",
				venue: "ICCV",
				year: 2023,
				description: "Re-implementation of the unified pretraining framework for human motion understanding — 3D pose estimation, mesh recovery, and action recognition.",
				paperUrl: "https://arxiv.org/abs/2210.06085",
				codeUrl: "https://github.com/stussysenik",
			},
		];

		for (let i = 0; i < papers.length; i++) {
			await ctx.db.insert("academicEntries", { ...papers[i], order: i, visible: true });
		}
		return `Seeded ${papers.length} academic papers`;
	},
});

export const seedLikes = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("likesCategories").first();
		if (existing) return "Likes already seeded";

		const categories = [
			{ title: "THINGS I LIKE", items: ["music", "film", "design", "code", "community radio", "open source", "cooking", "breakdancing"] },
			{ title: "BOTTLED WISHES/GOALS FOR THIS YEAR", items: ["balance", "courage", "adventure", "growth", "freedom", "abundance"] },
			{ title: "THINGS I HAVE BROKEN", items: ["cameras", "hard drives", "headphones", "deadlines"] },
			{ title: "WISHLIST", items: ["Hasselblad 500C", "field recorder", "Risograph printer", "a month of silence"] },
		];

		for (let i = 0; i < categories.length; i++) {
			await ctx.db.insert("likesCategories", { ...categories[i], order: i, visible: true });
		}
		return `Seeded ${categories.length} likes categories`;
	},
});

export const seedGifts = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("giftsConfig").first();
		if (existing) return "Gifts already seeded";

		await ctx.db.insert("giftsConfig", {
			title: "The Promise",
			manifesto: "I build and design a lot of things with free value in mind. In return, you could send me kind gifts in the form of art supplies or film medium.",
			contactEmail: "itsmxzou@gmail.com",
			callToAction: "Send books, postcards, or art supplies →",
			visible: true,
		});
		return "Seeded gifts config";
	},
});
