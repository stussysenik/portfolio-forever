<script lang="ts">
	import { onMount } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';

	export let id = "cv";

	let profile: any = null;
	let entries: any[] = [];
	let languages: any[] = [];
	let sections: any[] = [];

	$: sortedSections = [...sections].sort((a, b) => a.order - b.order).filter((s) => s.visible);

	function getEntriesForType(type: string): any[] {
		return entries
			.filter((e) => e.type === type && e.visible)
			.sort((a, b) => a.order - b.order);
	}

	function formatDateRange(start: string, end?: string): string {
		const fmt = (d: string) => {
			const date = new Date(d);
			return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
		};
		return end ? `${fmt(start)} — ${fmt(end)}` : `${fmt(start)} — Present`;
	}

	onMount(() => {
		const client = getConvexClient();
		const unsub = client.onUpdate(api.cv.getVisibleCV, {}, (data: any) => {
			if (data) {
				profile = data.profile ?? null;
				entries = data.entries ?? [];
				languages = data.languages ?? [];
				sections = data.sections ?? [];
			}
		});
		return () => unsub();
	});
</script>

<svelte:head>
	<title>CV | {profile?.name ?? 'Curriculum Vitae'}</title>
	<meta name="description" content="Curriculum Vitae — {profile?.jobTitle ?? 'Design Engineer'}" />
</svelte:head>

<section class="cv-wrapper" {id}>
	{#if profile}
		<header class="cv-header">
			<h1 class="cv-name">{profile.name}</h1>
			<p class="cv-title">{profile.jobTitle}</p>
			{#if profile.summary}
				<p class="cv-summary">{profile.summary}</p>
			{/if}
			<div class="cv-meta">
				{#if profile.location}<span class="cv-meta-item">{profile.location}</span>{/if}
				{#if profile.email}<span class="cv-meta-item"><a href="mailto:{profile.email}">{profile.email}</a></span>{/if}
				{#if profile.url}<span class="cv-meta-item"><a href={profile.url} target="_blank" rel="noopener">{profile.url}</a></span>{/if}
			</div>
		</header>
	{/if}

	{#each sortedSections as sec (sec._id)}
		{@const sectionEntries = getEntriesForType(sec.type)}
		{#if sectionEntries.length > 0}
			<div class="cv-section">
				<h2 class="cv-section-title">{sec.name}</h2>
				{#each sectionEntries as entry (entry._id)}
					<div class="cv-entry">
						<div class="cv-entry-header">
							<h3 class="cv-entry-title">
								{#if entry.url}
									<a href={entry.url} target="_blank" rel="noopener">{entry.title}</a>
								{:else}
									{entry.title}
								{/if}
							</h3>
							<span class="cv-entry-dates">{formatDateRange(entry.startDate, entry.endDate)}</span>
						</div>
						{#if entry.organization || entry.location}
							<div class="cv-entry-org">
								{#if entry.organization}<span>{entry.organization}</span>{/if}
								{#if entry.location}<span class="cv-entry-location">{entry.location}</span>{/if}
							</div>
						{/if}
						{#if entry.description}
							<p class="cv-entry-description">{entry.description}</p>
						{/if}
						{#if entry.highlights && entry.highlights.length > 0}
							<ul class="cv-entry-highlights">
								{#each entry.highlights as hl}
									<li>{hl}</li>
								{/each}
							</ul>
						{/if}
						{#if entry.tools && entry.tools.length > 0}
							<div class="cv-entry-tools">
								{#each entry.tools as tool}
									<span class="cv-tool-tag">{tool}</span>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/each}

	{#if languages.length > 0}
		<div class="cv-section">
			<h2 class="cv-section-title">Languages</h2>
			<div class="cv-languages">
				{#each languages.filter(l => l.visible).sort((a, b) => a.order - b.order) as lang (lang._id)}
					<span class="cv-lang">{lang.name} <span class="cv-lang-level">({lang.level})</span></span>
				{/each}
			</div>
		</div>
	{/if}

	{#if profile?.knowsAbout && profile.knowsAbout.length > 0}
		<div class="cv-section">
			<h2 class="cv-section-title">Skills</h2>
			<div class="cv-skills">
				{#each profile.knowsAbout as skill}
					<span class="cv-skill-tag">{skill.name}</span>
				{/each}
			</div>
		</div>
	{/if}

	<footer class="cv-footer">
		<a href="/data/cv.pdf" download class="cv-download">Download PDF version</a>
	</footer>
</section>

<style>
	.cv-wrapper {
		max-width: 800px;
		margin: 0 auto;
		padding: var(--space-xl) var(--space-md);
	}

	.cv-header {
		margin-bottom: var(--space-2xl);
		padding-bottom: var(--space-lg);
		border-bottom: 2px solid var(--border-color);
	}

	.cv-name {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		letter-spacing: var(--letter-spacing-tight);
		margin-bottom: var(--space-2xs);
	}

	.cv-title {
		font-size: var(--font-size-lg);
		color: var(--color-text-secondary);
		font-weight: 500;
		margin-bottom: var(--space-sm);
	}

	.cv-summary {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: var(--line-height-relaxed);
		max-width: 60ch;
	}

	.cv-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		margin-top: var(--space-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
	}

	.cv-meta a {
		color: var(--color-accent);
	}

	.cv-section {
		margin-bottom: var(--space-xl);
	}

	.cv-section-title {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
		color: var(--color-text);
		margin-bottom: var(--space-md);
		padding-bottom: var(--space-xs);
		border-bottom: var(--border-width) solid var(--border-color);
	}

	.cv-entry {
		margin-bottom: var(--space-lg);
	}

	.cv-entry-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.cv-entry-title {
		font-size: var(--font-size-base);
		font-weight: 600;
	}

	.cv-entry-title a {
		color: var(--color-text);
	}

	.cv-entry-title a:hover {
		color: var(--color-accent);
	}

	.cv-entry-dates {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.cv-entry-org {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-2xs);
		display: flex;
		gap: var(--space-sm);
	}

	.cv-entry-location {
		color: var(--color-text-subtle);
	}

	.cv-entry-location::before {
		content: "· ";
	}

	.cv-entry-description {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: var(--line-height-normal);
		margin-top: var(--space-xs);
	}

	.cv-entry-highlights {
		list-style: none;
		padding: 0;
		margin-top: var(--space-xs);
	}

	.cv-entry-highlights li {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: var(--line-height-normal);
		padding-left: var(--space-md);
		position: relative;
	}

	.cv-entry-highlights li::before {
		content: "—";
		position: absolute;
		left: 0;
		color: var(--color-text-subtle);
	}

	.cv-entry-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.cv-tool-tag {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-accent);
		border: var(--border-width) solid var(--color-accent);
		padding: 1px var(--space-xs);
		border-radius: var(--radius-sm);
	}

	.cv-languages {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
	}

	.cv-lang {
		font-size: var(--font-size-sm);
		color: var(--color-text);
	}

	.cv-lang-level {
		color: var(--color-text-subtle);
		font-size: var(--font-size-xs);
	}

	.cv-skills {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.cv-skill-tag {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		background: var(--color-surface);
		padding: var(--space-2xs) var(--space-sm);
		border-radius: var(--radius-sm);
	}

	.cv-footer {
		margin-top: var(--space-2xl);
		padding-top: var(--space-lg);
		border-top: var(--border-width) solid var(--border-color);
	}

	.cv-download {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-accent);
	}

	.cv-download:hover {
		text-decoration: underline;
	}
</style>
