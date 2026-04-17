<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { AdminStore } from '$lib/admin/stores/adminStore';
	import AdminShell from '$lib/admin/AdminShell.svelte';
	import SectionBuilder from '$lib/admin/SectionBuilder.svelte';
	import GlobalCompartment from '$lib/admin/GlobalCompartment.svelte';
	import SectionCompartmentList from '$lib/admin/SectionCompartmentList.svelte';
	import PreviewPane from '$lib/admin/PreviewPane.svelte';
	import SectionPicker from '$lib/admin/SectionPicker.svelte';
	import SettingsDrawer from '$lib/admin/SettingsDrawer.svelte';
	import PagesSheet from '$lib/admin/sheets/PagesSheet.svelte';
	import SectionsSheet from '$lib/admin/sheets/SectionsSheet.svelte';
	import PreviewSheet from '$lib/admin/sheets/PreviewSheet.svelte';
	import { toast } from '$lib/stores/toast';
	import { stripConvexMeta } from '$lib/admin/constants';
	import { adminViewStore } from '$lib/admin/stores/adminViewStore';
	import ContentView from '$lib/admin/views/ContentView.svelte';
	import BlogPostsView from '$lib/admin/views/BlogPostsView.svelte';

	const { client, api } = getContext<any>('admin');
	const adminStore = getContext<AdminStore>('adminStore');
	const {
		pages,
		siteConfig,
		featureFlags,
		registrySections,
		heroConfig,
		entriesByTable,
		cvData
	} = adminStore;

	let settingsOpen = false;

	// Page & section selection state
	let activePageId = 'home';
	let showSectionPicker = false;
	let previewRefreshKey = 0;
	let selectedSectionId = '';
	let globalExpanded = false;
	let activeMobileSheet: 'pages' | 'sections' | 'preview' | null = null;

	$: activePage = ($pages ?? []).find((p) => p.pageId === activePageId) ?? null;
	$: previewRoute = activePage?.route ?? '/';
	$: cvProfileData = $cvData?.profile ?? null;

	// Theme/font for settings drawer
	let currentTheme = 'minimal';
	let currentFont = 'inter';

	onMount(() => {
		currentTheme = document.documentElement.dataset.theme || 'minimal';
		currentFont = document.documentElement.dataset.font || 'inter';

		// Seed initial data if necessary (can be removed later)
		const seedData = async () => {
			try {
				await client.mutation(api.pages.ensureSeeded, {});
			} catch (_) { /* already seeded */ }
			try {
				await client.mutation(api.seedAll.seedBlog, {});
			} catch (_) { /* already seeded */ }
			try {
				await client.mutation(api.seedAll.seedHeroCaseStudies, {});
			} catch (_) { /* already seeded */ }
		};
		void seedData();
	});

	function handleSelectPage(e: CustomEvent<{ pageId: string }>) {
		activePageId = e.detail.pageId;
	}

	async function handleToggleFlag(e: CustomEvent<{ key: string; category: string }>) {
		const { key, category } = e.detail;
		const flag = ($featureFlags ?? []).find((f: any) => f.key === key);
		const newState = !(flag?.enabled ?? true);
		try {
			await client.mutation(api.siteConfig.setFeatureFlag, { key, enabled: newState, category });
			toast.success(`${key}: ${newState ? 'ON' : 'OFF'}`);
		} catch (err: any) {
			toast.error(err.message || 'Failed to toggle flag');
		}
	}

	async function handleTogglePage(e: CustomEvent<{ pageId: string; visible: boolean }>) {
		const { pageId, visible } = e.detail;
		const page = ($pages ?? []).find((p: any) => p.pageId === pageId);
		if (!page) return;
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				visible,
				navVisible: visible ? page.navVisible ?? true : false
			});
			toast.success(`${page.label}: ${visible ? 'VISIBLE' : 'HIDDEN'}`);
		} catch (err: any) {
			toast.error(err.message || 'Failed to toggle page visibility');
		}
	}

	async function handleReorderPages(e: CustomEvent<{ pageIds: string[] }>) {
		const { pageIds } = e.detail;
		try {
			for (let i = 0; i < pageIds.length; i++) {
				const page = ($pages ?? []).find((p) => p.pageId === pageIds[i]);
				if (page && page.navOrder !== i) {
					await client.mutation(api.pages.upsert, { ...stripConvexMeta(page), navOrder: i });
				}
			}
		} catch (err: any) {
			toast.error(err.message || 'Failed to reorder pages');
		}
	}

	async function handleArchivePage(e: CustomEvent<{ pageId: string; archived: boolean }>) {
		const { pageId, archived } = e.detail;
		try {
			await client.mutation(api.pages.setArchived, { pageId, archived });
			const page = ($pages ?? []).find((p: any) => p.pageId === pageId);
			toast.success(`${page?.label ?? pageId}: ${archived ? 'ARCHIVED' : 'UNARCHIVED'}`);
		} catch (err: any) {
			toast.error(err.message || 'Failed to toggle archive');
		}
	}

	async function handleAddSection(e: CustomEvent<string>) {
		if (!activePage) return;
		const sectionTypeId = e.detail;
		const { sectionTypeRegistry } = await import('$lib/sections/registry');
		const def = sectionTypeRegistry[sectionTypeId];
		const newSection = {
			sectionType: sectionTypeId,
			config: {},
			dataTable: def?.dataTable,
			order: activePage.sections?.length ?? 0
		};
		const updatedSections = [...(activePage.sections ?? []), newSection];
		try {
			await client.mutation(api.pages.updateSections, {
				pageId: activePage.pageId,
				sections: updatedSections
			});
			showSectionPicker = false;
			previewRefreshKey++;
			toast.success(`Added ${def?.label ?? sectionTypeId}`);
		} catch (err: any) {
			toast.error(err.message || 'Failed to add section');
		}
	}
