<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { AdminChipGroup } from '$lib/admin/primitives';
	import DraggableSectionList from '$lib/admin/DraggableSectionList.svelte';
	import CubeModeConfig from '$lib/admin/CubeModeConfig.svelte';
	import { sectionTypeRegistry, resolveComponentKey } from '$lib/sections/registry';
	import { toast } from '$lib/stores/toast';
	import { stripConvexMeta } from '$lib/admin/constants';
	import { resolveFlagEnabled } from '$lib/stores/stagedFlags';

	export let page: any = null;
	export let featureFlags: any[] = [];
	export let client: any;
	export let api: any;

	const dispatch = createEventDispatcher<{
		opensettings: void;
		selectsection: { sectionId: string };
	}>();

	/** Particle preset options for chip group */
	const particlePresets = [
		{ id: 'electrons', label: 'Electrons' },
		{ id: 'wanderers', label: 'Wanderers' },
		{ id: 'cards', label: 'Cards' },
	];

	$: sections = page?.sections ?? [];
	$: pageName = page?.label ?? page?.pageId ?? 'Untitled';
	$: pageRoute = page?.route ?? '/';
	$: isVisible = page?.visible ?? false;
	$: isNavVisible = page?.navVisible ?? false;

	/** Does any section on this page support the pixel engine? */
	$: hasPixelEngine = sections.some((s: any) => {
		const def = sectionTypeRegistry[s.sectionType];
		// Hero and works-grid support particles
		return s.sectionType === 'hero' || s.sectionType === 'works-grid' || s.config?.particles;
	});

	$: pixelEngineFlag = featureFlags.find((f: any) => f.key === 'pixel-engine');
	$: pixelEngineGlobal = pixelEngineFlag?.enabled ?? false;
	$: showParticles = hasPixelEngine && pixelEngineGlobal;
	$: cubeModeEnabled = resolveFlagEnabled('cube-mode', featureFlags);

	/** Current particle presets from first section config */
	$: activeParticles = sections[0]?.config?.particles ?? [];

	/* ── Handlers ── */

	async function handleReorder(e: CustomEvent<{ order: number[] }>) {
		if (!page?.pageId) return;
		try {
			const newOrder = e.detail.order;
			const sortedSections = [...sections].sort((a: any, b: any) => a.order - b.order);
			const reordered = newOrder.map((oldIdx: number, newIdx: number) => ({
				...sortedSections[oldIdx],
				order: newIdx,
			}));
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				sections: reordered,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to reorder sections');
		}
	}

	async function handleDelete(e: CustomEvent<{ index: number }>) {
		if (!page?.pageId) return;
		const sorted = [...sections].sort((a: any, b: any) => a.order - b.order);
		const updated = sorted
			.filter((_: any, i: number) => i !== e.detail.index)
			.map((s: any, i: number) => ({ ...s, order: i }));
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				sections: updated,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to delete section');
		}
	}

	function handleSelect(e: CustomEvent<{ index: number }>) {
		const sorted = [...sections].sort((a: any, b: any) => a.order - b.order);
		const section = sorted[e.detail.index];
		if (section) {
			const sectionId = resolveComponentKey(section.sectionType);
			dispatch('selectsection', { sectionId });
		}
	}

	function handleAdd() {
		dispatch('opensettings');
	}

	async function handleAccentChange(color: string | null) {
		if (!page?.pageId) return;
		const themeOverrides = { ...(page?.themeOverrides ?? {}), accentColor: color };
		if (color === null) delete themeOverrides.accentColor;
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				themeOverrides,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to update accent color');
		}
	}

	async function handleParticleChange(e: CustomEvent<{ value: string | string[] }>) {
		if (!page?.sections?.length) return;
		const newParticles = Array.isArray(e.detail.value) ? e.detail.value : [e.detail.value];
		const updated = page.sections.map((s: any, i: number) => {
			if (i === 0) {
				return { ...s, config: { ...s.config, particles: newParticles } };
			}
			return s;
		});
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				sections: updated,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to update particles');
		}
	}
</script>

