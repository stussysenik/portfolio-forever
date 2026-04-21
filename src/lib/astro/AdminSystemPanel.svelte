<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { api } from "../../../convex/_generated/api.js";
	import { getConvexClient } from "../convex";
	import { shellState, toggleShellState } from "../stores/shellState";

	let mode = "loading";
	let navCount = 0;
	let enabledFlags = 0;
	let connected = false;

	let unsubscribeSiteConfig: (() => void) | undefined;
	let unsubscribeNav: (() => void) | undefined;
	let unsubscribeFlags: (() => void) | undefined;

	onMount(() => {
		const client = getConvexClient();
		if (!client) {
			mode = "convex unavailable";
			return;
		}

		unsubscribeSiteConfig = client.onUpdate(api.siteConfig.get, {}, (siteConfig: any) => {
			connected = true;
			mode = siteConfig?.mode ?? "multi-page";
		});

		unsubscribeNav = client.onUpdate(api.pages.getNavItems, {}, (items: unknown) => {
			navCount = Array.isArray(items) ? items.length : 0;
		});

		unsubscribeFlags = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (flags: unknown) => {
			enabledFlags = Array.isArray(flags) ? flags.filter((flag: any) => flag?.enabled).length : 0;
		});
	});

	onDestroy(() => {
		unsubscribeSiteConfig?.();
		unsubscribeNav?.();
		unsubscribeFlags?.();
	});
</script>

<section class="system-panel">
	<div class="system-panel__intro">
		<p class="system-panel__eyebrow">System surface</p>
		<h2>Convex runtime under the Astro admin shell</h2>
		<p>
			This is the migration-safe system proof: live Convex subscriptions are online here while the larger
			legacy builder is ported in follow-up slices.
		</p>
	</div>

	<div class="system-panel__stats">
		<div>
			<span>connection</span>
			<strong>{connected ? "live" : "waiting"}</strong>
		</div>
		<div>
			<span>site mode</span>
			<strong>{mode}</strong>
		</div>
		<div>
			<span>nav items</span>
			<strong>{navCount}</strong>
		</div>
		<div>
			<span>enabled flags</span>
			<strong>{enabledFlags}</strong>
		</div>
		<div>
			<span>shared nano store</span>
			<strong>{$shellState}</strong>
		</div>
		<button type="button" on:click={toggleShellState}>Toggle shell state</button>
	</div>
</section>

<style>
	.system-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 28rem);
		gap: 1.25rem;
		padding: 1.4rem;
		border-radius: 1.5rem;
		border: 1px solid rgba(15, 23, 42, 0.12);
		background: rgba(255, 255, 255, 0.82);
	}

	.system-panel__eyebrow,
	.system-panel__stats span {
		display: block;
		margin-bottom: 0.45rem;
		font-size: 0.74rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(15, 23, 42, 0.56);
	}

	.system-panel__intro h2 {
		margin: 0;
		font-size: clamp(1.6rem, 3vw, 2.3rem);
		letter-spacing: -0.05em;
	}

	.system-panel__intro p {
		margin-bottom: 0;
		max-width: 44ch;
		color: rgba(15, 23, 42, 0.72);
		line-height: 1.6;
	}

	.system-panel__stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.system-panel__stats > div,
	.system-panel__stats button {
		padding: 1rem;
		border-radius: 1rem;
		border: 1px solid rgba(15, 23, 42, 0.08);
		background: rgba(15, 23, 42, 0.04);
	}

	.system-panel__stats strong {
		display: block;
		font-size: 1.1rem;
	}

	.system-panel__stats button {
		grid-column: 1 / -1;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	@media (max-width: 820px) {
		.system-panel {
			grid-template-columns: 1fr;
		}
	}
</style>
