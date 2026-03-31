<script lang="ts">
	import { onMount } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import { getClerk } from '$lib/clerk';
	import { toast } from '$lib/stores/toast';

	import AdminHeader from '$lib/admin/AdminHeader.svelte';
	import AdminNav from '$lib/admin/AdminNav.svelte';
	import DisplayAdmin from '$lib/admin/DisplayAdmin.svelte';
	import SiteConfigAdmin from '$lib/admin/SiteConfigAdmin.svelte';
	import SectionOrderAdmin from '$lib/admin/SectionOrderAdmin.svelte';
	import FeatureFlagsAdmin from '$lib/admin/FeatureFlagsAdmin.svelte';
	import ProfileAdmin from '$lib/admin/ProfileAdmin.svelte';
	import CvAdmin from '$lib/admin/CvAdmin.svelte';
	import AcademiaAdmin from '$lib/admin/AcademiaAdmin.svelte';
	import WorksAdmin from '$lib/admin/WorksAdmin.svelte';
	import TalksAdmin from '$lib/admin/TalksAdmin.svelte';
	import LikesAdmin from '$lib/admin/LikesAdmin.svelte';
	import GiftsAdmin from '$lib/admin/GiftsAdmin.svelte';
	import ThumbnailAdmin from '$lib/admin/ThumbnailAdmin.svelte';

	const client = getConvexClient();

	// ── Auth State ──
	let authed = false;
	let authLoading = true;
	let authError = '';
	let userName = '';
	let userImage = '';
	let signInFn: (() => void) | null = null;

	// ── Data State ──
	let profile: any = null;
	let entries: any[] = [];
	let languages: any[] = [];
	let sections: any[] = [];
	let academicEntries: any[] = [];
	let worksEntries: any[] = [];
	let talksEntries: any[] = [];
	let likesCategories: any[] = [];
	let giftsConfig: any = null;
	let thumbnailConfigs: any[] = [];
	let siteConfigData: any = null;
	let featureFlags: any[] = [];
	let loading = true;
	let activeGroup = 'content';
	let activeSection = 'profile';
	let displayConfigs: any[] = [];

	const ALLOWED_GITHUB_USERNAMES = ['stussysenik', 's3nik', 'itsmxzou@gmail.com'];

	onMount(async () => {
		try {
			const clerk = await getClerk();
			if (clerk.user) {
				const ghAccount = clerk.user.externalAccounts?.find(
					(a: any) => a.provider === 'github' || a.provider === 'oauth_github'
				);
				const ghUsername = ghAccount?.username || clerk.user.username || '';
				const email = clerk.user.primaryEmailAddress?.emailAddress || '';
				const isAllowed = ALLOWED_GITHUB_USERNAMES.includes(ghUsername.toLowerCase())
					|| ALLOWED_GITHUB_USERNAMES.includes(email.toLowerCase());

				if (isAllowed) {
					authed = true;
					userName = clerk.user.fullName || clerk.user.firstName || ghUsername;
					userImage = clerk.user.imageUrl || '';
				} else {
					authError = `Access denied. Account "${ghUsername || email}" is not authorized.`;
					authLoading = false;
					return;
				}
			} else {
				authLoading = false;
				signInFn = () => clerk.redirectToSignIn({ redirectUrl: window.location.href });
				return;
			}
		} catch (e: any) {
			if (e.message?.includes('publishable')) {
				authError = 'Clerk not configured. Add PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local';
			} else {
				authError = `Auth error: ${e.message}`;
			}
			authLoading = false;
			return;
		}
		authLoading = false;

		if (!authed) return;

		// ── Convex Subscriptions ──
		const unsub1 = client.onUpdate(api.cv.getFullCV, {}, (data) => {
			if (data) {
				profile = data.profile;
				entries = data.entries;
				languages = data.languages;
				sections = data.sections;
				loading = false;
			}
		});
		const unsub2 = client.onUpdate(api.academia.getFullAcademia, {}, (data) => {
			if (data) academicEntries = data;
		});
		const unsub3 = client.onUpdate(api.works.getFullWorks, {}, (data) => {
			if (data) worksEntries = data;
		});
		const unsub4 = client.onUpdate(api.talks.getFullTalks, {}, (data) => {
			if (data) talksEntries = data;
		});
		const unsub5 = client.onUpdate(api.likes.getFullLikes, {}, (data) => {
			if (data) likesCategories = data;
		});
		const unsub6 = client.onUpdate(api.gifts.getGiftsConfig, {}, (data) => {
			giftsConfig = data;
		});
		const unsub7 = client.onUpdate(api.thumbnails.getAllConfigs, {}, (data) => {
			if (data) thumbnailConfigs = data;
		});
		const unsub8 = client.onUpdate(api.siteConfig.get, {}, (data) => {
			siteConfigData = data;
		});
		const unsub9 = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (data) => {
			if (data) featureFlags = data;
		});
		const unsubDisplay = client.onUpdate(api.display.getAllConfigs, {}, (data: any) => {
			if (data) displayConfigs = data;
		});
		return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6(); unsub7(); unsub8(); unsub9(); unsubDisplay(); };
	});

	// ── Page-level Actions ──
	function exportPDF() {
		window.open('/cv', '_blank');
		setTimeout(() => {
			alert('Use Ctrl/Cmd+P on the CV page to print or save as PDF.');
		}, 500);
	}

	function exportSiteConfig() {
		const config = {
			siteConfig: siteConfigData,
			featureFlags,
			thumbnailConfigs,
			exportedAt: new Date().toISOString(),
		};
		const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `site-config-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success('Config exported');
	}
</script>

<svelte:head>
	<title>Admin | Portfolio CMS</title>
</svelte:head>

<div class="admin">
	{#if authLoading}
		<div class="auth-gate">
			<div class="loading">Authenticating...</div>
		</div>
	{:else if !authed}
		<div class="auth-gate">
			{#if authError}
				<div class="auth-error">{authError}</div>
			{:else}
				<h1 class="auth-title">Portfolio Admin</h1>
				<p class="auth-subtitle">Sign in with GitHub to manage your portfolio.</p>
				{#if signInFn}
					<button class="btn-github" on:click={signInFn}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
						Sign in with GitHub
					</button>
				{/if}
			{/if}
		</div>
	{:else}
		<AdminHeader {userName} {userImage} on:exportPDF={exportPDF} on:exportJSON={exportSiteConfig} />

		<AdminNav {activeGroup} {activeSection} {displayConfigs}
			on:navigate={(e) => { activeGroup = e.detail.group; activeSection = e.detail.section; }} />

		{#if loading}
			<div class="loading">Loading CV data from Convex...</div>
		{:else if activeGroup === 'content'}
			{#if activeSection === 'profile'}
				<ProfileAdmin {client} api={api} {profile} />
			{:else if activeSection === 'works'}
				<WorksAdmin {client} api={api} entries={worksEntries} />
			{:else if activeSection === 'cv'}
				<CvAdmin {client} api={api} {entries} {languages} {sections} />
			{:else if activeSection === 'talks'}
				<TalksAdmin {client} api={api} entries={talksEntries} />
			{:else if activeSection === 'likes'}
				<LikesAdmin {client} api={api} categories={likesCategories} />
			{:else if activeSection === 'gifts'}
				<GiftsAdmin {client} api={api} {giftsConfig} />
			{:else if activeSection === 'academia'}
				<AcademiaAdmin {client} api={api} entries={academicEntries} />
			{:else if activeSection === 'gallery'}
				<p style="padding: var(--space-lg); color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.85rem;">Gallery admin — coming in Phase 2</p>
			{:else if activeSection === 'minor'}
				<p style="padding: var(--space-lg); color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.85rem;">Minor admin — coming in Phase 2</p>
			{:else if activeSection === 'labs'}
				<p style="padding: var(--space-lg); color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.85rem;">Labs admin — coming in Phase 2</p>
			{:else if activeSection === 'blog'}
				<p style="padding: var(--space-lg); color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.85rem;">Blog admin — coming in Phase 2</p>
			{/if}
		{:else if activeGroup === 'appearance'}
			<SiteConfigAdmin {client} api={api} {siteConfigData} />
			<SectionOrderAdmin {client} api={api} {siteConfigData} />
			<ThumbnailAdmin {client} api={api} thumbnailConfigs={thumbnailConfigs} />
		{:else if activeGroup === 'system'}
			<FeatureFlagsAdmin {client} api={api} {featureFlags} />
			<DisplayAdmin {client} api={api} {displayConfigs} />
		{/if}
	{/if}
</div>

<style>
	.admin {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-md);
	}

	.auth-gate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		text-align: center;
		gap: var(--space-md);
	}

	.auth-title {
		font-size: var(--font-size-2xl);
		font-weight: 600;
	}

	.auth-subtitle {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.auth-error {
		color: var(--color-error);
		padding: var(--space-md);
		border: 1px solid var(--color-error);
		border-radius: var(--radius-md);
		max-width: 400px;
	}

	.btn-github {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 12px 24px;
		font-size: var(--font-size-base);
		font-weight: 500;
		font-family: inherit;
		color: var(--color-surface);
		background: var(--color-admin-github-bg);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: background var(--duration-fast) var(--easing);
	}

	.btn-github:hover {
		background: var(--color-admin-github-hover);
	}

	.loading {
		text-align: center;
		padding: var(--space-3xl);
		color: var(--color-text-muted);
	}
</style>
