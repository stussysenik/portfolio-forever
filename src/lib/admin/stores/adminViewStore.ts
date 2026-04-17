import { writable } from 'svelte/store';

type AdminView = 'dashboard' | 'pages' | 'content' | 'settings' | 'themes' | 'history';

interface AdminViewStore {
    currentView: AdminView;
    currentSubView?: string; // e.g., a specific content type like 'blogPosts'
}

function createAdminViewStore() {
    const { subscribe, set, update } = writable<AdminViewStore>({
        currentView: 'dashboard',
    });

    return {
        subscribe,
        setView: (view: AdminView, subView?: string) => set({ currentView: view, currentSubView: subView }),
        update,
    };
}

export const adminViewStore = createAdminViewStore();
