<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { stripConvexMeta } from '$lib/admin/constants';
	import { AdminChipGroup, AdminSlider } from '$lib/admin/primitives';

	export let sections: any[] = [];
	export let client: any;
	export let api: any;

	const ANIM_TYPES = ['none', 'conway', 'kanagawa', 'balatro'];

	const ANIM_DESCRIPTIONS: Record<string, string> = {
		'none': 'No background animation',
		'conway': "Conway's Game of Life",
		'kanagawa': 'The Great Wave off Kanagawa',
		'balatro': 'Balatro-style card animation',
	};

	$: visibleSections = sections.filter((s: any) => s.adminVisible);

	async function updateSection(section: any, field: string, value: any) {
		try {
			await client.mutation(api.sectionRegistry.upsert, {
				...stripConvexMeta(section),
				[field]: value,
			});
			toast.success(`${section.sectionId} animation updated`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to update animation');
		}
	}
</script>

<div class="animations-cell">
	{#each visibleSections as section}
		<div class="anim-row">
			<span class="anim-section-name">{section.sectionId}</span>

			<AdminChipGroup
				options={ANIM_TYPES.map(t => ({id: t, label: t, title: ANIM_DESCRIPTIONS[t] ?? t}))}
				value={section.animationBg ?? ''}
				mode="exclusive"
				color="blue"
				on:change={(e) => updateSection(section, 'animationBg', e.detail.value)}
			/>

			<AdminSlider
				value={section.animationSpeed ?? 1.0}
				min={0}
				max={2}
				step={0.1}
				label="Speed"
				format={(v) => v.toFixed(1)}
				width="compact"
				on:change={(e) => updateSection(section, 'animationSpeed', e.detail.value)}
			/>

			<AdminSlider
				value={section.animationOpacity ?? 0.5}
				min={0}
				max={1}
				step={0.05}
				label="Opacity"
				format={(v) => v.toFixed(2)}
				width="compact"
				on:change={(e) => updateSection(section, 'animationOpacity', e.detail.value)}
			/>
		</div>
	{/each}

	{#if visibleSections.length === 0}
		<div class="anim-empty">No visible sections</div>
	{/if}
</div>

<style>
	.animations-cell {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.anim-row {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 5px 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.anim-row:last-child {
		border-bottom: none;
	}

	.anim-section-name {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.anim-empty {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 8px;
	}
</style>
