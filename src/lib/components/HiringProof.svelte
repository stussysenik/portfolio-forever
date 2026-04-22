<script lang="ts">
	import { hiringMission, hiringTracks, proofPillars, proofRoutes } from "$lib/data/hiring-target";
</script>

<section class="hiring-proof" aria-label="Hiring proof">
	<p class="hiring-proof__eyebrow">Hiring proof</p>
	<h2 class="hiring-proof__title">
		<a href="/hire" class="hiring-proof__link">A structured read for design engineering, AI product, and frontend systems roles. →</a>
	</h2>
	<p class="hiring-proof__mission">
		{hiringMission}
	</p>

	<div class="hiring-proof__tracks" role="list" aria-label="Target role tracks">
		{#each hiringTracks as track}
			<span class="hiring-proof__track" role="listitem">{track.label}</span>
		{/each}
	</div>

	<div class="hiring-proof__body">
		<div class="hiring-proof__pillars" aria-label="Core proof points">
			{#each proofPillars as pillar}
				<article class="hiring-proof__pillar">
					<strong>{pillar.title}</strong>
					<p>{pillar.detail}</p>
				</article>
			{/each}
		</div>

		<nav class="hiring-proof__routes" aria-label="Proof routes">
			{#each proofRoutes as route}
				<a href={route.href} class="hiring-proof__route">
					<span class="hiring-proof__route-label">{route.label}</span>
					<span class="hiring-proof__route-reason">{route.reason}</span>
				</a>
			{/each}
		</nav>
	</div>
</section>

<style>
	.hiring-proof {
		display: grid;
		gap: var(--space-md);
		padding-top: var(--space-lg);
		border-top: 1px solid color-mix(in srgb, var(--border-color-strong) 72%, transparent);
	}

	.hiring-proof__eyebrow {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	.hiring-proof__title {
		margin: 0;
		max-width: none;
		font-size: clamp(1.05rem, 0.95rem + 0.4vw, 1.35rem);
		line-height: 1.3;
		letter-spacing: -0.015em;
	}

	.hiring-proof__link {
		color: inherit;
		text-decoration: none;
	}

	.hiring-proof__link:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.hiring-proof__mission {
		margin: 0;
		max-width: 40ch;
		font-size: var(--font-size-sm);
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	.hiring-proof__tracks {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.hiring-proof__track {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.72rem;
		border: 1px solid color-mix(in srgb, var(--border-color) 84%, transparent);
		background: color-mix(in srgb, var(--color-surface) 76%, transparent);
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--color-text-secondary);
	}

	.hiring-proof__body {
		display: grid;
		gap: var(--space-md);
	}

	.hiring-proof__pillars {
		display: grid;
		gap: var(--space-sm);
	}

	.hiring-proof__pillar {
		display: grid;
		gap: var(--space-xs);
		padding-top: var(--space-md);
		border-top: 1px solid color-mix(in srgb, var(--border-color) 72%, transparent);
	}

	.hiring-proof__pillar strong {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-text);
	}

	.hiring-proof__pillar p {
		margin: 0;
		font-size: var(--font-size-xs);
		line-height: 1.55;
		color: var(--color-text-secondary);
	}

	.hiring-proof__routes {
		display: grid;
		gap: var(--space-xs);
	}

	.hiring-proof__route {
		display: grid;
		gap: var(--space-2xs);
		padding: 0.75rem 0.85rem;
		border: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
		text-decoration: none;
		color: inherit;
		background: color-mix(in srgb, var(--color-bg) 55%, transparent);
	}

	.hiring-proof__route-label {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.hiring-proof__route-reason {
		font-size: var(--font-size-xs);
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	@media (min-width: 900px) {
		.hiring-proof__body {
			grid-template-columns: minmax(0, 1.1fr) minmax(16rem, 0.85fr);
			align-items: start;
		}
	}

	@media (min-width: 768px) {
		.hiring-proof__title {
			max-width: 22ch;
		}
	}
</style>
