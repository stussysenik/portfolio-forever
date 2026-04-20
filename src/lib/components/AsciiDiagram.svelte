<script lang="ts">
  import Hiccup from "./Hiccup.svelte";
  import { get_ascii_hiccup } from "$lib/clj/portfolio/sections/ascii.mjs";

  const hiccupData = get_ascii_hiccup();
</script>

<Hiccup data={hiccupData} />

<style global>
  .ascii-diagram-section {
    margin-bottom: var(--space-2xl);
    width: 100%;
  }

  .ascii-container {
    margin-top: var(--space-md);
    background: var(--color-bg-alt);
    border: 1px solid var(--border-color-subtle);
    border-radius: var(--radius-sm);
    padding: var(--space-lg);
    overflow-x: auto;
  }

  .ascii-art {
    font-family: var(--font-mono);
    font-size: clamp(8px, 1.5vw, 12px);
    line-height: 1.4;
    color: var(--color-text-secondary);
    margin: 0;
    white-space: pre;
    text-align: center;
  }
</style>
