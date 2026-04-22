import { proofPillars, hiringTracks, proofMatrix, targetCompanies } from "./hiring-target";
import { cvData } from "./cv";

type HireWork = {
	title: string;
	preview: string;
	href: string;
};

type HireRole = {
	title: string;
	org: string;
	period: string;
	highlight: string;
};

type HireTrack = {
	label: string;
	summary: string;
};

type HirePillar = {
	title: string;
	detail: string;
};

type HireLink = {
	label: string;
	href: string;
};

export type HireData = {
	hero: {
		name: [string, string];
		title: string;
		statement: string;
	};
	works: HireWork[];
	pillars: HirePillar[];
	tracks: HireTrack[];
	roles: HireRole[];
	targets: string[];
	status: string;
	contact: HireLink;
	links: HireLink[];
};

const topRoles: HireRole[] = cvData.workExperience.slice(0, 4).map((e) => ({
	title: e.title,
	org: e.organization,
	period: e.startDate.includes("-") ? e.startDate : `${e.startDate} → ${e.endDate === "present" ? "Now" : e.endDate}`,
	highlight: e.highlights?.[0] ?? "",
}));

export const hireData: HireData = {
	hero: {
		name: ["Stüssy", "Senik"],
		title: "Design Engineer · AI-Native Products · Full-Stack Systems",
		statement: "This website is the application. Every surface, interaction, and system behind it is proof — not a portfolio, a working prototype you can verify right now.",
	},
	works: [
		{ title: "Portfolio OS", preview: "/static/previews/curate-your-own-network.png", href: "/" },
		{ title: "Mymind clone", preview: "/static/previews/curate-your-own-network.png", href: "/works" },
		{ title: "iPod emulator", preview: "/static/previews/ipod-emulator.png", href: "/works" },
		{ title: "AR face filters", preview: "/static/previews/spinning-wheel-ar-face-filter-lottery.png", href: "/works" },
		{ title: "Typewriter", preview: "/static/previews/typewriter-that-doesn-t-delete-or-can-t-go-back.png", href: "/works" },
		{ title: "PH-213 viz", preview: "/static/previews/ph-213-electricity-current-and-magnetism-concepts-viz.png", href: "/works" },
		{ title: "Wavelength radio", preview: "/static/previews/wavelength-radio.png", href: "/works" },
	],
	pillars: proofPillars,
	tracks: hiringTracks.map((t) => ({ label: t.label, summary: t.summary })),
	roles: topRoles,
	targets: targetCompanies,
	status: "Available now. NYC. US Citizen. Targeting teams where clarity, trust, and taste matter. 150+ commits into this system. 35M+ tokens of context engineering. The proof is the prototype you're looking at.",
	contact: {
		label: "hello@portfolio-forever.com",
		href: "mailto:hello@portfolio-forever.com",
	},
	links: [
		{ label: "Works", href: "/works" },
		{ label: "Process", href: "/process" },
		{ label: "Terminal", href: "/terminal" },
		{ label: "CV", href: "/cv" },
	],
};