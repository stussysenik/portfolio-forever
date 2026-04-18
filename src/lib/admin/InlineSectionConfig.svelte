<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { AdminToggle, AdminSlider, AdminChipGroup, BoxModelDiagram, ChangeBadge, ResetButton } from '$lib/admin/primitives';
	import TypographyControls from '$lib/admin/TypographyControls.svelte';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import { sectionEditors } from '$lib/admin/section-editors';
	import { VIEW_MODES, DEFAULTS, TYPOGRAPHY_DEFAULTS } from '$lib/admin/constants';
	import { stagedChanges } from '$lib/stores/stagedChanges';

	export let section: any = null;
	export let sectionIndex: number = 0;
	export let pageId: string = '';
	export let client: any;
	export let api: any;
	export let page: any = null; // Add page prop to get full page state for staging

	const dispatch = createEventDispatcher<{ close: void }>();

	// Hero config from Convex subscription
	let heroConfig: any = null;

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

	$: visible = section?.visible !== false;

	// Box model values — margin maps to spacingBefore/After, padding from themeOverrides
	$: boxMargin = {
		top: section?.spacingBefore ?? 0,
		right: 0,
		bottom: section?.spacingAfter ?? 0,
		left: 0,
	};
	$: boxPadding = {
		top: section?.themeOverrides?.paddingTop ?? 0,
		right: section?.themeOverrides?.paddingRight ?? 0,
		bottom: section?.themeOverrides?.paddingBottom ?? 0,
		left: section?.themeOverrides?.paddingLeft ?? 0,
	};

	// Hero-specific
	$: heroNameSize = heroConfig?.heroNameSize ?? DEFAULTS.hero.heroNameSize;
	$: heroNameWeight = heroConfig?.heroNameWeight ?? DEFAULTS.hero.heroNameWeight;
	$: heroNameLetterSpacing = heroConfig?.heroNameLetterSpacing ?? DEFAULTS.hero.heroNameLetterSpacing;
	$: heroNameLineHeight = heroConfig?.heroNameLineHeight ?? DEFAULTS.hero.heroNameLineHeight;
	$: heroNameTextWrap = heroConfig?.heroNameTextWrap ?? DEFAULTS.hero.heroNameTextWrap;

	// Section-level typography (non-hero sections)
	$: sectionTypography = config?.typography ?? {};
	$: sectionFontSize = sectionTypography.fontSize ?? TYPOGRAPHY_DEFAULTS.fontSize;
	$: sectionFontWeight = sectionTypography.fontWeight ?? TYPOGRAPHY_DEFAULTS.fontWeight;
	$: sectionLetterSpacing = sectionTypography.letterSpacing ?? TYPOGRAPHY_DEFAULTS.letterSpacing;
	$: sectionLineHeight = sectionTypography.lineHeight ?? TYPOGRAPHY_DEFAULTS.lineHeight;

	// Data-backed
	$: isDataBacked = ['works-grid', 'gallery', 'blog-feed'].includes(sectionType);
	$: viewMode = config?.viewMode ?? 'grid';

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

	function getSingleValue(value: string | string[]): string {
		return Array.isArray(value) ? value[0] ?? '' : value;
	}

	function stagePageUpdate(patch: any, label: string) {
		stagedChanges.stage('pages', pageId, patch, label);
	}

	function stageHeroConfig(patch: any, label: string) {
		stagedChanges.stage('heroConfig', 'singleton', patch, label);
	}

	function resetHeroDefaults() {
		stageHeroConfig({
			heroNameSize: DEFAULTS.hero.heroNameSize,
			heroNameWeight: DEFAULTS.hero.heroNameWeight,
			heroNameLetterSpacing: DEFAULTS.hero.heroNameLetterSpacing,
			heroNameLineHeight: DEFAULTS.hero.heroNameLineHeight,
			heroNameTextWrap: DEFAULTS.hero.heroNameTextWrap,
		}, 'Reset Hero Typography');
	}

	function handleBoxModelChange(e: CustomEvent<{ layer: 'margin' | 'padding'; side: string; value: number }>) {
		const { layer, side, value } = e.detail;
		if (!page) return;

		const newSections = [...page.sections];
		const s = { ...newSections[sectionIndex] };

		if (layer === 'margin') {
			if (side === 'top') s.spacingBefore = value;
			if (side === 'bottom') s.spacingAfter = value;
		} else if (layer === 'padding') {
			const cssKey = `padding${side.charAt(0).toUpperCase() + side.slice(1)}`;
			s.themeOverrides = { ...(s.themeOverrides ?? {}), [cssKey]: value };
		}

		newSections[sectionIndex] = s;
		stagePageUpdate({ sections: newSections }, `Section Spacing: ${side}`);
	}

	function toggleVisibility() {
		if (!page) return;
		const newSections = [...page.sections];
		newSections[sectionIndex] = {
			...newSections[sectionIndex],
			visible: !visible,
		};
		stagePageUpdate({ sections: newSections }, `Section Visibility: ${visible ? 'Hide' : 'Show'}`);
	}

	function setSectionTypography(field: string, value: any) {
		if (!page) return;
		const newSections = [...page.sections];
		const config = newSections[sectionIndex].config ?? {};
		const typography = config.typography ?? {};
		
		newSections[sectionIndex] = {
			...newSections[sectionIndex],
			config: { ...config, typography: { ...typography, [field]: value } },
		};
		stagePageUpdate({ sections: newSections }, `Section Typography: ${field}`);
	}

	function resetSectionTypography() {
		if (!page) return;
		const newSections = [...page.sections];
		newSections[sectionIndex] = {
			...newSections[sectionIndex],
			config: { ...(newSections[sectionIndex].config ?? {}), typography: { ...TYPOGRAPHY_DEFAULTS } },
		};
		stagePageUpdate({ sections: newSections }, 'Reset Section Typography');
	}

	function applySpacingPreset(top: number, bottom: number) {
		if (!page) return;
		const newSections = [...page.sections];
		newSections[sectionIndex] = {
			...newSections[sectionIndex],
			spacingBefore: top,
			spacingAfter: bottom,
		};
		stagePageUpdate({ sections: newSections }, 'Apply Spacing Preset');
	}

	function setViewMode(mode: string) {
		if (!page) return;
		const newSections = [...page.sections];
		newSections[sectionIndex] = {
			...newSections[sectionIndex],
			config: { ...(newSections[sectionIndex].config ?? {}), viewMode: mode },
		};
		stagePageUpdate({ sections: newSections }, `View Mode: ${mode}`);
	}

	onMount(() => {
		if (sectionType !== 'hero') return;
		const unsub = client.onUpdate(api.hero.getHeroConfig, {}, (data: any) => {
			heroConfig = data;
		});
		return () => unsub();
	});
