import { writable } from 'svelte/store';

export interface Toast {
	id: number;
	message: string;
	type: 'success' | 'error' | 'info';
}

let nextId = 0;

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		success(message: string) { this.add(message, 'success'); },
		error(message: string) { this.add(message, 'error'); },
		info(message: string) { this.add(message, 'info'); },
		add(message: string, type: Toast['type'] = 'info') {
			const id = nextId++;
			update(t => [...t, { id, message, type }]);
			setTimeout(() => this.dismiss(id), 3000);
		},
		dismiss(id: number) {
			update(t => t.filter(toast => toast.id !== id));
		},
	};
}

export const toast = createToastStore();
