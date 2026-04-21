/**
 * Portfolio content data — the canonical source of truth for static content.
 * Ported from clj/portfolio/data/content.cljs
 */

export const skillCategories = ["design", "technology", "art"];

export const entryCategories = [
	"design", "technology", "art", "film", "tool", "AR/XR", "science", "music DJ", "personal software"
];

export const featuredColors = [
	"yellow", "green", "electric-green", "orange", "ocean", "gold", "pink", "cloud", "red"
];

export interface Skill {
	name: string;
	category: string;
	proficiency: number;
	yearsUsed: number;
}

export const skills: Skill[] = [
	{ name: "Motion Design", category: "design", proficiency: 0.85, yearsUsed: 6 },
	{ name: "UX & Product Design", category: "design", proficiency: 0.75, yearsUsed: 5 },
	{ name: "Visual Design", category: "design", proficiency: 0.9, yearsUsed: 8 },
	{ name: "Sound Design", category: "design", proficiency: 0.7, yearsUsed: 4 },
	{ name: "3D & CGI", category: "design", proficiency: 0.8, yearsUsed: 5 },
	{ name: "Unreal Engine", category: "technology", proficiency: 0.75, yearsUsed: 3 },
	{ name: "Rhino & Grasshopper", category: "technology", proficiency: 0.7, yearsUsed: 4 },
	{ name: "WebGPU & WASM", category: "technology", proficiency: 0.8, yearsUsed: 3 },
	{ name: "Three.js & WebGL", category: "technology", proficiency: 0.85, yearsUsed: 5 },
	{ name: "Hardware & Sensors", category: "technology", proficiency: 0.65, yearsUsed: 3 },
	{ name: "Creative Coding", category: "technology", proficiency: 0.9, yearsUsed: 8 },
	{ name: "Art Direction", category: "art", proficiency: 0.85, yearsUsed: 6 },
	{ name: "Filmmaking", category: "art", proficiency: 0.8, yearsUsed: 5 },
	{ name: "Lighting Design", category: "art", proficiency: 0.75, yearsUsed: 4 },
	{ name: "Digital Fabrication", category: "art", proficiency: 0.6, yearsUsed: 2 },
	{ name: "Illustration", category: "art", proficiency: 0.7, yearsUsed: 6 }
];

export interface Tool {
	name: string;
	category: string;
	expertise: string;
	url?: string;
}

export const tools: Tool[] = [
	{ name: "Unreal Engine 5", category: "software", expertise: "proficient", url: "https://unrealengine.com" },
	{ name: "Rhino 3D", category: "software", expertise: "proficient" },
	{ name: "Blender", category: "software", expertise: "expert" },
	{ name: "Cinema 4D", category: "software", expertise: "proficient" },
	{ name: "After Effects", category: "software", expertise: "expert" },
	{ name: "DaVinci Resolve", category: "software", expertise: "proficient" },
	{ name: "Figma", category: "software", expertise: "expert" },
	{ name: "Ableton Live", category: "software", expertise: "proficient" },
	{ name: "TouchDesigner", category: "software", expertise: "learning" },
	{ name: "TypeScript", category: "language", expertise: "expert" },
	{ name: "Python", category: "language", expertise: "proficient" },
	{ name: "Rust", category: "language", expertise: "learning" },
	{ name: "GLSL/WGSL", category: "language", expertise: "proficient" },
	{ name: "C++", category: "language", expertise: "learning" },
	{ name: "Ada", category: "language", expertise: "learning" },
	{ name: "Fortran", category: "language", expertise: "learning" },
	{ name: "Three.js", category: "framework", expertise: "expert" },
	{ name: "SvelteKit", category: "framework", expertise: "expert" },
	{ name: "React", category: "framework", expertise: "proficient" },
	{ name: "WebGPU", category: "framework", expertise: "proficient" },
	{ name: "Arduino", category: "hardware", expertise: "proficient" },
	{ name: "Raspberry Pi", category: "hardware", expertise: "proficient" },
	{ name: "ARRI / RED Cameras", category: "hardware", expertise: "proficient" }
];

export const galleryItems = [
	{ id: "threejs", title: "Three.js", thumbnail: "/gallery/threejs.jpg", category: ["technology"], year: 2010, featured: true },
	{ id: "under-neon", title: "Under Neon Lights", thumbnail: "/gallery/neon.jpg", category: ["film", "art"], year: 2017, featured: true },
	{ id: "3d-comic", title: "3D Comic", thumbnail: "/gallery/comic.jpg", category: ["technology", "art"], year: 2020 },
	{ id: "model-viewer", title: "<model-viewer>", thumbnail: "/gallery/model-viewer.jpg", category: ["technology"], year: 2018 },
	{ id: "crystal", title: "Crystal", thumbnail: "/gallery/crystal.jpg", category: ["art", "technology"], year: 2017 },
	{ id: "obsolidian", title: "Obsolidian", thumbnail: "/gallery/obsolidian.jpg", category: ["technology"], year: 2020 }
];

