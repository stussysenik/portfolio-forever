<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let sections: any[] = [];
	export let client: any;
	export let api: any;

	const ANIM_TYPES = ['none', 'conway', 'kanagawa', 'balatro'];

	$: visibleSections = sections.filter((s: any) => s.adminVisible);

	async function updateSection(section: any, field: string, value: any) {
		try {
			await client.mutation(api.sectionRegistry.upsert, {
				sectionId: section.sectionId,
				label: section.label,
				route: section.route,
				order: section.order,
				visible: section.visible,
				adminVisible: section.adminVisible,
				viewMode: section.viewMode,
				animationBg: field === 'animationBg' ? value : section.animationBg,
				animationSpeed: field === 'animationSpeed' ? value : section.animationSpeed,
				animationOpacity: field === 'animationOpacity' ? value : section.animationOpacity,
				immune: section.immune,
				cellSpan: section.cellSpan,
				cellAspect: section.cellAspect,
				previewType: section.previewType,
				dataTable: section.dataTable,
				accentColor: section.accentColor,
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

			<div class="anim-types">
				{#each ANIM_TYPES as type}
					<button
						class="anim-type-btn"
						class:active={section.animationBg === type}
						on:click={() => updateSection(section, 'animationBg', type)}
						aria-label="Set {section.sectionId} animation to {type}"
						aria-pressed={section.animationBg === type}
					>
						{type}
					</button>
				{/each}
			</div>

			<div class="anim-slider-group">
				<label class="slider-label" for="speed-{section.sectionId}">spd</label>
				<input
					type="range"
					id="speed-{section.sectionId}"
					class="anim-slider"
					min="0"
					max="2"
					step="0.1"
					value={section.animationSpeed ?? 1.0}
					on:change={(e) => updateSection(section, 'animationSpeed', parseFloat(e.currentTarget.value))}
				/>
				<span class="slider-readout">{(section.animationSpeed ?? 1.0).toFixed(1)}</span>
			</div>

			<div class="anim-slider-group">
				<label class="slider-label" for="opacity-{section.sectionId}">opa</label>
				<input
					type="range"
					id="opacity-{section.sectionId}"
					class="anim-slider"
					min="0"
					max="1"
					step="0.05"
					value={section.animationOpacity ?? 0.5}
					on:change={(e) => updateSection(section, 'animationOpacity', parseFloat(e.currentTarget.value))}
				/>
				<span class="slider-readout">{(section.animationOpacity ?? 0.5).toFixed(2)}</span>
			</div>
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

	.anim-types {
		display: flex;
		gap: 3px;
	}

	.anim-type-btn {
		font-family: var(--font-mono);
		font-size: 7px;
		padding: 2px 5px;
		border-radius: 2px;
		border: 1px solid var(--border-color);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all 160ms ease;
		text-transform: lowercase;
	}

	.anim-type-btn:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.anim-type-btn.active {
		background: #2563EB;
		color: #fff;
		border-color: #2563EB;
	}

	.anim-slider-group {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.slider-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		min-width: 20px;
	}

	.anim-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 36px;
		height: 3px;
		background: var(--border-color-subtle);
		border-radius: 2px;
		outline: none;
		transition: background 160ms ease;
	}

	.anim-slider:hover {
		background: var(--border-color);
	}

	.anim-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #2563EB;
		cursor: pointer;
		border: none;
	}

	.anim-slider::-moz-range-thumb {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #2563EB;
		cursor: pointer;
		border: none;
	}

	.slider-readout {
		font-family: var(--font-mono);
		font-size: 7px;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
		min-width: 28px;
		text-align: right;
	}

	.anim-empty {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 8px;
	}
</style>
