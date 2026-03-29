<script lang="ts">
	// Periodic table styled name: each letter group mapped to element cards
	// Non-element letters styled as "undiscovered" elements

	interface ElementCard {
		symbol: string;
		number: number;
		name: string;
		real: boolean; // true = actual element, false = creative liberty
	}

	export let name = "STÜSSY SENIK";

	// Map name to periodic table elements (creative liberty for non-elements)
	const cards: ElementCard[] = [
		{ symbol: "S", number: 16, name: "Sulfur", real: true },
		{ symbol: "Tü", number: 0, name: "Tüssium", real: false },
		{ symbol: "S", number: 16, name: "Sulfur", real: true },
		{ symbol: "Sy", number: 0, name: "Synergy", real: false },
		// space
		{ symbol: "Se", number: 34, name: "Selenium", real: true },
		{ symbol: "Ni", number: 28, name: "Nickel", real: true },
		{ symbol: "K", number: 19, name: "Potassium", real: true },
	];

	let hoveredIdx: number | null = null;
</script>

<div class="periodic-name" role="presentation">
	{#each cards as card, i}
		{#if i === 4}
			<span class="periodic-space"></span>
		{/if}
		<div
			class="element-card"
			class:undiscovered={!card.real}
			class:hovered={hoveredIdx === i}
			on:mouseenter={() => hoveredIdx = i}
			on:mouseleave={() => hoveredIdx = null}
			role="presentation"
		>
			<span class="element-number">{card.real ? card.number : '?'}</span>
			<span class="element-symbol">{card.symbol}</span>
			<span class="element-name">{card.name}</span>
		</div>
	{/each}
</div>

<style>
	.periodic-name {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		flex-wrap: wrap;
	}

	.periodic-space {
		width: var(--space-md);
	}

	.element-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: clamp(48px, 8vw, 64px);
		height: clamp(56px, 9vw, 72px);
		border: 2px solid var(--color-text);
		border-radius: 2px;
		padding: var(--space-2xs);
		position: relative;
		cursor: default;
		transition: all var(--duration-fast) var(--easing);
		background: var(--color-bg);
	}

	.element-card.hovered {
		background: linear-gradient(
			135deg,
			rgba(255, 0, 128, 0.15),
			rgba(0, 255, 200, 0.15),
			rgba(100, 100, 255, 0.15)
		);
		border-color: var(--color-accent);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	/* Holographic shimmer on hover */
	.element-card.hovered::after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			transparent 30%,
			rgba(255, 255, 255, 0.2) 50%,
			transparent 70%
		);
		animation: shimmer 1.5s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes shimmer {
		0%, 100% { transform: translateX(-100%); }
		50% { transform: translateX(100%); }
	}

	.element-card.undiscovered {
		border-style: dashed;
		opacity: 0.7;
	}

	.element-card.undiscovered.hovered {
		opacity: 1;
	}

	.element-number {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		color: var(--color-text-subtle);
		position: absolute;
		top: 2px;
		left: 4px;
	}

	.element-symbol {
		font-family: var(--font-sans);
		font-size: clamp(1.25rem, 3vw, 1.75rem);
		font-weight: 600;
		color: var(--color-text);
		line-height: 1;
	}

	.element-name {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		color: var(--color-text-muted);
		text-transform: lowercase;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	@media (max-width: 600px) {
		.periodic-name {
			gap: 2px;
		}

		.element-card {
			width: clamp(36px, 12vw, 48px);
			height: clamp(42px, 14vw, 56px);
		}
	}
</style>
