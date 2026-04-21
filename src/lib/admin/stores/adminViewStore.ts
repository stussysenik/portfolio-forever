/**
 * Admin view store for navigation.
 * Ported from clj/portfolio/stores/admin_view.cljs
 */
import { writable } from 'svelte/store';

export type AdminView = 'dashboard' | 'pages' | 'content' | 'settings' | 'themes' | 'history' | 'takeouts';

export interface AdminViewStoreState {
	currentView: AdminView;
	currentSubView?: string;
}

const initialState: AdminViewStoreState = {
	currentView: 'dashboard'
};

const store = writable<AdminViewStoreState>(initialState);

export const adminViewStore = {
	subscribe: store.subscribe,
	set: store.set,
	update: store.update,
	setView: (view: AdminView, subView?: string) => {
		store.set({ currentView: view, currentSubView: subView });
	}
};

export function setAdminView(view: AdminView, subView?: string) {
	adminViewStore.setView(view, subView);
}
