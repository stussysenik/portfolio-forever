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
		gap: 1.25rem;
		padding-left: 0.5rem;
	}

	.astro-shell__nav a {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: var(--color-text);
		font-size: 1.15rem;
		font-weight: 500;
		text-decoration: none;
		transition: opacity var(--duration-fast) var(--easing);
	}

	.nav-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		border: 1px solid var(--border-color-strong);
		background: transparent;
		opacity: 0.4;
		flex-shrink: 0;
	}

	.astro-shell__nav a:hover {
		opacity: 0.7;
	}

	.astro-shell__nav a[aria-current="page"] {
		font-weight: 700;
	}

	.astro-shell__nav a[aria-current="page"] .nav-dot {
		background: var(--color-text);
		opacity: 1;
		border-color: var(--color-text);
	}

	.astro-shell__nav a[data-archived="true"] {
		opacity: 0.3;
		text-decoration: line-through;
	}
</style>
