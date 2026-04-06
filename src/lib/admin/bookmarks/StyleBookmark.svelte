<script lang="ts">
	import { AdminToggle, AdminChipGroup } from '$lib/admin/primitives';
	import TypographyControls from '$lib/admin/TypographyControls.svelte';
	import { TYPOGRAPHY_DEFAULTS } from '$lib/admin/constants';

	// ── Props ──────────────────────────────────────────────────────────────────

	export let section: any = null;
	export let pageId: string = '';
	export let sectionIndex: number = 0;
	export let heroConfig: any = null;
	export let client: any;
	export let api: any;

	// ── Derived ───────────────────────────────────────────────────────────────

	$: isHero = section?.sectionType === 'hero';

	// Typography values — hero reads from heroConfig fields, non-hero from section.config.typography
	$: typo = section?.config?.typography ?? {};

	$: fontSize      = isHero ? (heroConfig?.heroNameSize          ?? 3.5)  : (typo.fontSize      ?? TYPOGRAPHY_DEFAULTS.fontSize);
	$: fontWeight    = isHero ? (heroConfig?.heroNameWeight         ?? 400)  : (typo.fontWeight    ?? TYPOGRAPHY_DEFAULTS.fontWeight);
	$: letterSpacing = isHero ? (heroConfig?.heroNameLetterSpacing  ?? 0)    : (typo.letterSpacing ?? TYPOGRAPHY_DEFAULTS.letterSpacing);
	$: lineHeight    = isHero ? (heroConfig?.heroNameLineHeight     ?? 1.2)  : (typo.lineHeight    ?? TYPOGRAPHY_DEFAULTS.lineHeight);

	// Hero typography defaults (differ from section defaults)
	$: heroTypoDefaults = { fontSize: 3.5, fontWeight: 400, letterSpacing: 0, lineHeight: 1.2 };
	$: typoDefaults = isHero ? heroTypoDefaults : TYPOGRAPHY_DEFAULTS;

	// Accent color
	$: accentColor = section?.config?.accentColor ?? '#2563EB';

	// Animation toggles (hero only)
	$: showAsciiDonut = heroConfig?.showAsciiDonut ?? false;
	$: showAsciiWave  = heroConfig?.showAsciiWave  ?? false;
	$: showPixelArt   = heroConfig?.showPixelArt   ?? false;
	$: showVelocity   = heroConfig?.showVelocity   ?? false;

	// Particles (hero only)
	$: activeParticles = section?.config?.particles ?? [];

	const PARTICLE_OPTIONS = [
		{ id: 'none',      label: 'None'      },
		{ id: 'electrons', label: 'Electrons' },
		{ id: 'wanderers', label: 'Wanderers' },
		{ id: 'cards',     label: 'Cards'     },
	];

	// ── Mutation helpers ──────────────────────────────────────────────────────

	/** Merge a patch into section.config and persist. */
	function updateSectionConfig(patch: Record<string, any>) {
		if (!pageId) return;
		const updated = { ...section?.config, ...patch };
		client.mutation(api.pages.updateSectionConfig, {
			pageId,
			sectionIndex,
			config: updated,
		});
	}

	/** Merge a patch into heroConfig and persist. */
	function updateHeroConfig(patch: Record<string, any>) {
		if (!heroConfig) return;
		client.mutation(api.hero.upsertHeroConfig, { ...heroConfig, ...patch });
	}

	// ── Typography handlers ───────────────────────────────────────────────────

	/** Map TypographyControls field name to heroConfig field name. */
	const HERO_FIELD_MAP: Record<string, string> = {
		fontSize:      'heroNameSize',
		fontWeight:    'heroNameWeight',
		letterSpacing: 'heroNameLetterSpacing',
		lineHeight:    'heroNameLineHeight',
	};

	function handleTypoChange(e: CustomEvent<{ field: string; value: number | string }>) {
		const { field, value } = e.detail;
		if (isHero) {
			const heroField = HERO_FIELD_MAP[field] ?? field;
			updateHeroConfig({ [heroField]: value });
		} else {
			updateSectionConfig({
				typography: { ...typo, [field]: value },
			});
		}
	}

	function handleTypoReset() {
		if (isHero) {
			updateHeroConfig({
				heroNameSize:          3.5,
				heroNameWeight:        400,
				heroNameLetterSpacing: 0,
				heroNameLineHeight:    1.2,
			});
		} else {
			updateSectionConfig({
				typography: { ...TYPOGRAPHY_DEFAULTS },
			});
		}
	}

	// ── Accent color handler ──────────────────────────────────────────────────

	function handleAccentInput(e: Event) {
		const color = (e.currentTarget as HTMLInputElement).value;
		updateSectionConfig({ accentColor: color });
	}

	// ── Animation toggle handler ──────────────────────────────────────────────

	function handleAnimationToggle(field: string, current: boolean) {
		updateHeroConfig({ [field]: !current });
	}

	// ── Particle chip handler ─────────────────────────────────────────────────

	function handleParticleChange(e: CustomEvent<{ value: string | string[] }>) {
		const newValue = e.detail.value;
		const particles = Array.isArray(newValue) ? newValue : [newValue];
		updateSectionConfig({ particles });
	}
