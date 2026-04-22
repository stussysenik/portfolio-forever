import { match, P } from "ts-pattern";
import * as R from "remeda";
import type { Application, ApplicationStage, CompanyTier } from "./machine";
import { targetRoles } from "../data/hiring-target";

/* ── ts-pattern: Exhaustive Stage Classification ── */

export type StageCategory = "pre-application" | "in-process" | "post-process" | "terminal";

export function classifyStage(stage: ApplicationStage): StageCategory {
	return match(stage)
		.with("identified", "researching", () => "pre-application" as const)
		.with("applied", "screening", "technical", "onsite", () => "in-process" as const)
		.with("offer", () => "post-process" as const)
		.with("accepted", "declined", "rejected", () => "terminal" as const)
		.exhaustive();
}

export function stageEmoji(stage: ApplicationStage): string {
	return match(stage)
		.with("identified", () => "🔍")
		.with("researching", () => "📋")
		.with("applied", () => "📤")
		.with("screening", () => "📞")
		.with("technical", () => "💻")
		.with("onsite", () => "🏢")
		.with("offer", () => "📨")
		.with("accepted", () => "✅")
		.with("declined", () => "🚪")
		.with("rejected", () => "❌")
		.exhaustive();
}

export function stageLabel(stage: ApplicationStage): string {
	return match(stage)
		.with("identified", () => "Identified")
		.with("researching", () => "Researching")
		.with("applied", () => "Applied")
		.with("screening", () => "Screening")
		.with("technical", () => "Technical")
		.with("onsite", () => "Onsite")
		.with("offer", () => "Offer")
		.with("accepted", () => "Accepted")
		.with("declined", () => "Declined")
		.with("rejected", () => "Rejected")
		.exhaustive();
}

/* ── ts-pattern: Company Tier Assignment ── */

type TierPattern =
	| { type: "exact"; companies: string[] }
	| { type: "batch"; batches: number[] };

const tierRules: Record<CompanyTier, TierPattern> = {
	tier1: {
		type: "exact",
		companies: ["OpenAI", "Google DeepMind", "Apple", "Jane Street"],
	},
	tier2: {
		type: "exact",
		companies: ["Ramp", "Linear", "Notion", "Mistral AI"],
	},
	tier3: {
		type: "exact",
		companies: ["Windmill", "Basement Studio"],
	},
};

export function assignTier(company: string): CompanyTier {
	return match(tierRules)
		.with(
			{ tier1: { type: "exact", companies: P.array(P.string) } },
			(rules) =>
				(rules.tier1.companies.includes(company)
					? "tier1"
					: rules.tier2.companies.includes(company)
						? "tier2"
						: "tier3") as CompanyTier,
		)
		.otherwise(() => "tier3");
}

/* ── remeda: Functional Data Transformations ── */

/** Group applications by stage using Remeda's groupBy */
export function groupByStage(apps: Application[]) {
	return R.groupBy(apps, (app) => app.stage);
}

/** Group applications by company using Remeda */
export function groupByCompany(apps: Application[]) {
	return R.groupBy(apps, (app) => app.company);
}

/** Sort applications by priority: tier desc, then stage progress */
export function sortByPriority(apps: Application[]) {
	const tierWeight: Record<CompanyTier, number> = { tier1: 3, tier2: 2, tier3: 1 };
	const stageWeight: Record<ApplicationStage, number> = {
		identified: 0,
		researching: 1,
		applied: 2,
		screening: 3,
		technical: 4,
		 onsite: 5,
		offer: 6,
		accepted: 7,
		declined: 0,
		rejected: 0,
	};

	return R.sortBy(apps, [
		(app) => tierWeight[app.tier],
		"desc",
	], [
		(app) => stageWeight[app.stage],
		"desc",
	]);
}

/** Get unique companies from applications */
export function uniqueCompanies(apps: Application[]) {
	return R.pipe(
		apps,
		R.map((app) => app.company),
		R.unique(),
	);
}

/** Count applications per stage */
export function countByStage(apps: Application[]) {
	return R.pipe(
		apps,
		R.groupBy((app) => app.stage),
		R.mapValues((group) => group.length),
	);
}

/** Filter to only active (non-terminal) applications */
export function activeApplications(apps: Application[]) {
	return R.filter(apps, (app) =>
		match(app.stage)
			.with("accepted", "declined", "rejected", () => false)
			.otherwise(() => true),
	);
}

/** Calculate conversion rate from identified to applied */
export function conversionRate(apps: Application[]) {
	const identified = R.filter(apps, (a) => a.stage === "identified").length;
	const applied = R.filter(apps, (a) =>
		match(a.stage)
			.with("applied", "screening", "technical", "onsite", "offer", "accepted", () => true)
			.otherwise(() => false),
	).length;
	return identified > 0 ? (applied / identified) * 100 : 0;
}

/* ── Seed Data: Auto-populate from targetRoles ── */

export function seedApplications(): Application[] {
	return R.pipe(
		targetRoles,
		R.map((role) => ({
			company: role.company,
			role: role.title,
			url: role.url,
			stage: "identified" as ApplicationStage,
			tier: assignTier(role.company),
			dateIdentified: new Date().toISOString().split("T")[0],
		})),
		R.map((data) => ({
			...data,
			id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		})),
	);
}