</script>

<svelte:head>
	<title>Admin | Portfolio OS</title>
</svelte:head>

<AdminShell
	pages={$pages}
	{activePage}
	featureFlags={$featureFlags}
	entriesByTable={$entriesByTable}
	siteConfig={$siteConfig}
	registrySections={$registrySections}
	{activeMobileSheet}
	on:selectpage={handleSelectPage}
	on:toggleflag={handleToggleFlag}
	on:togglepage={handleTogglePage}
	on:reorderpages={handleReorderPages}
	on:archivepage={handleArchivePage}
	on:opensettings={() => (settingsOpen = true)}
	on:openpages={() => (activeMobileSheet = 'pages')}
	on:opensections={() => (activeMobileSheet = 'sections')}
	on:openpreview={() => (activeMobileSheet = 'preview')}
>
	<!-- Builder pane (default slot) — compartment system -->
	{#if $adminViewStore.currentView === 'dashboard'}
		{#if activePage}
			<GlobalCompartment
				featureFlags={$featureFlags}
				siteConfig={$siteConfig}
				expanded={globalExpanded}
				{client}
				{api}
				on:toggle={() => (globalExpanded = !globalExpanded)}
			/>
			<SectionCompartmentList
				sections={activePage.sections ?? []}
				pageId={activePage.pageId}
				page={activePage}
				entriesByTable={$entriesByTable}
				featureFlags={$featureFlags}
				siteConfig={$siteConfig}
				heroConfig={$heroConfig}
				cvProfile={cvProfileData}
				{client}
				{api}
			/>
			<SectionBuilder
				page={activePage}
				featureFlags={$featureFlags}
				{client}
				{api}
				on:selectsection={(e) => {
					selectedSectionId = e.detail.sectionId;
				}}
				on:opensettings={() => (showSectionPicker = true)}
			/>
		{:else}
			<div class="empty-state">
				<p>Select a page to start editing</p>
			</div>
		{/if}
	{:else if $adminViewStore.currentView === 'pages'}
		<div class="placeholder">Pages Management Coming Soon</div>
	{:else if $adminViewStore.currentView === 'content'}
		{#if $adminViewStore.currentSubView === 'blogPosts'}
			<BlogPostsView />
		{:else}
			<ContentView />
		{/if}
	{:else if $adminViewStore.currentView === 'settings'}
		<div class="placeholder">Global Settings Coming Soon</div>
	{:else if $adminViewStore.currentView === 'themes'}
		<div class="placeholder">Theme Editor Coming Soon</div>
	{:else if $adminViewStore.currentView === 'history'}
		<div class="placeholder">Admin History Coming Soon</div>
	{/if}

	<!-- Preview pane (always visible — section config is now inline) -->
	<svelte:fragment slot="preview">
		<PreviewPane route={previewRoute} refreshKey={previewRefreshKey} {selectedSectionId} />
	</svelte:fragment>
</AdminShell>

<!-- Section Picker Modal -->
<SectionPicker
	open={showSectionPicker}
	on:pick={handleAddSection}
	on:close={() => (showSectionPicker = false)}
/>

<!-- Mobile sheets (below 768px) -->
<PagesSheet
	open={activeMobileSheet === 'pages'}
	pages={$pages}
	{activePageId}
	featureFlags={$featureFlags}
	entriesByTable={$entriesByTable}
	on:close={() => (activeMobileSheet = null)}
	on:selectpage={(e) => {
		handleSelectPage(e);
		activeMobileSheet = null;
	}}
	on:toggleflag={handleToggleFlag}
	on:togglepage={handleTogglePage}
	on:reorderpages={handleReorderPages}
	on:archivepage={handleArchivePage}
/>
<SectionsSheet
	open={activeMobileSheet === 'sections'}
	sections={activePage?.sections ?? []}
	pageId={activePage?.pageId ?? ''}
	page={activePage}
	entriesByTable={$entriesByTable}
	featureFlags={$featureFlags}
	siteConfig={$siteConfig}
	heroConfig={$heroConfig}
	cvProfile={cvProfileData}
	{client}
	{api}
	on:close={() => (activeMobileSheet = null)}
/>
<PreviewSheet
	open={activeMobileSheet === 'preview'}
	siteUrl={typeof window !== 'undefined' ? window.location.origin : ''}
	path={previewRoute}
	on:close={() => (activeMobileSheet = null)}
/>

<!-- Settings Drawer (global settings only) -->
<SettingsDrawer
	open={settingsOpen}
	{client}
	{api}
	{currentTheme}
	{currentFont}
	siteConfig={$siteConfig}
	featureFlags={$featureFlags}
	registrySections={$registrySections}
	heroConfig={$heroConfig}
	on:close={() => (settingsOpen = false)}
/>

<style>
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-text-subtle, #444);
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
	}
	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-text-subtle, #444);
		font-family: var(--font-mono);
		font-size: var(--admin-text-xl, 24px);
	}
</style>
