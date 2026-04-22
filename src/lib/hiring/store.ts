import { atom, computed } from "nanostores";
import type { Application, ApplicationStage, CompanyTier } from "./machine";

/* ── Core Atoms ── */

/** All tracked applications */
export const applicationsStore = atom<Application[]>([]);

/** Currently selected filter stage */
export const filterStageStore = atom<ApplicationStage | "all">("all");

/** Currently selected company tier */
export const filterTierStore = atom<CompanyTier | "all">("all");

/** Search query for role/company filtering */
export const searchQueryStore = atom<string>("");

/** Active application ID for detail view */
export const activeIdStore = atom<string | null>(null);

/* ── Derived Stores (Computed) ── */

/** Filtered applications based on all active filters */
export const filteredApplicationsStore = computed(
	[applicationsStore, filterStageStore, filterTierStore, searchQueryStore],
	(apps, stage, tier, query) => {
		return apps.filter((app) => {
			const stageMatch = stage === "all" || app.stage === stage;
			const tierMatch = tier === "all" || app.tier === tier;
			const queryMatch =
				query.length === 0 ||
				app.company.toLowerCase().includes(query.toLowerCase()) ||
				app.role.toLowerCase().includes(query.toLowerCase());
			return stageMatch && tierMatch && queryMatch;
		});
	},
);

/** Statistics for the dashboard header */
export const statsStore = computed([applicationsStore], (apps) => ({
	total: apps.length,
	applied: apps.filter((a) => a.stage !== "identified" && a.stage !== "researching").length,
	inProcess: apps.filter(
		(a) =>
			a.stage === "screening" ||
			a.stage === "technical" ||
			a.stage === "onsite",
	).length,
	offers: apps.filter((a) => a.stage === "offer" || a.stage === "accepted").length,
	rejected: apps.filter((a) => a.stage === "rejected" || a.stage === "declined").length,
}));

/** Active application details */
export const activeApplicationStore = computed([applicationsStore, activeIdStore], (apps, id) =>
	id ? apps.find((a) => a.id === id) ?? null : null,
);

/* ── Actions ── */

export function addApplication(app: Omit<Application, "id" | "stage">) {
	const newApp: Application = {
		...app,
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		stage: "identified",
	};
	applicationsStore.set([...applicationsStore.get(), newApp]);
}

export function advanceApplication(id: string, stage: ApplicationStage) {
	applicationsStore.set(
		applicationsStore.get().map((app) => (app.id === id ? { ...app, stage } : app)),
	);
}

export function rejectApplication(id: string) {
	advanceApplication(id, "rejected");
}

export function withdrawApplication(id: string) {
	advanceApplication(id, "declined");
}

export function addNote(id: string, note: string) {
	applicationsStore.set(
		applicationsStore.get().map((app) => (app.id === id ? { ...app, notes: note } : app)),
	);
}

export function setActiveId(id: string | null) {
	activeIdStore.set(id);
}

export function setFilterStage(stage: ApplicationStage | "all") {
	filterStageStore.set(stage);
}

export function setFilterTier(tier: CompanyTier | "all") {
	filterTierStore.set(tier);
}

export function setSearchQuery(query: string) {
	searchQueryStore.set(query);
}

export function resetAll() {
	applicationsStore.set([]);
	filterStageStore.set("all");
	filterTierStore.set("all");
	searchQueryStore.set("");
	activeIdStore.set(null);
}