</script>

<div class="inline-config">
	<!-- 1. Visibility — always first -->
	<div class="config-row config-row--split">
		<span class="field-label">VISIBLE</span>
		<AdminToggle
			checked={visible}
			size="sm"
			color="green"
			label="Section visibility"
			on:change={toggleVisibility}
		/>
	</div>

	<!-- 2. Content: Hero typography -->
	{#if sectionType === 'hero'}
		<div class="config-row">
			<div class="control-header">
				<span class="field-label">TYPOGRAPHY</span>
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

		<div class="config-row">
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
				on:change={(e) => stageHeroConfig({ heroNameSize: e.detail.value }, 'Hero Font Size')}
			/>
		</div>

		<div class="config-row">
			<span class="field-label">WEIGHT</span>
			<AdminChipGroup
				options={WEIGHT_OPTIONS}
				value={String(heroNameWeight)}
				on:change={(e) => stageHeroConfig({ heroNameWeight: parseInt(getSingleValue(e.detail.value), 10) }, 'Hero Font Weight')}
			/>
		</div>

		<div class="config-row">
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
				on:change={(e) => stageHeroConfig({ heroNameLetterSpacing: e.detail.value }, 'Hero Letter Spacing')}
			/>
		</div>

		<div class="config-row">
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
				on:change={(e) => stageHeroConfig({ heroNameLineHeight: e.detail.value }, 'Hero Line Height')}
			/>
		</div>

		<div class="config-row">
			<span class="field-label">WRAP</span>
			<AdminChipGroup
				options={WRAP_OPTIONS}
				value={heroNameTextWrap}
				on:change={(e) => stageHeroConfig({ heroNameTextWrap: getSingleValue(e.detail.value) }, 'Hero Text Wrap')}
			/>
		</div>

		<div class="config-row">
			<div class="control-header">
				<span class="field-label">HERO VISUALS</span>
			</div>
		</div>

		<div class="config-row config-row--split">
			<span class="field-label">ASCII DONUT</span>
			<AdminToggle
				checked={heroConfig?.showAsciiDonut ?? false}
				size="sm"
				color="green"
				label="Show ASCII Donut"
				on:change={() => stageHeroConfig({ showAsciiDonut: !(heroConfig?.showAsciiDonut ?? false) }, 'Hero Donut')}
			/>
		</div>

		<div class="config-row config-row--split">
			<span class="field-label">ASCII WAVE</span>
			<AdminToggle
				checked={heroConfig?.showAsciiWave ?? false}
				size="sm"
				color="green"
				label="Show ASCII Wave"
				on:change={() => stageHeroConfig({ showAsciiWave: !(heroConfig?.showAsciiWave ?? false) }, 'Hero Wave')}
			/>
		</div>
	{/if}

	<!-- 2b. Content: Non-hero typography controls -->
	{#if sectionType !== 'hero'}
		<div class="config-row">
			<TypographyControls
				fontSize={sectionFontSize}
				fontWeight={sectionFontWeight}
				letterSpacing={sectionLetterSpacing}
				lineHeight={sectionLineHeight}
				defaults={TYPOGRAPHY_DEFAULTS}
				on:change={(e) => setSectionTypography(e.detail.field, e.detail.value)}
				on:reset={resetSectionTypography}
			/>
		</div>
	{/if}

	<!-- 3. View Mode (data-backed sections only) -->
	{#if isDataBacked}
		<div class="config-row">
			<span class="field-label">VIEW MODE</span>
			<AdminChipGroup
				options={VIEW_MODE_OPTIONS}
				value={viewMode}
				on:change={(e) => setViewMode(getSingleValue(e.detail.value))}
			/>
		</div>
	{/if}

	<!-- 4. Spacing — collapsible, secondary -->
	<details class="spacing-details">
		<summary class="field-label spacing-summary">SPACING</summary>
		<div class="config-row" style="margin-top: 8px;">
			<div class="spacing-presets">
				<span class="field-label">PRESETS</span>
				<div class="preset-chips">
					{#each [
						{ label: 'none', top: 0, bottom: 0 },
						{ label: 'sm', top: 16, bottom: 16 },
						{ label: 'md', top: 32, bottom: 32 },
						{ label: 'lg', top: 64, bottom: 64 },
						{ label: 'xl', top: 96, bottom: 96 },
					] as preset}
						<button
							class="preset-chip"
							class:preset-chip--active={boxMargin.top === preset.top && boxMargin.bottom === preset.bottom}
							on:click={() => applySpacingPreset(preset.top, preset.bottom)}
						>{preset.label}</button>
					{/each}
				</div>
			</div>
			<BoxModelDiagram
				margin={boxMargin}
				padding={boxPadding}
				label={typeDef.label}
				on:change={handleBoxModelChange}
			/>
		</div>
	</details>
</div>

<style>
	.inline-config {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 12px 16px;
		background: color-mix(in oklch, var(--bento-blue, #2563EB) 3%, var(--color-bg, #fff));
		border-left: 2px solid var(--bento-blue, #2563EB);
		border-radius: 0 0 6px 6px;
		margin-top: -1px;
	}

	.config-row {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.config-row--split {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
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
		gap: 4px;
	}

	.control-header .field-label {
		flex: 1;
	}

	.spacing-details {
		border-top: 1px solid color-mix(in oklch, var(--bento-blue, #2563EB) 10%, transparent);
		padding-top: 8px;
		margin-top: 4px;
	}

	.spacing-summary {
		cursor: pointer;
		user-select: none;
		list-style: none;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.spacing-summary::before {
		content: '>';
		font-size: 7px;
		transition: transform 120ms ease;
	}

	.spacing-details[open] .spacing-summary::before {
		transform: rotate(90deg);
	}

	.spacing-summary::-webkit-details-marker {
		display: none;
	}

	.spacing-presets {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 8px;
	}

	.preset-chips {
		display: flex;
		gap: 2px;
	}

	.preset-chip {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 2px 6px;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all 120ms ease;
	}

	.preset-chip:hover {
		border-color: var(--admin-blue, #2563EB);
		color: var(--admin-blue, #2563EB);
	}

	.preset-chip--active {
		background: var(--admin-blue, #2563EB);
		color: white;
		border-color: var(--admin-blue, #2563EB);
	}
</style>
