<script lang="ts">
	import { AdminChipGroup, AdminSlider, AdminToggle } from '$lib/admin/primitives';
	import { DEFAULTS } from '$lib/admin/constants';
	import { toast } from '$lib/stores/toast';
	import { stagedChanges } from '$lib/stores/stagedChanges';
	import { stagedFlags } from '$lib/stores/stagedFlags';

	export let client: any;
	export let api: any;
	export let siteConfig: any = null;
	export let featureFlags: any[] = [];
	export let heroConfig: any = null;

	// Reference props to suppress unused-export warnings
	$: void client;
	$: void api;

	// Accordion state
	let layoutOpen = true;
	let typographyOpen = false;
	let effectsOpen = false;
	let defaultsOpen = false;

	// ── Layout reactive values ──
	const MODES = ['multi-page', 'one-page', 'reader'] as const;
	const HERO_LAYOUTS = ['default', 'diptych', 'editorial', 'stacked'] as const;

	$: mode = siteConfig?.mode ?? 'multi-page';
	$: parallax = siteConfig?.parallaxSpeed ?? 0.5;
	$: heroLayout = heroConfig?.layout ?? 'default';

	// ── Typography reactive values ──
	$: heroNameSize = heroConfig?.heroNameSize ?? DEFAULTS.hero.heroNameSize;
	$: heroNameWeight = heroConfig?.heroNameWeight ?? DEFAULTS.hero.heroNameWeight;
	$: heroNameLetterSpacing = heroConfig?.heroNameLetterSpacing ?? DEFAULTS.hero.heroNameLetterSpacing;
	$: heroNameLineHeight = heroConfig?.heroNameLineHeight ?? DEFAULTS.hero.heroNameLineHeight;
	$: heroNameTextWrap = heroConfig?.heroNameTextWrap ?? DEFAULTS.hero.heroNameTextWrap;

	const WEIGHT_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => ({
		id: String(w),
		label: String(w),
	}));
	const WRAP_OPTIONS = ['wrap', 'nowrap', 'balance', 'pretty'].map((w) => ({
		id: w,
		label: w,
	}));

	// ── Visual Effects reactive values ──
	$: flagsRecord = featureFlags.reduce((acc: Record<string, boolean>, f: any) => {
		acc[f.key] = f.enabled;
		return acc;
	}, {} as Record<string, boolean>);

	$: pixelEngineOn = flagsRecord['pixel-engine'] ?? false;
	$: donutOn = heroConfig?.showAsciiDonut ?? false;
	$: waveOn = heroConfig?.showAsciiWave ?? false;
	$: currentHeroVisual = siteConfig?.heroVisual ?? 'none';

	const HERO_VISUAL_OPTIONS = ['none', 'donut', 'wave', 'pixel'] as const;

	// ── Staging helpers ──

	function stageSiteConfig(patch: Record<string, any>, label: string) {
		stagedChanges.stage('siteConfig', 'singleton', patch, label);
	}

	function stageHeroConfig(patch: Record<string, any>, label: string) {
		stagedChanges.stage('heroConfig', 'singleton', patch, label);
	}

	function handleToggleFlag(key: string) {
		const flag = featureFlags.find((f: any) => f.key === key);
		const currentState = flag?.enabled ?? false;
		const category = flag?.category ?? 'visual';
		const label = flag?.label ?? key;
		const newState = !stagedFlags.getStagedEnabled(key) ?? !currentState;
		stagedFlags.stage(key, newState, category, label);
	}

	function getSingleValue(value: string | string[]): string {
		return Array.isArray(value) ? value[0] ?? '' : value;
	}
</script>

