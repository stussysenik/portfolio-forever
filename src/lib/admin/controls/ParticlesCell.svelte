<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let particles: string[] = [];
	export let enabled: boolean = false;
	export let pixelEngineGlobal: boolean = false;
	export let onToggle: (enabled: boolean) => void;
	export let onPresetsChange: (presets: string[]) => void;

	const PRESETS = ['electrons', 'wanderers', 'cards'] as const;

	function handleToggle() {
		onToggle(!enabled);
	}

	function handlePresetToggle(preset: string) {
		const next = particles.includes(preset)
			? particles.filter((p) => p !== preset)
			: [...particles, preset];
		onPresetsChange(next);
	}
</script>

<div class="particles-cell" role="group" aria-label="Particle animation">
	<span class="particles-label">Particles</span>

	<button
		class="particles-toggle"
		class:on={enabled}
		aria-label="Toggle particles"
		aria-pressed={enabled}
		on:click={handleToggle}
	>
		<span class="toggle-track">
			<span class="toggle-thumb"></span>
		</span>
	</button>

	{#if enabled}
		<div class="presets" role="group" aria-label="Particle presets">
			{#each PRESETS as preset}
				<button
					class="preset-chip"
					class:active={particles.includes(preset)}
					aria-pressed={particles.includes(preset)}
					on:click={() => handlePresetToggle(preset)}
				>
					{preset}
				</button>
			{/each}
		</div>
	{/if}

	{#if !pixelEngineGlobal}
		<span class="global-hint">pixel engine disabled globally — enable in Settings &gt; Flags</span>
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

	.particles-toggle {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.toggle-track {
		display: block;
		width: 28px;
		height: 14px;
		background: var(--border-color, #333);
		border-radius: 7px;
		position: relative;
		transition: background var(--duration-fast, 120ms) var(--easing);
	}

	.particles-toggle.on .toggle-track {
		background: var(--bento-green, #44D62C);
	}

	.toggle-thumb {
		display: block;
		width: 10px;
		height: 10px;
		background: #fff;
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: 2px;
		transition: left var(--duration-fast, 120ms) var(--easing);
	}

	.particles-toggle.on .toggle-thumb {
		left: 16px;
	}

	.presets {
		display: flex;
		gap: 2px;
	}

	.preset-chip {
		font-family: var(--font-mono);
		font-size: 8px;
		padding: 2px 6px;
		border-radius: 3px;
		border: 1px solid var(--border-color-subtle, #222);
		background: transparent;
		color: var(--color-text-muted, #666);
		cursor: pointer;
		transition: all var(--duration-fast, 120ms) var(--easing);
	}

	.preset-chip:hover {
		border-color: var(--color-text-muted, #666);
		color: var(--color-text, #fff);
	}

	.preset-chip.active {
		background: color-mix(in oklch, var(--bento-green, #44D62C), transparent 85%);
		border-color: color-mix(in oklch, var(--bento-green, #44D62C), transparent 60%);
		color: var(--bento-green, #44D62C);
	}

	.global-hint {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle, #555);
		width: 100%;
		margin-top: 2px;
	}
</style>