export const profile = {
	name: "Stüssy Senik",
	taglines: [
		{ lang: "de", text: "Design Engineer · Creative Producer" },
		{ lang: "ja", text: "クリエイティブ・テクノロジスト" }
	],
	shortBio: "Building at the intersection of engineering, creative production, and design — from code to camera",
	longBio: "I'm a formally trained Software Engineer turned Artist & self-taught Designer with over 8 years of experience crafting delight through impactful interfaces, experiences & artifacts.\n\nMy practice focuses on the application of computational techniques as a tool to augment the design & art direction process. I'm a creator at heart & I'm deeply passionate about:\n\na) Building platforms & systems that enable creation, encourage tinkering while empowering businesses and individual creators\n\nb) Designing novel, effective interactive experiences that challenge the status quo",
	location: "NYC / PRAGUE",
	available: true,
	email: "itsmxzou@gmail.com",
	edition: "01",
	createdDate: "January 2026"
};

export const siteConfig = {
	name: profile.name,
	title: profile.name,
	tagline: profile.taglines[0].text
};

export const socialLinks = [
	{ label: "soundcloud", url: "https://on.soundcloud.com/b7PpyyqCuScmugtNZc" },
	{ label: "imdb", url: "https://www.imdb.com/name/nm14502866/" },
	{ label: "github", url: "https://github.com/stussysenik" },
	{ label: "linkedin", url: "https://www.linkedin.com/in/mxzou" },
	{ label: "instagram", url: "https://instagram.com/mx.zou" },
	{ label: "x", url: "https://x.com/mx_zou" },
	{ label: "dribbble", url: "#" },
	{ label: "behance", url: "#" },
	{ label: "letterboxd", url: "#" },
	{ label: "storygraph", url: "#" },
	{ label: "email", url: `mailto:${profile.email}` }
];

export const works = [
	{ year: 2026, month: 1, title: "mymind.com clone", links: [{ label: "personal software", url: "https://curate-your-own-network.stussysenik.com" }], featured: "orange", category: "personal software" },
	{ year: 2026, month: 1, title: "iPod emulator", links: [{ label: "link", url: "https://ipod-music.vercel.app" }], featured: "cloud", category: "tool", tools: ["JavaScript", "WebGL", "ARKit"] },
	{ year: 2026, month: 1, title: "spinning wheel AR face filter lottery", links: [{ label: "try here", url: "https://spinning-wheel-filter.vercel.app" }], featured: "ocean", category: "tool", tools: ["JavaScript", "WebGL", "ARKit"] },
	{ year: 2025, month: 12, title: "uyr-problem", links: [{ label: "cooking", url: "https://uyr-problem.vercel.app" }], featured: "cloud", category: "tool", tools: ["JavaScript", "WebGL"] },
	{ year: 2025, month: 12, title: "infinite checklist", links: [{ label: "todo", url: "https://infinite-checklist.vercel.app" }], category: "tool" },
	{ year: 2025, month: 12, title: "typewriter that doesn't delete, or can't go back", links: [{ label: "try here", url: "https://clean-writer.vercel.app" }], featured: "gold", category: "tool" },
	{ year: 2025, month: 12, title: "ARE YOU HAVING A CREATIVE BLOCK?", links: [{ label: "link", url: "https://creative-block.vercel.app" }], featured: "ocean", category: "art" },
	{ year: 2025, month: 12, title: "AR b-boy filter", links: [{ label: "link", url: "https://bboy-filter.vercel.app" }], featured: "pink", category: "AR/XR" },
	{ year: 2024, month: 11, title: "PH-213 - Electricity, Current and Magnetism concepts viz", links: [{ label: "https", url: "https://ph213.vercel.app" }], featured: "electric-green", category: "science" },
	{ year: 2025, month: 2, title: "DVD corner video animation", links: [{ label: "link", url: "https://dvd-video-animation.vercel.app" }], category: "art", tools: ["Three.js", "WebGL"] },
	{ year: 2024, month: 10, title: "@WAVELENGTH RADIO", links: [{ label: "link", url: "https://wavelength-radio.vercel.app" }], featured: "cloud", category: "music DJ" }
];

export const talks = [
	{ year: 2025, month: 12, title: "26' season", links: [{ label: "info", url: "#" }] }
];

export const interviews = [
	{ year: 2025, month: 12, title: "good things are coming (soon)", links: [{ label: "link", url: "#" }] }
];

