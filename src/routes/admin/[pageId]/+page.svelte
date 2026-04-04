<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import { VIEW_MODES } from '$lib/admin/constants';
	import SectionList from '$lib/admin/SectionList.svelte';
	import SectionPicker from '$lib/admin/SectionPicker.svelte';

	const { client, api } = getContext<any>('admin');

	$: pageId = $page.params.pageId;

	let pageData: any = null;
	let selectedIndex: number | null = null;
	let pickerOpen = false;
	let metaOpen = false;

	$: sections = pageData?.sections ?? [];
	$: selectedSection = selectedIndex !== null ? sections[selectedIndex] : null;
	$: selectedDef = selectedSection ? sectionTypeRegistry[selectedSection.sectionType] : null;

	onMount(() => {
		const unsub = client.onUpdate(api.pages.getByPageId, { pageId }, (data: any) => {
			pageData = data;
		});
		return () => unsub();
	});

	async function saveSections(newSections: any[]) {
		try {
			await client.mutation(api.pages.updateSections, {
				pageId,
				sections: newSections,
			});
			toast.success('Sections updated');
		} catch (e: any) {
			toast.error(e.message || 'Failed to save');
		}
	}

	function handleReorder(e: CustomEvent<any[]>) {
		saveSections(e.detail);
	}

	function handleDelete(e: CustomEvent<number>) {
		const idx = e.detail;
		const newSections = sections.filter((_: any, i: number) => i !== idx);
		newSections.forEach((s: any, i: number) => (s.order = i));
		if (selectedIndex === idx) selectedIndex = null;
		else if (selectedIndex !== null && selectedIndex > idx) selectedIndex--;
		saveSections(newSections);
	}

	function handlePick(e: CustomEvent<string>) {
		const sectionType = e.detail;
		const def = sectionTypeRegistry[sectionType];
		const newSection = {
			sectionType,
			config: { viewMode: 'grid' },
			dataTable: def?.dataTable,
			order: sections.length,
		};
		const newSections = [...sections, newSection];
		saveSections(newSections);
		selectedIndex = newSections.length - 1;
	}

	async function updateSectionConfig(field: string, value: any) {
		if (selectedIndex === null) return;
		const newSections = [...sections];
		newSections[selectedIndex] = {
			...newSections[selectedIndex],
			config: { ...newSections[selectedIndex].config, [field]: value },
		};
		saveSections(newSections);
	}

	async function savePageMeta() {
		if (!pageData) return;
		try {
			const { _id, _creationTime, ...rest } = pageData;
			await client.mutation(api.pages.upsert, rest);
			toast.success('Page saved');
		} catch (e: any) {
			toast.error(e.message || 'Failed to save');
		}
	}
</script>

<svelte:head>
	<title>{pageData?.label ?? pageId} | Admin</title>
</svelte:head>

