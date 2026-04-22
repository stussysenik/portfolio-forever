<script lang="ts">
	import { onMount } from "svelte";
	import { hireData } from "$lib/data/hire";
	import type { HireData } from "$lib/data/hire";

	const d: HireData = hireData;
	const sectionIds = ["hero", "works", "pillars", "tracks", "roles", "status"];

	let visible = $state(new Set<string>());

	onMount(() => {
		const root = document.querySelector(".hire") as HTMLElement;
		if (!root) return;

		if (!window.IntersectionObserver) {
			sectionIds.forEach((id) => visible.add(id));
			return;
		}

		const obs = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) visible.add(e.target.id);
				}
			},
			{ threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
		);

		sectionIds.forEach((id) => {
			const el = root.querySelector(`#${id}`);
			if (el) obs.observe(el);
		});

		return () => obs.disconnect();
	});
</script>

<div class="hire">
	<section class="hire-hero hire-reveal" id="hero" class:hire-reveal--visible={visible.has("hero")}>
		<p class="hire-availability">
			<span class="hire-dot"></span>
			Available now · NYC · US Citizen
		</p>
		<h1 class="hire-name">
			{#each d.hero.name as line}
				<span class="hire-name__line">{line}</span>
			{/each}
		</h1>
		<p class="hire-title">{d.hero.title}</p>
		<p class="hire-statement">{d.hero.statement}</p>
		<nav class="hire-links">
			{#each d.links as link}
				<a href={link.href} class="hire-link">{link.label}</a>
			{/each}
		</nav>
	</section>

	<section class="hire-reveal" id="works" class:hire-reveal--visible={visible.has("works")}>
		<p class="hire-label">Work</p>
		<div class="hire-works">
			{#each d.works as work}
				<a href={work.href} class="hire-work">
					<div class="hire-work__frame">
						<img src={work.preview} alt={work.title} loading="lazy" />
					</div>
					<span class="hire-work__title">{work.title}</span>
				</a>
			{/each}
		</div>
	</section>

	<section class="hire-reveal" id="pillars" class:hire-reveal--visible={visible.has("pillars")}>
		<p class="hire-label">Proof</p>
		<div class="hire-pillars">
			{#each d.pillars as pillar}
				<div class="hire-pillar">
					<h3 class="hire-pillar__title">{pillar.title}</h3>
					<p class="hire-pillar__detail">{pillar.detail}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="hire-reveal" id="tracks" class:hire-reveal--visible={visible.has("tracks")}>
		<p class="hire-label">Fit</p>
		<dl class="hire-tracks">
			{#each d.tracks as track}
				<div class="hire-track">
					<dt class="hire-track__label">{track.label}</dt>
					<dd class="hire-track__summary">{track.summary}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section class="hire-reveal" id="roles" class:hire-reveal--visible={visible.has("roles")}>
		<p class="hire-label">History</p>
		<ol class="hire-roles">
			{#each d.roles as role}
				<li class="hire-role">
					<p class="hire-role__title">{role.title}</p>
					<p class="hire-role__meta">{role.org} · {role.period}</p>
					<p class="hire-role__highlight">{role.highlight}</p>
				</li>
			{/each}
		</ol>
	</section>

	<section class="hire-reveal" id="status" class:hire-reveal--visible={visible.has("status")}>
		<p class="hire-label">Status</p>
		<p class="hire-status">{d.status}</p>
		<p class="hire-targets">{d.targets.join(" · ")}</p>
		<div class="hire-cta">
			<a href={d.contact.href} class="hire-cta__button">{d.contact.label}</a>
		</div>
	</section>
</div>

<style>
	.hire {
		--ink: #0f172a;
		--ink-2: #475569;
		--ink-3: #94a3b8;
		--hair: rgba(15, 23, 42, 0.12);
		--accent: #2563eb;
		--accent-light: rgba(37, 99, 235, 0.08);
		--max-read: clamp(20rem, 52cqi, 42rem);
		--max-spread: clamp(20rem, 90cqi, 72rem);
		--gap-section: clamp(2.5rem, 6vh + 1rem, 6rem);
		container-type: inline-size;
		container-name: hire;
	}

	.hire-reveal {
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 500ms cubic-bezier(0.23, 1, 0.32, 1),
			transform 500ms cubic-bezier(0.23, 1, 0.32, 1);
	}
	.hire-reveal--visible {
		opacity: 1;
		transform: translateY(0);
	}
	@media (prefers-reduced-motion: reduce) {
		.hire-reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}

	.hire-hero {
		display: grid;
		gap: clamp(1rem, 2cqi, 2rem);
		padding-block-start: var(--gap-section);
		padding-block-end: var(--gap-section);
		max-width: var(--max-read);
	}

	.hire-availability {
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: clamp(0.68rem, 0.8cqi, 0.75rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
	}

	.hire-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #10b981;
		box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
		flex-shrink: 0;
	}

	.hire-name {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 10cqi, 8.5rem);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		text-transform: uppercase;
		color: var(--ink);
	}
	.hire-name__line {
		display: block;
	}

	.hire-title {
		margin: 0;
		font-size: clamp(1.1rem, 1.8cqi, 1.6rem);
		font-weight: 500;
		color: var(--ink);
		letter-spacing: -0.01em;
	}

	.hire-statement {
		margin: 0;
		font-size: clamp(0.95rem, 1.2cqi, 1.1rem);
		line-height: 1.55;
		color: var(--ink-2);
		max-width: 42ch;
	}

	.hire-links {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(0.6rem, 1.2cqi, 1.2rem);
	}
	.hire-link {
		font-family: var(--font-mono);
		font-size: clamp(0.72rem, 0.85cqi, 0.82rem);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink);
		text-decoration: none;
		position: relative;
		padding-block-end: 2px;
		border-bottom: 1px solid var(--hair);
		transition: border-color 180ms ease;
	}
	@media (hover: hover) and (pointer: fine) {
		.hire-link:hover {
			border-color: var(--accent);
		}
	}

	.hire > :not(.hire-hero) {
		padding-block: var(--gap-section);
		border-top: 1px solid var(--hair);
	}

	.hire-label {
		margin: 0;
		margin-block-end: clamp(1rem, 2.5cqi, 2rem);
		font-family: var(--font-mono);
		font-size: clamp(0.62rem, 0.72cqi, 0.7rem);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	.hire-works {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
		gap: clamp(0.6rem, 1.2cqi, 1.2rem);
		max-width: var(--max-spread);
	}
	.hire-work {
		display: grid;
		gap: 0.35rem;
		text-decoration: none;
		color: var(--ink);
		transition: transform 180ms ease;
	}
	@media (hover: hover) and (pointer: fine) {
		.hire-work:hover {
			transform: translateY(-2px);
		}
	}
	.hire-work__frame {
		position: relative;
		overflow: hidden;
		border-radius: 3px;
		background: color-mix(in srgb, var(--ink) 3%, white);
		aspect-ratio: 16 / 10;
	}
	.hire-work__frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
	}
	@media (hover: hover) and (pointer: fine) {
		.hire-work:hover .hire-work__frame img {
			transform: scale(1.03);
		}
	}
	.hire-work__title {
		font-size: clamp(0.72rem, 0.82cqi, 0.82rem);
		color: var(--ink-2);
		letter-spacing: 0.01em;
	}

	.hire-pillars {
		display: grid;
		gap: clamp(1.2rem, 2.5cqi, 2.5rem);
		max-width: var(--max-read);
	}
	.hire-pillar {
		display: grid;
		gap: var(--space-xs);
	}
	.hire-pillar__title {
		margin: 0;
		font-size: clamp(1rem, 1.5cqi, 1.3rem);
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.01em;
	}
	.hire-pillar__detail {
		margin: 0;
		font-size: clamp(0.85rem, 1cqi, 0.98rem);
		line-height: 1.55;
		color: var(--ink-2);
		max-width: 54ch;
	}

	.hire-tracks {
		display: grid;
		gap: clamp(0.8rem, 1.8cqi, 1.5rem);
		margin: 0;
		max-width: var(--max-read);
	}
	.hire-track {
		display: grid;
		gap: var(--space-2xs);
	}
	.hire-track__label {
		font-size: clamp(0.88rem, 1.1cqi, 1.05rem);
		font-weight: 600;
		color: var(--ink);
	}
	.hire-track__summary {
		margin: 0;
		font-size: clamp(0.82rem, 0.95cqi, 0.92rem);
		line-height: 1.5;
		color: var(--ink-2);
		max-width: 54ch;
	}

	.hire-roles {
		display: grid;
		gap: clamp(1rem, 2cqi, 1.8rem);
		margin: 0;
		padding: 0;
		list-style: none;
		max-width: var(--max-read);
	}
	.hire-role {
		display: grid;
		gap: var(--space-2xs);
	}
	.hire-role__title {
		margin: 0;
		font-size: clamp(0.88rem, 1.1cqi, 1.05rem);
		font-weight: 600;
		color: var(--ink);
	}
	.hire-role__meta {
		margin: 0;
		font-family: var(--font-mono);
		font-size: clamp(0.68rem, 0.78cqi, 0.74rem);
		color: var(--ink-3);
		letter-spacing: 0.02em;
	}
	.hire-role__highlight {
		margin: 0;
		font-size: clamp(0.82rem, 0.95cqi, 0.92rem);
		line-height: 1.45;
		color: var(--ink-2);
		max-width: 56ch;
	}

	.hire-status {
		margin: 0;
		margin-block-end: 0.5rem;
		font-size: clamp(1rem, 1.3cqi, 1.2rem);
		font-weight: 500;
		color: var(--ink);
		line-height: 1.45;
		max-width: 42ch;
	}
	.hire-targets {
		margin: 0;
		margin-block-end: clamp(1.2rem, 2.5cqi, 2rem);
		font-family: var(--font-mono);
		font-size: clamp(0.62rem, 0.72cqi, 0.7rem);
		letter-spacing: 0.04em;
		color: var(--ink-3);
		line-height: 1.7;
		max-width: var(--max-spread);
	}

	.hire-cta {
		margin-block-start: clamp(0.5rem, 1cqi, 1rem);
	}
	.hire-cta__button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: clamp(0.7rem, 1cqi, 0.9rem) clamp(1.4rem, 2cqi, 2rem);
		font-family: var(--font-mono);
		font-size: clamp(0.72rem, 0.85cqi, 0.82rem);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: white;
		background: var(--ink);
		text-decoration: none;
		border-radius: 2px;
		transition: background 180ms ease, transform 180ms ease;
	}
	@media (hover: hover) and (pointer: fine) {
		.hire-cta__button:hover {
			background: var(--accent);
			transform: translateY(-1px);
		}
	}
</style>