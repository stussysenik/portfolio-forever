export type NavItem = {
	pageId?: string;
	label: string;
	route: string;
	navOrder?: number;
	archived?: boolean;
};

export type WorkEntry = {
	slug: string;
	title: string;
	client: string;
	year: string;
	status: string;
	summary: string;
	accent: string;
	surface: string;
	stack: string[];
	outcomes: string[];
	liveHref: string;
	internalHref?: string;
	externalHref?: string;
	preview?: string;
	previewMode?: "live" | "static" | "video";
	videoPreview?: string;
	muxPlaybackId?: string;
	linkLabel?: string;
	category?: string;
	previewSurface?: WorkPreviewSurface;
	primaryAction?: WorkActionLink;
	internalRoute?: WorkActionLink;
	externalLink?: WorkActionLink;
	embed: {
		eyebrow: string;
		headline: string;
		caption: string;
		metrics: Array<{
			label: string;
			value: string;
		}>;
	};
};

export type WorkPreviewSurfaceType = "internal" | "mux" | "video" | "static" | "embed";

export type WorkPreviewSurface = {
	type: WorkPreviewSurfaceType;
	label: string;
	href?: string;
	src?: string;
	poster?: string;
	playbackId?: string;
};

export type WorkActionLink = {
	href: string;
	label: string;
	external?: boolean;
};

export type PreviewTarget = {
	label: string;
	document: string;
	route: string;
	description: string;
};

export type CvEntry = {
	period: string;
	role: string;
	company: string;
	summary: string;
	bullets: string[];
};

export const fallbackNavItems: NavItem[] = [
	{ label: "hire me", route: "/hire" },
	{ label: "media", route: "/media" },
	{ label: "re:mix", route: "/re-mix" },
	{ label: "terminal", route: "/terminal" },
	{ label: "process", route: "/process" },
	{ label: "works", route: "/works" },
	{ label: "talks", route: "/talks" },
	{ label: "likes", route: "/likes" },
	{ label: "blog", route: "/blog" },
	{ label: "gifts", route: "/gifts" },
	{ label: "cv", route: "/cv" },
];

export const fallbackConnections = [
	{ label: "SOUNDCLOUD", url: "https://soundcloud.com/stussysenik" },
	{ label: "IMDB", url: "https://www.imdb.com/name/nm14502866/" },
	{ label: "GITHUB", url: "https://github.com/stussysenik" },
	{ label: "LINKEDIN", url: "https://linkedin.com/in/mxzou" },
	{ label: "INSTAGRAM", url: "https://instagram.com/mx.zou" },
	{ label: "X", url: "https://x.com/stussysenik" },
	{ label: "DRIBBBLE", url: "https://dribbble.com/stussysenik" },
	{ label: "BEHANCE", url: "https://behance.net/stussysenik" },
	{ label: "LETTERBOXD", url: "https://letterboxd.com/stussysenik" },
	{ label: "STORYGRAPH", url: "https://thestorygraph.com/profile/stussysenik" },
	{ label: "EMAIL", url: "mailto:hello@portfolio-forever.com" },
];

export const fallbackSiteConfig = {
	mode: "multi-page",
	navMode: "sidebar",
	footerEdition: "Made in NYC / Prague by STÜSSY SENIK",
};

export const homepageFallbackSlice = {
	source: "seed" as const,
	eyebrow: "~/portfolio available",
	title: "Stüssy Senik",
	summary:
		"Building at the intersection of engineering, creative production, and design — from code to camera.",
	ctaLabel: "Open selected works",
	ctaHref: "/works",
	meta: "NYC / PRAGUE · Available for projects",
};

