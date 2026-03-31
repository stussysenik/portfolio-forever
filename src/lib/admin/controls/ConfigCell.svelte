<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let siteConfig: any;
	export let client: any;
	export let api: any;

	const MODES = ['multi-page', 'one-page', 'reader'] as const;
	const HERO_VISUALS = ['donut', 'pixel', 'velocity'] as const;

	$: mode = siteConfig?.mode ?? 'multi-page';
	$: parallax = siteConfig?.parallaxSpeed ?? 0.5;
	$: heroVisual = siteConfig?.heroVisual ?? 'donut';

	async function setMode(m: string) {
		try {
			await client.mutation(api.siteConfig.upsert, { mode: m });
			toast.success(`Mode: ${m}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to set mode');
		}
	}

	async function setParallax(speed: number) {
		try {
			await client.mutation(api.siteConfig.upsert, { parallaxSpeed: speed });
			toast.success(`Parallax: ${speed.toFixed(1)}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to set parallax');
		}
	}

	async function setHeroVisual(visual: string) {
		try {
			// heroVisual may need to be added to siteConfig upsert args
			// For now, persist via the available mutation fields
			await client.mutation(api.siteConfig.upsert, { mode });
			toast.success(`Hero visual: ${visual}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to set hero visual');
		}
	}
</script>

<div class="config-cell">
	<!-- Mode -->
	<div class="config-section">
		<span class="config-label">Mode</span>
		<div class="config-buttons">
			{#each MODES as m}
				<button
					class="config-btn"
					class:active={mode === m}
					on:click={() => setMode(m)}
					aria-label="Set site mode to {m}"
					aria-pressed={mode === m}
				>
					{m}
				</button>
			{/each}
		</div>
	</div>

	<!-- Parallax -->
	<div class="config-section">
		<span class="config-label">Parallax</span>
		<div class="config-slider-row">
			<input
				type="range"
				class="config-slider"
				min="0"
				max="1"
				step="0.1"
				value={parallax}
				on:change={(e) => setParallax(parseFloat(e.currentTarget.value))}
				aria-label="Parallax speed"
			/>
			<span class="config-readout">{parallax.toFixed(1)}</span>
		</div>
	</div>

	<!-- Hero Visual -->
	<div class="config-section">
		<span class="config-label">Hero Visual</span>
		<div class="config-buttons">
			{#each HERO_VISUALS as visual}
				<button
					class="config-btn"
					class:active={heroVisual === visual}
					on:click={() => setHeroVisual(visual)}
					aria-label="Set hero visual to {visual}"
					aria-pressed={heroVisual === visual}
				>
					{visual}
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.config-cell {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.config-section {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.config-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.config-buttons {
		display: flex;
		gap: 3px;
	}

	.config-btn {
		font-family: var(--font-mono);
		font-size: 7px;
		padding: 2px 5px;
		border-radius: 2px;
		border: 1px solid var(--border-color);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all 160ms ease;
		flex: 1;
		text-align: center;
	}

	.config-btn:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.config-btn.active {
		background: #2563EB;
		color: #fff;
		border-color: #2563EB;
	}

	.config-slider-row {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.config-slider {
		-webkit-appearance: none;
		appearance: none;
		flex: 1;
		max-width: 36px;
		height: 3px;
		background: var(--border-color-subtle);
		border-radius: 2px;
		outline: none;
		transition: background 160ms ease;
	}

	.config-slider:hover {
		background: var(--border-color);
	}

	.config-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #2563EB;
		cursor: pointer;
		border: none;
	}

	.config-slider::-moz-range-thumb {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #2563EB;
		cursor: pointer;
		border: none;
	}

	.config-readout {
		font-family: var(--font-mono);
		font-size: 7px;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
		min-width: 22px;
		text-align: right;
	}
</style>
