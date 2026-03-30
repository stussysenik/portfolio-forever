<script lang="ts">
  export let id = "process";
</script>

<svelte:head>
  <title>Process</title>
  <meta name="description" content="How I work" />
</svelte:head>



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
