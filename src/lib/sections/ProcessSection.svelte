<script lang="ts">
  import { processSteps } from '$lib/data/content';

  export let id = "process";

  /** Use phases from the Clojure backend port */
  let phases: Array<{ label: string; description?: string; order: number }> = processSteps.map((s: any, i: number) => ({
    label: s.title,
    description: s.description,
    order: i
  }));

  // SVG layout constants
  const RECT_WIDTH = 180;
  const RECT_HEIGHT = 60;
  const RECT_X = 80;
  const PHASE_SPACING = 100; // vertical distance between phase tops
  const FIRST_Y = 20;
  const CENTER_X = RECT_X + RECT_WIDTH / 2; // 170
  const CYCLE_MARGIN = 60; // extra space below last phase for cycle-back arrow
  const CYCLE_X = 40; // x-position of the left vertical line of cycle-back

  // Derived SVG dimensions
  $: lastPhaseY = FIRST_Y + (phases.length - 1) * PHASE_SPACING;
  $: viewBoxHeight = lastPhaseY + RECT_HEIGHT + CYCLE_MARGIN;

  // Build the aria label dynamically
  $: ariaLabel = `Process: ${phases.map((p) => p.label).join(', ')}`;
</script>

<svelte:head>
  <title>Process</title>
  <meta name="description" content="How I work" />
</svelte:head>

<div class="process-cycle" {id}>
  <svg class="process-svg" viewBox="0 0 300 {viewBoxHeight}" aria-label={ariaLabel}>
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
      </marker>
    </defs>

    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

      {#each phases as phase, i}
        <!-- Phase rectangle -->
        {@const y = FIRST_Y + i * PHASE_SPACING}
        <rect x={RECT_X} {y} width={RECT_WIDTH} height={RECT_HEIGHT} />
        <text
          x={CENTER_X}
          y={y + RECT_HEIGHT / 2 + 8}
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
            x1={CENTER_X}
            y1={y + RECT_HEIGHT}
            x2={CENTER_X}
            y2={y + PHASE_SPACING}
            marker-end="url(#arrowhead)"
          />
        {/if}
      {/each}

      <!-- Cycle-back path: bottom of last phase -> down -> left -> up -> into left side of first phase -->
      {#if phases.length > 1}
        {@const lastBottom = lastPhaseY + RECT_HEIGHT}
        {@const cycleBottom = lastBottom + (CYCLE_MARGIN - 20)}
        {@const firstMidY = FIRST_Y + RECT_HEIGHT / 2}
        <line x1={CENTER_X} y1={lastBottom} x2={CENTER_X} y2={cycleBottom} />
        <path
          d="M {CENTER_X} {cycleBottom} L {CYCLE_X} {cycleBottom} L {CYCLE_X} {firstMidY} L {RECT_X - 10} {firstMidY}"
          marker-end="url(#arrowhead)"
        />
      {/if}

    </g>
  </svg>
</div>

<style>
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
