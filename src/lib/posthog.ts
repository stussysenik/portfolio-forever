import posthog from 'posthog-js';
import { browser } from '$app/environment';

let initialized = false;

export function initPostHog() {
	if (!browser || initialized) return;

	const key = import.meta.env.PUBLIC_POSTHOG_KEY;
	if (!key) return;

	posthog.init(key, {
		api_host: import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
		capture_pageview: false, // We handle this manually for SPA navigation
		capture_pageleave: true,
		persistence: 'localStorage+cookie',
		autocapture: true,
		session_recording: {
			maskAllInputs: false,
			maskInputOptions: { password: true },
		},
		enable_heatmaps: true,
	});

	initialized = true;
}

export function trackPageView(url: string) {
	if (!browser || !initialized) return;
	posthog.capture('$pageview', { $current_url: url });
}

export function identifyUser(id: string, properties?: Record<string, any>) {
	if (!browser || !initialized) return;
	posthog.identify(id, properties);
}

export { posthog };
