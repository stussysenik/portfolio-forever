<script lang="ts">
	import { publicRuntimeState } from "../../lib/stores/publicRuntime";
	import type { NavItem } from "../../lib/astro/site-content";

	export let items: NavItem[] = [];
	export let activePath = "/";

	$: runtimeItems = $publicRuntimeState.navItems;
	$: displayItems = (runtimeItems.length ? runtimeItems : items) as NavItem[];
</script>

<nav class="astro-shell__nav" aria-label="Primary" data-testid="public-nav">
	{#each displayItems as item}
		<a
			href={item.route}
			aria-current={item.route === activePath ? "page" : undefined}
			data-archived={item.archived ? "true" : undefined}
		>
			<span class="nav-dot"></span>
			{item.label}
		</a>
	{/each}
</nav>

<style>
	.astro-shell__nav {
		display: grid;
		gap: 0.9rem;
	}

	.astro-shell__nav a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-text-secondary);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		transition: color var(--duration-fast) var(--easing), transform var(--duration-fast) var(--easing);
	}

	.nav-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		border: 1px solid var(--border-color-strong);
		background: transparent;
		opacity: 0.45;
		flex-shrink: 0;
	}

	.astro-shell__nav a:hover {
		color: var(--color-text);
		transform: translateX(0.12rem);
	}

	.astro-shell__nav a[aria-current="page"] {
		color: var(--color-text);
	}

	.astro-shell__nav a[aria-current="page"] .nav-dot {
		background: var(--color-accent);
		opacity: 1;
		border-color: var(--color-accent);
	}

	.astro-shell__nav a[data-archived="true"] {
		opacity: 0.35;
		text-decoration: line-through;
	}
</style>
