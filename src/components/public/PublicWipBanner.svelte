<script lang="ts">
	import { onMount } from "svelte";
	import { getWipBannerEnabled, publicRuntimeState } from "../../lib/stores/publicRuntime";

	export let enabled = false;
	export let message = "WIP — WEBSITE IS UNDER MAINTENANCE";

	const storageKey = "wipBannerDismissed";

	let dismissed = false;

	$: runtimeEnabled = getWipBannerEnabled($publicRuntimeState, enabled);
	$: visible = runtimeEnabled && !dismissed;

	onMount(() => {
		dismissed = window.localStorage.getItem(storageKey) === "true";
	});

	function dismiss() {
		dismissed = true;
		window.localStorage.setItem(storageKey, "true");
	}
</script>

{#if visible}
	<aside class="public-wip-banner" data-testid="public-wip-banner" role="status" aria-live="polite">
		<p>{message}</p>
		<button type="button" on:click={dismiss} aria-label="Dismiss work in progress banner">Dismiss</button>
	</aside>
{/if}

<style>
	.public-wip-banner {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.9rem;
		padding: 0.8rem 1rem;
		margin-bottom: 1rem;
		border: 1px solid color-mix(in srgb, var(--color-warning) 34%, var(--border-color));
		background: color-mix(in srgb, var(--color-warning) 10%, var(--color-surface));
		font-family: var(--font-mono);
		font-size: 0.76rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.public-wip-banner p {
		margin: 0;
		color: var(--color-text);
	}

	.public-wip-banner button {
		padding: 0.45rem 0.7rem;
		border: 1px solid var(--border-color-strong);
		background: transparent;
		color: var(--color-text);
		font: inherit;
		text-transform: inherit;
		letter-spacing: inherit;
		cursor: pointer;
	}

	@media (min-width: 720px) {
		.public-wip-banner {
			align-items: center;
		}
	}
</style>
