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

export const seedProfileExtended = mutation({
	handler: async (ctx) => {
		const profile = await ctx.db.query("cvProfile").first();
		if (!profile) return "No cvProfile doc found — skipping";

		await ctx.db.patch(profile._id, {
			taglines: [
				{ lang: "de", text: "Design Engineer · Creative Producer" },
				{ lang: "ja", text: "デザインエンジニア · クリエイティブプロデューサー" },
			],
			shortBio: "Building at the intersection of engineering, creative production, and design — from code to camera",
			location: "NYC / PRAGUE",
			available: true,
			email: "itsmxzou@gmail.com",
			edition: "01",
			createdDate: "January 2026",
		});
		return "Patched cvProfile with hero fields";
	},
});

export const seedGallery = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("galleryItems").first();
		if (existing) return "Gallery already seeded";

		const items = [
			{ title: "Three.js", thumbnailUrl: "/gallery/threejs.jpg", category: ["technology"], year: 2010 },
			{ title: "Under Neon Lights", thumbnailUrl: "/gallery/neon.jpg", category: ["film", "art"], year: 2017 },
			{ title: "3D Comic", thumbnailUrl: "/gallery/comic.jpg", category: ["technology", "art"], year: 2020 },
			{ title: "<model-viewer>", thumbnailUrl: "/gallery/model-viewer.jpg", category: ["technology"], year: 2018 },
			{ title: "Crystal", thumbnailUrl: "/gallery/crystal.jpg", category: ["art", "technology"], year: 2017 },
			{ title: "Obsolidian", thumbnailUrl: "/gallery/obsolidian.jpg", category: ["technology"], year: 2020 },
		];

		for (let i = 0; i < items.length; i++) {
			await ctx.db.insert("galleryItems", { ...items[i], order: i, visible: true });
		}
		return `Seeded ${items.length} gallery items`;
	},
});

export const seedLabs = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("labEntries").first();
		if (existing) return "Labs already seeded";

		const experiments = [
			{
				slug: "raymarch-wgsl",
				title: "WGSL Raymarcher",
				description: "Real-time raymarched 3D scene entirely in WebGPU compute shaders. Includes SDF primitives, soft shadows, and ambient occlusion.",
				date: "2025-01-02",
				status: "stable" as const,
				requiredFeatures: ["webgpu"],
				entryPoint: "/static/labs/raymarch-wgsl/index.html",
				fallbackImage: "/static/labs/raymarch-wgsl/fallback.png",
				sourceUrl: "https://github.com/username/raymarch-wgsl",
				tags: ["raymarching", "webgpu", "sdf", "compute"],
				memoryBudget: 128,
			},
			{
				slug: "particle-physics",
				title: "GPU Particle System",
				description: "100,000+ particles with physics simulation running entirely on GPU compute. Includes attractor fields and collision detection.",
				date: "2024-12-15",
				status: "stable" as const,
				requiredFeatures: ["webgpu", "shared-array-buffer"],
				entryPoint: "/static/labs/particle-physics/index.html",
				fallbackImage: "/static/labs/particle-physics/fallback.png",
				sourceUrl: "https://github.com/username/particle-physics",
				tags: ["particles", "physics", "compute", "simulation"],
				memoryBudget: 256,
			},
			{
				slug: "wasm-fluid",
				title: "WASM Fluid Simulation",
				description: "Navier-Stokes fluid dynamics solver compiled from Rust to WebAssembly. Rendered with WebGL2 for maximum compatibility.",
				date: "2024-11-28",
				status: "beta" as const,
				requiredFeatures: ["wasm", "webgl2"],
				entryPoint: "/static/labs/wasm-fluid/index.html",
				fallbackImage: "/static/labs/wasm-fluid/fallback.png",
				sourceUrl: "https://github.com/username/wasm-fluid",
				tags: ["fluid", "physics", "wasm", "rust"],
				memoryBudget: 384,
			},
			{
				slug: "audio-visualizer",
				title: "Audio Worklet Visualizer",
				description: "Real-time FFT analysis using Audio Worklet with GPU-accelerated visualization. Feed it any audio source.",
				date: "2024-10-20",
				status: "stable" as const,
				requiredFeatures: ["audio-worklet", "webgl2"],
				entryPoint: "/static/labs/audio-visualizer/index.html",
				fallbackImage: "/static/labs/audio-visualizer/fallback.png",
				tags: ["audio", "fft", "visualization", "worklet"],
				memoryBudget: 64,
			},
			{
				slug: "fractal-zoom",
				title: "Mandelbrot Zoom",
				description: "Infinite zoom into the Mandelbrot set with arbitrary precision arithmetic. Switch between GPU and CPU renderers.",
				date: "2024-09-10",
				status: "experimental" as const,
				requiredFeatures: ["webgpu"],
				entryPoint: "/static/labs/fractal-zoom/index.html",
				fallbackImage: "/static/labs/fractal-zoom/fallback.png",
				tags: ["fractal", "math", "precision", "compute"],
				memoryBudget: 512,
			},
			{
				slug: "ascii-render",
				title: "ASCII 3D Renderer",
				description: "Classic 3D objects rendered as ASCII art. Uses WebGL for actual rendering, then converts to text output.",
				date: "2024-08-01",
				status: "archived" as const,
				requiredFeatures: ["webgl2"],
				entryPoint: "/static/labs/ascii-render/index.html",
				fallbackImage: "/static/labs/ascii-render/fallback.png",
				sourceUrl: "https://github.com/username/ascii-render",
				tags: ["ascii", "3d", "webgl", "retro"],
				memoryBudget: 32,
			},
		];

		for (let i = 0; i < experiments.length; i++) {
			await ctx.db.insert("labEntries", { ...experiments[i], order: i, visible: true });
		}
		return `Seeded ${experiments.length} lab experiments`;
	},
});

