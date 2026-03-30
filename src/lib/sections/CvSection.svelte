<script lang="ts">
  import { onMount } from 'svelte';
  import { cvData as staticCvData } from '$lib/data/cv';
  import { tools, type Tool } from '$lib/data/content';
  import { getConvexClient } from '$lib/convex';
  import { api } from '$convex/_generated/api';

  export let id = "cv";

  // State: start with static data, replace with Convex data when loaded
  let profile = { name: staticCvData.name, jobTitle: staticCvData.jobTitle, summary: staticCvData.summary };
  let experience: any[] = staticCvData.workExperience;
  let education: any[] = staticCvData.education;
  let languages: any[] = staticCvData.languages;

  onMount(() => {
    const client = getConvexClient();
    const unsubscribe = client.onUpdate(api.cv.getVisibleCV, {}, (data) => {
      if (data) {
        if (data.profile) {
          profile = data.profile;
        }
        experience = data.entries.filter((e: any) => e.type === 'work');
        education = data.entries.filter((e: any) => e.type === 'education');
        languages = data.languages;
      }
    });
    return () => unsubscribe();
  });

  function formatDateRange(start: string, end?: string): string {
    const startDate = new Date(start);
    const startStr = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    if (!end) return startStr;
    if (end === 'present') return `${startStr} → present`;

    const endDate = new Date(end);
    const endStr = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    return `${startStr} → ${endStr}`;
  }

  // Group tools by category
  const toolsByCategory: Record<string, Tool[]> = {
    software: tools.filter(t => t.category === 'software'),
    language: tools.filter(t => t.category === 'language'),
    framework: tools.filter(t => t.category === 'framework'),
    hardware: tools.filter(t => t.category === 'hardware'),
  };

  function expertiseColor(expertise: Tool['expertise']): string {
    switch (expertise) {
      case 'master': return 'var(--color-accent)';
      case 'expert': return 'var(--color-text)';
      case 'proficient': return 'var(--color-text-secondary)';
      case 'learning': return 'var(--color-text-subtle)';
      default: return 'var(--color-text-muted)';
    }
  }
</script>

<svelte:head>
  <title>CV | {profile.name}</title>
  <meta name="description" content="Professional experience and background of {profile.name}" />
</svelte:head>

