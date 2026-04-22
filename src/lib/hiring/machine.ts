import { createMachine, assign } from "xstate";

export type ApplicationStage =
	| "identified"
	| "researching"
	| "applied"
	| "screening"
	| "technical"
	| "onsite"
	| "offer"
	| "accepted"
	| "declined"
	| "rejected";

export type CompanyTier = "tier1" | "tier2" | "tier3";

export interface Application {
	id: string;
	company: string;
	role: string;
	url: string;
	stage: ApplicationStage;
	tier: CompanyTier;
	dateIdentified: string;
	dateApplied?: string;
	notes?: string;
}

export type HiringEvent =
	| { type: "IDENTIFY"; app: Omit<Application, "id" | "stage"> }
	| { type: "APPLY"; id: string; date: string }
	| { type: "ADVANCE"; id: string; to: ApplicationStage }
	| { type: "REJECT"; id: string }
	| { type: "WITHDRAW"; id: string }
	| { type: "ADD_NOTE"; id: string; note: string }
	| { type: "RESET" };

interface HiringContext {
	applications: Application[];
	activeId: string | null;
}

const generateId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const hiringMachine = createMachine(
	{
		id: "hiring",
		initial: "tracking",
		context: {
			applications: [],
			activeId: null,
		} satisfies HiringContext,
		states: {
			tracking: {
				on: {
					IDENTIFY: {
						actions: assign({
							applications: ({ context, event }) => [
								...context.applications,
								{ ...event.app, id: generateId(), stage: "identified" },
							],
						}),
					},
					APPLY: {
						actions: assign({
							applications: ({ context, event }) =>
								context.applications.map((app) =>
									app.id === event.id
										? { ...app, stage: "applied" as const, dateApplied: event.date }
										: app,
								),
						}),
					},
					ADVANCE: {
						actions: assign({
							applications: ({ context, event }) =>
								context.applications.map((app) =>
									app.id === event.id ? { ...app, stage: event.to } : app,
								),
						}),
					},
					REJECT: {
						actions: assign({
							applications: ({ context, event }) =>
								context.applications.map((app) =>
									app.id === event.id ? { ...app, stage: "rejected" as const } : app,
								),
						}),
					},
					WITHDRAW: {
						actions: assign({
							applications: ({ context, event }) =>
								context.applications.map((app) =>
									app.id === event.id ? { ...app, stage: "declined" as const } : app,
								),
						}),
					},
					ADD_NOTE: {
						actions: assign({
							applications: ({ context, event }) =>
								context.applications.map((app) =>
									app.id === event.id
										? { ...app, notes: event.note }
										: app,
								),
						}),
					},
					RESET: {
						actions: assign({
							applications: [],
							activeId: null,
						}),
					},
				},
			},
		},
	},
	{
		// Actor implementations for future async operations
		actors: {},
		// Action implementations
		actions: {},
		// Guard implementations
		guards: {},
		// Delay implementations
		delays: {},
	},
);

export type HiringMachine = typeof hiringMachine;
