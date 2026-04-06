<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { validateLabel, validateRoute } from '$lib/admin/admin-utils';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import { VIEW_MODES, stripConvexMeta, DEFAULTS } from '$lib/admin/constants';
	import { ParticlesCell, ColorStrip } from '$lib/admin/controls';
	import { ChangeBadge, ResetButton, HistoryPopover } from '$lib/admin/primitives';
	import EntryTable from '$lib/admin/EntryTable.svelte';
	import SectionPicker from '$lib/admin/SectionPicker.svelte';

	export let page: any;
	export let entries: any[] = [];
	export let featureFlags: any[] = [];
	export let client: any;
	export let api: any;

	let showSectionPicker = false;
	let colorFilter: string | null = null;

	// History popover state
	let historyField: string = '';
	let historyEntries: Array<{ oldValue: any; newValue: any; timestamp: number }> = [];
	let historyOpen: boolean = false;

	async function openHistory(table: string, field: string) {
		historyField = field;
		try {
			historyEntries = await client.query(api.adminHistory.getRecent, { table, field });
		} catch (_) {
			historyEntries = [];
		}
		historyOpen = true;
	}

	function closeHistory() {
		historyOpen = false;
		historyField = '';
		historyEntries = [];
	}

	async function handleRestore(e: CustomEvent<{ oldValue: any; newValue: any; timestamp: number }>) {
		const { oldValue } = e.detail;
		if (historyField === 'viewMode') {
			updateSectionConfig('viewMode', oldValue);
		} else if (historyField === 'particles') {
			updateSectionConfig('particles', oldValue);
		}
		closeHistory();
	}

	$: sectionDef = sectionTypeRegistry[page?.sections?.[0]?.sectionType] ?? null;
	$: dataTable = sectionDef?.dataTable ?? page?.sections?.[0]?.dataTable ?? '';
	$: hasColorField = ['worksEntries', 'talksEntries', 'galleryItems'].includes(dataTable);
	$: colorField = dataTable === 'worksEntries' ? 'featured' : 'accentColor';
	$: pixelEngineFlag = featureFlags.find((f: any) => f.key === 'pixel-engine');
	$: pixelEngineGlobal = pixelEngineFlag?.enabled ?? false;
	$: pageParticles = page?.sections?.[0]?.config?.particles ?? [];
	$: pageParticlesEnabled = pageParticles.length > 0;

	$: currentViewMode = page?.sections?.[0]?.config?.viewMode ?? 'grid';
	$: isViewModeDefault = currentViewMode === 'grid';
	$: isParticlesDefault = !pageParticlesEnabled;

	function cycleViewMode() {
		const idx = VIEW_MODES.indexOf(currentViewMode as any);
		const next = VIEW_MODES[(idx + 1) % VIEW_MODES.length];
		updateSectionConfig('viewMode', next);
	}

	async function togglePageVisibility() {
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				visible: !page.visible,
			});
		} catch (e: any) {
			toast.error(e.message || 'Failed to toggle visibility');
		}
	}

	async function toggleNavVisibility() {
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				navVisible: !page.navVisible,
			});
		} catch (e: any) {
			toast.error(e.message || 'Failed to toggle nav visibility');
		}
	}

	async function updateSectionConfig(key: string, value: any) {
		if (!page?.sections?.length) return;
		const sections = page.sections.map((s: any, i: number) =>
			i === 0 ? { ...s, config: { ...s.config, [key]: value } } : s,
		);
		try {
			await client.mutation(api.pages.updateSections, {
				pageId: page.pageId,
				sections,
			});
		} catch (e: any) {
			toast.error(e.message || 'Failed to update section config');
		}
	}

	function resetViewMode() {
		updateSectionConfig('viewMode', 'grid');
	}

	function resetParticles() {
		updateSectionConfig('particles', []);
	}

	function handleParticleToggle(enabled: boolean) {
		updateSectionConfig('particles', enabled ? ['electrons'] : []);
	}

	function handlePresetsChange(presets: string[]) {
		updateSectionConfig('particles', presets);
	}

	function handleColorChange(entryId: string, color: string) {
		const mutationMap: Record<string, any> = {
			worksEntries: api.works.updateEntry,
			talksEntries: api.talks.updateEntry,
			galleryItems: api.gallery.updateEntry,
		};
		const mutation = mutationMap[dataTable];
		if (mutation) {
			client.mutation(mutation, { id: entryId, [colorField]: color }).catch((e: any) => {
				toast.error(e.message || 'Failed to update color');
			});
		}
	}

	async function handleSectionPick(e: CustomEvent<string>) {
		const sectionType = e.detail;
		const def = sectionTypeRegistry[sectionType];
		const sections = [
			...(page.sections ?? []),
			{
				sectionType,
				config: {},
				dataTable: def?.dataTable,
				order: (page.sections?.length ?? 0),
			},
		];
		try {
			await client.mutation(api.pages.updateSections, {
				pageId: page.pageId,
				sections,
			});
			showSectionPicker = false;
			toast.success(`Added ${def?.label ?? sectionType} section`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to add section');
		}
	}
</script>

<div class="page-panel" role="tabpanel">
	<!-- Page controls row -->
	<div class="controls-row">
		<div class="panel-title-group">
			<h2 class="panel-title">{page.label}</h2>
			<span class="panel-route">{page.route}</span>
		</div>
		<div class="panel-chips">
			{#if dataTable && VIEW_MODES.includes(currentViewMode as any)}
				<button class="chip" on:click={cycleViewMode}>
					{currentViewMode} ▾
				</button>
				<div class="badge-group">
					<ChangeBadge
						timestamp={null}
						isDefault={isViewModeDefault}
						on:click={() => openHistory('sectionConfig', 'viewMode')}
					/>
					<ResetButton
						visible={!isViewModeDefault}
						on:reset={resetViewMode}
					/>
					{#if historyOpen && historyField === 'viewMode'}
						<HistoryPopover
							entries={historyEntries}
							open={true}
							field="viewMode"
							on:close={closeHistory}
							on:restore={handleRestore}
						/>
					{/if}
				</div>
			{/if}
			<button
				class="chip"
				class:chip-active={page.visible}
				aria-pressed={page.visible}
				on:click={togglePageVisibility}
			>
				{page.visible ? 'visible' : 'hidden'}
			</button>
			<button
				class="chip"
				class:chip-active={page.navVisible}
				aria-pressed={page.navVisible}
				on:click={toggleNavVisibility}
			>
				{page.navVisible ? 'in nav' : 'not in nav'}
			</button>
		</div>
	</div>

	<!-- Color strip (only for pages with color-able entries) -->
	{#if hasColorField && entries.length > 0}
		<ColorStrip
			{entries}
			{colorField}
			activeFilter={colorFilter}
			onFilterChange={(c) => (colorFilter = c)}
			onColorChange={handleColorChange}
		/>
	{/if}

	<!-- Particle animations -->
	<div class="control-header">
		<span class="control-label">PARTICLES</span>
		<div class="badge-group">
			<ChangeBadge
				timestamp={null}
				isDefault={isParticlesDefault}
				on:click={() => openHistory('sectionConfig', 'particles')}
			/>
			<ResetButton
				visible={!isParticlesDefault}
				on:reset={resetParticles}
			/>
			{#if historyOpen && historyField === 'particles'}
				<HistoryPopover
					entries={historyEntries}
					open={true}
					field="particles"
					on:close={closeHistory}
					on:restore={handleRestore}
				/>
			{/if}
		</div>
	</div>
	<ParticlesCell
		particles={pageParticles}
		enabled={pageParticlesEnabled}
		{pixelEngineGlobal}
		onToggle={handleParticleToggle}
		onPresetsChange={handlePresetsChange}
	/>

	<!-- Entry table (only for data-driven pages) -->
	{#if dataTable && entries.length > 0}
		<EntryTable
			{entries}
			{dataTable}
			{colorField}
			{colorFilter}
			{client}
			{api}
		/>
	{:else if dataTable}
		<div class="empty-entries">
			<span>No entries yet</span>
			<button class="add-entry-btn" on:click>+ Add entry</button>
		</div>
	{/if}

	<!-- Section composer -->
	<div class="section-composer">
		<div class="composer-header">
			<span class="composer-label">Sections</span>
			<button class="add-section-btn" on:click={() => (showSectionPicker = true)}>
				+ Add section
			</button>
		</div>
		{#if page.sections?.length > 0}
			<div class="sections-list">
				{#each page.sections as section, idx}
					<div class="section-item">
						<span class="section-order">{idx + 1}</span>
						<span class="section-type">{sectionTypeRegistry[section.sectionType]?.label ?? section.sectionType}</span>
						{#if section.dataTable}
							<span class="section-data">{section.dataTable}</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
		<a class="composer-link" href="/admin/{page.pageId}">
			Open full composer
		</a>
	</div>
</div>

{#if showSectionPicker}
	<SectionPicker on:pick={handleSectionPick} on:close={() => (showSectionPicker = false)} />
{/if}

<style>
	.page-panel {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 12px 16px;
	}

	.controls-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
	}

	.panel-title-group {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.panel-title {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: -0.3px;
		margin: 0;
	}

	.panel-route {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--color-text-subtle, #444);
	}

	.panel-chips {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}

	.chip {
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 4px 10px;
		border-radius: 2px;
		border: 1px solid var(--border-color-subtle, #222);
		background: var(--color-bg, #111);
		color: var(--color-text-muted, #888);
		cursor: pointer;
		transition: all var(--duration-fast, 120ms) var(--easing);
		min-height: 28px;
		display: inline-flex;
		align-items: center;
	}

	.chip:hover {
		border-color: var(--color-text-muted, #666);
		color: var(--color-text, #fff);
	}

	.chip-active {
		color: var(--bento-green, #44D62C);
		border-color: color-mix(in oklch, var(--bento-green, #44D62C), transparent 70%);
	}

	.empty-entries {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 24px;
		border: 1px dashed var(--border-color-subtle, #222);
		border-radius: var(--radius-sm, 6px);
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--color-text-subtle, #555);
	}

	.add-entry-btn {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--bento-green, #44D62C);
		background: none;
		border: none;
		cursor: pointer;
	}

	.section-composer {
		margin-top: 8px;
		padding-top: 12px;
		border-top: 1px solid var(--border-color-subtle, #1a1a1a);
	}

	.composer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.composer-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-subtle, #666);
	}

	.add-section-btn {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--bento-green, #44D62C);
		background: none;
		border: none;
		cursor: pointer;
	}

	.sections-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 8px;
	}

	.section-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 8px;
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle, #1a1a1a);
		border-radius: 2px;
		font-family: var(--font-mono);
		font-size: 10px;
	}

	.section-order {
		font-size: 8px;
		color: var(--color-text-subtle, #555);
		min-width: 14px;
	}

	.section-type {
		color: var(--color-text, #ddd);
	}

	.section-data {
		font-size: 8px;
		color: var(--color-text-muted, #666);
		margin-left: auto;
	}

	.composer-link {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--bento-blue, #2563EB);
		text-decoration: none;
	}

	.composer-link:hover {
		text-decoration: underline;
	}

	.control-header {
		display: flex;
		align-items: center;
		gap: var(--admin-space-1, 4px);
	}

	.control-header .control-label {
		flex: 1;
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-subtle, #666);
	}

	.badge-group {
		display: flex;
		align-items: center;
		gap: 2px;
		flex-shrink: 0;
		position: relative;
	}
</style>
