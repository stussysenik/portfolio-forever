<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	export let sections: string[] = [];
	export let activeSection: string = "hero";
	export let sectionLabels: Record<string, string> = {};

	let scrollY = 0;
	let progress = 0;
	let containerHeight = 0;
	let windowHeight = 0;

	$: if (containerHeight && windowHeight) {
		const totalScrollable = document.documentElement.scrollHeight - windowHeight;
		progress = Math.min(Math.max(scrollY / totalScrollable, 0), 1);
	}

	function scrollToSection(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	}

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	});
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div class="minimap-container" bind:clientHeight={containerHeight} transition:fade>
	<div class="minimap-track">
		{#each sections as id}
			<button
				class="minimap-node"
				class:active={activeSection === id}
				on:click={() => scrollToSection(id)}
				title={sectionLabels[id] || id}
			>
				<span class="node-label">{sectionLabels[id] || id}</span>
			</button>
		{/each}

		<div 
			class="minimap-indicator" 
			style="transform: translateY({progress * 100}%)"
		>
			<a href="#cv" class="indicator-btn">
				HIRE ME
			</a>
		</div>
	</div>
</div>

<style>
	.minimap-container {
		position: fixed;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 200;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.minimap-container {
			right: 1rem;
		}
	}

	.minimap-track {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		position: relative;
		padding: 1rem 0;
		pointer-events: auto;
	}

	.minimap-node {
		width: 40px;
		height: 2px;
		background: var(--color-text-subtle);
		border: none;
		padding: 0;
		cursor: pointer;
		position: relative;
		transition: width var(--duration-fast) var(--easing), background var(--duration-fast) var(--easing);
	}

	.minimap-node.active {
		width: 60px;
		background: var(--color-accent);
	}

	.node-label {
		position: absolute;
		right: calc(100% + 1rem);
		top: 50%;
		transform: translateY(-50%);
		font-family: var(--font-mono);
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
		opacity: 0;
		transition: opacity var(--duration-fast) var(--easing);
		white-space: nowrap;
		pointer-events: none;
	}

	.minimap-node:hover .node-label {
		opacity: 1;
	}

	.minimap-indicator {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		transition: transform 0.1s linear;
	}

	.indicator-btn {
		position: absolute;
		right: 0;
		top: 0;
		transform: translateY(-50%);
		background: var(--color-accent);
		color: white;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.25rem 0.6rem;
		white-space: nowrap;
		text-decoration: none;
		pointer-events: auto;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		letter-spacing: 0.05em;
	}

	.indicator-btn:hover {
		filter: brightness(1.1);
	}

	@media (max-width: 640px) {
		.minimap-node {
			width: 20px;
		}
		.minimap-node.active {
			width: 30px;
		}
		.indicator-btn {
			padding: 0.15rem 0.4rem;
			font-size: 0.6rem;
		}
	}
</style>
