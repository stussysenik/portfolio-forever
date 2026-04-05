<script lang="ts">
  import { getStatusLabel, getStatusClass, checkAllFeatures } from '$lib/data/labs';
  import { onMount } from 'svelte';
  import { getConvexClient } from '$lib/convex';
  import { api } from '$convex/_generated/api';

  export let embedded = false;

  let labs: any[] = [];
  let sortedLabs: any[] = [];
  let featureSupport: Record<string, { supported: boolean; missing: string[] }> = {};

  onMount(() => {
    const client = getConvexClient();
    const unsub = client.onUpdate((api as any).labs.getVisibleLabs, {}, (data: any) => {
      if (data) {
        labs = data;
        sortedLabs = [...data].sort((a: any, b: any) => {
          const statusOrder: Record<string, number> = { stable: 0, beta: 1, experimental: 2, archived: 3 };
          const statusDiff = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
          if (statusDiff !== 0) return statusDiff;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        const support: Record<string, { supported: boolean; missing: string[] }> = {};
        for (const lab of data) {
          support[lab.slug] = checkAllFeatures(lab.requiredFeatures ?? []);
        }
        featureSupport = support;
      }
    });
    return () => unsub();
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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
</script>

<div class="labs-container" class:embedded>
  <header class="labs-header">
    <div class="labs-title-row">
      <h1 class="labs-title">Laboratory</h1>
      <span class="labs-warning">EXPERIMENTAL</span>
    </div>
    <p class="labs-description">
      Sandboxed experiments with cutting-edge web APIs.
      <span class="labs-subtitle">Future-looking, unstable, may break.</span>
    </p>
  </header>

  <div class="labs-grid">
    {#each sortedLabs as lab (lab.slug)}
      {@const support = featureSupport[lab.slug] || { supported: true, missing: [] }}
      <article class="lab-card" class:unsupported={!support.supported}>
        <div class="lab-status-row">
          <span class="lab-status {getStatusClass(lab.status)}">
            {getStatusLabel(lab.status)}
          </span>
          <span class="lab-date">{formatDate(lab.date)}</span>
        </div>

        <h2 class="lab-title">{lab.title}</h2>
        <p class="lab-description">{lab.description}</p>

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

        <div class="lab-memory">
          <span class="memory-label">Memory:</span>
          <span class="memory-value">{lab.memoryBudget}MB</span>
          <span class="memory-bar">
            {'█'.repeat(Math.min(Math.ceil(lab.memoryBudget / 50), 10))}{'░'.repeat(Math.max(10 - Math.ceil(lab.memoryBudget / 50), 0))}
          </span>
        </div>

        <div class="lab-tags">
          {#each lab.tags as tag}
            <span class="lab-tag">#{tag}</span>
          {/each}
        </div>

        <footer class="lab-actions">
          {#if support.supported}
            <a href="/labs/{lab.slug}" class="lab-launch">[ LAUNCH ] →</a>
          {:else}
            <span class="lab-unsupported-msg">Missing: {support.missing.join(', ')}</span>
          {/if}
          {#if lab.sourceUrl}
            <a href={lab.sourceUrl} target="_blank" rel="noopener noreferrer" class="lab-source">source</a>
          {/if}
        </footer>
      </article>
    {/each}
  </div>
</div>

<style>
  .labs-container {
    max-width: 1200px;
    margin: 0 auto;
  }

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

  :global(.status-stable) { color: hsl(140, 60%, 50%); }
  :global(.status-beta) { color: hsl(200, 80%, 55%); }
  :global(.status-experimental) { color: hsl(45, 100%, 50%); }
  :global(.status-archived) { color: var(--color-text-subtle); }

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

  .memory-label { color: var(--color-text-subtle); }
  .memory-value { color: var(--color-text-muted); min-width: 5ch; }
  .memory-bar { color: var(--color-accent); opacity: 0.6; letter-spacing: -0.1em; }

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

  .lab-launch:hover { text-decoration: underline; }

  .lab-unsupported-msg {
    font-size: var(--font-size-xs);
    color: hsl(0, 70%, 60%);
  }

  .lab-source {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }
</style>
