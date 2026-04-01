<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import ContentHub from '$lib/admin/ContentHub.svelte';
	import SettingsDrawer from '$lib/admin/SettingsDrawer.svelte';

	const { client, api } = getContext<any>('admin');

	let pages: any[] = [];
	let siteConfigData: any = null;
	let featureFlags: any[] = [];
	let registrySections: any[] = [];
	let entriesByTable: Record<string, any[]> = {};
	let currentTheme = 'minimal';
	let currentFont = 'inter';
	let settingsOpen = false;

	onMount(() => {
		currentTheme = document.documentElement.dataset.theme || 'minimal';
		currentFont = document.documentElement.dataset.font || 'inter';

		const subs = [
			client.onUpdate(api.pages.getAll, {}, (data: any) => { if (data) pages = data; }),
			client.onUpdate(api.siteConfig.get, {}, (data: any) => { siteConfigData = data; }),
			client.onUpdate(api.siteConfig.getFeatureFlags, {}, (data: any) => { if (data) featureFlags = data; }),
			client.onUpdate(api.sectionRegistry.getAll, {}, (data: any) => { if (data) registrySections = data; }),
			client.onUpdate(api.works.getFullWorks, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, worksEntries: data };
			}),
			client.onUpdate(api.talks.getFullTalks, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, talksEntries: data };
			}),
			client.onUpdate(api.blog.getFullPosts, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, blogPosts: data };
			}),
			client.onUpdate(api.gallery.getFullGallery, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, galleryItems: data };
			}),
			client.onUpdate(api.likes.getFullLikes, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, likesCategories: data };
			}),
			client.onUpdate(api.minor.getFullMinor, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, minorEntries: data };
			}),
			client.onUpdate(api.labs.getFullLabs, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, labEntries: data };
			}),
			client.onUpdate(api.academia.getFullAcademia, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, academicEntries: data };
			}),
			client.onUpdate(api.cv.getFullCV, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, cvEntries: data.entries ?? [] };
			}),
		];

		return () => subs.forEach((fn) => fn());
	});
</script>

<svelte:head>
	<title>Admin | Portfolio OS</title>
</svelte:head>

<div class="admin-landing">
	<header class="admin-header">
		<div class="admin-header-left">
			<h1 class="admin-title">portfolio</h1>
			<span class="admin-sep">/</span>
			<span class="admin-sub">admin</span>
		</div>
		<div class="admin-header-right">
			<button
				class="settings-btn"
				on:click={() => (settingsOpen = true)}
				aria-label="Open settings"
			>
				Settings
			</button>
		</div>
	</header>

	<ContentHub
		{pages}
		{featureFlags}
		{entriesByTable}
		{client}
		{api}
	/>
</div>

<SettingsDrawer
	open={settingsOpen}
	{client}
	api={api}
	{currentTheme}
	{currentFont}
	siteConfig={siteConfigData}
	featureFlags={featureFlags}
	registrySections={registrySections}
	on:close={() => (settingsOpen = false)}
/>

<style>
	.admin-landing {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
		min-height: 100vh;
	}

	.admin-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.admin-header-left {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.admin-title {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: -0.3px;
		margin: 0;
	}

	.admin-sep {
		color: var(--color-text-subtle, #333);
	}

	.admin-sub {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted, #888);
	}

	.settings-btn {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		padding: 4px 10px;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
	}

	.settings-btn:hover {
		color: var(--color-text);
		border-color: var(--border-color);
	}
</style>
