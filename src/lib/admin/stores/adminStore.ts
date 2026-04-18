import { readable } from 'svelte/store';
import type { ConvexReactClient } from 'convex/react';
import type { Api } from '$convex/_generated/api';

export type AdminStore = ReturnType<typeof createAdminStore>;

export function createAdminStore(client: ConvexReactClient<typeof Api>, api: typeof Api) {
	const createSubscription = <T>(query: (api: typeof Api) => any, initialValue: T) => {
		return readable<T>(initialValue, (set) => {
			if (!client) return;
			const unsubscribe = client.onUpdate(query(api), {}, (data: any) => {
				if (data !== undefined) {
					set(data as T);
				}
			});
			return () => unsubscribe();
		});
	};

	const createMultiTableSubscription = <T>(queries: Record<string, (api: typeof Api) => any>, initialValue: T) => {
		return readable<T>(initialValue, (set) => {
			if (!client) return;

			let combinedData = { ...initialValue };

			const unsubscribers = Object.entries(queries).map(([key, query]) => {
				return client.onUpdate(query(api), {}, (data: any) => {
					if (data !== undefined) {
						combinedData = { ...combinedData, [key]: data };
						set(combinedData);
					}
				});
			});

			return () => unsubscribers.forEach(unsub => unsub());
		});
	};
    
	const entriesByTable = createMultiTableSubscription({
		worksEntries: (api) => api.works.getFullWorks,
		talksEntries: (api) => api.talks.getFullTalks,
		blogPosts: (api) => api.blog.getFullPosts,
		galleryItems: (api) => api.gallery.getFullGallery,
		likesCategories: (api) => api.likes.getFullLikes,
		minorEntries: (api) => api.minor.getFullMinor,
		labEntries: (api) => api.labs.getFullLabs,
		academicEntries: (api) => api.academia.getFullAcademia,
		heroCaseStudies: (api) => api.heroCaseStudies.getFull,
		processConfig: (api) => api.process.getProcessConfig,
		osConfig: (api) => api.os.getOsConfig,
		terminalConfig: (api) => api.terminal.getTerminalConfig,
	}, {});


	const cvData = readable<{ profile: any; entries: any[] }>({ profile: null, entries: [] }, (set) => {
		if (!client) return;
		const unsubscribe = client.onUpdate(api.cv.getFullCV, {}, (data: any) => {
			if (data) {
				set({ profile: data.profile ?? null, entries: data.entries ?? [] });
			}
		});
		return () => unsubscribe();
	});

	return {
		pages: createSubscription<(any)[]>(api => api.pages.getAll, []),
		siteConfig: createSubscription<any>(api => api.siteConfig.get, null),
		featureFlags: createSubscription<(any)[]>(api => api.siteConfig.getFeatureFlags, []),
		registrySections: createSubscription<(any)[]>(api => api.sectionRegistry.getAll, []),
		heroConfig: createSubscription<any>(api => api.hero.getHeroConfig, null),
		themes: createSubscription<(any)[]>(api => api.themes.getAll, []),
		entriesByTable,
		cvData,
	};
}