export const processSteps = [
	{
		number: "01", title: "Research & Discovery",
		description: "Deep dive into the problem space. Understand constraints, audit existing solutions, identify opportunities.",
		ascii: "\n┌─────────┐\n│ OBSERVE │\n│  & MAP  │\n└────┬────┘\n     ↓"
	},
	{
		number: "02", title: "Prototype & Explore",
		description: "Rapid iteration through code sketches, visual experiments, and technical proof-of-concepts.",
		ascii: "\n┌─────────┐\n│  BUILD  │\n│  BREAK  │\n│ REBUILD │\n└────┬────┘\n     ↓"
	},
	{
		number: "03", title: "Refine & Polish",
		description: "Transform rough prototypes into production-ready artifacts. Details matter.",
		ascii: "\n┌─────────┐\n│ ITERATE │\n│ ITERATE │\n│ ITERATE │\n└────┬────┘\n     ↓"
	},
	{
		number: "04", title: "Ship & Document",
		description: "Deploy to the world. Write about the journey. Share the source.",
		ascii: "\n┌─────────┐\n│ RELEASE │\n│ & SHARE │\n└─────────┘"
	}
];

export const getSkillsByCategory = (category: string) => skills.filter(s => s.category === category);
export const getToolsByCategory = (category: string) => tools.filter(t => t.category === category);

export const formatDate = (entry: { year: number; month?: number }) => {
	if (entry.month) {
		return `${entry.year}.${entry.month.toString().padStart(2, "0")}`;
	}
	return entry.year.toString();
};

export const featuredColorMap: Record<string, string> = {
	"yellow": "1",
	"green": "2",
	"electric-green": "3",
	"orange": "4",
	"ocean": "5",
	"gold": "6",
	"pink": "7",
	"cloud": "8",
	"red": "9"
};

export const getHighlight = (entry: { featured?: string }) => {
	return entry.featured ? featuredColorMap[entry.featured] : undefined;
};

export const sortEntries = (entries: any[]) => {
	return [...entries].sort((a, b) => {
		if (a.year !== b.year) return b.year - a.year;
		return (b.month || 0) - (a.month || 0);
	});
};

export const sortedWorks = sortEntries(works);
export const sortedTalks = sortEntries(talks);
export const sortedInterviews = sortEntries(interviews);

export const likes = [
	{ title: "Typography", items: ["Klim Type Foundry", "Lineto", "Optimo", "Grilli Type", "Pangram Pangram", "Dinamo"] },
	{ title: "Design", items: ["Are.na", "Mymind", "Hoverstat.es", "Godly", "Savee", "Siteinspire"] },
	{ title: "Engineering", items: ["Vercel", "Convex", "Svelte", "Rust", "Clojure", "Zig"] },
	{ title: "Art & Film", items: ["A24", "Criterion", "MUBI", "NOWNESS", "Kino Lorber"] },
	{ title: "Reading", items: ["The Atlantic", "The New Yorker", "Wired", "New York Magazine", "MIT Technology Review"] }
];

export const blogPosts = [
	{ slug: "webgpu-compute", title: "WebGPU Compute Shaders for Generative Art", publishedAt: "2026-04-10", excerpt: "A deep dive into using WebGPU compute shaders for real-time generative art.", tags: ["webgpu", "graphics", "rust"] },
	{ slug: "clojure-svelte", title: "Expressiveness in UI: Clojure and Svelte", publishedAt: "2026-03-25", excerpt: "How we ported our portfolio logic to Clojure (Squint) while keeping Svelte 5 for rendering.", tags: ["clojure", "svelte", "architecture"] },
	{ slug: "minimalism", title: "Digital Minimalism in 2026", publishedAt: "2026-02-15", excerpt: "Why websites should be fast, accessible, and respect user autonomy.", tags: ["design", "minimalism", "ux"] }
];

export const academicEntries = [
	{ title: "A Novel Approach to Real-Time Fluid Simulation in WebAssembly", journal: "SIGGRAPH 2025", year: 2025, url: "https://stussysenik.com/academia/fluid-wasm", authors: "Mengxuan Zou" },
	{ title: "Evaluating OKLCH Color Space for Accessible UI Design", journal: "HCI International 2024", year: 2024, url: "https://stussysenik.com/academia/oklch-ui", authors: "Mengxuan Zou" }
];

export const giftsConfig = {
	title: "Send books, postcards, or art supplies",
	description: "If you found my work helpful or inspiring, consider sending a physical artifact. It fuels the creative process.",
	address: "123 Creative Street, Bed-Stuy, Brooklyn, NY 11221",
	manifesto: "The Promise — an open exchange of creative energy."
};
