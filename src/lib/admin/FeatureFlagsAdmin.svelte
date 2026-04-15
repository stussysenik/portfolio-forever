<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import FlagIndicator from '$lib/components/FlagIndicator.svelte';
	import { flagIndicatorRegistry } from './flagIndicatorRegistry';

	export let client: any;
	export let api: any;
	export let featureFlags: any[];

	function getFlagState(key: string): boolean {
		const flag = featureFlags.find((f: any) => f.key === key);
		return flag ? flag.enabled : true;
	}

	async function toggleFeatureFlag(key: string, enabled: boolean, category: string) {
		await client.mutation(api.siteConfig.setFeatureFlag, { key, enabled, category });
		toast.success(`${key}: ${enabled ? 'ON' : 'OFF'}`);
	}
</script>

<section class="admin-section">
	<h2 class="section-label">Feature Flags</h2>
	<div class="card">
		{#each flagIndicatorRegistry as flag}
			<div class="flag-row">
				<span class="flag-label">{flag.label}</span>
				<FlagIndicator flagKey={flag.key} enabled={getFlagState(flag.key)} label={getFlagState(flag.key) ? 'on' : 'off'} />
				<span class="flag-category">{flag.category}</span>
				<button
					class="flag-toggle"
					class:flag-on={getFlagState(flag.key)}
					on:click={() => toggleFeatureFlag(flag.key, !getFlagState(flag.key), flag.category)}
				>
					{getFlagState(flag.key) ? 'ON' : 'OFF'}
				</button>
			</div>
		{/each}
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

	.flag-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.flag-row:last-child {
		border-bottom: none;
	}

	.flag-label {
		flex: 1;
		font-size: var(--font-size-sm);
	}

	.flag-status {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-subtle);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
		padding: 1px 6px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color-subtle);
	}

	.flag-status-active {
		color: var(--color-success);
		border-color: var(--color-success);
	}

	.flag-category {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-subtle);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.flag-toggle {
		padding: var(--space-2xs) var(--space-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		font-weight: 600;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		min-width: 4ch;
		transition: all var(--duration-fast) var(--easing);
	}

	.flag-toggle.flag-on {
		background: var(--color-success);
		color: var(--color-surface);
		border-color: var(--color-success);
	}
</style>
