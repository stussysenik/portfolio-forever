<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { flagIndicatorRegistry } from './flagIndicatorRegistry';
	import { AdminToggle } from '$lib/admin/primitives';

	export let client: any;
	export let api: any;
	export let featureFlags: any[];

	function getFlagState(key: string): boolean {
		const flag = featureFlags.find((f: any) => f.key === key);
		return flag ? flag.enabled : true;
	}

	function formatFlagLabel(key: string): string {
		return key.replace(/-/g, ' ').toUpperCase();
	}

	async function handleFlagToggle(flag: any) {
		const newEnabled = !getFlagState(flag.key);
		await client.mutation(api.siteConfig.setFeatureFlag, {
			key: flag.key,
			enabled: newEnabled,
			category: flag.category,
		});
		toast.success(`${flag.key}: ${newEnabled ? 'ON' : 'OFF'}`);
	}
</script>

<section class="admin-section">
	<h2 class="section-label">Feature Flags</h2>
	<div class="card">
		{#each flagIndicatorRegistry as flag}
			{@const enabled = getFlagState(flag.key)}
			<div class="flag-row">
				<span
					class="flag-dot"
					class:flag-dot--active={enabled}
					aria-hidden="true"
				></span>
				<span class="flag-label">{formatFlagLabel(flag.key)}</span>
				<span class="flag-spacer"></span>
				<span class="flag-state" class:flag-state--on={enabled}>
					{enabled ? 'ON' : 'OFF'}
				</span>
				<AdminToggle
					checked={enabled}
					size="sm"
					color="green"
					label={formatFlagLabel(flag.key)}
					on:change={() => handleFlagToggle(flag)}
				/>
			</div>
		{/each}
	</div>
</section>

<style>
	.admin-section {
		margin-bottom: var(--space-xl);
	}

	.section-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 12px);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle, #444);
		line-height: 1;
		margin-bottom: var(--admin-space-2, 8px);
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.flag-row {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		min-height: 36px;
	}

	.flag-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-text-subtle, #444);
		flex-shrink: 0;
	}

	.flag-dot--active {
		background: var(--admin-green, #44D62C);
	}

	.flag-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 13px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted, #666);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	.flag-spacer {
		flex: 1;
	}

	.flag-state {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 12px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-subtle, #444);
		line-height: 1;
		flex-shrink: 0;
	}

	.flag-state--on {
		color: var(--admin-green, #44D62C);
	}
</style>