export const fallbackRecentPosts = [
	{
		_id: "seed-preview-loop",
		title: "Designing a tighter preview loop for editorial work",
		slug: "tighter-preview-loop",
		publishedAt: "2026-04-20",
		excerpt:
			"Admin should feel like mission control: edit in Sanity, validate in Astro, keep the runtime surface separate and fast.",
	},
	{
		_id: "seed-astro-foundation",
		title: "Astro as the host runtime",
		slug: "astro-host-runtime",
		publishedAt: "2026-04-16",
		excerpt:
			"Static-first rendering makes the portfolio calmer, sharper, and easier to evolve without dragging the whole app into hydration.",
	},
	{
		_id: "seed-live-works",
		title: "Embedding works without losing editorial clarity",
		slug: "embedded-works",
		publishedAt: "2026-04-12",
		excerpt:
			"A work card should show outcome, stack, and a real preview without turning the page into a browser tab cemetery.",
	},
];

export const featuredWorks: WorkEntry[] = [
	{
		slug: "curate-your-own-network",
		title: "mymind.com clone",
		client: "Personal software",
		year: "2026.01",
		status: "Live",
		summary: "A personal curation tool for collecting references, fragments, and internet residue without killing the pleasure of browsing.",
		accent: "#c65d21",
		surface: "rgba(198, 93, 33, 0.07)",
		stack: ["TypeScript", "Svelte", "Curation"],
		outcomes: ["Fast capture", "Soft organization", "Personal archive"],
		liveHref: "https://curate-your-own-network.stussysenik.com",
		embed: {
			eyebrow: "Personal software",
			headline: "Curate your own network.",
			caption: "A reference system for saving visual and conceptual threads without turning everything into folders.",
			metrics: [
				{ label: "mode", value: "archive" },
				{ label: "tone", value: "quiet" },
				{ label: "type", value: "personal" },
			],
		},
	},
	{
		slug: "ipod-emulator",
		title: "iPod emulator",
		client: "Interface study",
		year: "2026.01",
		status: "Live",
		summary: "A faithful reconstruction of the iPod interaction model, built around feel, memory, and the friction of old hardware.",
		accent: "#8a8f96",
		surface: "rgba(138, 143, 150, 0.07)",
		stack: ["JavaScript", "WebGL", "Interaction"],
		outcomes: ["Device fidelity", "Tactile recall", "Retro UI study"],
		liveHref: "https://ipod-music.vercel.app",
		embed: {
			eyebrow: "Interface study",
			headline: "Wheel, menu, memory.",
			caption: "A recreation that treats nostalgia as a usability problem, not just a visual one.",
			metrics: [
				{ label: "input", value: "rotary" },
				{ label: "mode", value: "music" },
				{ label: "feel", value: "faithful" },
			],
		},
	},
	{
		slug: "spinning-wheel-filter",
		title: "spinning wheel AR face filter lottery",
		client: "AR/XR experiment",
		year: "2026.01",
		status: "Live",
		summary: "A social filter that turns the face into a game surface, mixing chance, reaction, and camera-native spectacle.",
		accent: "#0d8f95",
		surface: "rgba(13, 143, 149, 0.07)",
		stack: ["JavaScript", "AR", "Realtime"],
		outcomes: ["Camera play", "Lottery mechanic", "Shareable loop"],
		liveHref: "https://spinning-wheel-filter.vercel.app",
		embed: {
			eyebrow: "AR/XR experiment",
			headline: "Camera as game board.",
			caption: "A fast interactive filter designed for reaction, surprise, and mobile-native participation.",
			metrics: [
				{ label: "camera", value: "front" },
				{ label: "mode", value: "AR" },
				{ label: "speed", value: "instant" },
			],
		},
	},
	{
		slug: "uyr-problem",
		title: "uyr-problem",
		client: "Tool",
		year: "2025.12",
		status: "Live",
		summary: "A stripped-back utility for reframing the problem before committing to the solution.",
		accent: "#7b848f",
		surface: "rgba(123, 132, 143, 0.07)",
		stack: ["JavaScript", "UX writing", "Tooling"],
		outcomes: ["Problem framing", "Fast utility", "Direct interaction"],
		liveHref: "https://uyr-problem.vercel.app",
		embed: {
			eyebrow: "Tool",
			headline: "Interrogate the brief.",
			caption: "A small problem-framing surface that resists premature certainty.",
			metrics: [
				{ label: "goal", value: "clarify" },
				{ label: "size", value: "small" },
				{ label: "mode", value: "utility" },
			],
		},
	},
	{
		slug: "infinite-checklist",
		title: "infinite checklist",
		client: "Tool",
		year: "2025.12",
		status: "Live",
		summary: "A recursive checklist for work that keeps branching and refuses a neat final state.",
		accent: "#4d7a57",
		surface: "rgba(77, 122, 87, 0.07)",
		stack: ["JavaScript", "Nested state", "Productivity"],
		outcomes: ["Infinite depth", "Recursive structure", "Personal workflow"],
		liveHref: "https://infinite-checklist.vercel.app",
		embed: {
			eyebrow: "Tool",
			headline: "Checklist without a floor.",
			caption: "A recursive to-do surface that treats detail as a navigable structure instead of clutter.",
			metrics: [
				{ label: "depth", value: "recursive" },
				{ label: "state", value: "nested" },
				{ label: "tone", value: "focused" },
			],
		},
	},
	{
		slug: "typewriter",
		title: "typewriter that doesn't delete, or can't go back",
		client: "Writing tool",
		year: "2025.12",
		status: "Live",
		summary: "A writing constraint that turns the inability to revise into the core interaction.",
		accent: "#a57c18",
		surface: "rgba(165, 124, 24, 0.08)",
		stack: ["JavaScript", "Writing", "Constraint"],
		outcomes: ["Constraint-based writing", "Attention shaping", "Single-purpose tool"],
		liveHref: "/works/typewriter",
		internalHref: "/works/typewriter",
		externalHref: "https://clean-writer.mxzou.com/",
		preview: "/previews/typewriter-that-doesn-t-delete-or-can-t-go-back.png",
		previewMode: "video",
		videoPreview: "/videos/typewriter-that-doesn-t-delete-or-can-t-go-back.mp4",
		embed: {
			eyebrow: "Writing tool",
			headline: "No undo, keep moving.",
			caption: "A typewriter-like surface that removes backtracking and changes the psychology of drafting.",
			metrics: [
				{ label: "undo", value: "none" },
				{ label: "mode", value: "draft" },
				{ label: "feel", value: "severe" },
			],
		},
	},
	{
		slug: "creative-block",
		title: "ARE YOU HAVING A CREATIVE BLOCK?",
		client: "Interactive piece",
		year: "2025.12",
		status: "Live",
		summary: "A blunt interactive surface built around resistance, interruption, and the rituals people use to get moving again.",
		accent: "#136f77",
		surface: "rgba(19, 111, 119, 0.07)",
		stack: ["Interactive art", "Writing", "Prompting"],
		outcomes: ["Provocation", "Playful friction", "Creative prompt"],
		liveHref: "https://creative-block.vercel.app",
		embed: {
			eyebrow: "Interactive piece",
			headline: "Fight the block directly.",
			caption: "An art/tool hybrid about the rituals and anxieties around making things.",
			metrics: [
				{ label: "mode", value: "prompt" },
				{ label: "tone", value: "loud" },
				{ label: "type", value: "art" },
			],
		},
	},
	{
		slug: "bboy-filter",
		title: "AR b-boy filter",
		client: "AR/XR experiment",
		year: "2025.12",
		status: "Live",
		summary: "A movement-led face filter that pushes performance and character through an augmented lens.",
		accent: "#d7a9bb",
		surface: "rgba(215, 169, 187, 0.08)",
		stack: ["AR", "Motion", "Social camera"],
		outcomes: ["Character performance", "Mobile spectacle", "Realtime response"],
		liveHref: "https://bboy-filter.vercel.app",
		embed: {
			eyebrow: "AR/XR experiment",
			headline: "Face filter as persona.",
			caption: "A camera-native surface built around performance, motion, and instant expression.",
			metrics: [
				{ label: "camera", value: "front" },
				{ label: "mode", value: "AR" },
				{ label: "vibe", value: "performative" },
			],
		},
	},
	{
		slug: "ph-213",
		title: "PH-213 - Electricity, Current and Magnetism concepts viz",
		client: "Physics visualization",
		year: "2024.11",
		status: "Live",
		summary: "A visualization-driven approach to physics concepts, translating abstract fields and currents into direct interactive intuition.",
		accent: "#39d04f",
		surface: "rgba(57, 208, 79, 0.07)",
		stack: ["Science", "Visualization", "Education"],
		outcomes: ["Concept clarity", "Interactive learning", "Physics diagrams"],
		liveHref: "https://ph213.vercel.app",
		embed: {
			eyebrow: "Physics visualization",
			headline: "See the field, not just the formula.",
			caption: "Interactive concept visuals for electricity, current, and magnetism.",
			metrics: [
				{ label: "domain", value: "physics" },
				{ label: "mode", value: "visual" },
				{ label: "goal", value: "explain" },
			],
		},
	},
	{
		slug: "dvd-corner",
		title: "DVD corner video animation",
		client: "Interactive art",
		year: "2025.02",
		status: "Live",
		summary: "A tiny piece built around anticipation, repetition, and the satisfaction of a screen-saver-era event.",
		accent: "#a06134",
		surface: "rgba(160, 97, 52, 0.07)",
		stack: ["Three.js", "Motion", "Nostalgia"],
		outcomes: ["Ambient loop", "Anticipation", "Playful obsession"],
		liveHref: "https://dvd-video-animation.vercel.app",
		embed: {
			eyebrow: "Interactive art",
			headline: "Waiting for the corner hit.",
			caption: "A simple motion piece built around anticipation and repetition.",
			metrics: [
				{ label: "loop", value: "endless" },
				{ label: "mode", value: "ambient" },
				{ label: "tone", value: "playful" },
			],
		},
	},
	{
		slug: "wavelength-radio",
		title: "@WAVELENGTH RADIO",
		client: "Music / community",
		year: "2024.10",
		status: "Live",
		summary: "An internet radio surface and community signal built around pocket-sized listening and cultural curation.",
		accent: "#9aa0a6",
		surface: "rgba(154, 160, 166, 0.07)",
		stack: ["Audio", "Community", "Culture"],
		outcomes: ["Radio identity", "Pocket listening", "Cultural signal"],
		liveHref: "https://wavelength-radio.vercel.app",
		embed: {
			eyebrow: "Music / community",
			headline: "Pocket-sized radio signal.",
			caption: "A cultural listening surface built around community, memory, and broadcast texture.",
			metrics: [
				{ label: "mode", value: "radio" },
				{ label: "scale", value: "community" },
				{ label: "tone", value: "curated" },
			],
		},
	},
];

