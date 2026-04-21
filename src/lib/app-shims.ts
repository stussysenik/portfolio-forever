// Shims for SvelteKit modules to allow shared components to run in Astro
export const goto = (url: string) => {
	if (typeof window !== "undefined") {
		window.location.href = url;
	}
};

export const replaceState = (url: string, state: any) => {
	if (typeof window !== "undefined" && window.history) {
		window.history.replaceState(state, "", url);
	}
};

export const browser = typeof window !== "undefined";

export const env = {
	public: {}
};

// Re-export api if needed, but better to import directly from convex
export { api } from '../../convex/_generated/api';
