/**
 * Hero section logic — handles Convex subscriptions and reactive data.
 * Ported from clj/portfolio/sections/hero.cljs
 */
import { api } from "$lib/app-shims";

export function formatProfileData(data: any, defaultProfile: any) {
	if (data && data.profile) {
		const p = data.profile;
		return {
			name: p.name || defaultProfile.name,
			taglines: p.taglines || defaultProfile.taglines,
			shortBio: p.shortBio || p.summary || defaultProfile.shortBio,
			location: p.location || defaultProfile.location,
			available: p.available !== undefined ? p.available : defaultProfile.available,
			sameAs: p.sameAs || [],
		};
	}
	return defaultProfile;
}

export function setupHeroSubscriptions(client: any, callbacks: any) {
	const { onProfile, onWorks, onConfig } = callbacks;

	const unsubProfile = client.onUpdate(
		api.cv.getVisibleCV,
		{},
		(data: any) => {
			if (onProfile) onProfile(data);
		}
	);
	const unsubWorks = client.onUpdate(
		api.works.getVisibleWorks,
		{},
		(data: any) => {
			if (onWorks) onWorks(data);
		}
	);
	const unsubConfig = client.onUpdate(
		api.hero.getHeroConfig,
		{},
		(data: any) => {
			if (onConfig) onConfig(data);
		}
	);

	return () => {
		unsubProfile();
		unsubWorks();
		unsubConfig();
	};
}

export function getHeroConfigDerived(config: any) {
	return {
		showDonut: config ? (config.showAsciiDonut ?? true) : true,
		showWave: config ? (config.showAsciiWave ?? false) : false,
		layout: config ? (config.layout ?? "default") : "default",
		archived: config ? (config.archived ?? true) : true,
	};
}
