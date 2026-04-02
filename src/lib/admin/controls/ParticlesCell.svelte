<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { AdminToggle, AdminChipGroup } from '$lib/admin/primitives';

	export let particles: string[] = [];
	export let enabled: boolean = false;
	export let pixelEngineGlobal: boolean = false;
	export let onToggle: (enabled: boolean) => void;
	export let onPresetsChange: (presets: string[]) => void;

	const PRESETS = ['electrons', 'wanderers', 'cards'] as const;

	function handleToggle() {
		onToggle(!enabled);
	}
</script>

<div class="particles-cell" role="group" aria-label="Particle animation">
	<span class="particles-label">Particles</span>

	<AdminToggle
		checked={enabled}
		size="md"
		color="green"
		label="Toggle particles"
		on:change={() => handleToggle()}
	/>

	{#if enabled}
		<AdminChipGroup
			options={PRESETS.map(p => ({id: p, label: p}))}
			value={particles}
			mode="multi"
			color="green"
			size="md"
			on:change={(e) => {
				const val = e.detail.value;
				onPresetsChange(Array.isArray(val) ? val : [val]);
			}}
		/>
	{/if}

	{#if !pixelEngineGlobal}
		<span class="global-hint">disabled globally — Settings &gt; Flags</span>
	{/if}
</div>

<style>
	.particles-cell {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle, #1a1a1a);
		border-radius: var(--radius-sm, 6px);
		flex-wrap: wrap;
	}

	.particles-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-subtle, #666);
	}

	.global-hint {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle, #555);
		width: 100%;
		margin-top: 2px;
	}
</style>