<div class="ui-settings">
	<!-- ── LAYOUT ── -->
	<div class="group" class:open={layoutOpen}>
		<button class="group-header" on:click={() => layoutOpen = !layoutOpen}>
			<span class="group-label">LAYOUT</span>
			<span class="group-chevron">{layoutOpen ? '\u2212' : '+'}</span>
		</button>
		{#if layoutOpen}
			<div class="group-body">
				<!-- Site Mode -->
				<div class="control-row">
					<span class="field-label">SITE MODE</span>
					<AdminChipGroup
						options={MODES.map(m => ({ id: m, label: m }))}
						value={mode}
						mode="exclusive"
						color="blue"
						equalWidth={true}
						on:change={(e) => stageSiteConfig({ mode: getSingleValue(e.detail.value) }, 'Site Mode')}
					/>
				</div>

				<!-- Hero Layout -->
				<div class="control-row">
					<span class="field-label">HERO LAYOUT</span>
					<AdminChipGroup
						options={HERO_LAYOUTS.map(l => ({ id: l, label: l }))}
						value={heroLayout}
						mode="exclusive"
						color="blue"
						equalWidth={true}
						on:change={(e) => stageHeroConfig({ layout: getSingleValue(e.detail.value) }, 'Hero Layout')}
					/>
				</div>

				<!-- Parallax Speed -->
				<div class="control-row">
					<AdminSlider
						value={parallax}
						min={0}
						max={1}
						step={0.1}
						label="Parallax"
						format={(v) => v.toFixed(1)}
						width="fill"
						on:change={(e) => stageSiteConfig({ parallaxSpeed: e.detail.value }, 'Parallax')}
					/>
				</div>
			</div>
		{/if}
	</div>

	<!-- ── TYPOGRAPHY ── -->
	<div class="group" class:open={typographyOpen}>
		<button class="group-header" on:click={() => typographyOpen = !typographyOpen}>
			<span class="group-label">TYPOGRAPHY</span>
			<span class="group-chevron">{typographyOpen ? '\u2212' : '+'}</span>
		</button>
		{#if typographyOpen}
			<div class="group-body">
				<!-- Hero Name Size -->
				<div class="control-row">
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

				<!-- Weight -->
				<div class="control-row">
					<span class="field-label">WEIGHT</span>
					<AdminChipGroup
						options={WEIGHT_OPTIONS}
						value={String(heroNameWeight)}
						on:change={(e) => stageHeroConfig({ heroNameWeight: parseInt(getSingleValue(e.detail.value), 10) }, 'Hero Font Weight')}
					/>
				</div>

				<!-- Letter Spacing -->
				<div class="control-row">
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

				<!-- Line Height -->
				<div class="control-row">
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

				<!-- Text Wrap -->
				<div class="control-row">
					<span class="field-label">WRAP</span>
					<AdminChipGroup
						options={WRAP_OPTIONS}
						value={heroNameTextWrap}
						on:change={(e) => stageHeroConfig({ heroNameTextWrap: getSingleValue(e.detail.value) }, 'Hero Text Wrap')}
					/>
				</div>
			</div>
		{/if}
	</div>

	<!-- ── VISUAL EFFECTS ── -->
	<div class="group" class:open={effectsOpen}>
		<button class="group-header" on:click={() => effectsOpen = !effectsOpen}>
			<span class="group-label">VISUAL EFFECTS</span>
			<span class="group-chevron">{effectsOpen ? '\u2212' : '+'}</span>
		</button>
		{#if effectsOpen}
			<div class="group-body">
				<!-- Pixel Engine (feature flag) -->
				<div class="toggle-row">
					<AdminToggle
						checked={stagedFlags.getStagedEnabled('pixel-engine') ?? pixelEngineOn}
						size="sm"
						color="green"
						label="Pixel Engine"
						on:change={() => handleToggleFlag('pixel-engine')}
					/>
					<span class="toggle-label">Pixel Engine</span>
				</div>

				<!-- ASCII Donut (heroConfig) -->
				<div class="toggle-row">
					<AdminToggle
						checked={donutOn}
						size="sm"
						color="green"
						label="ASCII Donut"
						on:change={() => stageHeroConfig({ showAsciiDonut: !donutOn }, 'Hero Donut')}
					/>
					<span class="toggle-label">ASCII Donut</span>
				</div>

				<!-- ASCII Wave (heroConfig) -->
				<div class="toggle-row">
					<AdminToggle
						checked={waveOn}
						size="sm"
						color="green"
						label="ASCII Wave"
						on:change={() => stageHeroConfig({ showAsciiWave: !waveOn }, 'Hero Wave')}
					/>
					<span class="toggle-label">ASCII Wave</span>
				</div>

				<!-- Hero Visual Selector -->
				<div class="control-row">
					<span class="field-label">HERO VISUAL</span>
					<AdminChipGroup
						options={HERO_VISUAL_OPTIONS.map(v => ({ id: v, label: v }))}
						value={currentHeroVisual}
						mode="exclusive"
						color="blue"
						equalWidth={true}
						on:change={(e) => stageSiteConfig({ heroVisual: getSingleValue(e.detail.value) }, 'Hero Visual')}
					/>
				</div>
			</div>
		{/if}
	</div>

	<!-- ── SECTION DEFAULTS ── -->
	<div class="group" class:open={defaultsOpen}>
		<button class="group-header" on:click={() => defaultsOpen = !defaultsOpen}>
			<span class="group-label">SECTION DEFAULTS</span>
			<span class="group-chevron">{defaultsOpen ? '\u2212' : '+'}</span>
		</button>
		{#if defaultsOpen}
			<div class="group-body">
				<p class="defaults-note">
					Per-section visibility, spacing, and animation settings are configured inline via each section's compartment panel.
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.ui-settings {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	/* ── Accordion Group ── */
	.group {
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.group:last-child {
		border-bottom: none;
	}

	.group-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 10px 0;
		background: none;
		border: none;
		cursor: pointer;
		min-height: var(--admin-touch-min, 44px);
		-webkit-tap-highlight-color: transparent;
	}

	.group-header:hover .group-label {
		color: var(--color-text);
	}

	.group-label {
		font-family: var(--font-mono);
		font-size: 8px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		transition: color 120ms ease;
	}

	.group-chevron {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted);
		line-height: 1;
		user-select: none;
	}

	.group-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 0 0 12px;
	}

	/* ── Control rows ── */
	.control-row {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	/* ── Toggle rows ── */
	.toggle-row {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: var(--admin-touch-min, 44px);
	}

	.toggle-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		user-select: none;
	}

	/* ── Section Defaults note ── */
	.defaults-note {
		font-family: var(--font-mono);
		font-size: 8px;
		line-height: 1.5;
		color: var(--color-text-muted);
		margin: 0;
	}
</style>
