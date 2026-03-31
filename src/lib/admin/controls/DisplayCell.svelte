<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let configs: any[] = [];
	export let client: any;
	export let api: any;

	const SECTIONS = ['hero', 'works', 'talks', 'academia', 'likes', 'gifts', 'gallery', 'minor', 'labs', 'blog'];
	const VIEW_MODES = ['grid', 'case-study', 'minimal-list', 'pixel-universe'];

	function getConfig(section: string) {
		return configs.find((c: any) => c.section === section);
	}

	async function cycleViewMode(section: string) {
		const config = getConfig(section);
		if (config?.immune) return;

		const current = config?.viewMode ?? 'grid';
		const idx = VIEW_MODES.indexOf(current);
		const next = VIEW_MODES[(idx + 1) % VIEW_MODES.length];

		try {
			if (config) {
				await client.mutation(api.display.upsertConfig, {
					id: config._id,
					section,
					viewMode: next,
				});
			} else {
				await client.mutation(api.display.upsertConfig, {
					section,
					viewMode: next,
					animationBg: 'none',
					animationSpeed: 1.0,
					animationOpacity: 0.5,
					immune: false,
				});
			}
			toast.success(`${section}: ${next}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to update display');
		}
	}
</script>

<div class="display-cell">
	<div class="display-grid">
		{#each SECTIONS as section}
			{@const config = getConfig(section)}
			<button
				class="display-card"
				class:immune={config?.immune}
				on:click={() => cycleViewMode(section)}
				aria-label="Cycle {section} view mode. Current: {config?.viewMode ?? 'grid'}"
				disabled={config?.immune}
			>
				<div class="display-card-header">
					<span class="display-section-name">{section}</span>
					{#if config?.immune}
						<span class="immune-badge">L</span>
					{/if}
				</div>
				<span class="display-view-mode">{config?.viewMode ?? 'grid'}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.display-cell {
		display: flex;
		flex-direction: column;
	}

	.display-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
	}

	.display-card {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 4px 5px;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: transparent;
		cursor: pointer;
		text-align: left;
		transition: all 160ms ease;
	}

	.display-card:hover:not(:disabled) {
		border-color: var(--border-color);
		background: var(--color-bg-alt);
	}

	.display-card:disabled {
		cursor: default;
		opacity: 0.6;
	}

	.display-card.immune {
		border-style: dashed;
	}

	.display-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 3px;
	}

	.display-section-name {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.immune-badge {
		font-family: var(--font-mono);
		font-size: 6px;
		font-weight: 700;
		color: #2563EB;
		background: color-mix(in oklch, #2563EB, transparent 88%);
		padding: 0 3px;
		border-radius: 2px;
		line-height: 1.4;
	}

	.display-view-mode {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
