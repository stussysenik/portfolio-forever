<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let client: any;
	export let api: any;
	export let siteConfigData: any;

	async function setSiteMode(mode: 'one-page' | 'multi-page' | 'reader') {
		await client.mutation(api.siteConfig.upsert, { mode });
		toast.success(`Site mode: ${mode}`);
	}

	async function setParallaxSpeed(speed: number) {
		await client.mutation(api.siteConfig.upsert, { parallaxSpeed: speed });
		toast.success(`Parallax speed: ${speed}`);
	}
</script>

<section class="admin-section">
	<h2 class="section-label">Site Configuration</h2>
	<div class="card">
		<div class="field-row">
			<span class="field-label">Site Mode</span>
			<div class="mode-switcher">
				{#each ['multi-page', 'one-page', 'reader'] as mode}
					<button
						class="mode-btn"
						class:active={siteConfigData?.mode === mode || (!siteConfigData?.mode && mode === 'multi-page')}
						on:click={() => setSiteMode(mode as 'one-page' | 'multi-page' | 'reader')}
					>
						{mode}
					</button>
				{/each}
			</div>
		</div>
		<div class="field-row">
			<span class="field-label">Parallax Speed</span>
			<div class="slider-row">
				<input
					type="range"
					min="0"
					max="1"
					step="0.1"
					value={siteConfigData?.parallaxSpeed ?? 0.5}
					on:change={(e) => setParallaxSpeed(parseFloat(e.currentTarget.value))}
					class="slider"
				/>
				<span class="slider-value">{siteConfigData?.parallaxSpeed ?? 0.5}</span>
			</div>
		</div>
	</div>
</section>

<style>
	.admin-section {
		margin-bottom: var(--space-xl);
	}

	.section-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}

	.card {
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		margin-bottom: var(--space-sm);
		transition: border-color var(--duration-fast) var(--easing);
	}

	.card:hover {
		border-color: var(--border-color);
	}

	.field-row {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.field-row:last-child {
		border-bottom: none;
	}

	.field-label {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		color: var(--color-text-muted);
		min-width: 70px;
		padding-top: 4px;
	}

	.mode-switcher {
		display: flex;
		gap: var(--space-xs);
	}

	.mode-btn {
		padding: var(--space-xs) var(--space-md);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
	}

	.mode-btn.active {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	.mode-btn:hover:not(.active) {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		flex: 1;
	}

	.slider {
		flex: 1;
		accent-color: var(--color-accent);
	}

	.slider-value {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		min-width: 3ch;
	}
</style>
