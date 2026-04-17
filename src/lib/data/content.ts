// Portfolio Content Data
// Enhanced with skills matrix, tools, and profile for NASA-style presentation

export interface Entry {
        year: number;
        month?: number;
        title: string;
        description?: string;
        links?: { label: string; url: string }[];
        featured?: "yellow" | "green" | "electric-green" | "orange" | "ocean" | "gold" | "pink" | "cloud" | "red";
        category?:
        | "design"
        | "technology"
        | "art"
        | "film"
        | "tool"
        | "AR/XR"
        | "science"
        | "music DJ"
        | "personal software";
        tools?: string[];
}

// Skills Matrix (NASA-document style)
export interface Skill {
        name: string;
        category: "design" | "technology" | "art";
        proficiency: number; // 0.0 - 1.0
        yearsUsed?: number;
        icon?: string;
}

export const skills: Skill[] = [
        // DESIGN
        {
                name: "Motion Design",
                category: "design",
                proficiency: 0.85,
                yearsUsed: 6,
        },
        {
                name: "UX & Product Design",
                category: "design",
                proficiency: 0.75,
                yearsUsed: 5,
        },
        {
                name: "Visual Design",
                category: "design",
                proficiency: 0.9,
                yearsUsed: 8,
        },
        {
                name: "Sound Design",
                category: "design",
                proficiency: 0.7,
                yearsUsed: 4,
        },
        {
                name: "3D & CGI",
                category: "design",
                proficiency: 0.8,
                yearsUsed: 5,
        },

        // TECHNOLOGY
        {
                name: "Unreal Engine",
                category: "technology",
                proficiency: 0.75,
                yearsUsed: 3,
        },
        {
                name: "Rhino & Grasshopper",
                category: "technology",
                proficiency: 0.7,
                yearsUsed: 4,
        },
        {
                name: "WebGPU & WASM",
                category: "technology",
                proficiency: 0.8,
                yearsUsed: 3,
        },
        {
                name: "Three.js & WebGL",
                category: "technology",
                proficiency: 0.85,
                yearsUsed: 5,
        },
        {
                name: "Hardware & Sensors",
                category: "technology",
                proficiency: 0.65,
                yearsUsed: 3,
        },
        {
                name: "Creative Coding",
                category: "technology",
                proficiency: 0.9,
                yearsUsed: 8,
        },

        // ART
        {
                name: "Art Direction",
                category: "art",
                proficiency: 0.85,
                yearsUsed: 6,
        },
        { name: "Filmmaking", category: "art", proficiency: 0.8, yearsUsed: 5 },
        {
                name: "Lighting Design",
                category: "art",
                proficiency: 0.75,
                yearsUsed: 4,
        },
        {
                name: "Digital Fabrication",
                category: "art",
                proficiency: 0.6,
                yearsUsed: 2,
        },
        {
                name: "Illustration",
                category: "art",
                proficiency: 0.7,
                yearsUsed: 6,
        },
];

// Technical Stack
export interface Tool {
        name: string;
        category: "software" | "hardware" | "language" | "framework";
        expertise: "learning" | "proficient" | "expert" | "master";
        url?: string;
        icon?: string;
}

export const tools: Tool[] = [
        // Software
        {
                name: "Unreal Engine 5",
                category: "software",
                expertise: "proficient",
                url: "https://unrealengine.com",
        },
        { name: "Rhino 3D", category: "software", expertise: "proficient" },
        { name: "Blender", category: "software", expertise: "expert" },
        { name: "Cinema 4D", category: "software", expertise: "proficient" },
        { name: "After Effects", category: "software", expertise: "expert" },
        {
                name: "DaVinci Resolve",
                category: "software",
                expertise: "proficient",
        },
        { name: "Figma", category: "software", expertise: "expert" },
        { name: "Ableton Live", category: "software", expertise: "proficient" },
        { name: "TouchDesigner", category: "software", expertise: "learning" },

        // Languages
        { name: "TypeScript", category: "language", expertise: "expert" },
        { name: "Python", category: "language", expertise: "proficient" },
        { name: "Rust", category: "language", expertise: "learning" },
        { name: "GLSL/WGSL", category: "language", expertise: "proficient" },
        { name: "C++", category: "language", expertise: "learning" },

        // Frameworks
        { name: "Three.js", category: "framework", expertise: "expert" },
        { name: "SvelteKit", category: "framework", expertise: "expert" },
        { name: "React", category: "framework", expertise: "proficient" },
        { name: "WebGPU", category: "framework", expertise: "proficient" },

        // Hardware
        { name: "Arduino", category: "hardware", expertise: "proficient" },
        { name: "Raspberry Pi", category: "hardware", expertise: "proficient" },
        {
                name: "ARRI / RED Cameras",
                category: "hardware",
                expertise: "proficient",
        },
];

