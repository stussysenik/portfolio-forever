<script lang="ts">
  import { onMount } from "svelte";
  import { create_buffers, compute_frame } from "$lib/clj/portfolio/components/donut.mjs";
  import { make_draggable } from "$lib/clj/portfolio/ui/drag.mjs";

  let asciiOutput = $state("LOADING DONUT...");
  
  // Static rotation angles
  let A = 1.0; 
  let B = 1.5;

  const buffers = create_buffers();

  onMount(() => {
    // Render the frame once
    asciiOutput = compute_frame(buffers, A, B);
  });
</script>

<div class="donut-wrapper" use:make_draggable>
  <div class="donut-container">
    <pre class="donut-ascii">{asciiOutput}</pre>
  </div>
</div>

<style>
  .donut-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    /* Other CSS logic moved to clj drag action */
  }
  
  .donut-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    width: 100%;
    overflow: hidden;
    background: transparent;
    border-radius: var(--radius-md);
    transition: transform var(--duration-fast) var(--easing),
                opacity var(--duration-fast) var(--easing);
  }
  
  :global(.donut-container.dragging) {
    transform: scale(1.05);
    opacity: 0.8;
  }

  .donut-ascii {
    font-family: var(--font-mono);
    font-size: clamp(6px, 1.2vw, 10px);
    line-height: 1;
    letter-spacing: 2px;
    color: var(--color-accent);
    margin: 0;
    white-space: pre;
    user-select: none;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    .donut-ascii {
      font-size: 5px;
      letter-spacing: 1px;
    }
  }
</style>
