<script lang="ts">
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
</script>

<div class="hire-page">
	<!-- HERO — Inverse Law: One name, one line, one status -->
	<header class="hire-hero">
		<div class="hire-hero__kicker">
			<span class="hire-hero__line"></span>
			<span class="hire-hero__label">Hiring proof — April 2026</span>
		</div>
		<h1 class="hire-hero__name">Stüssy Senik</h1>
		<p class="hire-hero__thesis">
			Design engineer building AI-native products, expert tools, and trust-heavy interfaces.
		</p>
		<div class="hire-hero__meta">
			<span class="hire-hero__status">
				<span class="hire-hero__dot"></span>
				Available now
			</span>
			<span class="hire-hero__location">NYC / PRAGUE</span>
		</div>
	</header>

	<!-- THE MANIFEST — Why this page exists -->
	<section class="hire-manifest" aria-labelledby="manifest-heading">
		<h2 id="manifest-heading" class="hire-manifest__title">The Mission</h2>
		<p class="hire-manifest__body">{hiringMission}</p>
		<div class="hire-manifest__stats">
			<div class="hire-stat">
				<span class="hire-stat__number">30+</span>
				<span class="hire-stat__label">Target roles</span>
			</div>
			<div class="hire-stat">
				<span class="hire-stat__number">10</span>
				<span class="hire-stat__label">Companies</span>
			</div>
			<div class="hire-stat">
				<span class="hire-stat__number">1</span>
				<span class="hire-stat__label">Proof surface</span>
			</div>
		</div>
	</section>

	<!-- PILLARS — Core proof points -->
	<section class="hire-pillars" aria-labelledby="pillars-heading">
		<h2 id="pillars-heading" class="sr-only">Proof pillars</h2>
		<div class="hire-pillars__grid">
			{#each proofPillars as pillar, i}
				<article class="hire-pillar">
					<span class="hire-pillar__index">0{i + 1}</span>
					<h3 class="hire-pillar__title">{pillar.title}</h3>
					<p class="hire-pillar__detail">{pillar.detail}</p>
				</article>
			{/each}
		</div>
	</section>

	<!-- ROLE TARGETS — The actual jobs -->
	<section class="hire-roles" aria-labelledby="roles-heading">
		<h2 id="roles-heading" class="hire-section__title">Target Roles</h2>
		<p class="hire-section__subtitle">
			Every role below links to the live posting. Every posting maps to evidence in this portfolio.
		</p>

		<div class="hire-roles__grid">
			{#each batches as batch}
				{@const roles = rolesForBatch(batch)}
				{#if roles.length > 0}
					<div class="hire-batch">
						<h3 class="hire-batch__name">{batchNames[batch]}</h3>
						<div class="hire-batch__roles">
							{#each roles as role}
								<article class="hire-role">
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
										{#each role.keywords as kw}
											<span class="hire-role__kw">{kw}</span>
										{/each}
									</div>
									<div class="hire-role__proof">
										<span class="hire-role__proof-label">Proof:</span>
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

	<!-- PROOF MATRIX — Skills → Evidence -->
	<section class="hire-matrix" aria-labelledby="matrix-heading">
		<h2 id="matrix-heading" class="hire-section__title">Proof Matrix</h2>
		<p class="hire-section__subtitle">Skills mapped to shipped evidence, not claimed competence.</p>

		<div class="hire-matrix__list">
			{#each proofMatrix as row}
				<article class="hire-matrix__row">
					<div class="hire-matrix__skill">{row.skill}</div>
					<div class="hire-matrix__evidence">
						{#each row.evidence as item}
							<span class="hire-matrix__item">{item}</span>
						{/each}
					</div>
					<div class="hire-matrix__roles">
						{#each row.roles as role}
							<span class="hire-matrix__role">{role}</span>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- THE ASK — Direct CTA -->
	<section class="hire-ask" aria-labelledby="ask-heading">
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
	<footer class="hire-footer">
		<p class="hire-footer__text">
			Built with Astro 6, Svelte 5, Convex, and Sanity. 150+ commits. 35M+ tokens of context engineering.
			No templates. No shortcuts. Only proof.
		</p>
	</footer>
</div>

<style>
	/* === INVERSE-LAW DESIGN SYSTEM === */
	/* Rick Rubin: Strip everything non-essential */
	/* PG LANG: Bold, confident, artistic restraint */
	/* Light Phone: Calm, minimal, no noise */

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

	.hire-page {
		--hire-accent: var(--color-text, #111);
		--hire-muted: var(--color-text-secondary, #666);
		--hire-subtle: var(--color-text-subtle, #999);
		--hire-surface: var(--color-surface, #f8f8f8);
		--hire-border: var(--border-color, #e5e5e5);
		--hire-gap-xl: clamp(3rem, 8vw, 6rem);
		--hire-gap-lg: clamp(2rem, 5vw, 4rem);
		--hire-gap-md: clamp(1.25rem, 3vw, 2rem);
		--hire-gap-sm: clamp(0.75rem, 2vw, 1.25rem);

		display: grid;
		gap: var(--hire-gap-xl);
		padding-bottom: clamp(4rem, 10vw, 8rem);
	}

	/* --- HERO --- */
	.hire-hero {
		display: grid;
		gap: var(--hire-gap-md);
		padding-top: clamp(2rem, 5vh, 4rem);
		border-bottom: 1px solid var(--hire-border);
		padding-bottom: var(--hire-gap-xl);
	}

	.hire-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: var(--hire-gap-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--hire-subtle);
	}

	.hire-hero__line {
		width: 3rem;
		height: 1px;
		background: var(--hire-subtle);
	}

	.hire-hero__name {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 10vw, 8rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.05em;
		text-transform: uppercase;
		color: var(--hire-accent);
		max-width: 12ch;
	}

	.hire-hero__thesis {
		margin: 0;
		font-size: clamp(1.1rem, 1rem + 0.6vw, 1.6rem);
		line-height: 1.35;
		color: var(--hire-muted);
		max-width: 42ch;
		font-weight: 400;
	}

	.hire-hero__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--hire-gap-sm);
		align-items: center;
		margin-top: 0.5rem;
	}

	.hire-hero__status {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-success, #22c55e);
	}

	.hire-hero__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 10px currentColor;
	}

	.hire-hero__location {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--hire-subtle);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	/* --- MANIFEST --- */
	.hire-manifest {
		display: grid;
		gap: var(--hire-gap-md);
	}

	.hire-manifest__title {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--hire-subtle);
	}

	.hire-manifest__body {
		margin: 0;
		font-size: clamp(1.25rem, 1rem + 0.8vw, 1.85rem);
		line-height: 1.3;
		color: var(--hire-accent);
		max-width: 48ch;
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	.hire-manifest__stats {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(2rem, 5vw, 4rem);
		margin-top: 1rem;
	}

	.hire-stat {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.hire-stat__number {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.04em;
		color: var(--hire-accent);
	}

	.hire-stat__label {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--hire-subtle);
	}

	/* --- PILLARS --- */
	.hire-pillars__grid {
		display: grid;
		gap: 1px;
		background: var(--hire-border);
		border: 1px solid var(--hire-border);
	}

	.hire-pillar {
		background: var(--color-bg, #fff);
		padding: clamp(1.5rem, 3vw, 2.5rem);
		display: grid;
		gap: var(--hire-gap-sm);
	}

	.hire-pillar__index {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--hire-subtle);
		letter-spacing: 0.1em;
	}

	.hire-pillar__title {
		margin: 0;
		font-size: clamp(1rem, 0.9rem + 0.3vw, 1.25rem);
		font-weight: 600;
		line-height: 1.2;
		color: var(--hire-accent);
	}

	.hire-pillar__detail {
		margin: 0;
		font-size: var(--font-size-sm);
		line-height: 1.6;
		color: var(--hire-muted);
		max-width: 50ch;
	}

	/* --- SECTION TITLES --- */
	.hire-section__title {
		margin: 0 0 var(--hire-gap-sm) 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--hire-subtle);
	}

	.hire-section__subtitle {
		margin: 0 0 var(--hire-gap-lg) 0;
		font-size: clamp(1.1rem, 1rem + 0.4vw, 1.4rem);
		line-height: 1.35;
		color: var(--hire-muted);
		max-width: 48ch;
	}

	/* --- ROLES --- */
	.hire-roles__grid {
		display: grid;
		gap: var(--hire-gap-xl);
	}

	.hire-batch {
		display: grid;
		gap: var(--hire-gap-md);
		padding-bottom: var(--hire-gap-lg);
		border-bottom: 1px solid var(--hire-border);
	}

	.hire-batch__name {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 2.5vw, 2.25rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--hire-accent);
	}

	.hire-batch__roles {
		display: grid;
		gap: var(--hire-gap-md);
	}

	.hire-role {
		display: grid;
		gap: 0.6rem;
		padding: clamp(1rem, 2vw, 1.5rem);
		border: 1px solid var(--hire-border);
		background: var(--hire-surface);
		transition: border-color 0.2s ease;
	}

	.hire-role:hover {
		border-color: var(--hire-accent);
	}

	.hire-role__title {
		margin: 0;
		font-size: clamp(1rem, 0.95rem + 0.25vw, 1.15rem);
		font-weight: 600;
		color: var(--hire-accent);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.hire-role__title:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.hire-role__arrow {
		font-size: 0.85em;
		color: var(--hire-subtle);
	}

	.hire-role__meta {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--hire-subtle);
		letter-spacing: 0.08em;
	}

	.hire-role__keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.hire-role__kw {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		padding: 0.3rem 0.5rem;
		background: color-mix(in srgb, var(--hire-border) 60%, transparent);
		color: var(--hire-muted);
		letter-spacing: 0.06em;
	}

	.hire-role__proof {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: center;
		margin-top: 0.25rem;
	}

	.hire-role__proof-label {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		color: var(--hire-subtle);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.hire-role__proof-link {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		color: var(--hire-accent);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.hire-role__proof-link:hover {
		color: var(--hire-muted);
	}

	/* --- MATRIX --- */
	.hire-matrix__list {
		display: grid;
		gap: 1px;
		background: var(--hire-border);
		border: 1px solid var(--hire-border);
	}

	.hire-matrix__row {
		background: var(--color-bg, #fff);
		padding: clamp(1.25rem, 2.5vw, 2rem);
		display: grid;
		gap: var(--hire-gap-sm);
	}

	.hire-matrix__skill {
		font-size: clamp(1.05rem, 1rem + 0.2vw, 1.2rem);
		font-weight: 600;
		color: var(--hire-accent);
	}

	.hire-matrix__evidence {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.hire-matrix__item {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		padding: 0.4rem 0.65rem;
		border: 1px solid var(--hire-border);
		color: var(--hire-muted);
	}

	.hire-matrix__roles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.hire-matrix__role {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		color: var(--hire-subtle);
		letter-spacing: 0.06em;
	}

	/* --- ASK --- */
	.hire-ask {
		display: grid;
		gap: var(--hire-gap-md);
		padding: var(--hire-gap-xl) 0;
		border-top: 1px solid var(--hire-border);
		border-bottom: 1px solid var(--hire-border);
	}

	.hire-ask__title {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 800;
		letter-spacing: -0.04em;
		color: var(--hire-accent);
	}

	.hire-ask__body {
		margin: 0;
		font-size: clamp(1.1rem, 1rem + 0.4vw, 1.4rem);
		line-height: 1.4;
		color: var(--hire-muted);
		max-width: 52ch;
	}

	.hire-ask__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--hire-gap-sm);
		margin-top: 0.5rem;
	}

	.hire-ask__cta {
		display: inline-flex;
		align-items: center;
		padding: 0.85rem 1.25rem;
		border: 1px solid var(--hire-border);
		background: var(--hire-surface);
		color: var(--hire-accent);
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		letter-spacing: 0.08em;
		transition: background 0.2s ease, border-color 0.2s ease;
	}

	.hire-ask__cta:hover {
		background: var(--hire-accent);
		color: var(--color-bg, #fff);
		border-color: var(--hire-accent);
	}

	.hire-ask__cta--primary {
		background: var(--hire-accent);
		color: var(--color-bg, #fff);
		border-color: var(--hire-accent);
	}

	.hire-ask__cta--primary:hover {
		background: var(--hire-muted);
		border-color: var(--hire-muted);
	}

	/* --- FOOTER --- */
	.hire-footer {
		padding-top: var(--hire-gap-lg);
	}

	.hire-footer__text {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		color: var(--hire-subtle);
		line-height: 1.6;
		max-width: 60ch;
		letter-spacing: 0.06em;
	}

	/* === RESPONSIVE === */
	@media (min-width: 768px) {
		.hire-pillars__grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.hire-matrix__row {
			grid-template-columns: minmax(12rem, 0.4fr) 1fr;
			gap: var(--hire-gap-md);
			align-items: start;
		}

		.hire-matrix__roles {
			grid-column: 2;
		}
	}

	@media (min-width: 1024px) {
		.hire-pillars__grid {
			grid-template-columns: repeat(4, 1fr);
		}

		.hire-batch__roles {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1400px) {
		.hire-batch__roles {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