// Gallery Items
export interface GalleryItem {
        id: string;
        title: string;
        thumbnail: string;
        category: ("design" | "technology" | "art" | "film")[];
        year: number;
        description?: string;
        featured?: boolean;
        link?: string;
        tools?: string[];
}

export const galleryItems: GalleryItem[] = [
        {
                id: "threejs",
                title: "Three.js",
                thumbnail: "/gallery/threejs.jpg",
                category: ["technology"],
                year: 2010,
                featured: true,
        },
        {
                id: "under-neon",
                title: "Under Neon Lights",
                thumbnail: "/gallery/neon.jpg",
                category: ["film", "art"],
                year: 2017,
                featured: true,
        },
        {
                id: "3d-comic",
                title: "3D Comic",
                thumbnail: "/gallery/comic.jpg",
                category: ["technology", "art"],
                year: 2020,
        },
        {
                id: "model-viewer",
                title: "<model-viewer>",
                thumbnail: "/gallery/model-viewer.jpg",
                category: ["technology"],
                year: 2018,
        },
        {
                id: "crystal",
                title: "Crystal",
                thumbnail: "/gallery/crystal.jpg",
                category: ["art", "technology"],
                year: 2017,
        },
        {
                id: "obsolidian",
                title: "Obsolidian",
                thumbnail: "/gallery/obsolidian.jpg",
                category: ["technology"],
                year: 2020,
        },
        // Add more items as needed...
];

// Profile / Bio
export interface Profile {
        name: string;
        taglines: { lang: string; text: string }[];
        shortBio: string;
        longBio: string;
        location: string;
        available: boolean;
        email?: string;
        edition: string;
        createdDate: string;
}

export const profile: Profile = {
        name: "Stüssy Senik",
        taglines: [
                // {
                //         lang: "en",
                //         text: "I focus on building detailed precise technical interfaces that value minimalism",
                // },
                {
                        lang: "de",
                        text: "Design Engineer · Creative Producer",
                },
                { lang: "ja", text: "クリエイティブ・テクノロジスト" },
        ],
        shortBio: "Building at the intersection of engineering, creative production, and design — from code to camera",
        longBio: `I'm a formally trained Software Engineer turned Artist & self-taught Designer with over 8 years of experience crafting delight through impactful interfaces, experiences & artifacts.

My practice focuses on the application of computational techniques as a tool to augment the design & art direction process. I'm a creator at heart & I'm deeply passionate about:

a) Building platforms & systems that enable creation, encourage tinkering while empowering businesses and individual creators

b) Designing novel, effective interactive experiences that challenge the status quo`,
        location: "NYC / PRAGUE",
        available: true,
        email: "itsmxzou@gmail.com",
        edition: "01",
        createdDate: "January 2026",
};

// Site Configuration
export const siteConfig = {
        name: profile.name,
        title: profile.name,
        tagline: profile.taglines[0].text,
};

// Social Links
export const socialLinks = [
        {
                label: "soundcloud",
                url: "https://on.soundcloud.com/b7PpyyqCuScmugtNZc",
        },
        { label: "imdb", url: "https://www.imdb.com/name/nm14502866/" },
        { label: "github", url: "https://github.com/stussysenik" },
        { label: "linkedin", url: "https://www.linkedin.com/in/mxzou" },
        { label: "instagram", url: "https://instagram.com/mx.zou" },
        { label: "x", url: "https://x.com/mx_zou" },
        { label: "dribbble", url: "#" },
        { label: "behance", url: "#" },
        { label: "letterboxd", url: "#" },
        { label: "storygraph", url: "#" },
        { label: "email", url: `mailto:${profile.email}` },
];