export const seedBlog = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("blogPosts").first();
		if (existing) return "Blog already seeded";

		const posts = [
			{
				title: "Building a Portfolio with SvelteKit + Convex",
				slug: "sveltekit-convex-portfolio",
				content: "<h2>Why SvelteKit + Convex?</h2><p>After years of fighting with SSR, hydration mismatches, and stale data, I rebuilt my portfolio on a stack that just works. SvelteKit handles routing and rendering. Convex handles everything else — real-time data, mutations, subscriptions — with zero boilerplate.</p><p>The result: a portfolio that updates live when I edit it from the admin panel. No deploy needed. No cache invalidation. Just change and see.</p><h2>Architecture</h2><p>The key insight: every piece of content lives in Convex. Pages are composed of sections. Sections reference data tables. The admin panel writes to Convex; the frontend subscribes to changes. It's reactive all the way down.</p>",
				excerpt: "How real-time data and composable sections make a portfolio that updates itself.",
				tags: ["sveltekit", "convex", "architecture"],
				publishedAt: "2026-03-15",
				visible: true,
			},
			{
				title: "ASCII Art Algorithms for the Web",
				slug: "ascii-art-algorithms",
				content: "<h2>The Spinning Donut</h2><p>Andy Sloane's donut.c is a masterpiece of mathematical art — a torus rendered entirely in ASCII characters using nothing but trigonometry and a z-buffer. I ported it to TypeScript and Zig for my portfolio's hero section.</p><p>The algorithm works by sampling points on a torus surface, projecting them to 2D, and selecting a character based on surface luminance. The character set <code>.,-~:;=!*%#</code> maps darkness to density.</p><h2>Wave Fields</h2><p>For variety, I added a wave field generator: a 2D grid where each cell's character is determined by layered sine waves. The effect is hypnotic — like watching the ocean rendered in monospace.</p>",
				excerpt: "Porting donut.c to the browser and inventing new ASCII animations.",
				tags: ["ascii", "algorithms", "creative-coding"],
				publishedAt: "2026-03-20",
				visible: true,
			},
			{
				title: "On Design Engineering",
				slug: "on-design-engineering",
				content: "<h2>The Gap</h2><p>Design engineering sits in the gap between design and engineering — not as a compromise, but as its own discipline. A design engineer doesn't just implement mockups. They understand the material (code, browsers, interaction models) well enough to make design decisions in the medium itself.</p><p>The best interfaces I've built weren't pixel-perfect reproductions of Figma files. They were collaborations where the design evolved through implementation — where the constraints of the medium informed the design as much as the design informed the code.</p><h2>What It Takes</h2><p>Typography. Color theory. Motion design. Accessibility. Performance. State management. API design. These aren't separate concerns — they're facets of the same craft.</p>",
				excerpt: "Design engineering as its own discipline, not a compromise between design and code.",
				tags: ["design", "engineering", "craft"],
				publishedAt: "2026-04-01",
				visible: true,
			},
		];

		for (let i = 0; i < posts.length; i++) {
			await ctx.db.insert("blogPosts", { ...posts[i], order: i });
		}
		return `Seeded ${posts.length} blog posts`;
	},
});

