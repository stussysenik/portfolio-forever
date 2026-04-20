<script lang="ts">
  import { get_phases, compute_geometry, rect_width, rect_height, rect_x, phase_spacing, center_x, cycle_x } from '$lib/clj/portfolio/sections/process.mjs';
  import { processSteps } from '$lib/data/content';
  import Hiccup from '$lib/components/Hiccup.svelte';

  export let id = "process";

  /** Use phases from the Clojure backend port */
  let phases = get_phases();

  // Derived SVG dimensions from Clojure logic
  $: geo = compute_geometry(phases.length);
  $: ariaLabel = `Process: ${phases.map((p: any) => p.label).join(', ')}`;

  // Construct Hiccup for non-interactive parts
  $: processHiccup = [
    'div', { class: 'process-page-content' },
    ['header', { class: 'page-header' }, ['h1', { class: 'page-title' }, 'PROCESS']],
    ['div', { class: 'steps' }, 
      ...processSteps.map(step => [
        'div', { class: 'step' },
        ['span', { class: 'step-num' }, step.number],
        ['div', { class: 'step-content' },
          ['h2', { class: 'step-title' }, step.title],
          step.ascii ? ['pre', { class: 'step-ascii' }, step.ascii.trim()] : null,
          ['p', { class: 'step-desc' }, step.description]
        ]
      ])
    ]
  ];

  $: depthHiccup = [
    'div', { class: 'depth-sections' },
    ['details', { class: 'depth-section' },
      ['summary', { class: 'depth-toggle' }, '[ expand: principles ]'],
      ['ul', { class: 'principles' },
        ['li', '→ Start with constraints'],
        ['li', '→ Prototype in code'],
        ['li', '→ Details compound'],
        ['li', '→ Document everything'],
        ['li', '→ Ship, then iterate']
      ]
    ],
    ['details', { class: 'depth-section' },
      ['summary', { class: 'depth-toggle' }, '[ expand: on tools ]'],
      ['div', { class: 'tools-philosophy' },
        ['p', ['strong', 'Right tool, right job.'], ' Every project gets fresh evaluation.'],
        ['p', ['strong', 'Learn fundamentals.'], ' WebGPU before Three.js. Shaders before filters.'],
        ['p', ['strong', 'Embrace discomfort.'], ' Best work happens at the edge of competence.']
      ]
    ]
  ];
</script>

<svelte:head>
  <title>Process</title>
  <meta name="description" content="How I work" />
</svelte:head>

<div class="process-wrapper" {id}>
  <Hiccup data={processHiccup} />

  <div class="process-cycle">
    <svg class="process-svg" viewBox="0 0 300 {geo.viewBoxHeight}" aria-label={ariaLabel}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>

      <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

        {#each phases as phase, i}
          <!-- Phase rectangle -->
          {@const y = 20 + i * phase_spacing}
          <rect x={rect_x} {y} width={rect_width} height={rect_height} />
          <text
            x={center_x}
            y={y + rect_height / 2 + 8}
            fill="currentColor"
            stroke="none"
            text-anchor="middle"
            font-family="monospace"
            font-weight="bold"
            font-size="24"
          >{phase.label}</text>

          <!-- Arrow to next phase (not after the last one) -->
          {#if i < phases.length - 1}
            <line
              x1={center_x}
              y1={y + rect_height}
              x2={center_x}
              y2={y + phase_spacing}
              marker-end="url(#arrowhead)"
            />
          {/if}
        {/each}

        <!-- Cycle-back path: bottom of last phase -> down -> left -> up -> into left side of first phase -->
        {#if phases.length > 1}
          <line x1={center_x} y1={geo.lastPhaseY + rect_height} x2={center_x} y2={geo.cycleBottom} />
          <path
            d="M {center_x} {geo.cycleBottom} L {cycle_x} {geo.cycleBottom} L {cycle_x} {geo.firstMidY} L {rect_x - 10} {geo.firstMidY}"
            marker-end="url(#arrowhead)"
          />
        {/if}

      </g>
    </svg>
  </div>

  <Hiccup data={depthHiccup} />
</div>

<style>
  .process-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-xl) var(--space-md);
  }

  :global(.page-header) {
    margin-bottom: var(--space-2xl);
    padding-bottom: var(--space-sm);
    border-bottom: var(--border-width-thick) solid var(--color-text);
  }

  :global(.page-title) {
    font-family: var(--font-sans);
    font-size: var(--font-size-xl);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
    margin: 0;
  }

  /* Steps */
  :global(.steps) {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    margin-bottom: var(--space-3xl);
  }

  :global(.step) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-lg);
  }

  :global(.step-num) {
    font-family: var(--font-sans);
    font-size: var(--font-size-3xl);
    font-weight: 200;
    color: var(--color-text-subtle);
    line-height: 1;
  }

  :global(.step-content) {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  :global(.step-title) {
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    font-weight: 600;
    margin: 0;
  }

  :global(.step-ascii) {
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

  :global(.step-desc) {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    max-width: 60ch;
  }

  /* Process Cycle SVG */
  .process-cycle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: var(--space-3xl);
    width: 100%;
  }

  .process-svg {
    width: 100%;
    max-width: 400px;
    height: auto;
    color: var(--color-text);
  }

  /* Expandable sections */
  :global(.depth-sections) {
    margin-top: var(--space-3xl);
  }

  :global(.depth-section) {
    margin-bottom: var(--space-lg);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-sm);
  }

  :global(.depth-toggle) {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    list-style: none;
  }

  :global(.depth-toggle::-webkit-details-marker) {
    display: none;
  }

  :global(.depth-toggle:hover) {
    color: var(--color-text);
  }

  :global(.depth-section[open] .depth-toggle) {
    border-bottom: var(--border-width) solid var(--border-color);
  }

  :global(.principles) {
    list-style: none;
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  :global(.tools-philosophy) {
    padding: var(--space-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  :global(.tools-philosophy p) {
    margin: 0 0 var(--space-sm) 0;
  }

  :global(.tools-philosophy p:last-child) {
    margin-bottom: 0;
  }

  :global(.tools-philosophy strong) {
    color: var(--color-text);
  }
</style>