<script lang="ts">
  import { processSteps, profile } from '$lib/data/content';
</script>

<svelte:head>
  <title>Process</title>
  <meta name="description" content="How I work" />
</svelte:head>

<header class="page-header">
  <h1 class="page-title">◇ PROCESS</h1>
</header>

<!-- Steps - compact, let users discover -->
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

<!-- Hidden depth - users can discover -->
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

<!-- ASCII signature -->
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
  .process-footer {
    padding-top: var(--space-xl);
    border-top: var(--border-width) dashed var(--border-color);
    display: flex;
    justify-content: center;
  }
  
  .ascii-sig {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    line-height: 1.3;
    color: var(--color-text-subtle);
    margin: 0;
  }
</style>
