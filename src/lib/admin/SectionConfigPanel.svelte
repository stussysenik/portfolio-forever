<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { AdminToggle, AdminSlider, AdminChipGroup, ChangeBadge, ResetButton, HistoryPopover } from '$lib/admin/primitives';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import { sectionEditors } from '$lib/admin/section-editors';
	import { VIEW_MODES, DEFAULTS } from '$lib/admin/constants';

	export let section: any = null;
	export let sectionIndex: number = 0;
	export let pageId: string = '';
	export let client: any;
	export let api: any;

	const dispatch = createEventDispatcher<{ close: void }>();

	// Hero config from Convex subscription
	let heroConfig: any = null;

	// Per-field history popover state
	let historyField: string = '';
	let historyEntries: Array<{ oldValue: any; newValue: any; timestamp: number }> = [];
	let historyOpen: boolean = false;

	// Per-field default checks
	$: isSizeDefault = (heroConfig?.heroNameSize ?? DEFAULTS.hero.heroNameSize) === DEFAULTS.hero.heroNameSize;
	$: isWeightDefault = (heroConfig?.heroNameWeight ?? DEFAULTS.hero.heroNameWeight) === DEFAULTS.hero.heroNameWeight;
	$: isTrackingDefault = Math.abs((heroConfig?.heroNameLetterSpacing ?? DEFAULTS.hero.heroNameLetterSpacing) - DEFAULTS.hero.heroNameLetterSpacing) <= 0.001;
	$: isLeadingDefault = Math.abs((heroConfig?.heroNameLineHeight ?? DEFAULTS.hero.heroNameLineHeight) - DEFAULTS.hero.heroNameLineHeight) <= 0.01;
	$: isWrapDefault = (heroConfig?.heroNameTextWrap ?? DEFAULTS.hero.heroNameTextWrap) === DEFAULTS.hero.heroNameTextWrap;

	async function openHistory(field: string) {
		historyField = field;
		try {
			historyEntries = await client.query(api.adminHistory.getRecent, {
				table: 'heroConfig',
				field,
			});
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
		if (historyField) {
			await setHeroConfig(historyField, oldValue);
		}
		closeHistory();
	}

	// Whether all hero typography fields match their defaults
	$: isHeroDefault = heroConfig
		? heroConfig.heroNameSize === DEFAULTS.hero.heroNameSize
			&& heroConfig.heroNameWeight === DEFAULTS.hero.heroNameWeight
			&& heroConfig.heroNameLetterSpacing === DEFAULTS.hero.heroNameLetterSpacing
			&& heroConfig.heroNameLineHeight === DEFAULTS.hero.heroNameLineHeight
			&& (heroConfig.heroNameTextWrap ?? 'wrap') === DEFAULTS.hero.heroNameTextWrap
		: true;

	$: sectionType = section?.sectionType ?? '';
	$: typeDef = sectionTypeRegistry[sectionType] ?? { label: sectionType, icon: '?' };
	$: editorDef = sectionEditors[sectionType];
	$: config = section?.config ?? editorDef?.defaultConfig ?? {};

	// Visibility
	$: visible = section?.visible !== false;

	// Spacing
	$: spacingBefore = config?.spacingBefore ?? 0;
	$: spacingAfter = config?.spacingAfter ?? 0;

	// Hero-specific derived values
	$: heroNameSize = heroConfig?.heroNameSize ?? DEFAULTS.hero.heroNameSize;
	$: heroNameWeight = heroConfig?.heroNameWeight ?? DEFAULTS.hero.heroNameWeight;
	$: heroNameLetterSpacing = heroConfig?.heroNameLetterSpacing ?? DEFAULTS.hero.heroNameLetterSpacing;
	$: heroNameLineHeight = heroConfig?.heroNameLineHeight ?? DEFAULTS.hero.heroNameLineHeight;
	$: heroNameTextWrap = heroConfig?.heroNameTextWrap ?? DEFAULTS.hero.heroNameTextWrap;

	// Data-backed section type check
	$: isDataBacked = ['works-grid', 'gallery', 'blog-feed'].includes(sectionType);
	$: viewMode = config?.viewMode ?? 'grid';

	// Weight / wrap options for chip groups
	const WEIGHT_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => ({
		id: String(w),
		label: String(w),
	}));
	const WRAP_OPTIONS = ['wrap', 'nowrap', 'balance', 'pretty'].map((w) => ({
		id: w,
		label: w,
	}));
	const VIEW_MODE_OPTIONS = VIEW_MODES.map((m) => ({
		id: m,
		label: m,
	}));

	async function setHeroConfig(field: string, value: any) {
		try {
			await client.mutation(api.hero.upsertHeroConfig, { [field]: value });
		} catch (_) {
			/* ignore */
		}
	}

	async function resetHeroDefaults() {
		try {
			await client.mutation(api.hero.upsertHeroConfig, {
				heroNameSize: DEFAULTS.hero.heroNameSize,
				heroNameWeight: DEFAULTS.hero.heroNameWeight,
				heroNameLetterSpacing: DEFAULTS.hero.heroNameLetterSpacing,
				heroNameLineHeight: DEFAULTS.hero.heroNameLineHeight,
				heroNameTextWrap: DEFAULTS.hero.heroNameTextWrap,
			});
		} catch (_) {
			/* ignore */
		}
	}

	async function updateSpacing(field: 'spacingBefore' | 'spacingAfter', value: number) {
		try {
			await client.mutation(api.pages.updateSectionSpacing, {
				pageId,
				sectionIndex,
				[field]: value,
			});
		} catch (_) {
			/* ignore */
		}
	}

	async function toggleVisibility() {
		if (!editorDef?.mutations?.toggleVisibility) return;
		try {
			const [mod, fn] = editorDef.mutations.toggleVisibility.split(':');
			await client.mutation((api as any)[mod][fn], {
				pageId,
				sectionIndex,
				visible: !visible,
			});
		} catch (_) {
			/* ignore */
		}
	}

	async function setViewMode(mode: string) {
		try {
			await client.mutation(api.pages.updateSectionConfig, {
				pageId,
				sectionIndex,
				config: { ...config, viewMode: mode },
			});
		} catch (_) {
			/* ignore */
		}
	}

	function handleClose() {
		dispatch('close');
	}

	onMount(() => {
		if (sectionType !== 'hero') return;

		// Subscribe to hero config for live updates
		const unsub = client.onUpdate(api.hero.getHeroConfig, {}, (data: any) => {
			heroConfig = data;
		});

		return () => unsub();
	});
