/**
 * Staged changes store for admin CMS.
 * Ported from clj/portfolio/admin/staging.cljs
 */
import { writable, derived } from 'svelte/store';

export interface StagedChange {
	table: string;
	id: string;
	patch: any;
	label: string;
}

const store = writable(new Map<string, StagedChange>());

export const stagedChanges = {
	subscribe: store.subscribe,
	stage: (table: string, id: string, patch: any, label: string) => {
		store.update(m => {
			const key = `${table}:${id}`;
			m.set(key, { table, id, patch, label });
			return m;
		});
	},
	unstage: (table: string, id: string) => {
		store.update(m => {
			m.delete(`${table}:${id}`);
			return m;
		});
	},
	clear: () => {
		store.set(new Map());
	}
};

export const stagedChangesCount = derived(store, (map) => map.size);

export const stagedChangesLabels = derived(store, (map) => {
	const labels: string[] = [];
	map.forEach((c) => labels.push(c.label));
	return labels;
});