<div class="composer">
	<!-- Header -->
	<header class="composer-header">
		<div class="composer-header-left">
			<a href="/admin" class="back-link">← Pages</a>
			<h1 class="composer-title">{pageData?.label ?? pageId}</h1>
			{#if pageData}
				<span class="composer-route">{pageData.route}</span>
			{/if}
		</div>
		<div class="composer-header-right">
			<button
				class="meta-toggle"
				class:active={metaOpen}
				on:click={() => (metaOpen = !metaOpen)}
			>
				Page Settings
			</button>
			<span class="status-dot" class:published={pageData?.visible}></span>
		</div>
	</header>

	<!-- Page Meta Editor (collapsible) -->
	{#if metaOpen && pageData}
		<div class="meta-panel">
			<div class="meta-field">
				<label class="meta-label" for="page-label">Label</label>
				<input class="meta-input" id="page-label" bind:value={pageData.label} />
			</div>
			<div class="meta-field">
				<label class="meta-label" for="page-route">Route</label>
				<input class="meta-input" id="page-route" bind:value={pageData.route} />
			</div>
			<div class="meta-field">
				<label class="meta-label" for="page-nav-label">Nav Label</label>
				<input class="meta-input" id="page-nav-label" bind:value={pageData.navLabel} placeholder="(use label)" />
			</div>
			<div class="meta-row">
				<div class="meta-field">
					<label class="meta-label" for="page-nav-order">Nav Order</label>
					<input class="meta-input" id="page-nav-order" type="number" bind:value={pageData.navOrder} />
				</div>
				<label class="meta-checkbox">
					<input type="checkbox" bind:checked={pageData.visible} />
					Published
				</label>
				<label class="meta-checkbox">
					<input type="checkbox" bind:checked={pageData.navVisible} />
					In Nav
				</label>
			</div>
			<button class="save-meta-btn" on:click={savePageMeta}>Save Page Settings</button>
		</div>
	{/if}

	<!-- Two-panel layout -->
	<div class="composer-body">
		<!-- Left: Section list + config -->
		<aside class="composer-sidebar">
			<div class="sidebar-section">
				<span class="sidebar-heading">Sections</span>
				<SectionList
					{sections}
					{selectedIndex}
					on:select={(e) => (selectedIndex = e.detail)}
					on:reorder={handleReorder}
					on:delete={handleDelete}
					on:add={() => (pickerOpen = true)}
				/>
			</div>

			{#if selectedSection && selectedDef}
				<div class="sidebar-section config-section">
					<span class="sidebar-heading">
						{selectedDef.icon} {selectedDef.label}
					</span>

					<div class="config-field">
						<label class="config-label" for="section-view-mode">View Mode</label>
						<select
							id="section-view-mode"
							class="config-select"
							value={selectedSection.config?.viewMode ?? 'grid'}
							on:change={(e) => updateSectionConfig('viewMode', e.currentTarget.value)}
						>
							{#each VIEW_MODES as mode}
								<option value={mode}>{mode}</option>
							{/each}
						</select>
					</div>

					{#if selectedSection.dataTable}
						<div class="config-field">
							<span class="config-label">Data Table</span>
							<span class="config-value">{selectedSection.dataTable}</span>
						</div>
					{/if}

					<div class="config-field">
						<span class="config-label">Type</span>
						<span class="config-value">{selectedSection.sectionType}</span>
					</div>
				</div>
			{/if}
		</aside>

		<!-- Right: Live preview -->
		<div class="composer-preview">
			{#if pageData?.route}
				<iframe
					src={pageData.route}
					title="Page preview"
					class="preview-frame"
					sandbox="allow-same-origin allow-scripts"
				></iframe>
			{:else}
				<div class="preview-empty">
					<span>Select a page to preview</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<SectionPicker open={pickerOpen} on:pick={handlePick} on:close={() => (pickerOpen = false)} />

<style>
	.composer {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.composer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 16px;
		border-bottom: 1px solid var(--border-color-subtle);
		flex-shrink: 0;
	}

	.composer-header-left {
		display: flex;
		align-items: baseline;
		gap: 12px;
	}

	.back-link {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color var(--duration-fast) var(--easing);
	}

	.back-link:hover {
		color: var(--color-text);
	}

	.composer-title {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text);
	}

	.composer-route {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--color-text-subtle);
	}

	.composer-header-right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.meta-toggle {
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		background: transparent;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		padding: 4px 10px;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
	}

	.meta-toggle:hover, .meta-toggle.active {
		border-color: var(--bento-blue, #2563EB);
		color: var(--bento-blue, #2563EB);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-text-subtle);
	}

	.status-dot.published {
		background: var(--bento-green, #44D62C);
	}

	/* Meta panel */
	.meta-panel {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-color-subtle);
		background: var(--color-bg-alt);
	}

	.meta-field {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 120px;
		flex: 1;
	}

	.meta-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
	}

	.meta-input {
		font-family: var(--font-mono);
		font-size: 12px;
		padding: 4px 8px;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
	}

	.meta-input:focus {
		outline: 2px solid var(--bento-blue, #2563EB);
		outline-offset: 1px;
	}

	.meta-row {
		display: flex;
		align-items: end;
		gap: 12px;
		flex: 1;
	}

	.meta-checkbox {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		gap: 4px;
		cursor: pointer;
		white-space: nowrap;
	}

	.save-meta-btn {
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 6px 14px;
		border: 1px solid var(--bento-blue, #2563EB);
		border-radius: var(--radius-sm);
		background: var(--bento-blue, #2563EB);
		color: #fff;
		cursor: pointer;
		align-self: end;
		transition: opacity var(--duration-fast) var(--easing);
	}

	.save-meta-btn:hover {
		opacity: 0.9;
	}

	/* Two-panel body */
	.composer-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.composer-sidebar {
		width: 280px;
		flex-shrink: 0;
		border-right: 1px solid var(--border-color-subtle);
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.sidebar-section {
		padding: 12px;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.sidebar-heading {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
		display: block;
		margin-bottom: 8px;
	}

	.config-section {
		flex: 1;
	}

	.config-field {
		display: flex;
		flex-direction: column;
		gap: 3px;
		margin-bottom: 8px;
	}

	.config-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
	}

	.config-select {
		font-family: var(--font-mono);
		font-size: 11px;
		padding: 4px 8px;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
	}

	.config-value {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted);
	}

	/* Preview */
	.composer-preview {
		flex: 1;
		background: var(--color-bg-alt);
		overflow: hidden;
	}

	.preview-frame {
		width: 100%;
		height: 100%;
		border: none;
	}

	.preview-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--color-text-subtle);
	}

	@media (max-width: 768px) {
		.composer-body {
			flex-direction: column;
		}

		.composer-sidebar {
			width: 100%;
			border-right: none;
			border-bottom: 1px solid var(--border-color-subtle);
			max-height: 40vh;
		}

		.composer-preview {
			min-height: 40vh;
		}
	}
</style>