</script>

<div class="config-panel">
	<header class="config-header">
		<div class="config-header-left">
			<span class="config-icon">{typeDef.icon}</span>
			<span class="config-title">{typeDef.label}</span>
		</div>
		<button
			class="config-close"
			on:click={handleClose}
			aria-label="Close config panel"
		>
			&times;
		</button>
	</header>

	<!-- Section-specific controls -->
	{#if sectionType === 'hero'}
		<div class="config-section">
			<div class="control-header">
				<span class="admin-label admin-label--2xs">Typography</span>
				<ChangeBadge
					timestamp={heroConfig?.lastModified ?? null}
					isDefault={isHeroDefault}
				/>
				<ResetButton
					visible={!isHeroDefault}
					on:reset={resetHeroDefaults}
				/>
			</div>
		</div>

		<div class="config-grid">
			<!-- Size -->
			<div class="config-field config-full-width">
				<div class="field-header">
					<AdminSlider
						label="SIZE"
						value={heroNameSize}
						min={2}
						max={12}
						step={0.5}
						width="fill"
						format={(v) => v + 'rem'}
						showReset={heroNameSize !== DEFAULTS.hero.heroNameSize}
						resetValue={DEFAULTS.hero.heroNameSize}
						on:change={(e) => setHeroConfig('heroNameSize', e.detail.value)}
					/>
					<div class="field-badges">
						<ChangeBadge
							timestamp={heroConfig?.lastModified ?? null}
							isDefault={isSizeDefault}
							on:click={() => openHistory('heroNameSize')}
						/>
						<ResetButton
							visible={!isSizeDefault}
							on:reset={() => setHeroConfig('heroNameSize', DEFAULTS.hero.heroNameSize)}
						/>
						{#if historyOpen && historyField === 'heroNameSize'}
							<HistoryPopover
								entries={historyEntries}
								open={true}
								field="heroNameSize"
								on:close={closeHistory}
								on:restore={handleRestore}
							/>
						{/if}
					</div>
				</div>
			</div>

			<!-- Weight -->
			<div class="config-field config-full-width">
				<div class="field-header">
					<span class="field-label">WEIGHT</span>
					<div class="field-badges">
						<ChangeBadge
							timestamp={heroConfig?.lastModified ?? null}
							isDefault={isWeightDefault}
							on:click={() => openHistory('heroNameWeight')}
						/>
						<ResetButton
							visible={!isWeightDefault}
							on:reset={() => setHeroConfig('heroNameWeight', DEFAULTS.hero.heroNameWeight)}
						/>
						{#if historyOpen && historyField === 'heroNameWeight'}
							<HistoryPopover
								entries={historyEntries}
								open={true}
								field="heroNameWeight"
								on:close={closeHistory}
								on:restore={handleRestore}
							/>
						{/if}
					</div>
				</div>
				<AdminChipGroup
					options={WEIGHT_OPTIONS}
					value={String(heroNameWeight)}
					on:change={(e) => setHeroConfig('heroNameWeight', parseInt(e.detail.value as string))}
				/>
			</div>

			<!-- Tracking -->
			<div class="config-field config-full-width">
				<div class="field-header">
					<AdminSlider
						label="TRACKING"
						value={heroNameLetterSpacing}
						min={-0.1}
						max={0.05}
						step={0.01}
						width="fill"
						format={(v) => v.toFixed(2) + 'em'}
						showReset={Math.abs(heroNameLetterSpacing - DEFAULTS.hero.heroNameLetterSpacing) > 0.001}
						resetValue={DEFAULTS.hero.heroNameLetterSpacing}
						on:change={(e) => setHeroConfig('heroNameLetterSpacing', e.detail.value)}
					/>
					<div class="field-badges">
						<ChangeBadge
							timestamp={heroConfig?.lastModified ?? null}
							isDefault={isTrackingDefault}
							on:click={() => openHistory('heroNameLetterSpacing')}
						/>
						<ResetButton
							visible={!isTrackingDefault}
							on:reset={() => setHeroConfig('heroNameLetterSpacing', DEFAULTS.hero.heroNameLetterSpacing)}
						/>
						{#if historyOpen && historyField === 'heroNameLetterSpacing'}
							<HistoryPopover
								entries={historyEntries}
								open={true}
								field="heroNameLetterSpacing"
								on:close={closeHistory}
								on:restore={handleRestore}
							/>
						{/if}
					</div>
				</div>
			</div>

			<!-- Leading -->
			<div class="config-field config-full-width">
				<div class="field-header">
					<AdminSlider
						label="LEADING"
						value={heroNameLineHeight}
						min={0.8}
						max={2}
						step={0.05}
						width="fill"
						format={(v) => v.toFixed(2)}
						showReset={Math.abs(heroNameLineHeight - DEFAULTS.hero.heroNameLineHeight) > 0.01}
						resetValue={DEFAULTS.hero.heroNameLineHeight}
						on:change={(e) => setHeroConfig('heroNameLineHeight', e.detail.value)}
					/>
					<div class="field-badges">
						<ChangeBadge
							timestamp={heroConfig?.lastModified ?? null}
							isDefault={isLeadingDefault}
							on:click={() => openHistory('heroNameLineHeight')}
						/>
						<ResetButton
							visible={!isLeadingDefault}
							on:reset={() => setHeroConfig('heroNameLineHeight', DEFAULTS.hero.heroNameLineHeight)}
						/>
						{#if historyOpen && historyField === 'heroNameLineHeight'}
							<HistoryPopover
								entries={historyEntries}
								open={true}
								field="heroNameLineHeight"
								on:close={closeHistory}
								on:restore={handleRestore}
							/>
						{/if}
					</div>
				</div>
			</div>

			<!-- Wrap -->
			<div class="config-field config-full-width">
				<div class="field-header">
					<span class="field-label">WRAP</span>
					<div class="field-badges">
						<ChangeBadge
							timestamp={heroConfig?.lastModified ?? null}
							isDefault={isWrapDefault}
							on:click={() => openHistory('heroNameTextWrap')}
						/>
						<ResetButton
							visible={!isWrapDefault}
							on:reset={() => setHeroConfig('heroNameTextWrap', DEFAULTS.hero.heroNameTextWrap)}
						/>
						{#if historyOpen && historyField === 'heroNameTextWrap'}
							<HistoryPopover
								entries={historyEntries}
								open={true}
								field="heroNameTextWrap"
								on:close={closeHistory}
								on:restore={handleRestore}
							/>
						{/if}
					</div>
				</div>
				<AdminChipGroup
					options={WRAP_OPTIONS}
					value={heroNameTextWrap}
					on:change={(e) => setHeroConfig('heroNameTextWrap', e.detail.value as string)}
				/>
			</div>
		</div>
	{/if}

	{#if isDataBacked}
		<div class="config-section">
			<span class="admin-label admin-label--2xs">Display</span>
		</div>

		<div class="config-grid">
			<div class="config-field config-full-width">
				<span class="field-label">VIEW MODE</span>
				<AdminChipGroup
					options={VIEW_MODE_OPTIONS}
					value={viewMode}
					on:change={(e) => setViewMode(e.detail.value as string)}
				/>
			</div>
		</div>
	{/if}

	<!-- Common controls for all sections -->
	<div class="config-section">
		<span class="admin-label admin-label--2xs">Common</span>
	</div>

	<div class="config-grid">
		<!-- Visibility -->
		<div class="config-field">
			<span class="field-label">VISIBLE</span>
			<AdminToggle
				checked={visible}
				size="sm"
				color="green"
				label="Section visibility"
				on:change={toggleVisibility}
			/>
		</div>

		<!-- Spacing Before -->
		<div class="config-field config-full-width">
			<AdminSlider
				label="SPACE BEFORE"
				value={spacingBefore}
				min={0}
				max={96}
				step={4}
				width="fill"
				format={(v) => v + 'px'}
				on:change={(e) => updateSpacing('spacingBefore', e.detail.value)}
			/>
		</div>

		<!-- Spacing After -->
		<div class="config-field config-full-width">
			<AdminSlider
				label="SPACE AFTER"
				value={spacingAfter}
				min={0}
				max={96}
				step={4}
				width="fill"
				format={(v) => v + 'px'}
				on:change={(e) => updateSpacing('spacingAfter', e.detail.value)}
			/>
		</div>
	</div>
</div>

<style>
	.config-panel {
		padding: var(--admin-space-5, 20px);
		overflow-y: auto;
		height: 100%;
	}

	.config-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--admin-space-4, 16px);
		padding-bottom: var(--admin-space-3, 12px);
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.config-header-left {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.config-icon {
		font-size: var(--admin-text-lg, 16px);
		line-height: 1;
	}

	.config-title {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: -0.2px;
	}

	.config-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: 1px solid var(--border-color-subtle);
		border-radius: 3px;
		color: var(--color-text-muted);
		font-size: 16px;
		line-height: 1;
		cursor: pointer;
		min-width: var(--admin-touch-min, 44px);
		min-height: var(--admin-touch-min, 44px);
		padding: 0;
		transition: all var(--admin-transition, 120ms ease);
		-webkit-tap-highlight-color: transparent;
	}

	.config-close:hover {
		color: var(--color-text);
		border-color: var(--border-color);
	}

	.config-section {
		margin-top: var(--admin-space-4, 16px);
		margin-bottom: var(--admin-space-2, 8px);
	}

	.config-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--admin-space-3, 12px) var(--admin-space-4, 16px);
	}

	.config-field {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-1, 4px);
	}

	.config-full-width {
		grid-column: 1 / -1;
	}

	.field-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.control-header {
		display: flex;
		align-items: center;
		gap: var(--admin-space-1, 4px);
	}

	.control-header :global(.admin-label) {
		flex: 1;
	}

	.field-header {
		display: flex;
		align-items: center;
		gap: var(--admin-space-1, 4px);
		position: relative;
	}

	.field-header :global(.admin-slider) {
		flex: 1;
	}

	.field-badges {
		display: flex;
		align-items: center;
		gap: 2px;
		flex-shrink: 0;
		position: relative;
	}
</style>
