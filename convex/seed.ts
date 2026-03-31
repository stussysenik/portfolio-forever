import { mutation } from "./_generated/server";

// Section registry defaults shared across all seed entries
const SECTION_DEFAULTS = {
	visible: true,
	adminVisible: true,
	viewMode: "grid",
	animationBg: "none",
	animationSpeed: 1,
	animationOpacity: 0.5,
	immune: false,
} as const;

// One-time seed: populates sectionRegistry table with default sections
export const seedSectionRegistry = mutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query("sectionRegistry").take(1);
		if (existing.length > 0) {
			return { status: "already seeded", sections: 0 };
		}

		const sections = [
			{ sectionId: "hero",     label: "Home",     route: "/",         order: 1,  cellSpan: 12, cellAspect: "wide",   previewType: "list",     accentColor: "blue" },
			{ sectionId: "works",    label: "Works",    route: "/works",    order: 2,  cellSpan: 8,  cellAspect: "golden", previewType: "list",     accentColor: "green" },
			{ sectionId: "talks",    label: "Talks",    route: "/talks",    order: 3,  cellSpan: 4,  cellAspect: "square", previewType: "grid",     accentColor: "muted" },
			{ sectionId: "terminal", label: "Terminal", route: "/terminal", order: 4,  cellSpan: 4,  cellAspect: "square", previewType: "terminal", accentColor: "green" },
			{ sectionId: "cv",       label: "CV",       route: "/cv",       order: 5,  cellSpan: 4,  cellAspect: "square", previewType: "timeline", accentColor: "muted" },
			{ sectionId: "academia", label: "Re:mix",   route: "/academia", order: 6,  cellSpan: 4,  cellAspect: "square", previewType: "grid",     accentColor: "blue" },
			{ sectionId: "blog",     label: "Blog",     route: "/blog",     order: 7,  cellSpan: 4,  cellAspect: "square", previewType: "list",     accentColor: "muted" },
			{ sectionId: "process",  label: "Process",  route: "/process",  order: 8,  cellSpan: 4,  cellAspect: "square", previewType: "cycle",    accentColor: "muted" },
			{ sectionId: "gallery",  label: "Gallery",  route: "/gallery",  order: 9,  cellSpan: 4,  cellAspect: "square", previewType: "mosaic",   accentColor: "blue" },
			{ sectionId: "likes",    label: "Likes",    route: "/likes",    order: 10, cellSpan: 4,  cellAspect: "square", previewType: "list",     accentColor: "muted" },
			{ sectionId: "minor",    label: "Minor",    route: "/minor",    order: 11, cellSpan: 4,  cellAspect: "square", previewType: "list",     accentColor: "muted" },
			{ sectionId: "labs",     label: "Labs",     route: "/labs",     order: 12, cellSpan: 4,  cellAspect: "square", previewType: "list",     accentColor: "green" },
			{ sectionId: "gifts",    label: "Gifts",    route: "/gifts",    order: 13, cellSpan: 4,  cellAspect: "square", previewType: "list",     accentColor: "muted" },
			{ sectionId: "os",       label: "OS",       route: "/os",       order: 14, cellSpan: 4,  cellAspect: "square", previewType: "desktop",  accentColor: "blue" },
		];

		for (const section of sections) {
			await ctx.db.insert("sectionRegistry", {
				...SECTION_DEFAULTS,
				...section,
			});
		}

		return { status: "seeded", sections: sections.length };
	},
});

