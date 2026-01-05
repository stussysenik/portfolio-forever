<script lang="ts">
  import { labs, getStatusLabel, getStatusClass, checkAllFeatures, type LabExperiment } from '$lib/data/labs';
  import { onMount } from 'svelte';

  // Sort by date (newest first), then by status
  const sortedLabs = [...labs].sort((a, b) => {
    // Stable/beta first, then experimental, then archived
    const statusOrder = { stable: 0, beta: 1, experimental: 2, archived: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Feature support (will be populated on mount)
  let featureSupport: Record<string, { supported: boolean; missing: string[] }> = {};

  onMount(() => {
    for (const lab of labs) {
      featureSupport[lab.slug] = checkAllFeatures(lab.requiredFeatures);
    }
    featureSupport = featureSupport; // Trigger reactivity
  });

  function getFeatureIcon(feature: string): string {
    switch (feature) {
      case 'webgpu': return '◆';
      case 'webgl2': return '◇';
      case 'wasm': return '⬡';
      case 'shared-array-buffer': return '⟐';
      case 'audio-worklet': return '♪';
      default: return '○';
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  }
</script>

<svelte:head>
  <title>Labs | Experimental Projects</title>
  <meta name="description" content="Sandboxed WebGPU and WASM experiments - unstable, may break" />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="labs-container">
  <!-- Header -->
  <header class="labs-header">
    <div class="labs-title-row">
      <h1 class="labs-title">Laboratory</h1>
      <span class="labs-warning">⚠ EXPERIMENTAL</span>
    </div>
    <p class="labs-description">
      Sandboxed experiments with cutting-edge web APIs.
      <span class="labs-subtitle">Future-looking, unstable, may break.</span>
    </p>
  </header>

  <!-- Feature Legend -->
  <nav class="feature-legend" aria-label="Feature icons legend">
    <span class="legend-label">◆ LEGEND:</span>
    <div class="legend-items">
      <span class="legend-item"><span class="legend-icon">◆</span> WebGPU</span>
      <span class="legend-item"><span class="legend-icon">◇</span> WebGL2</span>
      <span class="legend-item"><span class="legend-icon">⬡</span> WASM</span>
      <span class="legend-item"><span class="legend-icon">⟐</span> SharedArrayBuffer</span>
      <span class="legend-item"><span class="legend-icon">♪</span> AudioWorklet</span>
    </div>
  </nav>

  <!-- Labs Grid -->
  <div class="labs-grid">
    {#each sortedLabs as lab (lab.slug)}
      {@const support = featureSupport[lab.slug] || { supported: true, missing: [] }}
      <article class="lab-card" class:unsupported={!support.supported}>
        <!-- Status Badge -->
        <div class="lab-status-row">
          <span class="lab-status {getStatusClass(lab.status)}">
            {getStatusLabel(lab.status)}
          </span>
          <span class="lab-date">{formatDate(lab.date)}</span>
        </div>

        <!-- Title -->
        <h2 class="lab-title">{lab.title}</h2>

        <!-- Description -->
        <p class="lab-description">{lab.description}</p>

        <!-- Required Features -->
        <div class="lab-features">
          <span class="features-label">Requires:</span>
          <div class="features-list">
            {#each lab.requiredFeatures as feature}
              <span 
                class="feature-badge"
                class:missing={support.missing.includes(feature)}
                title={feature}
              >
                {getFeatureIcon(feature)} {feature}
              </span>
            {/each}
          </div>
        </div>

        <!-- Memory Budget -->
        <div class="lab-memory">
          <span class="memory-label">Memory:</span>
          <span class="memory-value">{lab.memoryBudget}MB</span>
          <span class="memory-bar">
            {'█'.repeat(Math.min(Math.ceil(lab.memoryBudget / 50), 10))}{'░'.repeat(Math.max(10 - Math.ceil(lab.memoryBudget / 50), 0))}
          </span>
        </div>

        <!-- Tags -->
        <div class="lab-tags">
          {#each lab.tags as tag}
            <span class="lab-tag">#{tag}</span>
          {/each}
        </div>

        <!-- Actions -->
        <footer class="lab-actions">
          {#if support.supported}
            <a href="/labs/{lab.slug}" class="lab-launch">
              [ LAUNCH ] →
            </a>
          {:else}
            <span class="lab-unsupported-msg">
              ⚠ Missing: {support.missing.join(', ')}
            </span>
          {/if}
          
          {#if lab.sourceUrl}
            <a href={lab.sourceUrl} target="_blank" rel="noopener noreferrer" class="lab-source">
              source
            </a>
          {/if}
        </footer>
      </article>
    {/each}
  </div>

  <!-- Browser Compatibility Notice -->
  <aside class="compatibility-notice">
    <h3 class="notice-title">◆ BROWSER REQUIREMENTS</h3>
    <p class="notice-text">
      Most experiments require modern browsers with WebGPU support.
      Chrome 113+ recommended. Safari support is limited.
    </p>
    <div class="browser-grid">
      <span class="browser chrome">Chrome 113+ ✓</span>
      <span class="browser edge">Edge 113+ ✓</span>
      <span class="browser firefox">Firefox (flag) △</span>
      <span class="browser safari">Safari 18+ △</span>
    </div>
  </aside>
</div>

<style>
  .labs-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Header */
  .labs-header {
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-lg);
    border-bottom: 2px solid var(--border-color);
  }

  .labs-title-row {
    display: flex;
    align-items: baseline;
    gap: var(--space-md);
    margin-bottom: var(--space-xs);
    flex-wrap: wrap;
  }

  .labs-title {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
  }

  .labs-warning {
    font-size: var(--font-size-xs);
    color: hsl(45, 100%, 50%);
    background: hsl(45, 100%, 50%, 0.15);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
  }

  .labs-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    max-width: 60ch;
  }

  .labs-subtitle {
    color: var(--color-text-subtle);
    font-size: var(--font-size-xs);
  }

  /* Feature Legend */
  .feature-legend {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
    padding: var(--space-md);
    background: var(--color-surface);
    border-radius: var(--radius-md);
  }

  .legend-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }

  .legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .legend-item {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .legend-icon {
    color: var(--color-accent);
    margin-right: var(--space-xs);
  }

  /* Labs Grid */
  .labs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-2xl);
  }

  .lab-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding: var(--space-lg);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    border: var(--border-width) solid var(--border-color);
    transition: border-color var(--duration-fast) var(--easing);
  }

  .lab-card:hover {
    border-color: var(--color-text-subtle);
  }

  .lab-card.unsupported {
    opacity: 0.6;
  }

  .lab-status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lab-status {
    font-size: var(--font-size-xs);
    font-weight: 500;
    letter-spacing: var(--letter-spacing-wide);
  }

  .status-stable {
    color: hsl(140, 60%, 50%);
  }

  .status-beta {
    color: hsl(200, 80%, 55%);
  }

  .status-experimental {
    color: hsl(45, 100%, 50%);
  }

  .status-archived {
    color: var(--color-text-subtle);
  }

  .lab-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    font-variant-numeric: tabular-nums;
  }

  .lab-title {
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--color-text);
    line-height: var(--line-height-tight);
  }

  .lab-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    line-height: var(--line-height-normal);
    flex: 1;
  }

  .lab-features {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-xs);
    font-size: var(--font-size-xs);
  }

  .features-label {
    color: var(--color-text-subtle);
  }

  .features-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .feature-badge {
    color: var(--color-accent);
    background: var(--color-accent);
    background: transparent;
    border: var(--border-width) solid var(--color-accent);
    padding: 2px var(--space-xs);
    border-radius: var(--radius-sm);
  }

  .feature-badge.missing {
    color: hsl(0, 70%, 60%);
    border-color: hsl(0, 70%, 60%);
  }

  .lab-memory {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-xs);
  }

  .memory-label {
    color: var(--color-text-subtle);
  }

  .memory-value {
    color: var(--color-text-muted);
    min-width: 5ch;
  }

  .memory-bar {
    color: var(--color-accent);
    opacity: 0.6;
    letter-spacing: -0.1em;
  }

  .lab-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .lab-tag {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  .lab-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: var(--border-width) solid var(--border-color);
  }

  .lab-launch {
    font-size: var(--font-size-sm);
    color: var(--color-accent);
    font-weight: 500;
  }

  .lab-launch:hover {
    text-decoration: underline;
  }

  .lab-unsupported-msg {
    font-size: var(--font-size-xs);
    color: hsl(0, 70%, 60%);
  }

  .lab-source {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  /* Compatibility Notice */
  .compatibility-notice {
    padding: var(--space-lg);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    border: var(--border-width) solid var(--border-color);
  }

  .notice-title {
    font-size: var(--font-size-xs);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    color: var(--color-text-subtle);
    margin-bottom: var(--space-sm);
  }

  .notice-text {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-md);
  }

  .browser-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .browser {
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    background: var(--color-bg);
  }

  .browser.chrome,
  .browser.edge {
    color: hsl(140, 60%, 50%);
  }

  .browser.firefox,
  .browser.safari {
    color: hsl(45, 100%, 50%);
  }
</style>
