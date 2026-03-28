<script lang="ts">
  import { cvData, type CVEntry } from '$lib/data/cv';
  import { tools, /* skills, */ type Tool } from '$lib/data/content';

  function formatDateRange(start: string, end?: string): string {
    const startDate = new Date(start);
    const startStr = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    if (!end) return startStr;
    if (end === 'present') return `${startStr} → present`;

    const endDate = new Date(end);
    const endStr = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    return `${startStr} → ${endStr}`;
  }

  /* function getProficiencyBar(proficiency: number): string {
    const filled = Math.round(proficiency * 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  } */

  // Group entries by type
  const experience = cvData.workExperience;
  const education = cvData.education;

  /* // Group skills by category
  const designSkills = skills.filter(s => s.category === 'design');
  const techSkills = skills.filter(s => s.category === 'technology');
  const artSkills = skills.filter(s => s.category === 'art'); */

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
  <title>CV | {cvData.name}</title>
  <meta name="description" content="Professional experience and background of {cvData.name}" />
  {@html `<script type="application/ld+json">${JSON.stringify(cvData)}</script>`}
</svelte:head>

<div class="cv-container">
  <!-- Header / Identity -->
  <header class="cv-header">
    <h1 class="cv-name">{cvData.name}</h1>
    <p class="cv-title">{cvData.jobTitle}</p>
    <p class="cv-location">NYC / Prague · itsmxzou@gmail.com</p>
    <div class="cv-domains">
      <span class="cv-domain-item"><a href="https://stussysenik.com" target="_blank" rel="noopener noreferrer">stussysenik.com</a> <span class="cv-domain-desc">— dev + creative</span></span>
      <span class="cv-domain-item"><a href="https://mengxuanzou.com" target="_blank" rel="noopener noreferrer">mengxuanzou.com</a> <span class="cv-domain-desc">— filmmaking</span></span>
      <span class="cv-domain-item"><a href="https://mxzou.com" target="_blank" rel="noopener noreferrer">mxzou.com</a> <span class="cv-domain-desc">— main</span></span>
    </div>
  </header>

  <!-- Summary -->
  <section class="cv-section">
    <h2 class="cv-section-title">◆ SUMMARY</h2>
    <p class="cv-summary">{cvData.summary}</p>
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

  <!-- ARCHIVED: Disciplines / Skills
  <section class="cv-section">
    <h2 class="cv-section-title">◆ DISCIPLINES</h2>
    <div class="skills-grouped">
      <div class="skill-group">
        <span class="skill-group-label badge--design">Design</span>
        <div class="skills-grid">
          {#each designSkills as skill}
            <div class="skill-row">
              <span class="skill-name">{skill.name}</span>
              <span class="skill-bar">{getProficiencyBar(skill.proficiency)}</span>
            </div>
          {/each}
        </div>
      </div>
      <div class="skill-group">
        <span class="skill-group-label badge--technology">Tech</span>
        <div class="skills-grid">
          {#each techSkills as skill}
            <div class="skill-row">
              <span class="skill-name">{skill.name}</span>
              <span class="skill-bar">{getProficiencyBar(skill.proficiency)}</span>
            </div>
          {/each}
        </div>
      </div>
      <div class="skill-group">
        <span class="skill-group-label badge--art">Art</span>
        <div class="skills-grid">
          {#each artSkills as skill}
            <div class="skill-row">
              <span class="skill-name">{skill.name}</span>
              <span class="skill-bar">{getProficiencyBar(skill.proficiency)}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
  -->

  <!-- Languages -->
  <section class="cv-section">
    <h2 class="cv-section-title">◆ LANGUAGES</h2>
    <div class="languages-grid">
      {#each cvData.languages as lang}
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

  /* Skills Grouped */
  .skills-grouped {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .skill-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .skill-group-label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wider);
    padding: var(--space-2xs) var(--space-sm);
    border-radius: var(--radius-sm);
    width: fit-content;
  }

  .skill-group-label.badge--design {
    background: hsl(330, 70%, 95%);
    color: var(--color-design);
  }

  .skill-group-label.badge--technology {
    background: hsl(210, 80%, 95%);
    color: var(--color-technology);
  }

  .skill-group-label.badge--art {
    background: hsl(45, 90%, 92%);
    color: hsl(35, 80%, 35%);
  }

  /* Skills Grid */
  .skills-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .skill-row {
    display: grid;
    grid-template-columns: 1fr auto; /* third column (percentage) hidden */
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

    .skill-bar {
      font-size: 8pt;
      color: #333;
    }

    .skill-name {
      color: #000;
    }

    .skill-value {
      color: #555;
    }

    .tool-tag {
      border: 1px solid #ddd;
      background: transparent;
      color: #333 !important;
    }

    .skill-group-label {
      background: transparent !important;
      border: 1px solid currentColor;
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

    .skill-row {
      grid-template-columns: 1fr auto;
    }
    .skill-bar {
      display: none;
    }
  }

  /* Dark mode adjustments for skill group labels — scoped to darkroom theme */
  :global([data-theme="darkroom"]) .skill-group-label.badge--design {
    background: hsl(330, 50%, 15%);
  }
  :global([data-theme="darkroom"]) .skill-group-label.badge--technology {
    background: hsl(210, 60%, 15%);
  }
  :global([data-theme="darkroom"]) .skill-group-label.badge--art {
    background: hsl(45, 60%, 15%);
    color: var(--color-art);
  }
</style>
