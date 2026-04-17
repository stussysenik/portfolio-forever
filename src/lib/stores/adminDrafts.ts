import { writable, get } from 'svelte/store';

/**
 * Admin Draft Store
 *
 * Tracks uncommitted changes in the admin CMS.
 * Keyed by table/document ID to allow per-entry reverting.
 */
interface DraftState {
	original: Record<string, any>;
	current: Record<string, any>;
	isDirty: boolean;
}

export const adminDrafts = writable<Record<string, DraftState>>({});

/**
 * Initialize a draft for a specific record
 */
export function initDraft(id: string, initialData: any) {
	adminDrafts.update(drafts => {
		if (drafts[id]) return drafts;
		return {
			...drafts,
			[id]: {
				original: JSON.parse(JSON.stringify(initialData)),
				current: JSON.parse(JSON.stringify(initialData)),
				isDirty: false
			}
		};
	});
}

/**
 * Update a draft value
 */
export function updateDraft(id: string, updates: any) {
	adminDrafts.update(drafts => {
		const draft = drafts[id];
		if (!draft) return drafts;

		const nextCurrent = { ...draft.current, ...updates };
		const isDirty = JSON.stringify(nextCurrent) !== JSON.stringify(draft.original);

		return {
			...drafts,
			[id]: {
				...draft,
				current: nextCurrent,
				isDirty
			}
		};
	});
}

/**
 * Reset a draft to its original state
 */
export function resetDraft(id: string) {
	adminDrafts.update(drafts => {
		const draft = drafts[id];
		if (!draft) return drafts;

		return {
			...drafts,
			[id]: {
				...draft,
				current: JSON.parse(JSON.stringify(draft.original)),
				isDirty: false
			}
		};
	});
}

/**
 * Commit a draft (call after successful mutation)
 */
export function commitDraft(id: string) {
	adminDrafts.update(drafts => {
		const draft = drafts[id];
		if (!draft) return drafts;

		return {
			...drafts,
			[id]: {
				original: JSON.parse(JSON.stringify(draft.current)),
				current: draft.current,
				isDirty: false
			}
		};
	});
}
