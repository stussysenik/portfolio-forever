<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { wipBannerDismissed, featureFlags } from '$lib/stores/siteMode';

	export let compact: boolean = false;

	const dispatch = createEventDispatcher<{ toggle: { enabled: boolean } }>();

	let hovered = false;

	$: wipFlagEnabled = ($featureFlags.get('wip-banner') ?? true);

	function handleToggle() {
		wipBannerDismissed.update(v => !v);
		dispatch('toggle', { enabled: !$wipBannerDismissed });
	}
</script>

<button
	class="wip-badge"
	class:wip-badge--active={wipFlagEnabled && !$wipBannerDismissed}
	class:wip-badge--compact={compact}
	on:click={handleToggle}
	on:mouseenter={() => hovered = true}
	on:mouseleave={() => hovered = false}
	title={$wipBannerDismissed ? 'Show WIP banner on site' : 'WIP banner is visible — click to hide'}
	aria-label={$wipBannerDismissed ? 'Enable WIP banner' : 'Disable WIP banner'}
	aria-pressed={wipFlagEnabled && !$wipBannerDismissed}
>
	<span class="wip-dot" aria-hidden="true"></span>
	{#if !compact}
		<span class="wip-label">WIP</span>
	{/if}
</button>

<style>
	.wip-badge {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 3px 10px 3px 7px;
		border: 1px solid var(--admin-keyline, #333);
		border-radius: 2px;
		background: transparent;
		color: var(--admin-text-subtle, #888);
		cursor: pointer;
		font-family: var(--admin-font-mono, monospace);
		font-size: var(--admin-text-xs, 12px);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
		transition: all var(--admin-transition, 120ms ease);
		min-height: var(--admin-touch-compact, 36px);
		user-select: none;
	}

	.wip-badge:hover {
		border-color: var(--admin-keyline-strong, #555);
		color: var(--admin-text, #e5e5e5);
	}

	.wip-badge--active {
		background: #ff6b6b;
		border-color: #ff6b6b;
		color: #fff;
	}

	.wip-badge--active:hover {
		background: #e55555;
		border-color: #e55555;
		color: #fff;
	}

	.wip-badge--compact {
		padding: 2px 6px;
	}

	.wip-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--admin-text-subtle, #888);
		transition: background var(--admin-transition, 120ms ease);
	}

	.wip-badge--active .wip-dot {
		background: #fff;
		animation: wip-pulse 2s ease-in-out infinite;
	}

	@keyframes wip-pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.wip-label {
		white-space: nowrap;
	}
</style>