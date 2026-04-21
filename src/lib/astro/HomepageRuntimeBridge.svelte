<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { api } from "../../../convex/_generated/api.js";
	import { getConvexClient } from "../convex";
	import { shellState, toggleShellState } from "../stores/shellState";

	let navCount = 0;
	let flagCount = 0;
	let connected = false;
	let lastUpdated = "waiting";

	let unsubscribeNav: (() => void) | undefined;
	let unsubscribeFlags: (() => void) | undefined;

	onMount(() => {
		const client = getConvexClient();
		if (!client) {
			lastUpdated = "convex unavailable";
			return;
		}

		unsubscribeNav = client.onUpdate(api.pages.getNavItems, {}, (items: unknown) => {
			connected = true;
			navCount = Array.isArray(items) ? items.length : 0;
			lastUpdated = new Date().toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
			});
		});

		unsubscribeFlags = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (flags: unknown) => {
			flagCount = Array.isArray(flags) ? flags.filter((flag: any) => flag?.enabled).length : 0;
		});
	});

	onDestroy(() => {
		unsubscribeNav?.();
		unsubscribeFlags?.();
	});
</script>

<section class="runtime-bridge">
	<div class="runtime-bridge__meta">
		<p class="runtime-bridge__eyebrow">Convex runtime</p>
		<h3>Live composition stays separate from editorial atoms.</h3>
		<p class="runtime-bridge__copy">
			Homepage navigation and flags are subscribed live, while this button mutates the shared Nano Store
			read by the header chip.
		</p>
	</div>

	<div class="runtime-bridge__panel">
		<div>
			<span class="runtime-bridge__kicker">status</span>
			<strong>{connected ? "subscribed" : "connecting"}</strong>
		</div>
		<div>
			<span class="runtime-bridge__kicker">nav items</span>
			<strong>{navCount}</strong>
		</div>
		<div>
			<span class="runtime-bridge__kicker">enabled flags</span>
			<strong>{flagCount}</strong>
		</div>
		<div>
			<span class="runtime-bridge__kicker">nano store</span>
			<strong>{$shellState}</strong>
		</div>
		<div>
			<span class="runtime-bridge__kicker">last pulse</span>
			<strong>{lastUpdated}</strong>
		</div>
		<button type="button" class="runtime-bridge__button" on:click={toggleShellState}>
			Toggle shell state
		</button>
	</div>
</section>

<style>
	.runtime-bridge {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
		gap: 1.5rem;
		padding: 1.5rem;
		border: 1px solid rgba(15, 23, 42, 0.12);
		border-radius: 1.5rem;
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.9)),
			radial-gradient(circle at top left, rgba(190, 24, 93, 0.08), transparent 45%);
	}

	.runtime-bridge__eyebrow,
	.runtime-bridge__kicker {
		margin: 0 0 0.4rem;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(15, 23, 42, 0.58);
	}

	.runtime-bridge__meta h3 {
		margin: 0;
		font-size: clamp(1.4rem, 3vw, 2rem);
		line-height: 1.05;
	}

	.runtime-bridge__copy {
		margin: 1rem 0 0;
		max-width: 42ch;
		color: rgba(15, 23, 42, 0.7);
	}

	.runtime-bridge__panel {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.9rem;
		align-content: start;
	}

	.runtime-bridge__panel > div,
	.runtime-bridge__button {
		padding: 1rem;
		border-radius: 1rem;
		background: rgba(15, 23, 42, 0.04);
		border: 1px solid rgba(15, 23, 42, 0.08);
	}

	.runtime-bridge__panel strong {
		display: block;
		font-size: 1.1rem;
	}

	.runtime-bridge__button {
		grid-column: 1 / -1;
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition: transform 180ms ease, border-color 180ms ease;
	}

	.runtime-bridge__button:hover {
		transform: translateY(-1px);
		border-color: rgba(190, 24, 93, 0.28);
	}

	@media (max-width: 780px) {
		.runtime-bridge {
			grid-template-columns: 1fr;
		}
	}
</style>
