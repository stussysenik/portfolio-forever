<script lang="ts">
  import { processSteps, profile } from '$lib/data/content';

  export let id = "process";
</script>

<svelte:head>
  <title>Process</title>
  <meta name="description" content="How I work" />
</svelte:head>



<!-- Steps - compact, let users discover -->
<!-- ARCHIVED CONTENT
<div class="steps">
  {#each processSteps as step, i}
    <div class="step">
      <span class="step-num">{step.number}</span>
      <div class="step-content">
        <h2 class="step-title">{step.title}</h2>
        {#if step.ascii}
          <pre class="step-ascii">{step.ascii.trim()}</pre>
        {/if}
      </div>
    </div>
  {/each}
</div>

<details class="depth-section">
  <summary class="depth-toggle">[ expand: principles ]</summary>
  <ul class="principles">
    <li>→ Start with constraints</li>
    <li>→ Prototype in code</li>
    <li>→ Details compound</li>
    <li>→ Document everything</li>
    <li>→ Ship, then iterate</li>
  </ul>
</details>

<details class="depth-section">
  <summary class="depth-toggle">[ expand: on tools ]</summary>
  <div class="tools-philosophy">
    <p><strong>Right tool, right job.</strong> Every project gets fresh evaluation.</p>
    <p><strong>Learn fundamentals.</strong> WebGPU before Three.js. Shaders before filters.</p>
    <p><strong>Embrace discomfort.</strong> Best work happens at the edge of competence.</p>
  </div>
</details>
-->

<div class="process-cycle" {id}>
  <svg class="process-svg" viewBox="0 0 300 380" aria-label="Process: Imagine, Re-think, Ship">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
      </marker>
    </defs>

    <!-- Styles -->
    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

      <!-- IMAGINE -->
      <rect x="80" y="20" width="180" height="60" />
      <text x="170" y="55" fill="currentColor" stroke="none" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="24">IMAGINE</text>

      <!-- Arrow 1 -->
      <line x1="170" y1="80" x2="170" y2="120" marker-end="url(#arrowhead)" />

      <!-- RE-THINK -->
      <rect x="80" y="120" width="180" height="60" />
      <text x="170" y="155" fill="currentColor" stroke="none" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="24">RE-THINK</text>

      <!-- Arrow 2 -->
      <line x1="170" y1="180" x2="170" y2="220" marker-end="url(#arrowhead)" />

      <!-- SHIP -->
      <rect x="80" y="220" width="180" height="60" />
      <text x="170" y="255" fill="currentColor" stroke="none" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="24">SHIP</text>

      <!-- Cycle Path: Bottom of Ship -> Left -> Up -> Into Imagine -->
      <!-- Coming out bottom of SHIP -->
      <line x1="170" y1="280" x2="170" y2="340" />

      <!-- Turn Left and go Up -->
      <path d="M 170 340 L 40 340 L 40 50 L 70 50" marker-end="url(#arrowhead)" />

    </g>
  </svg>
</div>

<!--
<footer class="process-footer">
  <pre class="ascii-sig">
    ┌─────────────┐
    │   OBSERVE   │
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │    BUILD    │
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │   ITERATE   │
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │    SHIP     │
    └─────────────┘
  </pre>
</footer>
-->

<style>
  .page-header {
    margin-bottom: var(--space-2xl);
    padding-bottom: var(--space-sm);
    border-bottom: var(--border-width-thick) solid var(--color-text);
  }

  .page-title {
    font-family: var(--font-sans);
    font-size: var(--font-size-xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
    margin: 0;
  }

  /* Steps */
  .steps {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    margin-bottom: var(--space-3xl);
  }

  .step {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-lg);
  }

  .step-num {
    font-family: var(--font-sans);
    font-size: var(--font-size-3xl);
    font-weight: 200;
    color: var(--color-text-subtle);
    line-height: 1;
  }

  .step-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .step-title {
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    font-weight: 600;
    margin: 0;
  }

  .step-ascii {
    font-family: var(--font-mono);
    font-size: clamp(0.5rem, 1.5vw, var(--font-size-xs));
    line-height: 1.1;
    color: var(--color-accent);
    margin: 0;
    overflow-x: auto;
    white-space: pre;
    max-width: 100%;
    padding-bottom: var(--space-xs); /* For scrollbar breathing */
  }

  /* Expandable sections */
  .depth-section {
    margin-bottom: var(--space-lg);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-sm);
  }

  .depth-toggle {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    list-style: none;
  }

  .depth-toggle::-webkit-details-marker {
    display: none;
  }

  .depth-toggle:hover {
    color: var(--color-text);
  }

  .depth-section[open] .depth-toggle {
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .principles {
    list-style: none;
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .tools-philosophy {
    padding: var(--space-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .tools-philosophy p {
    margin: 0 0 var(--space-sm) 0;
  }

  .tools-philosophy p:last-child {
    margin-bottom: 0;
  }

  .tools-philosophy strong {
    color: var(--color-text);
  }

  /* Footer */
  /* Process Cycle */
  .process-cycle {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    padding: var(--space-3xl) var(--space-md) var(--space-md);
    width: 100%;
  }

  .process-svg {
    width: 100%;
    max-width: 400px;
    height: auto;
    color: var(--color-text);
  }
</style>