</script>

<div class="style-bookmark">

	<!-- ── TYPOGRAPHY ─────────────────────────────────────────────────── -->
	<div class="group">
		<span class="group-label">TYPOGRAPHY</span>
		<TypographyControls
			{fontSize}
			{fontWeight}
			{letterSpacing}
			{lineHeight}
			defaults={typoDefaults}
			on:change={handleTypoChange}
			on:reset={handleTypoReset}
		/>
	</div>

	<!-- ── COLOR ─────────────────────────────────────────────────────── -->
	<div class="group">
		<span class="group-label">COLOR</span>
		<div class="color-row">
			<span class="field-label">ACCENT</span>
			<input
				type="color"
				value={accentColor}
				on:input={handleAccentInput}
				class="accent-picker"
				title="Accent color"
				aria-label="Accent color"
			/>
			<span class="accent-hex">{accentColor.toUpperCase()}</span>
		</div>
	</div>

	<!-- ── ANIMATION (hero only) ─────────────────────────────────────── -->
	{#if isHero}
		<div class="group">
			<span class="group-label">ANIMATION</span>
			<div class="toggle-list">
				<div class="toggle-row">
					<span class="field-label">ASCII DONUT</span>
					<AdminToggle
						checked={showAsciiDonut}
						size="sm"
						color="green"
						label="ASCII DONUT"
						on:change={() => handleAnimationToggle('showAsciiDonut', showAsciiDonut)}
					/>
				</div>
				<div class="toggle-row">
					<span class="field-label">ASCII WAVE</span>
					<AdminToggle
						checked={showAsciiWave}
						size="sm"
						color="green"
						label="ASCII WAVE"
						on:change={() => handleAnimationToggle('showAsciiWave', showAsciiWave)}
					/>
				</div>
				<div class="toggle-row">
					<span class="field-label">PIXEL ART</span>
					<AdminToggle
						checked={showPixelArt}
						size="sm"
						color="green"
						label="PIXEL ART"
						on:change={() => handleAnimationToggle('showPixelArt', showPixelArt)}
					/>
				</div>
				<div class="toggle-row">
					<span class="field-label">VELOCITY</span>
					<AdminToggle
						checked={showVelocity}
						size="sm"
						color="green"
						label="VELOCITY"
						on:change={() => handleAnimationToggle('showVelocity', showVelocity)}
					/>
				</div>
			</div>
		</div>

		<!-- ── PARTICLES (hero only) ─────────────────────────────────── -->
		<div class="group">
			<span class="group-label">PARTICLES</span>
			<AdminChipGroup
				options={PARTICLE_OPTIONS}
				value={activeParticles}
				mode="multi"
				color="blue"
				size="sm"
				on:change={handleParticleChange}
			/>
		</div>
	{/if}

</div>

<style>
	/* ── Bookmark root ────────────────────────────────────────────────── */
	.style-bookmark {
		display: flex;
		flex-direction: column;
	}

	/* ── Group (CSS divider compartment) ─────────────────────────────── */
	.group {
		border-top: 1px solid var(--border-color-subtle);
		padding: var(--admin-space-3, 12px) var(--admin-space-4, 16px);
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-2, 8px);
	}

	/* ── Group label ─────────────────────────────────────────────────── */
	.group-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		line-height: 1;
	}

	/* ── Field label (inline) ─────────────────────────────────────────── */
	.field-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		line-height: 1;
		flex: 1;
	}

	/* ── Color row ───────────────────────────────────────────────────── */
	.color-row {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		min-height: var(--admin-touch-compact, 28px);
	}

	.accent-picker {
		width: 20px;
		height: 20px;
		padding: 0;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		cursor: pointer;
		background: none;
		flex-shrink: 0;
	}

	.accent-picker::-webkit-color-swatch-wrapper {
		padding: 0;
	}

	.accent-picker::-webkit-color-swatch {
		border: none;
		border-radius: 1px;
	}

	.accent-hex {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		color: var(--color-text-muted);
		letter-spacing: 0.06em;
		font-variant-numeric: tabular-nums;
	}

	/* ── Toggle list ─────────────────────────────────────────────────── */
	.toggle-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.toggle-row {
		display: flex;
		align-items: center;
		min-height: var(--admin-touch-compact, 28px);
	}
</style>