<div class="cv-container" {id}>
  <!-- Header / Identity -->
  <header class="cv-header">
    <div class="cv-header-top">
      <div>
        <h1 class="cv-name">{profile.name}</h1>
        <p class="cv-title">{profile.jobTitle}</p>
        <p class="cv-location">NYC / Prague · itsmxzou@gmail.com</p>
      </div>
      <button class="cv-download-btn" on:click={() => window.print()} aria-label="Download CV as PDF">
        Download PDF
      </button>
    </div>
    <div class="cv-domains">
      <span class="cv-domain-item"><a href="https://stussysenik.com" target="_blank" rel="noopener noreferrer">stussysenik.com</a> <span class="cv-domain-desc">— dev + creative</span></span>
      <span class="cv-domain-item"><a href="https://mengxuanzou.com" target="_blank" rel="noopener noreferrer">mengxuanzou.com</a> <span class="cv-domain-desc">— filmmaking</span></span>
      <span class="cv-domain-item"><a href="https://mxzou.com" target="_blank" rel="noopener noreferrer">mxzou.com</a> <span class="cv-domain-desc">— main</span></span>
    </div>
  </header>

  <!-- Summary -->
  <section class="cv-section">
    <h2 class="cv-section-title">◆ SUMMARY</h2>
    <p class="cv-summary">{profile.summary}</p>
  </section>

  <!-- Work Experience -->
  <section class="cv-section">
    <h2 class="cv-section-title">
      ◆ EXPERIENCE
      <span class="cv-section-count">{experience.length} positions</span>
    </h2>
    <ul class="timeline">
      {#each experience as entry}
        <li class="timeline-entry">
          <div class="timeline-header">
            <span class="timeline-date">{formatDateRange(entry.startDate, entry.endDate)}</span>
            <span class="timeline-dot">●</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">{entry.title}</h3>
            <p class="timeline-org">{entry.organization}</p>
            {#if entry.location}
              <p class="timeline-location">↳ {entry.location}</p>
            {/if}
            {#if entry.description}
              <p class="timeline-description">{entry.description}</p>
            {/if}
            {#if entry.highlights && entry.highlights.length > 0}
              <ul class="timeline-highlights">
                {#each entry.highlights as highlight}
                  <li>→ {highlight}</li>
                {/each}
              </ul>
            {/if}
            {#if entry.tools && entry.tools.length > 0}
              <div class="timeline-tools">
                {#each entry.tools as tool}
                  <span class="tool-tag">{tool}</span>
                {/each}
              </div>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <!-- Education -->
  <section class="cv-section">
    <h2 class="cv-section-title">
      ◆ EDUCATION
      <span class="cv-section-count">{education.length} schools</span>
    </h2>
    <ul class="timeline">
      {#each education as entry}
        <li class="timeline-entry">
          <div class="timeline-header">
            <span class="timeline-date">{formatDateRange(entry.startDate, entry.endDate)}</span>
            <span class="timeline-dot">○</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">{entry.title}</h3>
            <p class="timeline-org">{entry.organization}</p>
            {#if entry.location}
              <p class="timeline-location">↳ {entry.location}</p>
            {/if}
            {#if entry.description}
              <p class="timeline-description">{entry.description}</p>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <!-- Languages -->
  <section class="cv-section">
    <h2 class="cv-section-title">◆ LANGUAGES</h2>
    <div class="languages-grid">
      {#each languages as lang}
        <div class="language-item">
          <span class="language-name">{lang.name}</span>
          <span class="language-level">{lang.level}</span>
        </div>
      {/each}
    </div>
  </section>

  <!-- Tools & Technologies -->
  <section class="cv-section">
    <h2 class="cv-section-title">◆ TOOLS & TECHNOLOGIES</h2>
    <div class="tools-grouped">
      {#each Object.entries(toolsByCategory) as [category, categoryTools]}
        <div class="tool-group">
          <span class="tool-group-label">{category}</span>
          <div class="tool-group-items">
            {#each categoryTools as tool}
              <span class="tool-tag" style="color: {expertiseColor(tool.expertise)}">
                {tool.name}
              </span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Footer / Download -->
  <footer class="cv-footer">
    <a href="/data/cv.jsonld" download class="cv-download">↓ Download JSON-LD</a>
    <a href="mailto:itsmxzou@gmail.com?subject=Full%20CV%20Request" class="cv-request">Request full CV</a>
  </footer>
</div>

<style>
  .cv-container {
    max-width: 900px;
    margin: 0 auto;
    padding-top: var(--space-lg);
  }

  /* Header */
  .cv-header {
    margin-bottom: var(--space-2xl);
    padding-bottom: var(--space-lg);
    border-bottom: 2px solid var(--border-color);
  }

  .cv-header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .cv-download-btn {
    padding: 8px 20px;
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-bg);
    background: var(--color-accent);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    white-space: nowrap;
    transition: opacity var(--duration-fast) var(--easing);
  }

  .cv-download-btn:hover {
    opacity: 0.85;
  }

  @media print {
    .cv-download-btn { display: none; }
  }

  .cv-name {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: var(--space-xs);
  }

  .cv-title {
    font-size: var(--font-size-base);
    color: var(--color-text-muted);
    margin-bottom: var(--space-xs);
  }

  .cv-location {
    font-size: var(--font-size-sm);
    color: var(--color-text-subtle);
    margin-bottom: var(--space-md);
  }

  /* Domains */
  .cv-domains {
    display: flex;
    gap: var(--space-lg);
    flex-wrap: wrap;
    margin-top: var(--space-sm);
  }

  .cv-domain-item {
    font-size: var(--font-size-xs);
  }

  .cv-domain-item a {
    color: var(--color-accent);
    font-weight: 450;
  }

  .cv-domain-desc {
    color: var(--color-text-subtle);
  }

  /* Summary */
  .cv-summary {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    max-width: 65ch;
  }

  /* Sections */
  .cv-section {
    margin-bottom: var(--space-xl); /* was --space-2xl (48px), now 32px */
  }

  .cv-section-title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--color-text-subtle);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: var(--border-width) solid var(--border-color);
    display: flex;
    align-items: baseline;
    gap: var(--space-md);
  }

  .cv-section-count {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    margin-left: auto;
    font-weight: 400;
  }

  /* Languages */
  .languages-grid {
    display: flex;
    gap: var(--space-xl);
    flex-wrap: wrap;
  }

  .language-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .language-name {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--color-text);
  }

  .language-level {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  /* Tools Grouped */
  .tools-grouped {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .tool-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .tool-group-label {
    font-size: var(--font-size-xs);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wider);
    color: var(--color-text-subtle);
  }

  .tool-group-items {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  /* Timeline */
  .timeline {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .timeline-entry {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: var(--space-lg);
  }

  /* Tablet breakpoint — collapse timeline earlier */
  @media (max-width: 768px) {
    .timeline-entry {
      grid-template-columns: 1fr;
      gap: var(--space-sm);
    }
  }

  .timeline-header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .timeline-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .timeline-dot {
    color: var(--color-accent);
    font-size: var(--font-size-xs);
    line-height: 1.6;
  }

  .timeline-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .timeline-title {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--color-text);
  }

  .timeline-org {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .timeline-location {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  .timeline-description {
    font-size: var(--font-size-sm);
    color: var(--color-text);
    margin-top: var(--space-xs);
  }

  .timeline-highlights {
    list-style: none;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .timeline-highlights li {
    padding: var(--space-xs) 0;
  }

  .timeline-tools {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-sm);
  }

  .tool-tag {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    background: var(--color-surface);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
  }

  /* Footer */
  .cv-footer {
    margin-top: var(--space-2xl);
    padding-top: var(--space-lg);
    border-top: var(--border-width) solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .cv-download {
    font-size: var(--font-size-xs);
    color: var(--color-accent);
  }

  .cv-request {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-lg);
    background: var(--color-text);
    color: var(--color-bg);
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-radius: var(--radius-sm);
    text-decoration: none;
    transition: opacity var(--duration-fast);
  }

  .cv-request:hover {
    opacity: 0.85;
    color: var(--color-bg);
  }

  /* Print Stylesheet */
  @media print {
    .cv-container {
      max-width: 100%;
      font-size: 11pt;
    }

    .cv-header {
      border-bottom: 2px solid #000;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
    }

    .cv-name {
      font-size: 18pt;
      color: #000;
    }

    .cv-title {
      font-size: 11pt;
      color: #333;
    }

    .cv-location {
      color: #555;
    }

    .cv-domain-item a {
      color: #000;
      text-decoration: underline;
    }

    .cv-domain-desc {
      color: #666;
    }

    .cv-section {
      margin-bottom: 1rem;
      break-inside: avoid;
    }

    .cv-section-title {
      font-size: 10pt;
      color: #000;
      border-bottom: 1px solid #ccc;
    }

    .cv-summary {
      color: #333;
    }

    .cv-footer {
      display: none;
    }

    .timeline-entry {
      grid-template-columns: 140px 1fr;
      gap: 0.5rem;
      break-inside: avoid;
    }

    .timeline-title {
      color: #000;
    }

    .timeline-org {
      color: #333;
    }

    .timeline-description {
      color: #333;
    }

    .timeline-highlights {
      color: #555;
    }

    .tool-tag {
      border: 1px solid #ddd;
      background: transparent;
      color: #333 !important;
    }

    .language-name {
      color: #000;
    }

    .language-level {
      color: #555;
    }

    /* Force light background for print */
    * {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    @page {
      margin: 1.5cm 2cm;
    }
  }

  /* Mobile CV adjustments */
  @media (max-width: 600px) {
    .cv-domains {
      flex-direction: column;
      gap: var(--space-xs);
    }

    .cv-header {
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-sm);
    }

    .cv-name {
      font-size: var(--font-size-xl);
    }

  }
</style>
