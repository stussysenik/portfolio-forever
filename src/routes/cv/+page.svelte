<script lang="ts">
  import { cvData, type CVEntry } from '$lib/data/cv';

  function formatDateRange(start: string, end?: string): string {
    const startDate = new Date(start);
    const startStr = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (!end) return startStr;
    if (end === 'present') return `${startStr} → present`;
    
    const endDate = new Date(end);
    const endStr = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    return `${startStr} → ${endStr}`;
  }

  function getProficiencyBar(proficiency: number): string {
    const filled = Math.round(proficiency * 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  // Group entries by type
  const experience = cvData.workExperience;
  const education = cvData.education;
  const awards = cvData.awards;
</script>

<svelte:head>
  <title>CV | {cvData.name}</title>
  <meta name="description" content="Professional experience and background of {cvData.name}" />
  <!-- JSON-LD for structured data -->
  {@html `<script type="application/ld+json">${JSON.stringify(cvData)}</script>`}
</svelte:head>

<div class="cv-container">
  <!-- Header / Identity -->
  <header class="cv-header">
    <h1 class="cv-name">{cvData.name}</h1>
    <p class="cv-title">{cvData.jobTitle}</p>
    <div class="cv-links">
      {#each cvData.sameAs as link}
        <a href={link} target="_blank" rel="noopener noreferrer" class="cv-link">
          {link.replace('https://', '').split('/')[0]}
        </a>
      {/each}
    </div>
  </header>

  <!-- Skills / Proficiencies -->
  <section class="cv-section">
    <h2 class="cv-section-title">◆ DISCIPLINES</h2>
    <div class="skills-grid">
      {#each cvData.knowsAbout as skill}
        <div class="skill-row">
          <span class="skill-name">{skill.name}</span>
          <span class="skill-bar">{getProficiencyBar(skill.proficiency)}</span>
          <span class="skill-value">{Math.round(skill.proficiency * 100)}%</span>
        </div>
      {/each}
    </div>
  </section>

  <!-- Work Experience -->
  <section class="cv-section">
    <h2 class="cv-section-title">◆ EXPERIENCE</h2>
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
    <h2 class="cv-section-title">◆ EDUCATION</h2>
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

  <!-- Awards -->
  <section class="cv-section">
    <h2 class="cv-section-title">◆ RECOGNITION</h2>
    <ul class="awards-list">
      {#each awards as award}
        <li class="award-entry">
          <span class="award-date">{new Date(award.startDate).getFullYear()}</span>
          <span class="award-title">{award.title}</span>
          <span class="award-org">— {award.organization}</span>
        </li>
      {/each}
    </ul>
  </section>

  <!-- Footer / Download -->
  <footer class="cv-footer">
    <!-- <span class="cv-footer-text">[ Generated from structured data ]</span> -->
    <a href="/data/cv.jsonld" download class="cv-download">↓ Download JSON</a> <!-- LD? -->
  </footer>
</div>

<style>
  .cv-container {
    max-width: 900px;
    margin: 0 auto;
  }

  /* Header */
  .cv-header {
    margin-bottom: var(--space-2xl);
    padding-bottom: var(--space-lg);
    border-bottom: 2px solid var(--border-color);
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
    margin-bottom: var(--space-md);
  }

  .cv-links {
    display: flex;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .cv-link {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    text-transform: lowercase;
  }

  .cv-link:hover {
    color: var(--color-accent);
  }

  /* Sections */
  .cv-section {
    margin-bottom: var(--space-2xl);
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
  }

  /* Skills Grid */
  .skills-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .skill-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: var(--space-md);
    align-items: center;
    font-size: var(--font-size-sm);
    padding: var(--space-xs) 0;
  }

  .skill-name {
    color: var(--color-text);
  }

  .skill-bar {
    font-size: var(--font-size-xs);
    color: var(--color-accent);
    letter-spacing: -0.1em;
  }

  .skill-value {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    min-width: 3ch;
    text-align: right;
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

  @media (max-width: 700px) {
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

  /* Awards */
  .awards-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .award-entry {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    font-size: var(--font-size-sm);
    padding: var(--space-xs) 0;
  }

  .award-date {
    color: var(--color-text-muted);
    min-width: 4ch;
    font-variant-numeric: tabular-nums;
  }

  .award-title {
    color: var(--color-text);
    font-weight: 450;
  }

  .award-org {
    color: var(--color-text-subtle);
    font-size: var(--font-size-xs);
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

  .cv-footer-text {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  .cv-download {
    font-size: var(--font-size-xs);
    color: var(--color-accent);
  }
</style>
