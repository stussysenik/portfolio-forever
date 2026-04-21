/**
 * CV section logic — handles Hiccup structure for CV.
 * Ported from clj/portfolio/sections/cv.cljs
 */
import { cvData } from "$lib/data/cv";

function formatDateRange(start: string, end?: string) {
	const fmt = (d?: string) => {
		if (!d || d === "present") return "Present";
		const date = new Date(d);
		return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
	};
	return `${fmt(start)} — ${fmt(end)}`;
}

export function getCvHiccup(isScreenPass: boolean) {
	const profile = cvData;
	const work = profile.workExperience;
	const edu = profile.education;
	const langs = profile.languages;
	const skills = profile.knowsAbout;

	return [
		"section",
		{ class: "cv-wrapper" },
		[
			"header",
			{ class: "cv-header" },
			["h1", { class: "cv-name" }, profile.name],
			["p", { class: "cv-title" }, profile.jobTitle],
			["p", { class: "cv-summary" }, profile.summary],
			[
				"div",
				{ class: "cv-meta" },
				["span", { class: "cv-meta-item" }, profile.location],
				[
					"span",
					{ class: "cv-meta-item" },
					["a", { href: `mailto:${profile.email}` }, profile.email],
				],
				[
					"span",
					{ class: "cv-meta-item" },
					["a", { href: profile.url, target: "_blank" }, profile.url],
				],
			],
		],

		// Experience
		[
			"div",
			{ class: "cv-section" },
			["h2", { class: "cv-section-title" }, "Experience"],
			[
				"div",
				{ class: "cv-entries" },
				...work.map((entry) => [
					"div",
					{ class: "cv-entry" },
					[
						"div",
						{ class: "cv-entry-header" },
						[
							"h3",
							{ class: "cv-entry-title" },
							(entry as any).url
								? ["a", { href: (entry as any).url, target: "_blank" }, entry.title]
								: entry.title,
						],
						[
							"span",
							{ class: "cv-entry-dates" },
							formatDateRange(entry.startDate, entry.endDate),
						],
					],
					[
						"div",
						{ class: "cv-entry-org" },
						["span", entry.organization],
						entry.location
							? ["span", { class: "cv-entry-location" }, entry.location]
							: null,
					],
					!isScreenPass
						? [
								"div",
								["p", { class: "cv-entry-description" }, entry.description],
								entry.highlights?.length
									? [
											"ul",
											{ class: "cv-entry-highlights" },
											...entry.highlights.map((hl) => ["li", hl]),
									  ]
									: null,
						  ]
						: null,
				]),
			],
		],

		// Education
		[
			"div",
			{ class: "cv-section" },
			["h2", { class: "cv-section-title" }, "Education"],
			[
				"div",
				{ class: "cv-entries" },
				...edu.map((entry) => [
					"div",
					{ class: "cv-entry" },
					[
						"div",
						{ class: "cv-entry-header" },
						["h3", { class: "cv-entry-title" }, entry.title],
						[
							"span",
							{ class: "cv-entry-dates" },
							formatDateRange(entry.startDate, entry.endDate),
						],
					],
					["div", { class: "cv-entry-org" }, ["span", entry.organization]],
				]),
			],
		],

		// Languages
		[
			"div",
			{ class: "cv-section" },
			["h2", { class: "cv-section-title" }, "Languages"],
			[
				"div",
				{ class: "cv-languages" },
				...langs.map((lang) => [
					"span",
					{ class: "cv-lang" },
					lang.name + " ",
					["span", { class: "cv-lang-level" }, `(${lang.level})`],
				]),
			],
		],

		// Skills
		[
			"div",
			{ class: "cv-section" },
			["h2", { class: "cv-section-title" }, "Skills"],
			[
				"div",
				{ class: "cv-skills" },
				...skills.map((skill) => ["span", { class: "cv-skill-tag" }, skill.name]),
			],
		],
	];
}
