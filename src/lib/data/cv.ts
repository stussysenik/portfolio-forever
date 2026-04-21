/**
 * CV data — structured as JSON-LD compatible format.
 * Ported from clj/portfolio/data/cv.cljs
 */

export const cvData = {
	context: "https://schema.org",
	type: "Person",
	name: "MENGXUAN \"SENIK\" ZOU",
	jobTitle: "Design Engineer & Creative Producer",
	url: "https://www.stussysenik.com",
	sameAs: [
		"https://github.com/stussysenik",
		"https://www.linkedin.com/in/mxzou",
		"https://instagram.com/mx.zou",
		"https://www.imdb.com/name/nm14502866/",
		"https://mengxuanzou.com",
		"https://mxzou.com"
	],
	summary: "Polymath engineer at the convergence of software, film, music, and design. Formally trained at Cooper Union and FAMU Prague, with production experience spanning B2B product engineering, simultaneous translation across 4 languages, community radio, and EU-funded filmmaking. Building tools and experiences for 1 billion people in mind.",
	languages: [
		{ name: "EN", level: "Native / Fluent" },
		{ name: "中文 ZH", level: "Native" },
		{ name: "CZ", level: "Fluent" },
		{ name: "DE", level: "Conversational" }
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
		{ name: "Ada", proficiency: 0.4 },
		{ name: "Fortran", proficiency: 0.3 }
	],
	workExperience: [
		{
			id: "exp-1",
			type: "work",
			title: "AI/ML Growth Product Design Engineer",
			organization: "Attendu",
			location: "Prague, Czechia",
			startDate: "2026-02",
			endDate: "present",
			description: "Shipping production-ready B2B features for high-trust coding scenarios; contributed to product reaching #1 Product of the Day on Product Hunt (Sep 2025)",
			highlights: [
				"Rapid-building production-ready software for B2B high-trust, risk, safety and resilience coding scenarios",
				"T-shaped development spanning QA assurance and product ownership",
				"Setting leadership in the Czech market for parallel agent development and DevOps"
			],
			tools: ["TypeScript", "SvelteKit", "AI/ML", "DevOps"]
		},
		{
			id: "exp-2",
			type: "work",
			title: "Growth Hacker",
			organization: "@WAVELENGTH RADIO",
			location: "New York, United States",
			startDate: "2024-09",
			endDate: "present",
			description: "Founded and grew a global radio community platform inspired by Virgil Abloh's legacy, producing pocket-sized audio experiences",
			highlights: [
				"Built wavelengthradio.media — a global site for radio community listeners",
				"Produced digital Letters — pocket-sized audio experiences tunneling past, present, and future"
			],
			url: "https://www.wavelengthradio.media"
		},
		{
			id: "exp-3",
			type: "work",
			title: "Business Development Translator",
			organization: "Dahua Technology",
			location: "Budapest, Hungary",
			startDate: "2025-10",
			endDate: "2026-02",
			description: "Managed bilingual communication (Chinese to Czech) for 100+ attendees at a B2B event covering AI/ML camera monitoring and chip technology advancements",
			highlights: [
				"Facilitated smooth cross-cultural communication for B2B camera monitoring systems and AI/ML technology presentations"
			]
		},
		{
			id: "exp-4",
			type: "work",
			title: "Simultaneous Translator",
			organization: "RIWAY International",
			location: "Singapore",
			startDate: "2021-01",
			endDate: "2022-03",
			description: "Simultaneously translated multi-day conference events (500+ attendees) across English, Chinese, and Czech — covering medical, business, and negotiation topics",
			highlights: [
				"Translated several multi-day conferences with 500+ attendees across EN/ZH/CZ",
				"Covered medical health, business sales, and negotiation subject matter"
			]
		},
		{
			id: "exp-5",
			type: "work",
			title: "Project Program Coordinator",
			organization: "Flip Makers",
			location: "Remote",
			startDate: "2020-03",
			endDate: "2021-03",
			description: "Led a remote global team of designers and developers in response to COVID-19, polishing and redesigning NGO brand identities to support the global economy",
			highlights: [
				"Coordinated a global remote team of designers/developers during COVID-19",
				"Redesigned multiple NGO brand identities to support economic recovery"
			]
		},
		{
			id: "exp-6",
			type: "work",
			title: "Junior Frontend Software Engineer",
			organization: "Attendu",
			location: "Prague, Czechia",
			startDate: "19-05",
			endDate: "19-08",
			description: "Built responsive event platforms for IKEA and Vodafone using Vue.js, serving internal team-building programmes",
			highlights: [
				"Worked with clients like IKEA and Vodafone on custom event website solutions",
				"Delivered responsive web design, Vue.js development, REST API integration, and content management"
			],
			tools: ["Vue.js", "REST API", "Postman", "CSS"]
		},
		{
			id: "exp-7",
			type: "work",
			title: "Steadicam Operator & Location Scout",
			organization: "IMAGE.IN / EU-funded (OPU)",
			location: "Prague, Czechia",
			startDate: "18-12",
			endDate: "19-05",
			description: "Contributed to a UNICEF-funded humanitarian filmmaking project teaching audio-visual skills to children from migrant backgrounds in Czechia",
			highlights: [
				"Taught beginner filmmaking skills to children from migrant backgrounds",
				"Operated steadicam and scouted locations for EU-funded productions"
			]
		}
	],
	education: [
		{
			id: "edu-1",
			type: "education",
			title: "Engineering Technology",
			organization: "The Cooper Union for the Advancement of Science and Art",
			location: "New York, NY",
			startDate: "2022-09",
			endDate: "2025-05",
			description: "Dropped out junior year to self-learn advanced computer science topics — deep learning, computer vision, and systems engineering"
		},
		{
			id: "edu-2",
			type: "education",
			title: "AAS, Film Production & Creative Management",
			organization: "Academy of Performing Arts in Prague (FAMU)",
			location: "Prague, Czechia",
			startDate: "2021-07",
			endDate: "2022-07",
			description: "Film production and creative management at one of the oldest film schools in Europe"
		},
		{
			id: "edu-3",
			type: "education",
			title: "High School Diploma, Liberal Arts",
			organization: "Northfield Mount Hermon",
			location: "Gill, MA",
			startDate: "2019-08",
			endDate: "2021-05"
		},
		{
			id: "edu-4",
			type: "education",
			title: "High School Diploma, Liberal Arts",
			organization: "Gymnázium Altis",
			location: "Prague, Czechia",
			startDate: "2015-09",
			endDate: "2019-06"
		}
	],
	awards: [
		{
			id: "award-1",
			type: "award",
			title: "#1 Product of the Day",
			organization: "Product Hunt",
			startDate: "2025-09",
			description: "Attendu — recognized as the top product launch of the day"
		}
	]
};

export function generateJsonLd(data: any) {
	return JSON.stringify(data, null, 2);
}