// Works (existing, enhanced)
export const works: Entry[] = [
        {
                year: 2026,
                month: 1,
                title: "mymind.com clone",
                links: [
                        {
                                label: "personal software",
                                url: "https://curate-your-own-network.stussysenik.com",
                        },
                ],
                featured: "orange",
                category: "personal software",
        },
        {
                year: 2026,
                month: 1,
                title: "iPod emulator",
                links: [
                        {
                                label: "link",
                                url: "https://ipod-music.vercel.app",
                        },
                ],
                featured: "cloud",
                category: "tool",
                tools: ["JavaScript", "WebGL", "ARKit"],
        },
        {
                year: 2026,
                month: 1,
                title: "spinning wheel AR face filter lottery",
                links: [
                        {
                                label: "try here",
                                url: "https://spinning-wheel-filter.vercel.app",
                        },
                ],
                featured: "ocean",
                category: "tool",
                tools: ["JavaScript", "WebGL", "ARKit"],
        },
        {
                year: 2025,
                month: 12,
                title: "uyr-problem",
                links: [
                        {
                                label: "cooking",
                                url: "https://uyr-problem.vercel.app",
                        },
                ],
                featured: "cloud",
                category: "tool",
                tools: ["JavaScript", "WebGL"],
        },
        {
                year: 2025,
                month: 12,
                title: "infinite checklist",
                links: [
                        {
                                label: "todo",
                                url: "https://infinite-checklist.vercel.app",
                        },
                ],
                category: "tool",
        },
        {
                year: 2025,
                month: 12,
                title: "typewriter that doesn't delete, or can't go back",
                links: [
                        {
                                label: "try here",
                                url: "https://clean-writer.vercel.app",
                        },
                ],
                featured: "gold",
                category: "tool",
        },
        {
                year: 2025,
                month: 12,
                title: "ARE YOU HAVING A CREATIVE BLOCK?",
                links: [
                        {
                                label: "link",
                                url: "https://creative-block.vercel.app",
                        },
                ],
                featured: "ocean",
                category: "art",
        },
        {
                year: 2025,
                month: 12,
                title: "AR b-boy filter",
                links: [
                        {
                                label: "link",
                                url: "https://bboy-filter.vercel.app",
                        },
                ],
                featured: "pink",
                category: "AR/XR",
        },
        // {
        //         year: 2025,
        //         month: 12,
        //         title: "two-dimensional CAD editor in the browser",
        //         links: [{ label: "link", url: "https://1985-cad.vercel.app" }],
        //         category: "technology",
        // },
        {
                year: 2024,
                month: 11,
                title: "PH-213 - Electricity, Current and Magnetism concepts viz",
                links: [{ label: "https", url: "https://ph213.vercel.app" }],
                featured: "electric-green",
                category: "science",
        },
        {
                year: 2025,
                month: 2,
                title: "DVD corner video animation",
                links: [
                        {
                                label: "link",
                                url: "https://dvd-video-animation.vercel.app",
                        },
                ],
                category: "art",
                tools: ["Three.js", "WebGL"],
        },
        {
                year: 2024,
                month: 10,
                title: "@WAVELENGTH RADIO",
                links: [
                        {
                                label: "link",
                                url: "https://wavelength-radio.vercel.app",
                        },
                ],
                featured: "cloud",
                category: "music DJ",
        },
        // { year: 2025, month: 7, title: 'Obsolidian', links: [{ label: 'link', url: '#' }, { label: 'tweet', url: '#' }], category: 'technology' },
        // { year: 2025, month: 10, title: "What You Don't Know", links: [{ label: 'link', url: '#' }, { label: 'tweet', url: '#' }, { label: 'article', url: '#' }], category: 'film' },
        // { year: 2025, month: 11, title: '<model-viewer>', links: [{ label: 'link', url: '#' }], featured: 'green', category: 'technology' },
        // { year: 2025, month: 12, title: 'Crystal', links: [{ label: 'link', url: '#' }], category: 'art' },
        // { year: 2025, month: 4, title: 'Under Neon Lights', links: [{ label: 'link', url: '#' }, { label: 'tweet', url: '#' }], category: 'film', tools: ['ARRI', 'DaVinci Resolve'] },
        // { year: 2025, month: 10, title: 'Web Unleashed 2016', links: [{ label: 'link', url: '#' }], category: 'technology' },
        // { year: 2025, month: 2, title: 'Broken Mantra', links: [{ label: 'link', url: '#' }], category: 'art' },
];

