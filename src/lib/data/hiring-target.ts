export type HiringTrack = {
	id: string;
	label: string;
	summary: string;
};

export type ProofRoute = {
	label: string;
	href: string;
	reason: string;
};

export type ProofPillar = {
	title: string;
	detail: string;
};

export const hiringMission =
	"Direct proof for design engineering, AI-native product craft, and frontend systems work where clarity, trust, and taste matter.";

export const hiringTracks: HiringTrack[] = [
	{
		id: "design-engineer",
		label: "Design engineer",
		summary: "Concept to code with no fidelity gap between prototype, system, and shipped surface.",
	},
	{
		id: "ai-product",
		label: "AI product craft",
		summary: "Interfaces for probabilistic systems that feel trustworthy, legible, and actually useful.",
	},
	{
		id: "frontend-systems",
		label: "Frontend systems",
		summary: "Typed, responsive, accessible interfaces for expert users, mobile contexts, and high-stakes workflows.",
	},
];

export const proofRoutes: ProofRoute[] = [
	{
		label: "works",
		href: "/works",
		reason: "Live shipped surfaces, prototypes, and embeds.",
	},
	{
		label: "cv",
		href: "/cv",
		reason: "Role history, ownership, and range.",
	},
	{
		label: "process",
		href: "/process",
		reason: "How the work gets clarified, built, and verified.",
	},
];

export const proofPillars: ProofPillar[] = [
	{
		title: "Ship the interface",
		detail: "Web, mobile-minded, motion-aware implementation with a quality bar closer to product than portfolio theatre.",
	},
	{
		title: "Reduce complexity cleanly",
		detail: "AI, finance, editorial, and internal-tool flows reduced to calm, high-signal surfaces without flattening the underlying power.",
	},
	{
		title: "Work AI-native without losing taste",
		detail: "Use code, prompts, prototypes, and systems thinking together, then tighten until the final surface feels intentional.",
	},
];

export const targetCompanies = [
	"Ramp",
	"Linear",
	"OpenAI",
	"Google DeepMind",
	"Basement Studio",
	"Jane Street",
	"Windmill",
	"Notion",
	"Apple",
	"Mistral AI",
];
