import { writable, derived, get } from 'svelte/store';

export type PendingChange = {
	id: string;
	action: string;
	args: Record<string, unknown>;
	label: string;
	createdAt: number;
};

export type PendingStore = {
	changes: PendingChange[];
};

let changeCounter = 0;

function createPendingStore() {
	const { subscribe, set, update } = writable<PendingStore>({ changes: [] });

	return {
		subscribe,
		push(change: Omit<PendingChange, 'id' | 'createdAt'>) {
			const entry: PendingChange = {
				...change,
				id: `ch_${++changeCounter}_${Date.now()}`,
				createdAt: Date.now(),
			};
			update((s) => ({ ...s, changes: [...s.changes, entry] }));
			return entry.id;
		},
		remove(id: string) {
			update((s) => ({
				...s,
				changes: s.changes.filter((c) => c.id !== id),
			}));
		},
		clear() {
			set({ changes: [] });
		},
		snapshot(): PendingChange[] {
			return get({ subscribe }).changes;
		},
	};
}

export const pendingChanges = createPendingStore();

export const pendingCount = derived(pendingChanges, ($s) => $s.changes.length);

export const pendingLabels = derived(pendingChanges, ($s) =>
	$s.changes.map((c) => c.label)
);