export const processAsciiDiagram = String.raw`
+------------+       +--------------+       +--------+
|  IMAGINE   | ----> |   RE-THINK   | ----> |  SHIP  |
| gather     |       | compress     |       | verify |
| signal     | <---- | simplify     | <---- | land   |
+------------+       +--------------+       +--------+
        \___________ feedback stays live ___________/
`.trim();

export const processSteps = [
	{
		title: "Imagine",
		kicker: "Frame the real problem",
		description:
			"Start by identifying the actual audience, the proof they need, and the smallest surface that can carry that proof with integrity.",
		artifact: "Brief, content map, constraints",
	},
	{
		title: "Re-think",
		kicker: "Remove the accidental system",
		description:
			"Challenge the defaults, split concerns by ownership, and keep only the layers that justify their presence in the stack.",
		artifact: "Architecture, content boundary, preview flow",
	},
	{
		title: "Ship",
		kicker: "Verify against reality",
		description:
			"Run the actual build, hit the actual pages, and keep the testing surface tied to behavior users and editors can observe.",
		artifact: "Checks, e2e coverage, working routes",
	},
];

export const cvProfile = {
	name: "Stussy Senik",
	legalName: "Mengxuan Zou",
	role: "Creative technologist and design engineer",
	location: "Prague, remote-friendly",
	url: "https://portfolio-forever.vercel.app",
	email: "hello@portfolio-forever.com",
	summary:
		"I build high-signal interfaces for cultural, editorial, and product systems. The work sits at the boundary between brand clarity, frontend craft, and live content infrastructure.",
	disciplines: [
		"Design engineering",
		"Editorial systems",
		"Interactive prototypes",
		"Front-end architecture",
	],
};

