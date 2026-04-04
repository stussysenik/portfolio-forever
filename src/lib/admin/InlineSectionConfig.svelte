<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { AdminToggle, AdminSlider, AdminChipGroup, BoxModelDiagram, ChangeBadge, ResetButton } from '$lib/admin/primitives';
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

	async function setHeroConfig(field: string, value: any) {
		try {
			await client.mutation(api.hero.upsertHeroConfig, { [field]: value });
		} catch (_) { /* ignore */ }
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
		} catch (_) { /* ignore */ }
	}

	async function handleBoxModelChange(e: CustomEvent<{ layer: 'margin' | 'padding'; side: string; value: number }>) {
		const { layer, side, value } = e.detail;

		if (layer === 'margin') {
			// Margin top/bottom map to spacingBefore/After
			const fieldMap: Record<string, string> = { top: 'spacingBefore', bottom: 'spacingAfter' };
			const field = fieldMap[side];
			if (field) {
				try {
					await client.mutation(api.pages.updateSectionSpacing, {
						pageId,
						sectionIndex,
						[field]: value,
					});
				} catch (_) { /* ignore */ }
			}
		} else if (layer === 'padding') {
			// Padding values stored in themeOverrides
			const cssKey = `padding${side.charAt(0).toUpperCase() + side.slice(1)}`;
			try {
				await client.mutation(api.pages.updateSectionThemeOverrides, {
					pageId,
					sectionIndex,
					themeOverrides: { [cssKey]: value },
				});
			} catch (_) { /* ignore */ }
		}
	}

	async function toggleVisibility() {
		try {
			const page = await client.query(api.pages.getByPageId, { pageId });
			if (!page) return;
			const sections = [...page.sections];
			sections[sectionIndex] = {
				...sections[sectionIndex],
				visible: !visible,
			};
			await client.mutation(api.pages.updateSections, { pageId, sections });
		} catch (_) { /* ignore */ }
	}

	async function setViewMode(mode: string) {
		try {
			await client.mutation(api.pages.updateSectionConfig, {
				pageId,
				sectionIndex,
				config: { ...config, viewMode: mode },
			});
		} catch (_) { /* ignore */ }
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
	<!-- CSS Box Model Inspector -->
	<div class="config-row">
		<BoxModelDiagram
			margin={boxMargin}
			padding={boxPadding}
			label={typeDef.label}
			on:change={handleBoxModelChange}
		/>
	</div>

	<!-- Common: Visibility -->
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

	<!-- Hero typography -->
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
				on:change={(e) => setHeroConfig('heroNameSize', e.detail.value)}
			/>
		</div>

		<div class="config-row">
			<span class="field-label">WEIGHT</span>
			<AdminChipGroup
				options={WEIGHT_OPTIONS}
				value={String(heroNameWeight)}
				on:change={(e) => setHeroConfig('heroNameWeight', parseInt(getSingleValue(e.detail.value), 10))}
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
				on:change={(e) => setHeroConfig('heroNameLetterSpacing', e.detail.value)}
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
				on:change={(e) => setHeroConfig('heroNameLineHeight', e.detail.value)}
			/>
		</div>

		<div class="config-row">
			<span class="field-label">WRAP</span>
			<AdminChipGroup
				options={WRAP_OPTIONS}
				value={heroNameTextWrap}
				on:change={(e) => setHeroConfig('heroNameTextWrap', e.detail.value)}
			/>
		</div>
	{/if}

	<!-- Data-backed: View Mode -->
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
</style>