export const seedHeroCaseStudies = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("heroCaseStudies").first();
		if (existing) return "Hero case studies already seeded";

		const studies = [
			{
				title: "Attendu Platform Overhaul",
				role: "Lead Design Engineer",
				timeToShip: "2 weeks",
				framework: "SvelteKit + Tailwind",
				problem: "Aesthetics were high, but conversion funnel lacked trust signals.",
				constraint: "Strict 2-week timeline before Series A raise.",
				result: "Increased demo conversions by 42% post-rebuild.",
				order: 0,
				visible: true,
			},
			{
				title: "Claude Code Elixir Runtime",
				role: "Architect",
				timeToShip: "3 days",
				framework: "Elixir/OTP + Zig",
				problem: "Need for an extremely reliable local-first runtime without JS lockouts.",
				constraint: "OTP concurrency limits & native OS file access.",
				result: "Zero-downtime robust recovery model scaled to 10k messages.",
				order: 1,
				visible: true,
			},
		];

		for (const study of studies) {
			await ctx.db.insert("heroCaseStudies", study);
		}
		return `Seeded ${studies.length} hero case studies`;
	},
});

export const seedMinor = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("minorEntries").first();
		if (existing) return "Minor entries already seeded";

		const lists: Array<{ category: string; text: string; year?: number; note?: string }> = [
			// lost
			{ category: "lost", text: "My favorite pen from 2019", year: 2019, note: "Still mourning" },
			{ category: "lost", text: "A single AirPod (left)", year: 2022 },
			{ category: "lost", text: "That book I was almost done reading", year: 2023 },
			{ category: "lost", text: "My sense of direction in IKEA", note: "Repeatedly" },
			{ category: "lost", text: "Several umbrellas", note: "I stopped counting" },
			{ category: "lost", text: "A really good idea I had at 3am", year: 2024 },
			// broken
			{ category: "broken", text: "My phone screen (3 times)", note: "Same corner each time" },
			{ category: "broken", text: "A vintage coffee mug", year: 2021, note: "RIP" },
			{ category: "broken", text: "The office printer", year: 2023, note: "It was already struggling" },
			{ category: "broken", text: "Several promises to go to bed early" },
			{ category: "broken", text: "The fourth wall", note: "Right now" },
			{ category: "broken", text: "A personal record for procrastination", year: 2024 },
			// learned
			{ category: "learned", text: "Coffee doesn't replace sleep", note: "Still trying though" },
			{ category: "learned", text: "Always read the error message first", year: 2020 },
			{ category: "learned", text: "That backup you skipped? You'll need it", year: 2022 },
			{ category: "learned", text: '"5 more minutes" is always a lie' },
			{ category: "learned", text: "The deployment on Friday rule exists for a reason", year: 2023 },
			{ category: "learned", text: "Sometimes the bug IS the feature", year: 2024 },
			// overrated
			{ category: "overrated", text: "Reply-all emails" },
			{ category: "overrated", text: '"Quick sync" meetings that last an hour' },
			{ category: "overrated", text: "Motivational posters in open offices" },
			{ category: "overrated", text: 'The word "synergy"' },
			{ category: "overrated", text: "Microwaved pizza", note: "Fight me" },
			{ category: "overrated", text: "Monday productivity", note: "A myth" },
			// underrated
			{ category: "underrated", text: "Silence in conversations" },
			{ category: "underrated", text: "The undo button", note: "Ctrl+Z supremacy" },
			{ category: "underrated", text: "Leaving a party early" },
			{ category: "underrated", text: "Reading documentation first", note: "Nobody does it" },
			{ category: "underrated", text: "A good night's sleep", year: 2024, note: "Rare but real" },
			{ category: "underrated", text: "The mute button in meetings" },
			// confused
			{ category: "confused", text: "CSS vertical centering", note: "Before flexbox" },
			{ category: "confused", text: "Time zones" },
			{ category: "confused", text: "Why printers sense fear" },
			{ category: "confused", text: "The rules of cricket" },
			{ category: "confused", text: "Where all my socks go" },
			{ category: "confused", text: "Why I have 47 browser tabs open" },
		];

		for (let i = 0; i < lists.length; i++) {
			await ctx.db.insert("minorEntries", { ...lists[i], order: i, visible: true });
		}
		return `Seeded ${lists.length} minor entries`;
	},
});