export const cvExperience: CvEntry[] = [
	{
		period: "2024 to present",
		role: "Independent design engineer",
		company: "Portfolio Forever",
		summary:
			"Shipping portfolio systems, editorial prototypes, and interaction-heavy product surfaces with an emphasis on clarity and runtime discipline.",
		bullets: [
			"Designed and implemented Astro, Svelte, and Convex systems for static-first delivery with live controls.",
			"Built custom admin shells for content, flags, and preview workflows instead of relying on generic CMS chrome.",
			"Used tests as product contracts: route smoke coverage, preview flow assertions, and utility verification.",
		],
	},
	{
		period: "2022 to 2024",
		role: "Senior product designer / prototyper",
		company: "Independent collaborations",
		summary:
			"Worked with startups and cultural teams on interface systems, product narratives, and interaction concepts that needed to survive beyond presentation mode.",
		bullets: [
			"Translated strategy into coded prototypes that became implementation baselines.",
			"Created design systems focused on typography, motion restraint, and information hierarchy.",
			"Led critique and iteration loops around product-market storytelling and landing surfaces.",
		],
	},
	{
		period: "2019 to 2022",
		role: "Creative technologist",
		company: "Editorial and brand projects",
		summary:
			"Built campaign sites, interactive showcases, and content-heavy launches where performance and presentation quality mattered equally.",
		bullets: [
			"Shipped responsive frontends with strong narrative pacing and measurable performance constraints.",
			"Produced reusable content primitives for editorial teams and creative direction reviews.",
			"Maintained close collaboration between motion, design, and engineering disciplines.",
		],
	},
];