// One-time seed: migrates static cv.ts data into Convex tables
export const seedFromStatic = mutation({
	handler: async (ctx) => {
		// Check if already seeded
		const existing = await ctx.db.query("cvProfile").collect();
		if (existing.length > 0) {
			return { status: "already seeded", entries: 0 };
		}

		// ── Profile ──
		await ctx.db.insert("cvProfile", {
			name: 'MENGXUAN "SENIK" ZOU',
			jobTitle: "Design Engineer & Creative Producer",
			url: "https://www.stussysenik.com",
			summary:
				"Polymath engineer at the convergence of software, film, music, and design. Formally trained at Cooper Union and FAMU Prague, with production experience spanning B2B product engineering, simultaneous translation across 4 languages, community radio, and EU-funded filmmaking. Building tools and experiences for 1 billion people in mind.",
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
		});

		// ── Sections ──
		const sectionTypes = [
			{ name: "Experience", type: "work" },
			{ name: "Education", type: "education" },
			{ name: "Awards", type: "award" },
			{ name: "Languages", type: "language" },
		];
		for (let i = 0; i < sectionTypes.length; i++) {
			await ctx.db.insert("cvSections", {
				...sectionTypes[i],
				order: i,
				visible: true,
			});
		}

		// ── Work Experience ──
		const work = [
			{
				title: "AI/ML Growth Product Design Engineer",
				organization: "Attendu",
				location: "Prague, Czechia",
				startDate: "2026-02",
				endDate: "present",
				description:
					"Shipping production-ready B2B features for high-trust coding scenarios; contributed to product reaching #1 Product of the Day on Product Hunt (Sep 2025)",
				highlights: [
					"Rapid-building production-ready software for B2B high-trust, risk, safety and resilience coding scenarios",
					"T-shaped development spanning QA assurance and product ownership",
					"Setting leadership in the Czech market for parallel agent development and DevOps",
				],
				tools: ["TypeScript", "SvelteKit", "AI/ML", "DevOps"],
			},
			{
				title: "Growth Hacker",
				organization: "@WAVELENGTH RADIO",
				location: "New York, United States",
				startDate: "2024-09",
				endDate: "present",
				description:
					'Founded and grew a global radio community platform inspired by Virgil Abloh\'s legacy, producing pocket-sized audio experiences',
				highlights: [
					"Built wavelengthradio.media — a global site for radio community listeners",
					'Produced "digital Letters" — a series of pocket-sized audio experiences tunneling past, present, and future',
				],
				url: "https://www.wavelengthradio.media",
			},
			{
				title: "Business Development Translator",
				organization: "Dahua Technology",
				location: "Budapest, Hungary",
				startDate: "2025-10",
				endDate: "2026-02",
				description:
					"Managed bilingual communication (Chinese to Czech) for 100+ attendees at a B2B event covering AI/ML camera monitoring and chip technology advancements",
				highlights: [
					"Facilitated smooth cross-cultural communication for B2B camera monitoring systems and AI/ML technology presentations",
				],
			},
			{
				title: "Simultaneous Translator",
				organization: "RIWAY International",
				location: "Singapore",
				startDate: "2021-01",
				endDate: "2022-03",
				description:
					"Simultaneously translated multi-day conference events (500+ attendees) across English, Chinese, and Czech — covering medical, business, and negotiation topics",
				highlights: [
					"Translated several multi-day conferences with 500+ attendees across EN/ZH/CZ",
					"Covered medical health, business sales, and negotiation subject matter",
				],
			},
			{
				title: "Project Program Coordinator",
				organization: "Flip Makers",
				location: "Remote",
				startDate: "2020-03",
				endDate: "2021-03",
				description:
					"Led a remote global team of designers and developers in response to COVID-19, polishing and redesigning NGO brand identities to support the global economy",
				highlights: [
					"Coordinated a global remote team of designers/developers during COVID-19",
					"Redesigned multiple NGO brand identities to support economic recovery",
				],
			},
			{
				title: "Junior Frontend Software Engineer",
				organization: "Attendu",
				location: "Prague, Czechia",
				startDate: "2019-05",
				endDate: "2019-08",
				description:
					"Built responsive event platforms for IKEA and Vodafone using Vue.js, serving internal team-building programmes",
				highlights: [
					"Worked with clients like IKEA and Vodafone on custom event website solutions",
					"Delivered responsive web design, Vue.js development, REST API integration, and content management",
				],
				tools: ["Vue.js", "REST API", "Postman", "CSS"],
			},
			{
				title: "Steadicam Operator & Location Scout",
				organization: "IMAGE.IN / EU-funded (OPU)",
				location: "Prague, Czechia",
				startDate: "2018-12",
				endDate: "2019-05",
				description:
					"Contributed to a UNICEF-funded humanitarian filmmaking project teaching audio-visual skills to children from migrant backgrounds in Czechia",
				highlights: [
					"Taught beginner filmmaking skills to children from migrant backgrounds",
					"Operated steadicam and scouted locations for EU-funded productions",
				],
			},
		];

		let entryCount = 0;
		for (let i = 0; i < work.length; i++) {
			await ctx.db.insert("cvEntries", {
				type: "work",
				order: i,
				visible: true,
				...work[i],
			});
			entryCount++;
		}

		// ── Education ──
		const education = [
			{
				title: "Computer Engineering",
				organization: "The Cooper Union for the Advancement of Science and Art",
				location: "New York, NY",
				startDate: "2022-09",
				endDate: "2025-05",
				description:
					"Dropped out junior year to self-learn advanced computer science topics — deep learning, computer vision, and systems engineering",
			},
			{
				title: "AAS, Film Production & Creative Management",
				organization: "Academy of Performing Arts in Prague (FAMU)",
				location: "Prague, Czechia",
				startDate: "2021-07",
				endDate: "2022-07",
				description:
					"Film production and creative management at one of the oldest film schools in Europe",
			},
			{
				title: "High School Diploma, Liberal Arts",
				organization: "Northfield Mount Hermon",
				location: "Gill, MA",
				startDate: "2019-08",
				endDate: "2021-05",
			},
			{
				title: "High School Diploma, Liberal Arts",
				organization: "Gymnázium Altis",
				location: "Prague, Czechia",
				startDate: "2015-09",
				endDate: "2019-06",
			},
		];

		for (let i = 0; i < education.length; i++) {
			await ctx.db.insert("cvEntries", {
				type: "education",
				order: i,
				visible: true,
				...education[i],
			});
			entryCount++;
		}

		// ── Awards ──
		await ctx.db.insert("cvEntries", {
			type: "award",
			title: "#1 Product of the Day",
			organization: "Product Hunt",
			startDate: "2025-09",
			description: "Attendu — recognized as the top product launch of the day",
			order: 0,
			visible: true,
		});
		entryCount++;

		// ── Languages ──
		const languages = [
			{ name: "EN", level: "Native / Fluent" },
			{ name: "中文 ZH", level: "Native" },
			{ name: "CZ", level: "Fluent" },
			{ name: "DE", level: "Conversational" },
		];

		for (let i = 0; i < languages.length; i++) {
			await ctx.db.insert("cvLanguages", {
				...languages[i],
				order: i,
				visible: true,
			});
		}

		return { status: "seeded", entries: entryCount };
	},
});