<div class="section-builder">
	<!-- Page header -->
	<div class="builder-header">
		<div class="header-top">
			<h2 class="page-name">{pageName}</h2>
			<div class="badges">
				{#if isVisible}
					<span class="badge badge-visible">VISIBLE</span>
				{:else}
					<span class="badge badge-hidden">HIDDEN</span>
				{/if}
				{#if isNavVisible}
					<span class="badge badge-nav">NAV</span>
				{/if}
				<span class="badge badge-count">{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
			</div>
			<div class="page-accent">
				<label class="field-label" for="page-accent-color">ACCENT</label>
				<input
					id="page-accent-color"
					type="color"
					value={page?.themeOverrides?.accentColor ?? '#2563EB'}
					on:input={(e) => handleAccentChange(e.currentTarget.value)}
					class="accent-picker"
				/>
				{#if page?.themeOverrides?.accentColor}
					<button class="accent-reset" on:click={() => handleAccentChange(null)} title="Reset to default">x</button>
				{/if}
			</div>
		</div>
		<div class="header-bottom">
			<span class="page-route">{pageRoute}</span>
			<a class="view-live-link" href={pageRoute} target="_blank" rel="noopener noreferrer">VIEW LIVE</a>
		</div>
	</div>

	<!-- Cube mode config -->
	{#if cubeModeEnabled}
		<div class="builder-section">
			<CubeModeConfig {page} {client} {api} />
		</div>
	{/if}

	<!-- Section list (hidden for single-hero pages — no reorder/add needed) -->
	{#if !(sections.length === 1 && sections[0]?.sectionType === 'hero')}
		<div class="builder-section">
			<span class="admin-label admin-label--xs">SECTIONS</span>
			<DraggableSectionList
				{sections}
				pageId={page?.pageId ?? ''}
				{client}
				{api}
				on:reorder={handleReorder}
				on:select={handleSelect}
				on:delete={handleDelete}
				on:add={handleAdd}
			/>
		</div>
	{/if}

	<!-- Particles section -->
	{#if showParticles}
		<div class="builder-section">
			<span class="admin-label admin-label--xs">PARTICLES</span>
			<AdminChipGroup
				options={particlePresets}
				value={activeParticles}
				mode="multi"
				color="blue"
				on:change={handleParticleChange}
			/>
		</div>
	{/if}
</div>

<style>
	.section-builder {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-5, 20px);
		padding: var(--admin-space-4, 16px);
	}

	/* ── Header ── */
	.builder-header {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-1, 4px);
	}

	.header-top {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.page-name {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xl, 18px);
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		line-height: 1.2;
	}

	.header-bottom {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.page-route {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		color: var(--color-text-subtle);
	}

	.view-live-link {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--bento-blue, #2563EB);
		text-decoration: none;
		padding: 2px 5px;
		border: 1px solid color-mix(in oklch, var(--bento-blue, #2563EB) 40%, transparent);
		border-radius: 2px;
		transition: all 120ms ease;
	}

	.view-live-link:hover {
		background: color-mix(in oklch, var(--bento-blue, #2563EB) 10%, transparent);
		border-color: var(--bento-blue, #2563EB);
	}

	.badge-count {
		background: var(--color-bg-alt, #f4f4f4);
		color: var(--color-text-subtle, #999);
		border: 1px solid var(--border-color-subtle);
	}

	.badges {
		display: flex;
		gap: var(--admin-space-1, 4px);
	}

	.badge {
		font-family: var(--font-mono);
		font-size: 7px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 2px 5px;
		border-radius: 2px;
		line-height: 1;
	}

	.badge-visible {
		background: color-mix(in oklch, var(--admin-green, #44D62C), transparent 85%);
		color: var(--admin-green, #44D62C);
		border: 1px solid color-mix(in oklch, var(--admin-green, #44D62C), transparent 60%);
	}

	.badge-hidden {
		background: color-mix(in oklch, var(--color-text-subtle, #999), transparent 90%);
		color: var(--color-text-subtle, #999);
		border: 1px solid var(--border-color-subtle);
	}

	.badge-nav {
		background: color-mix(in oklch, var(--admin-blue, #2563EB), transparent 85%);
		color: var(--admin-blue, #2563EB);
		border: 1px solid color-mix(in oklch, var(--admin-blue, #2563EB), transparent 60%);
	}

	/* ── Accent color ── */
	.page-accent {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-left: auto;
	}

	.page-accent .field-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.accent-picker {
		width: 20px;
		height: 20px;
		padding: 0;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		cursor: pointer;
		background: none;
	}

	.accent-picker::-webkit-color-swatch-wrapper {
		padding: 0;
	}

	.accent-picker::-webkit-color-swatch {
		border: none;
		border-radius: 1px;
	}

	.accent-reset {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		background: none;
		border: none;
		cursor: pointer;
		padding: 2px 4px;
	}

	.accent-reset:hover {
		color: var(--color-danger, #ef4444);
	}

	/* ── Builder sections ── */
	.builder-section {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-2, 8px);
	}

</style>
