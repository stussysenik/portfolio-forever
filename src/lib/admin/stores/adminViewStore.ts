// @ts-ignore
import { admin_view_store } from '../../clj/portfolio/stores/admin_view.mjs';

export const adminViewStore = admin_view_store;
export type AdminView = 'dashboard' | 'pages' | 'content' | 'settings' | 'themes' | 'history' | 'takeouts';

export interface AdminViewStore {
	currentView: AdminView;
	currentSubView?: string;
}