export const previewTargets: PreviewTarget[] = [
	{
		label: "Homepage hero",
		document: "heroContent",
		route: "/",
		description: "Headline, supporting copy, and primary CTA.",
	},
	{
		label: "Works color system",
		document: "caseStudy",
		route: "/works",
		description: "Featured works, palette, and embedded preview rhythm.",
	},
	{
		label: "CV narrative",
		document: "profile",
		route: "/cv",
		description: "Profile summary, discipline framing, and timeline.",
	},
	{
		label: "Process framing",
		document: "heroContent",
		route: "/process",
		description: "ASCII workflow and method copy.",
	},
	{
		label: "Blog notes",
		document: "post",
		route: "/blog",
		description: "Recent posts and long-form editorial detail.",
	},
	{
		label: "Talks & Interviews",
		document: "talksEntries",
		route: "/talks",
		description: "Public speaking and media appearances.",
	},
	{
		label: "Terminal config",
		document: "terminalConfig",
		route: "/terminal",
		description: "Interactive shell environment and commands.",
	},
	{
		label: "Re:mix (Academia)",
		document: "academicEntries",
		route: "/academia",
		description: "Academic re-implementations and papers.",
	},
	{
		label: "Labs (Experiments)",
		document: "labEntries",
		route: "/labs",
		description: "WebGPU, WASM, and high-performance experiments.",
	},
	{
		label: "Gallery archive",
		document: "galleryItems",
		route: "/gallery",
		description: "Visual fragments and art documentation.",
	},
	{
		label: "Media highlights",
		document: "galleryItems",
		route: "/media",
		description: "Photo and video highlights.",
	},
	{
		label: "Likes & Interests",
		document: "likesCategories",
		route: "/likes",
		description: "Personal preferences and goals.",
	},
	{
		label: "Minor entries",
		document: "minorEntries",
		route: "/minor",
		description: "Lost, broken, and underrated things.",
	},
	{
		label: "Gifts manifesto",
		document: "giftsConfig",
		route: "/gifts",
		description: "The promise and call to action.",
	},
	{
		label: "OS environment",
		document: "osConfig",
		route: "/os",
		description: "Windows 95 simulation layer.",
	},
];