// Talks
export const talks: Entry[] = [
        {
                year: 2025,
                month: 12,
                title: "26' season",
                links: [{ label: "info", url: "#" }],
        },
        // { year: 2024, month: 11, title: 'JSConf JP 2024', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }] },
        // { year: 2024, month: 6, title: 'JSNation 2024', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }] },
        // { year: 2023, month: 1, title: 'WebGL + WebGPU Meetup', links: [{ label: 'video', url: '#' }] },
        // { year: 2022, month: 8, title: 'Nakame Meetup #1', links: [{ label: 'video', url: '#' }] },
        // { year: 2019, month: 10, title: 'Nordic.js 2019', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }] },
        // { year: 2019, month: 7, title: 'SIGGRAPH 2019', links: [{ label: 'info', url: '#' }] },
        // { year: 2019, month: 5, title: 'Google I/O 2019', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }], featured: 'green' },
        // { year: 2019, month: 3, title: 'GDC 2019', links: [{ label: 'info', url: '#' }] },
        // { year: 2018, month: 12, title: 'SIGGRAPH 2018', links: [{ label: 'info', url: '#' }] },
        // { year: 2018, month: 10, title: 'Web Unleashed 2018', links: [{ label: 'info', url: '#' }] },
        // { year: 2018, month: 9, title: 'Generate 2018', links: [{ label: 'info', url: '#' }] },
        // { year: 2018, month: 9, title: 'CAMP 2018', links: [{ label: 'info', url: '#' }], featured: 'green' },
        // { year: 2018, month: 8, title: 'SIGGRAPH 2018', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }] },
];

// Interviews
export const interviews: Entry[] = [
        {
                year: 2025,
                month: 12,
                title: "good things are coming (soon)",
                links: [{ label: "link", url: "#" }],
        },
        // { year: 2015, month: 3, title: 'cindyhwang.github.io', links: [{ label: 'link', url: '#' }] },
        // { year: 2013, month: 1, title: 'realtimerendering.com', links: [{ label: 'link', url: '#' }] },
        // { year: 2012, month: 3, title: 'creativecodingpodcast.com', links: [{ label: 'link', url: '#' }] },
        // { year: 2011, month: 12, title: 'ubuntu.com', links: [{ label: 'link', url: '#' }] },
        // { year: 2011, month: 7, title: 'hacks.mozilla.org', links: [{ label: 'link', url: '#' }] },
        // { year: 2009, month: 9, title: 'ajaxian.com', links: [{ label: 'link', url: '#' }] },
        // { year: 2008, month: 1, title: 'thefwa.com', links: [{ label: 'link', url: '#' }] },
];

// Process Steps (for /process page)
export interface ProcessStep {
        number: string;
        title: string;
        description: string;
        ascii?: string;
}

export const processSteps: ProcessStep[] = [
        {
                number: "01",
                title: "Research & Discovery",
                description:
                        "Deep dive into the problem space. Understand constraints, audit existing solutions, identify opportunities.",
                ascii: `
┌─────────┐
│ OBSERVE │
│  & MAP  │
└────┬────┘
     ↓`,
        },
        {
                number: "02",
                title: "Prototype & Explore",
                description:
                        "Rapid iteration through code sketches, visual experiments, and technical proof-of-concepts.",
                ascii: `
┌─────────┐
│  BUILD  │
│  BREAK  │
│ REBUILD │
└────┬────┘
     ↓`,
        },
        {
                number: "03",
                title: "Refine & Polish",
                description:
                        "Transform rough prototypes into production-ready artifacts. Details matter.",
                ascii: `
┌─────────┐
│ ITERATE │
│ ITERATE │
│ ITERATE │
└────┬────┘
     ↓`,
        },
        {
                number: "04",
                title: "Ship & Document",
                description:
                        "Deploy to the world. Write about the journey. Share the source.",
                ascii: `
┌─────────┐
│ RELEASE │
│ & SHARE │
└─────────┘`,
        },
];

// Helper functions
export function getSkillsByCategory(category: Skill["category"]): Skill[] {
        return skills.filter((s) => s.category === category);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
        return tools.filter((t) => t.category === category);
}

export function formatDate(entry: Entry): string {
        const month = entry.month?.toString().padStart(2, "0") || "";
        return month ? `${entry.year}.${month}` : `${entry.year}`;
}

export function getHighlight(entry: Entry): string | null {
        if (!entry.featured) return null;
        if (entry.featured === "yellow") return "1";
        if (entry.featured === "green") return "2";
        if (entry.featured === "electric-green") return "3";
        if (entry.featured === "orange") return "4";
        if (entry.featured === "ocean") return "5";
        if (entry.featured === "gold") return "6";
        if (entry.featured === "pink") return "7";
        if (entry.featured === "cloud") return "8";
        if (entry.featured === "red") return "9";
        return null;
}

export function sortEntries(entries: Entry[]): Entry[] {
        return [...entries].sort((a, b) => {
                // Sort by year (descending)
                if (a.year !== b.year) {
                        return b.year - a.year;
                }
                // Then sort by month (descending), treating missing month as 0
                const monthA = a.month ?? 0;
                const monthB = b.month ?? 0;
                return monthB - monthA;
        });
}

export const sortedWorks = sortEntries(works);
export const sortedTalks = sortEntries(talks);
export const sortedInterviews = sortEntries(interviews);
