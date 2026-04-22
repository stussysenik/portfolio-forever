<script lang="ts">
	import { onMount } from "svelte";
	import { targetRoles, proofMatrix, hiringMission, proofPillars } from "$lib/data/hiring-target";

	const batches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const batchNames: Record<number, string> = {
		1: "Ramp",
		2: "Linear",
		3: "OpenAI",
		4: "Basement Studio",
		5: "Jane Street",
		6: "Google DeepMind",
		7: "Windmill",
		8: "Notion",
		9: "Apple",
		10: "Mistral AI",
	};

	let mounted = false;

	onMount(() => {
		// Small delay ensures browser has painted before animating
		requestAnimationFrame(() => {
			mounted = true;
		});
	});

	function rolesForBatch(batch: number) {
		return targetRoles.filter((r) => r.batch === batch);
	}

	function getProofLabel(path: string) {
		const labels: Record<string, string> = {
			"/works": "Works",
			"/cv": "CV",
			"/process": "Process",
			"/terminal": "Terminal",
			"/gallery": "Gallery",
			"/academia": "Academia",
		};
		return labels[path] ?? path;
	}

	function staggerDelay(index: number, base = 50) {
		return `${index * base}ms`;
	}
</script>

<div class="hire-page" data-mounted={mounted}>
	<!-- HERO — Asymmetric, massive scale, breathing room -->
	<header class="hire-hero">
		<div class="hire-hero__kicker" style="transition-delay: {staggerDelay(0)}">
			<span class="hire-hero__line"></span>
			<span class="hire-hero__label">Hiring proof — April 2026</span>
		</div>

		<h1 class="hire-hero__name" style="transition-delay: {staggerDelay(1)}">
			<span class="hire-hero__word">Stüssy</span>
			<span class="hire-hero__word">Senik</span>
		</h1>

		<p class="hire-hero__thesis" style="transition-delay: {staggerDelay(2)}">
			Design engineer building AI-native products, expert tools, and trust-heavy interfaces.
		</p>

		<div class="hire-hero__meta" style="transition-delay: {staggerDelay(3)}">
			<span class="hire-hero__status">
				<span class="hire-hero__dot"></span>
				Available now
			</span>
			<span class="hire-hero__location">NYC / PRAGUE</span>
			<span class="hire-hero__signal">30+ roles · 10 companies · 1 proof</span>
		</div>
	</header>

	<!-- THE MANIFEST — Editorial, not metrics -->
	<section class="hire-manifest" aria-labelledby="manifest-heading">
		<h2 id="manifest-heading" class="hire-manifest__title" style="transition-delay: {staggerDelay(4)}">The Mission</h2>
		<p class="hire-manifest__body" style="transition-delay: {staggerDelay(5)}">{hiringMission}</p>
	</section>

	<!-- PILLARS — Broken grid, varied scale -->
	<section class="hire-pillars" aria-labelledby="pillars-heading">
		<h2 id="pillars-heading" class="sr-only">Proof pillars</h2>
		<div class="hire-pillars__grid">
			{#each proofPillars as pillar, i}
				<article
					class="hire-pillar"
					style="transition-delay: {staggerDelay(i + 6, 80)}"
				>
					<span class="hire-pillar__index">0{i + 1}</span>
					<h3 class="hire-pillar__title">{pillar.title}</h3>
					<p class="hire-pillar__detail">{pillar.detail}</p>
				</article>
			{/each}
		</div>
	</section>

	<!-- ROLE TARGETS — The actual jobs, with staggered entrance -->
	<section class="hire-roles" aria-labelledby="roles-heading">
		<div class="hire-roles__header" style="transition-delay: {staggerDelay(10)}">
			<h2 id="roles-heading" class="hire-section__title">Target Roles</h2>
			<p class="hire-section__subtitle">
				Every role links to the live posting. Every posting maps to evidence in this portfolio.
			</p>
		</div>

		<div class="hire-roles__grid">
			{#each batches as batch}
				{@const roles = rolesForBatch(batch)}
				{#if roles.length > 0}
					<div class="hire-batch" style="transition-delay: {staggerDelay(batch + 10, 60)}">
						<h3 class="hire-batch__name">{batchNames[batch]}</h3>
						<div class="hire-batch__roles">
							{#each roles as role, ri}
								<article
									class="hire-role"
									style="transition-delay: {staggerDelay(ri + batch * 3, 40)}"
								>
									<a
										href={role.url}
										target="_blank"
										rel="noreferrer noopener"
										class="hire-role__title"
									>
										{role.title}
										<span class="hire-role__arrow">↗</span>
									</a>
									<div class="hire-role__meta">
										<span class="hire-role__location">{role.location}</span>
									</div>
									<div class="hire-role__keywords">
										{#each role.keywords.slice(0, 4) as kw}
											<span class="hire-role__kw">{kw}</span>
										{/each}
									</div>
									<div class="hire-role__proof">
										{#each role.proofPaths as path}
											<a href={path} class="hire-role__proof-link">{getProofLabel(path)}</a>
										{/each}
									</div>
								</article>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<!-- PROOF MATRIX — Skills mapped to evidence -->
	<section class="hire-matrix" aria-labelledby="matrix-heading">
		<div class="hire-matrix__header" style="transition-delay: {staggerDelay(20)}">
			<h2 id="matrix-heading" class="hire-section__title">Proof Matrix</h2>
			<p class="hire-section__subtitle">Skills mapped to shipped evidence, not claimed competence.</p>
		</div>

		<div class="hire-matrix__list">
			{#each proofMatrix as row, i}
				<article
					class="hire-matrix__row"
					style="transition-delay: {staggerDelay(i + 22, 50)}"
				>
					<div class="hire-matrix__skill">{row.skill}</div>
					<div class="hire-matrix__evidence">
						{#each row.evidence as item}
							<span class="hire-matrix__item">{item}</span>
						{/each}
					</div>
					<div class="hire-matrix__roles">
						{#each row.roles as r}
							<span class="hire-matrix__role">{r}</span>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- THE ASK — Direct CTA with press feedback -->
	<section class="hire-ask" aria-labelledby="ask-heading" style="transition-delay: {staggerDelay(28)}">
		<h2 id="ask-heading" class="hire-ask__title">The Ask</h2>
		<p class="hire-ask__body">
			If you're hiring for any of the roles above, the evidence is here. The code is here. The proof is here.
			I don't need you to believe me — I need you to check the work.
		</p>
		<div class="hire-ask__actions">
			<a href="mailto:hello@portfolio-forever.com" class="hire-ask__cta hire-ask__cta--primary">
				hello@portfolio-forever.com
			</a>
			<a href="https://github.com/stussysenik" target="_blank" rel="noreferrer noopener" class="hire-ask__cta">
				GitHub ↗
			</a>
			<a href="https://linkedin.com/in/mxzou" target="_blank" rel="noreferrer noopener" class="hire-ask__cta">
				LinkedIn ↗
			</a>
		</div>
	</section>

	<!-- FOOTER NOTE -->
	<footer class="hire-footer" style="transition-delay: {staggerDelay(30)}">
		<p class="hire-footer__text">
			Built with Astro 6, Svelte 5, Convex, and Sanity. 150+ commits. 35M+ tokens of context engineering.
			No templates. No shortcuts. Only proof.
		</p>
	</footer>
</div>

<style>
	/* ============================================
	   HIRE PAGE — Vision Check Rebuild
	   impeccable + Emil Kowalski + Jakub Krehel + Rauno
	   ============================================ */

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	/* ---- Entrance Animation System ---- */
	/* Jakub's recipe: opacity + translateY(8px) + blur(4px) */
	/* Stagger: 40-80ms between items (Emil) */

	.hire-page > header > *,
	.hire-page > section > *,
	.hire-page > footer,
	.hire-hero__name .hire-hero__word,
	.hire-pillar,
	.hire-batch,
	.hire-role,
	.hire-matrix__row {
		opacity: 0;
		transform: translateY(12px);
		filter: blur(3px);
		transition:
			opacity 500ms cubic-bezier(0.23, 1, 0.32, 1),
			transform 500ms cubic-bezier(0.23, 1, 0.32, 1),
			filter 500ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.hire-page[data-mounted="true"] > header > *,
	.hire-page[data-mounted="true"] > section > *,
	.hire-page[data-mounted="true"] > footer,
	.hire-page[data-mounted="true"] .hire-hero__word,
	.hire-page[data-mounted="true"] .hire-pillar,
	.hire-page[data-mounted="true"] .hire-batch,
	.hire-page[data-mounted="true"] .hire-role,
	.hire-page[data-mounted="true"] .hire-matrix__row {
		opacity: 1;
		transform: translateY(0);
		filter: blur(0);
	}

	/* Respect reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.hire-page > header > *,
		.hire-page > section > *,
		.hire-page > footer,
		.hire-hero__name .hire-hero__word,
		.hire-pillar,
		.hire-batch,
		.hire-role,
		.hire-matrix__row {
			transition: opacity 150ms ease;
			transform: none;
			filter: none;
		}
	}

	/* ---- Page Shell ---- */
	.hire-page {
		--hp-gap-xl: clamp(4rem, 10vw, 7rem);
		--hp-gap-lg: clamp(2.5rem, 6vw, 4rem);
		--hp-gap-md: clamp(1.5rem, 3vw, 2.5rem);
		--hp-gap-sm: clamp(0.75rem, 2vw, 1.25rem);

		display: grid;
		gap: var(--hp-gap-xl);
		padding-bottom: clamp(5rem, 12vw, 10rem);
		overflow-wrap: break-word;
		word-break: break-word;
	}

	/* ---- HERO ---- */
	/* Massive scale contrast. Name dominates. Everything else is tiny. */
	.hire-hero {
		display: grid;
		gap: var(--hp-gap-md);
		padding-top: clamp(2rem, 5vh, 4rem);
		padding-bottom: var(--hp-gap-xl);
		border-bottom: 1px solid var(--border-color);
	}

	.hire-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: var(--hp-gap-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	.hire-hero__line {
		width: 2.5rem;
		height: 1px;
		background: currentColor;
	}

	.hire-hero__name {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.75rem, 14vw, 10rem);
		font-weight: 800;
		line-height: 0.88;
		letter-spacing: -0.055em;
		text-transform: uppercase;
		color: var(--color-text);
		display: flex;
		flex-direction: column;
	}

	.hire-hero__word {
		display: block;
	}

	.hire-hero__thesis {
		margin: 0;
		font-size: clamp(1.15rem, 1rem + 0.7vw, 1.75rem);
		line-height: 1.3;
		color: var(--color-text-secondary);
		max-width: 44ch;
		font-weight: 400;
		letter-spacing: -0.01em;
	}

	.hire-hero__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--hp-gap-sm);
		align-items: center;
		margin-top: 0.25rem;
	}

	.hire-hero__status {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-success);
	}

	.hire-hero__dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 8px currentColor;
		animation: pulse 3s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	@media (prefers-reduced-motion: reduce) {
		.hire-hero__dot { animation: none; }
	}

	.hire-hero__location {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.hire-hero__signal {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-muted);
		letter-spacing: 0.06em;
		margin-left: auto;
		display: none;
	}

	@media (min-width: 768px) {
		.hire-hero__signal { display: inline; }
	}

	/* ---- MANIFEST ---- */
	.hire-manifest {
		display: grid;
		gap: var(--hp-gap-sm);
	}

	.hire-manifest__title {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	.hire-manifest__body {
		margin: 0;
		font-size: clamp(1.35rem, 1rem + 1vw, 2rem);
		line-height: 1.25;
		color: var(--color-text);
		max-width: 44ch;
		font-weight: 500;
		letter-spacing: -0.025em;
	}

	/* ---- PILLARS — Broken grid, no cards ---- */
	.hire-pillars__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
	}

	.hire-pillar {
		padding: var(--hp-gap-md) 0;
		border-top: 1px solid var(--border-color);
		display: grid;
		gap: var(--hp-gap-sm);
	}

	.hire-pillar:last-child {
		border-bottom: 1px solid var(--border-color);
	}

	.hire-pillar__index {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-subtle);
		letter-spacing: 0.1em;
	}

	.hire-pillar__title {
		margin: 0;
		font-size: clamp(1.1rem, 1rem + 0.4vw, 1.45rem);
		font-weight: 600;
		line-height: 1.15;
		color: var(--color-text);
		letter-spacing: -0.02em;
	}

	.hire-pillar__detail {
		margin: 0;
		font-size: var(--font-size-sm);
		line-height: 1.6;
		color: var(--color-text-secondary);
		max-width: 52ch;
	}

	/* On desktop: asymmetric 2-column with offset */
	@media (min-width: 900px) {
		.hire-pillars__grid {
			grid-template-columns: 1fr 1fr;
			gap: 0 var(--hp-gap-lg);
		}

		.hire-pillar:nth-child(odd) {
			padding-right: var(--hp-gap-md);
		}

		.hire-pillar:nth-child(even) {
			padding-left: var(--hp-gap-md);
			border-left: 1px solid var(--border-color);
		}

		/* Remove bottom border from non-last items in 2-col layout */
		.hire-pillar:nth-child(3) { border-bottom: none; }
	}

	/* ---- SECTION HEADERS ---- */
	.hire-section__title {
		margin: 0 0 var(--hp-gap-sm) 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	.hire-section__subtitle {
		margin: 0 0 var(--hp-gap-lg) 0;
		font-size: clamp(1.1rem, 1rem + 0.4vw, 1.4rem);
		line-height: 1.35;
		color: var(--color-text-secondary);
		max-width: 48ch;
	}

	/* ---- ROLES — Varied, alive, not identical cards ---- */
	.hire-roles__grid {
		display: grid;
		gap: var(--hp-gap-xl);
	}

	.hire-batch {
		display: grid;
		gap: var(--hp-gap-md);
	}

	.hire-batch__name {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.75rem);
		font-weight: 700;
		letter-spacing: -0.035em;
		color: var(--color-text);
		padding-bottom: var(--hp-gap-sm);
		border-bottom: 1px solid var(--border-color);
	}

	.hire-batch__roles {
		display: grid;
		gap: 1px;
		background: var(--border-color);
	}

	.hire-role {
		background: var(--color-bg);
		padding: clamp(1.25rem, 2.5vw, 2rem);
		display: grid;
		gap: 0.65rem;
		position: relative;
		transition:
			background 180ms cubic-bezier(0.23, 1, 0.32, 1),
			transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	/* Subtle hover: lift + surface shift, not just border */
	@media (hover: hover) and (pointer: fine) {
		.hire-role:hover {
			background: var(--color-surface);
			transform: translateX(4px);
		}
	}

	.hire-role__title {
		margin: 0;
		font-size: clamp(1rem, 0.9rem + 0.4vw, 1.2rem);
		font-weight: 600;
		color: var(--color-text);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		transition: color 150ms ease;
		line-height: 1.2;
	}

	.hire-role__title:hover {
		color: var(--color-accent);
	}

	.hire-role__arrow {
		font-size: 0.8em;
		color: var(--color-text-subtle);
		transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.hire-role__title:hover .hire-role__arrow {
		transform: translate(2px, -2px);
	}

	.hire-role__meta {
		font-size: var(--font-size-2xs);
		color: var(--color-text-muted);
		letter-spacing: 0.04em;
	}

	.hire-role__keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.15rem;
	}

	.hire-role__kw {
		font-size: max(0.75rem, var(--font-size-3xs));
		padding: 0.4rem 0.55rem;
		border: 1px solid var(--border-color);
		color: var(--color-text-muted);
		letter-spacing: 0.03em;
		transition: border-color 150ms ease, color 150ms ease;
		min-height: 32px;
		display: inline-flex;
		align-items: center;
	}

	.hire-role:hover .hire-role__kw {
		border-color: var(--border-color-strong);
		color: var(--color-text-secondary);
	}

	.hire-role__proof {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		margin-top: 0.35rem;
	}

	.hire-role__proof-link {
		font-size: var(--font-size-2xs);
		color: var(--color-text);
		text-decoration: underline;
		text-underline-offset: 0.18em;
		transition: color 150ms ease;
	}

	.hire-role__proof-link:hover {
		color: var(--color-accent);
	}

	/* ---- MATRIX — Clean rows, no card noise ---- */
	.hire-matrix__list {
		display: grid;
		gap: 0;
	}

	.hire-matrix__row {
		padding: clamp(1.5rem, 3vw, 2.5rem) 0;
		border-top: 1px solid var(--border-color);
		display: grid;
		gap: var(--hp-gap-sm);
		align-items: start;
	}

	.hire-matrix__row:last-child {
		border-bottom: 1px solid var(--border-color);
	}

	.hire-matrix__skill {
		font-size: clamp(1.1rem, 1rem + 0.3vw, 1.35rem);
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: -0.02em;
	}

	.hire-matrix__evidence {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.hire-matrix__item {
		font-size: var(--font-size-2xs);
		padding: 0.35rem 0.6rem;
		border: 1px solid var(--border-color);
		color: var(--color-text-secondary);
		transition: border-color 150ms ease;
	}

	.hire-matrix__row:hover .hire-matrix__item {
		border-color: var(--border-color-strong);
	}

	.hire-matrix__roles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.hire-matrix__role {
		font-size: var(--font-size-3xs);
		color: var(--color-text-muted);
		letter-spacing: 0.04em;
	}

	/* ---- ASK — Press feedback, strong CTAs ---- */
	.hire-ask {
		display: grid;
		gap: var(--hp-gap-md);
		padding: var(--hp-gap-xl) 0;
		border-top: 1px solid var(--border-color);
		border-bottom: 1px solid var(--border-color);
	}

	.hire-ask__title {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 5vw, 4rem);
		font-weight: 800;
		letter-spacing: -0.045em;
		color: var(--color-text);
	}

	.hire-ask__body {
		margin: 0;
		font-size: clamp(1.15rem, 1rem + 0.5vw, 1.5rem);
		line-height: 1.35;
		color: var(--color-text-secondary);
		max-width: 50ch;
	}

	.hire-ask__actions {
		display: flex;
		flex-direction: column;
		gap: var(--hp-gap-sm);
		margin-top: 0.5rem;
	}

	@media (min-width: 480px) {
		.hire-ask__actions {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}

	.hire-ask__cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.9rem 1.4rem;
		border: 1px solid var(--border-color-strong);
		background: transparent;
		color: var(--color-text);
		text-decoration: none;
		font-size: var(--font-size-xs);
		letter-spacing: 0.06em;
		min-height: 48px;
		transition:
			background 160ms cubic-bezier(0.23, 1, 0.32, 1),
			transform 120ms cubic-bezier(0.23, 1, 0.32, 1),
			border-color 160ms ease;
	}

	/* Emil: buttons must feel responsive */
	.hire-ask__cta:active {
		transform: scale(0.97);
	}

	@media (hover: hover) and (pointer: fine) {
		.hire-ask__cta:hover {
			background: var(--color-text);
			color: var(--color-bg);
			border-color: var(--color-text);
		}
	}

	.hire-ask__cta--primary {
		background: var(--color-text);
		color: var(--color-bg);
		border-color: var(--color-text);
	}

	@media (hover: hover) and (pointer: fine) {
		.hire-ask__cta--primary:hover {
			background: var(--color-text-secondary);
			border-color: var(--color-text-secondary);
		}
	}

	/* ---- FOOTER ---- */
	.hire-footer {
		padding-top: var(--hp-gap-lg);
	}

	.hire-footer__text {
		margin: 0;
		font-size: var(--font-size-3xs);
		color: var(--color-text-subtle);
		line-height: 1.6;
		max-width: 55ch;
		letter-spacing: 0.04em;
	}

	/* ---- MOBILE OVERRIDES (< 480px) ---- */
	@media (max-width: 479px) {
		.hire-page {
			--hp-gap-xl: clamp(2.5rem, 8vw, 4rem);
			--hp-gap-md: clamp(1rem, 3vw, 1.5rem);
		}

		.hire-hero {
			padding-top: 1rem;
			padding-bottom: var(--hp-gap-lg);
		}

		.hire-batch__name {
			font-size: clamp(1.35rem, 8vw, 1.75rem);
		}

		.hire-role {
			padding: 1rem;
		}

		.hire-ask__title {
			font-size: clamp(1.75rem, 10vw, 2.25rem);
		}
	}

	/* ---- TABLET+ ---- */
	@media (min-width: 768px) {
		.hire-matrix__row {
			grid-template-columns: minmax(14rem, 0.35fr) 1fr;
			gap: var(--hp-gap-md);
		}

		.hire-matrix__roles {
			grid-column: 2;
		}

		.hire-batch__roles {
			grid-template-columns: repeat(2, 1fr);
			gap: 1px;
		}
	}

	@media (min-width: 1200px) {
		.hire-batch__roles {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
