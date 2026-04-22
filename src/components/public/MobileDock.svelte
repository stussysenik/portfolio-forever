<script lang="ts">
	import IconHouse from "~icons/ph/house-bold";
	import IconSquaresFour from "~icons/ph/squares-four-bold";
	import IconIdentificationCard from "~icons/ph/identification-card-bold";
	import IconShieldCheck from "~icons/ph/shield-check-bold";
	import IconRocketLaunch from "~icons/ph/rocket-launch-bold";
	import IconList from "~icons/ph/list-bold";
	import IconX from "~icons/ph/x-bold";
	import { fade, slide, fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import { onMount, onDestroy } from "svelte";

	export let navItems: { route: string; label: string }[] = [];
	export let activePath: string = "/";

	let menuOpen = false;
	let scrollActiveSection = "";

	const primaryItems = [
		{ route: "/", label: "Home", icon: IconHouse },
		{ route: "/works", label: "Works", icon: IconRocketLaunch },
		{ route: "/cv", label: "CV", icon: IconIdentificationCard },
		{ route: "/hire", label: "Hire", icon: IconShieldCheck },
	];

	function isActive(route: string) {
		if (route === "/hire") return activePath === "/hire" || scrollActiveSection === "cv";
		if (route === "/works") return activePath.startsWith("/works") || scrollActiveSection === "works" || scrollActiveSection === "colored_works";
		if (route === "/cv") return activePath === "/cv" || scrollActiveSection === "cv";
		if (route === "/") return activePath === "/" && !scrollActiveSection;
		return activePath.startsWith(route);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	let observer: IntersectionObserver | undefined;

	onMount(() => {
		const sectionMap: Record<string, string> = {
			hero: "/",
			colored_works: "/works",
			works: "/works",
			cv: "/cv",
			process: "/process",
			media: "/media",
			academia: "/academia",
			labs: "/labs",
			likes: "/likes",
			minor: "/minor",
			gifts: "/gifts",
			talks: "/talks",
			blog: "/blog",
			terminal: "/terminal",
			os: "/os",
		};

		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						scrollActiveSection = entry.target.id;
					}
				}
			},
			{ rootMargin: "-40% 0px -55% 0px" }
		);

		const observe = () => {
			Object.keys(sectionMap).forEach((id) => {
				const el = document.getElementById(id);
				if (el) observer!.observe(el);
			});
		};
		observe();
		const timer = setTimeout(observe, 2000);
		return () => clearTimeout(timer);
	});

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

<div class="mobile-dock-wrapper">
	{#if menuOpen}
		<!-- Full screen menu overlay -->
		<div 
			class="menu-overlay" 
			transition:fade={{ duration: 200 }} 
			on:click={closeMenu}
		>
			<div 
				class="menu-content" 
				transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
				on:click|stopPropagation
			>
				<header class="menu-header">
					<span class="menu-title">ALL SECTIONS</span>
					<button class="close-btn" on:click={closeMenu} aria-label="Close menu">
						<IconX />
					</button>
				</header>

				<nav class="menu-grid">
					{#each navItems as item}
						<a 
							href={item.route} 
							class="menu-item" 
							class:active={isActive(item.route)}
							on:click={closeMenu}
						>
							<span class="item-label">{item.label}</span>
							{#if isActive(item.route)}
								<span class="active-dot"></span>
							{/if}
						</a>
					{/each}
				</nav>

				<footer class="menu-footer">
					<div class="status-indicator">
						<span class="dot"></span>
						<span>available for projects</span>
					</div>
					<span class="version">v2026.04</span>
				</footer>
			</div>
		</div>
	{/if}

	<!-- Fixed Bottom Dock -->
	<nav class="mobile-dock">
		{#each primaryItems as item}
			<a 
				href={item.route} 
				class="dock-item" 
				class:active={isActive(item.route)}
				aria-label={item.label}
			>
				<svelte:component this={item.icon} />
				<span class="dock-label">{item.label}</span>
			</a>
		{/each}

		<button 
			class="dock-item menu-toggle" 
			class:active={menuOpen}
			on:click={toggleMenu}
			aria-label="More sections"
		>
			<IconList />
			<span class="dock-label">Menu</span>
		</button>
	</nav>
</div>

<style>
	.mobile-dock-wrapper {
		display: block;
	}

	@media (min-width: 900px) {
		.mobile-dock-wrapper {
			display: none;
		}
	}

	.mobile-dock {
		position: fixed;
		bottom: max(1rem, env(safe-area-inset-bottom, 1rem));
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% - 2rem);
		max-width: 28rem;
		height: 3.8rem;
		background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg-alt));
		backdrop-filter: blur(16px) saturate(1.8);
		-webkit-backdrop-filter: blur(16px) saturate(1.8);
		border: 1px solid var(--border-color);
		border-radius: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 0 0.35rem;
		z-index: 1000;
		box-shadow: 0 8px 32px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
	}

	.dock-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.15rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		font-family: var(--font-mono);
		transition: color var(--duration-fast) var(--easing), transform var(--duration-fast) var(--easing);
		flex: 1;
		min-width: 0;
		min-height: 2.75rem;
		background: none;
		border: none;
		padding: 0.25rem 0;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.dock-item:active {
		transform: scale(0.92);
	}

	.dock-item :global(svg) {
		font-size: 1.1rem;
	}

	.dock-label {
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		color: var(--color-text-secondary);
	}

	.dock-item.active .dock-label {
		color: var(--color-text);
		font-weight: 550;
	}

	.dock-item.active {
		color: var(--color-accent);
	}

	.menu-toggle.active {
		color: var(--color-text);
	}

	/* Menu Overlay */
	.menu-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		z-index: 999;
		display: flex;
		align-items: flex-end;
		padding: 1rem;
	}

	.menu-content {
		width: 100%;
		background: var(--color-surface);
		border-radius: 2rem;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
	}

	.menu-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.menu-title {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		color: var(--color-text-subtle);
	}

	.close-btn {
		background: var(--color-bg-alt);
		border: none;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text);
		cursor: pointer;
	}

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.menu-item {
		padding: 1.25rem;
		background: var(--color-bg-alt);
		border-radius: 1rem;
		text-decoration: none;
		color: var(--color-text);
		font-family: var(--font-sans);
		font-weight: 550;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid transparent;
		transition: all var(--duration-fast) var(--easing);
	}

	.menu-item.active {
		border-color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 5%, var(--color-bg-alt));
	}

	.active-dot {
		width: 6px;
		height: 6px;
		background: var(--color-accent);
		border-radius: 50%;
	}

	.menu-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-text-subtle);
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-success);
	}

	.dot {
		width: 8px;
		height: 8px;
		background: currentColor;
		border-radius: 50%;
		box-shadow: 0 0 8px currentColor;
	}
</style>
