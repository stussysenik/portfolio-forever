<script lang="ts">
  import { get_phases, compute_geometry, rect_width, rect_height, rect_x, phase_spacing, center_x, cycle_x } from '$lib/clj/portfolio/sections/process.mjs';

  export let id = "process";

  /** Use phases from the Clojure backend port */
  let phases = get_phases();

  // Derived SVG dimensions from Clojure logic
  $: geo = compute_geometry(phases.length);
  $: ariaLabel = `Process: ${phases.map((p: any) => p.label).join(', ')}`;
</script>

<svelte:head>
  <title>Process</title>
  <meta name="description" content="How I work" />
</svelte:head>

<div class="process-cycle" {id}>
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
