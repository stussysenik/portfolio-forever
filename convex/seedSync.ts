import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * RESET AND SYNC SEED
 * This mutation resets core content tables and populates them from the
 * canonical Clojure data source (content.cljs, cv.cljs, labs.cljs).
 * 
 * Objectives:
 * 1. Restore missing Hero config.
 * 2. Sync works, cv, academia, labs, and blog.
 * 3. Optimize navigation order for trust & reliability (Mature Architecture).
 * 4. Archive media-heavy or low-signal sections.
 */
export const syncFromClojure = mutation({
	args: {},
	handler: async (ctx) => {
		// 1. CLEAR EXISTING DATA (Selective to avoid total wipe of meta tables)
		const tablesToReset = [
			"sectionRegistry",
			"pages",
			"cvProfile",
			"cvEntries",
			"cvLanguages",
			"worksEntries",
			"academicEntries",
			"labEntries",
			"blogPosts",
			"likesCategories",
			"heroCaseStudies",
		] as const;

		for (const table of tablesToReset) {
			const docs = await ctx.db.query(table as any).collect();
			for (const doc of docs) {
				await ctx.db.delete(doc._id);
			}
		}

		// 2. SEED PROFILE (from cv.cljs)
		const profileId = await ctx.db.insert("cvProfile", {
			name: 'MENGXUAN "SENIK" ZOU',
			jobTitle: "Design Engineer & Creative Producer",
			url: "https://www.stussysenik.com",
			summary: "Polymath engineer at the convergence of software, film, music, and design. Formally trained at Cooper Union and FAMU Prague, with production experience spanning B2B product engineering, simultaneous translation across 4 languages, community radio, and EU-funded filmmaking. Building tools and experiences for 1 billion people in mind.",
			sameAs: [
				"https://github.com/stussysenik",
				"https://www.linkedin.com/in/mxzou",
				"https://instagram.com/mx.zou",
				"https://www.imdb.com/name/nm14502866/",
				"https://mengxuanzou.com",
				"https://mxzou.com",
			],
			knowsAbout: [
				{ name: "Creative Coding", proficiency: 0.9 },
				{ name: "Visual Design", proficiency: 0.9 },
				{ name: "Three.js & WebGL", proficiency: 0.85 },
				{ name: "Motion Design", proficiency: 0.85 },
				{ name: "Art Direction", proficiency: 0.85 },
				{ name: "WebGPU & WASM", proficiency: 0.8 },
				{ name: "Filmmaking", proficiency: 0.8 },
				{ name: "3D & CGI", proficiency: 0.8 },
				{ name: "UX & Product Design", proficiency: 0.75 },
			],
			taglines: [
				{ lang: "de", text: "Design Engineer · Creative Producer" },
				{ lang: "ja", text: "クリエイティブ・テクノロジスト" },
			],
			shortBio: "Building at the intersection of engineering, creative production, and design — from code to camera",
			location: "NYC / PRAGUE",
			available: true,
			email: "itsmxzou@gmail.com",
			edition: "01",
			createdDate: "January 2026",
		});

		// 3. SEED CV ENTRIES (from cv.cljs)
		const cvEntries = [
			{ type: "work" as const, title: "AI/ML Growth Product Design Engineer", organization: "Attendu", location: "Prague, Czechia", startDate: "2026-02", endDate: "present", description: "Shipping production-ready B2B features for high-trust coding scenarios; contributed to product reaching #1 Product of the Day on Product Hunt (Sep 2025)", highlights: ["Rapid-building production-ready software for B2B high-trust, risk, safety and resilience coding scenarios", "T-shaped development spanning QA assurance and product ownership", "Setting leadership in the Czech market for parallel agent development and DevOps"], tools: ["TypeScript", "SvelteKit", "AI/ML", "DevOps"] },
			{ type: "work" as const, title: "Growth Hacker", organization: "@WAVELENGTH RADIO", location: "New York, United States", startDate: "2024-09", endDate: "present", description: "Founded and grew a global radio community platform inspired by Virgil Abloh's legacy, producing pocket-sized audio experiences", highlights: ["Built wavelengthradio.media — a global site for radio community listeners", "Produced digital Letters — pocket-sized audio experiences tunneling past, present, and future"], url: "https://www.wavelengthradio.media" },
			{ type: "work" as const, title: "Business Development Translator", organization: "Dahua Technology", location: "Budapest, Hungary", startDate: "2025-10", endDate: "2026-02", description: "Managed bilingual communication (Chinese to Czech) for 100+ attendees at a B2B event covering AI/ML camera monitoring and chip technology advancements", highlights: ["Facilitated smooth cross-cultural communication for B2B camera monitoring systems and AI/ML technology presentations"] },
			{ type: "work" as const, title: "Simultaneous Translator", organization: "RIWAY International", location: "Singapore", startDate: "2021-01", endDate: "2022-03", description: "Simultaneously translated multi-day conference events (500+ attendees) across English, Chinese, and Czech — covering medical, business, and negotiation topics", highlights: ["Translated several multi-day conferences with 500+ attendees across EN/ZH/CZ", "Covered medical health, business sales, and negotiation subject matter"] },
			{ type: "education" as const, title: "Engineering Technology", organization: "The Cooper Union for the Advancement of Science and Art", location: "New York, NY", startDate: "2022-09", endDate: "2025-05", description: "Dropped out junior year to self-learn advanced computer science topics — deep learning, computer vision, and systems engineering" },
			{ type: "education" as const, title: "AAS, Film Production & Creative Management", organization: "Academy of Performing Arts in Prague (FAMU)", location: "Prague, Czechia", startDate: "2021-07", endDate: "2022-07", description: "Film production and creative management at one of the oldest film schools in Europe" },
			{ type: "award" as const, title: "#1 Product of the Day", organization: "Product Hunt", startDate: "2025-09", description: "Attendu — recognized as the top product launch of the day" },
		];

		for (let i = 0; i < cvEntries.length; i++) {
			await ctx.db.insert("cvEntries", { ...cvEntries[i], order: i, visible: true });
		}

		// 4. SEED WORKS (from content.cljs)
		const works = [
			{ year: 2026, month: 1, title: "mymind.com clone", url: "https://curate-your-own-network.stussysenik.com", linkLabel: "personal software", featured: "orange", category: "personal software", preview: "/previews/curate-your-own-network.png" },
			{ year: 2026, month: 1, title: "iPod emulator", url: "https://ipod-music.vercel.app", linkLabel: "link", featured: "cloud", category: "tool", tools: ["JavaScript", "WebGL", "ARKit"] },
			{ year: 2026, month: 1, title: "spinning wheel AR face filter lottery", url: "https://spinning-wheel-filter.vercel.app", linkLabel: "try here", featured: "ocean", category: "tool", tools: ["JavaScript", "WebGL", "ARKit"] },
			{ year: 2025, month: 12, title: "uyr-problem", url: "https://uyr-problem.vercel.app", linkLabel: "cooking", featured: "cloud", category: "tool", tools: ["JavaScript", "WebGL"] },
			{ year: 2025, month: 12, title: "infinite checklist", url: "https://infinite-checklist.vercel.app", linkLabel: "todo", category: "tool" },
			{ year: 2025, month: 12, title: "typewriter that doesn't delete, or can't go back", url: "https://clean-writer.vercel.app", linkLabel: "try here", featured: "gold", category: "tool" },
			{ year: 2025, month: 12, title: "ARE YOU HAVING A CREATIVE BLOCK?", url: "https://creative-block.vercel.app", linkLabel: "link", featured: "ocean", category: "art" },
			{ year: 2025, month: 12, title: "AR b-boy filter", url: "https://bboy-filter.vercel.app", linkLabel: "link", featured: "pink", category: "AR/XR" },
			{ year: 2024, month: 11, title: "PH-213 - Electricity, Current and Magnetism concepts viz", url: "https://ph213.vercel.app", linkLabel: "https", featured: "electric-green", category: "science" },
			{ year: 2025, month: 2, title: "DVD corner video animation", url: "https://dvd-video-animation.vercel.app", linkLabel: "link", category: "art", tools: ["Three.js", "WebGL"] },
			{ year: 2024, month: 10, title: "@WAVELENGTH RADIO", url: "https://wavelength-radio.vercel.app", linkLabel: "link", featured: "cloud", category: "music DJ" },
		];

		for (let i = 0; i < works.length; i++) {
			await ctx.db.insert("worksEntries", { ...works[i], order: i, visible: true });
		}

		// 5. SEED ACADEMIA (Robust architecture / trust signals)
		const academia = [
			{ title: "WHAC: World-grounded Humans and Cameras", authors: "Stüssy Senik (re-implementation)", venue: "ECCV", year: 2024, description: "Re-implementation of pose estimation in crowds — rethinking multi-person 3D human pose and shape recovery with world-grounded coordinates.", paperUrl: "https://arxiv.org/abs/2403.12959", codeUrl: "https://github.com/stussysenik" },
			{ title: "ProMoT HMR: Prompt-based Motion Transformer for Human Mesh Recovery", authors: "Stüssy Senik (re-implementation)", year: 2024, description: "Re-implementation exploring prompt-based conditioning for temporal human mesh recovery with motion transformers.", codeUrl: "https://github.com/stussysenik" },
			{ title: "SAM 3D: Segment Anything in 3D", authors: "Stüssy Senik (re-implementation)", year: 2024, description: "Re-implementation of extending Segment Anything Model to 3D point clouds and volumetric data for zero-shot 3D segmentation.", paperUrl: "https://arxiv.org/abs/2306.03908", codeUrl: "https://github.com/stussysenik" },
		];

		for (let i = 0; i < academia.length; i++) {
			await ctx.db.insert("academicEntries", { ...academia[i], order: i, visible: true });
		}

		// 6. SEED LABS (from labs.cljs)
		const labs = [
			{ slug: "raymarch-wgsl", title: "WGSL Raymarcher", description: "Real-time raymarched 3D scene entirely in WebGPU compute shaders.", date: "2025-01-02", status: "stable" as const, requiredFeatures: ["webgpu"], tags: ["raymarching", "webgpu"], memoryBudget: 128 },
			{ slug: "particle-physics", title: "GPU Particle System", description: "100,000+ particles with physics simulation running entirely on GPU compute.", date: "2024-12-15", status: "stable" as const, requiredFeatures: ["webgpu"], tags: ["particles", "physics"], memoryBudget: 256 },
			{ slug: "wasm-fluid", title: "WASM Fluid Simulation", description: "Navier-Stokes fluid dynamics solver compiled from Rust to WebAssembly.", date: "2024-11-28", status: "beta" as const, requiredFeatures: ["wasm"], tags: ["fluid", "wasm", "rust"], memoryBudget: 384 },
		];

		for (let i = 0; i < labs.length; i++) {
			await ctx.db.insert("labEntries", { ...labs[i], order: i, visible: true });
		}

		// 6.5. SEED BLOG POSTS (from content.cljs)
		const blogPosts = [
			{ slug: "webgpu-compute", title: "WebGPU Compute Shaders for Generative Art", publishedAt: "2026-04-10", excerpt: "A deep dive into using WebGPU compute shaders for real-time generative art.", tags: ["webgpu", "graphics", "rust"], visible: true, order: 0 },
			{ slug: "clojure-svelte", title: "Expressiveness in UI: Clojure and Svelte", publishedAt: "2026-03-25", excerpt: "How we ported our portfolio logic to Clojure (Squint) while keeping Svelte 5 for rendering.", tags: ["clojure", "svelte", "architecture"], visible: true, order: 1 },
			{ slug: "minimalism", title: "Digital Minimalism in 2026", publishedAt: "2026-02-15", excerpt: "Why websites should be fast, accessible, and respect user autonomy.", tags: ["design", "minimalism", "ux"], visible: true, order: 2 },
		];

		for (const post of blogPosts) {
			await ctx.db.insert("blogPosts", post);
		}

		// 6.7. SEED TALKS & INTERVIEWS (from content.cljs)
		const talks = [
			{ title: "Building and Operating an Architecture for 1 Billion People", entryType: "talk" as const, year: 2026, month: 4, links: [{ label: "RSVP", url: "#" }], order: 0, visible: true },
			{ title: "The Convergence of Code and Camera", entryType: "talk" as const, year: 2025, month: 11, links: [{ label: "Video", url: "#" }], order: 1, visible: true },
			{ title: "Why digital minimalism is the future of the web", entryType: "interview" as const, year: 2026, month: 2, links: [{ label: "Read", url: "#" }], order: 2, visible: true },
		];

		for (const talk of talks) {
			await ctx.db.insert("talksEntries", talk);
		}

		// 7. SEED HERO CASE STUDIES (Trust signals)
		const studies = [
			{ title: "Attendu Platform Overhaul", role: "Lead Design Engineer", timeToShip: "2 weeks", framework: "SvelteKit + Tailwind", problem: "Aesthetics were high, but conversion funnel lacked trust signals.", constraint: "Strict 2-week timeline before Series A raise.", result: "Increased demo conversions by 42% post-rebuild.", order: 0, visible: true },
			{ title: "Claude Code Elixir Runtime", role: "Architect", timeToShip: "3 days", framework: "Elixir/OTP + Zig", problem: "Need for an extremely reliable local-first runtime without JS lockouts.", constraint: "OTP concurrency limits & native OS file access.", result: "Zero-downtime robust recovery model scaled to 10k messages.", order: 1, visible: true },
		];

		for (const study of studies) {
			await ctx.db.insert("heroCaseStudies", study);
		}

		// 8. SECTION REGISTRY & PAGES (Optimized Order)
		// Home -> Works -> CV -> Academia -> Labs -> Blog -> Terminal -> Process -> [Archived...]
		const SECTIONS = [
			{ id: "hero", label: "Home", route: "/", order: 0, cellSpan: 12, cellAspect: "wide", previewType: "list", accentColor: "blue", dataTable: undefined, visible: true },
			{ id: "works-grid", label: "Works", route: "/works", order: 1, cellSpan: 8, cellAspect: "golden", previewType: "list", accentColor: "green", dataTable: "worksEntries", visible: true, viewMode: "case-study" },
			{ id: "cv", label: "CV", route: "/cv", order: 2, cellSpan: 4, cellAspect: "square", previewType: "timeline", accentColor: "muted", dataTable: "cvEntries", visible: true },
			{ id: "academia", label: "Re:mix", route: "/academia", order: 3, cellSpan: 4, cellAspect: "square", previewType: "grid", accentColor: "blue", dataTable: "academicEntries", visible: true },
			{ id: "labs", label: "Labs", route: "/labs", order: 4, cellSpan: 4, cellAspect: "square", previewType: "list", accentColor: "green", dataTable: "labEntries", visible: true },
			{ id: "blog-feed", label: "Blog", route: "/blog", order: 5, cellSpan: 4, cellAspect: "square", previewType: "list", accentColor: "muted", dataTable: "blogPosts", visible: true },
			{ id: "terminal", label: "Terminal", route: "/terminal", order: 6, cellSpan: 4, cellAspect: "square", previewType: "terminal", accentColor: "green", dataTable: undefined, visible: true },
			{ id: "process", label: "Process", route: "/process", order: 7, cellSpan: 4, cellAspect: "square", previewType: "cycle", accentColor: "muted", dataTable: undefined, visible: true },
			{ id: "timeline", label: "Talks", route: "/talks", order: 8, cellSpan: 4, cellAspect: "square", previewType: "grid", accentColor: "muted", dataTable: "talksEntries", visible: false }, // Archived
			{ id: "likes", label: "Likes", route: "/likes", order: 9, cellSpan: 4, cellAspect: "square", previewType: "list", accentColor: "muted", dataTable: "likesCategories", visible: false }, // Archived
			{ id: "gallery", label: "Gallery", route: "/gallery", order: 10, cellSpan: 4, cellAspect: "square", previewType: "mosaic", accentColor: "blue", dataTable: "galleryItems", visible: false }, // Archived
			{ id: "gifts", label: "Gifts", route: "/gifts", order: 11, cellSpan: 4, cellAspect: "square", previewType: "list", accentColor: "muted", dataTable: "giftsConfig", visible: false }, // Archived
			{ id: "minor", label: "Minor", route: "/minor", order: 12, cellSpan: 4, cellAspect: "square", previewType: "list", accentColor: "muted", dataTable: "minorEntries", visible: false }, // Archived
			{ id: "os", label: "OS", route: "/os", order: 13, cellSpan: 4, cellAspect: "square", previewType: "desktop", accentColor: "blue", dataTable: undefined, visible: false },
		];

		const SECTION_DEFAULTS = {
			adminVisible: true,
			viewMode: "grid",
			animationBg: "none",
			animationSpeed: 1,
			animationOpacity: 0.5,
			immune: false,
		};

		for (const s of SECTIONS) {
			await ctx.db.insert("sectionRegistry", {
				sectionId: s.id,
				label: s.label,
				route: s.route,
				order: s.order,
				visible: s.visible,
				cellSpan: s.cellSpan,
				cellAspect: s.cellAspect,
				previewType: s.previewType,
				accentColor: s.accentColor,
				dataTable: s.dataTable,
				...SECTION_DEFAULTS,
			});

			await ctx.db.insert("pages", {
				pageId: s.id === "hero" ? "home" : (s.id === "works-grid" ? "works" : (s.id === "blog-feed" ? "blog" : (s.id === "timeline" ? "talks" : s.id))),
				label: s.label,
				route: s.route,
				navOrder: s.order,
				navVisible: s.visible && s.id !== "hero",
				visible: true,
				archived: !s.visible,
				sections: [{
					sectionType: s.id,
					config: {},
					dataTable: s.dataTable,
					order: 0,
				}],
			});
		}

		// 9. ENSURE HERO CONFIG EXISTS
		const existingHero = await ctx.db.query("heroConfig").first();
		if (!existingHero) {
			await ctx.db.insert("heroConfig", {
				showVelocity: false,
				showAsciiDonut: true,
				showAsciiWave: false,
				showPixelArt: false,
				layout: "default",
				accentColor: "blue",
			});
		}

		return "Database synced with Clojure version and optimized for Trust/Reliability.";
	},
});
