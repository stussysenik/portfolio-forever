<script lang="ts">
	import AdminIcon from '$lib/admin/AdminIcon.svelte';
	import { resolveIconifyKey } from '$lib/admin/admin-icons';
	import { getFlagIconKey } from '$lib/admin/flagIndicatorRegistry';

	export let flagKey: string;
	export let enabled: boolean;
	export let label: string | undefined = undefined;
	export let showLabel: boolean = true;
	export let showIcon: boolean = true;

	$: iconKey = getFlagIconKey(flagKey);
	$: iconComponent = resolveIconifyKey(iconKey);
</script>

<span
	class="flag-indicator"
	class:is-on={enabled}
	class:is-off={!enabled}
	data-flag={flagKey}
	role="status"
	aria-label="{label ?? flagKey}: {enabled ? 'on' : 'off'}"
>
	{#if showIcon}
		<span class="icon-slot" aria-hidden="true">
			<AdminIcon icon={iconComponent} size="sm" tone="inherit" />
		</span>
	{/if}
	{#if showLabel}
		<span class="lbl">{label ?? flagKey}</span>
	{/if}
	<span class="dot" aria-hidden="true"></span>
</span>

<style>
	.flag-indicator {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-subtle);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 1px 6px;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		background: transparent;
	}

	.icon-slot {
		display: inline-flex;
		width: 14px;
		height: 14px;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: currentColor;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background: transparent;
		transition: background 140ms ease, border-color 140ms ease;
	}

	.is-on .dot {
		background: var(--color-success);
		border-color: var(--color-success);
	}

	.is-on {
		color: var(--color-success);
		border-color: var(--color-success);
	}

	.is-off .dot {
		background: transparent;
		border-color: var(--color-text-subtle);
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
			transition: none;
		}
	}
</style>
