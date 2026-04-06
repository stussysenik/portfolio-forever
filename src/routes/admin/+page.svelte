<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import AdminShell from '$lib/admin/AdminShell.svelte';
	import SectionBuilder from '$lib/admin/SectionBuilder.svelte';
	import GlobalCompartment from '$lib/admin/GlobalCompartment.svelte';
	import SectionCompartmentList from '$lib/admin/SectionCompartmentList.svelte';
	import PreviewPane from '$lib/admin/PreviewPane.svelte';
	import SectionPicker from '$lib/admin/SectionPicker.svelte';
	import SettingsDrawer from '$lib/admin/SettingsDrawer.svelte';
	import { toast } from '$lib/stores/toast';
	import { stripConvexMeta } from '$lib/admin/constants';

	const { client, api } = getContext<any>('admin');

	let pages: any[] = [];
	let siteConfigData: any = null;
	let featureFlags: any[] = [];
	let registrySections: any[] = [];
	let entriesByTable: Record<string, any[]> = {};
	let heroConfigData: any = null;
	let cvProfileData: any = null;
	let settingsOpen = false;

	// Page & section selection state
	let activePageId = 'home';
	let showSectionPicker = false;
	let previewRefreshKey = 0;
	let selectedSectionId = '';
	let globalExpanded = false;

	$: activePage = pages.find((p) => p.pageId === activePageId) ?? null;
	$: previewRoute = activePage?.route ?? '/';

	// Theme/font for settings drawer
	let currentTheme = 'minimal';
	let currentFont = 'inter';

	function handleSelectPage(e: CustomEvent<{ pageId: string }>) {
		activePageId = e.detail.pageId;
	}

	async function handleToggleFlag(e: CustomEvent<{ key: string; category: string }>) {
		const { key, category } = e.detail;
		const flag = featureFlags.find((f: any) => f.key === key);
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
		const page = pages.find((p: any) => p.pageId === pageId);
		if (!page) return;
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				visible,
				navVisible: visible ? (page.navVisible ?? true) : false,
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
				const page = pages.find((p) => p.pageId === pageIds[i]);
				if (page && page.navOrder !== i) {
					await client.mutation(api.pages.upsert, { ...stripConvexMeta(page), navOrder: i });
				}
			}
		} catch (err: any) {
			toast.error(err.message || 'Failed to reorder pages');
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
			order: activePage.sections?.length ?? 0,
		};
		const updatedSections = [...(activePage.sections ?? []), newSection];
		try {
			await client.mutation(api.pages.updateSections, {
				pageId: activePage.pageId,
				sections: updatedSections,
			});
			showSectionPicker = false;
			previewRefreshKey++;
			toast.success(`Added ${def?.label ?? sectionTypeId}`);
		} catch (err: any) {
			toast.error(err.message || 'Failed to add section');
		}
	}

	onMount(() => {
		currentTheme = document.documentElement.dataset.theme || 'minimal';
		currentFont = document.documentElement.dataset.font || 'inter';
		let subs: Array<() => void> = [];
		let disposed = false;

		const init = async () => {
			try {
				await client.mutation(api.pages.ensureSeeded, {});
			} catch (_) { /* already seeded */ }
			try { await client.mutation(api.seedAll.seedBlog, {}); } catch (_) { /* already seeded */ }
			try { await client.mutation(api.seedAll.seedHeroCaseStudies, {}); } catch (_) { /* already seeded */ }

			if (disposed) return;

			subs = [
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
					if (data) {
						entriesByTable = { ...entriesByTable, cvEntries: data.entries ?? [] };
						cvProfileData = data.profile ?? null;
					}
				}),
				client.onUpdate(api.hero.getHeroConfig, {}, (data: any) => {
					heroConfigData = data ?? null;
				}),
				client.onUpdate(api.heroCaseStudies.getFull, {}, (data: any) => {
					if (data) entriesByTable = { ...entriesByTable, heroCaseStudies: data };
				}),
				client.onUpdate(api.process.getProcessConfig, {}, (data: any) => {
					if (data) entriesByTable = { ...entriesByTable, processConfig: [data] };
				}),
				client.onUpdate(api.os.getOsConfig, {}, (data: any) => {
					if (data) entriesByTable = { ...entriesByTable, osConfig: [data] };
				}),
				client.onUpdate(api.terminal.getTerminalConfig, {}, (data: any) => {
					if (data) entriesByTable = { ...entriesByTable, terminalConfig: [data] };
				}),
			];
		};

		void init();

		return () => {
			disposed = true;
			subs.forEach((fn) => fn());
		};
	});
</script>

<svelte:head>
	<title>Admin | Portfolio OS</title>
</svelte:head>

<AdminShell
	{pages}
	{activePage}
	{featureFlags}
	{entriesByTable}
	siteConfig={siteConfigData}
	{registrySections}
	on:selectpage={handleSelectPage}
	on:toggleflag={handleToggleFlag}
	on:togglepage={handleTogglePage}
	on:reorderpages={handleReorderPages}
	on:opensettings={() => (settingsOpen = true)}
>
	<!-- Builder pane (default slot) — compartment system -->
	{#if activePage}
		<GlobalCompartment
			{featureFlags}
			siteConfig={siteConfigData}
			expanded={globalExpanded}
			{client}
			{api}
			on:toggle={() => (globalExpanded = !globalExpanded)}
		/>
		<SectionCompartmentList
			sections={activePage.sections ?? []}
			pageId={activePage.pageId}
			page={activePage}
			{entriesByTable}
			{featureFlags}
			siteConfig={siteConfigData}
			heroConfig={heroConfigData}
			cvProfile={cvProfileData}
			{client}
			{api}
		/>
		<SectionBuilder
			page={activePage}
			{featureFlags}
			{client}
			{api}
			on:selectsection={(e) => { selectedSectionId = e.detail.sectionId; }}
			on:opensettings={() => (showSectionPicker = true)}
		/>
	{:else}
		<div class="empty-state">
			<p>Select a page to start editing</p>
		</div>
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

<!-- Settings Drawer (global settings only) -->
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
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-text-subtle, #444);
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
	}
</style>
