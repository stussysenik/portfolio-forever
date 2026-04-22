<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export type LayoutType = 'grid' | 'masonry' | 'filmstrip' | 'editorial';
  
  export let available: LayoutType[] = ['grid', 'masonry', 'filmstrip'];
  export let active: LayoutType = 'grid';
  
  const dispatch = createEventDispatcher<{ change: LayoutType }>();

  function select(layout: LayoutType) {
    active = layout;
    dispatch('change', layout);
  }

  // Map layout types to simple visual representations (could use icons later)
  const icons: Record<LayoutType, string> = {
    grid: '⊞',
    masonry: '▦',
    filmstrip: '🎞️',
    editorial: '📰'
  };
</script>

<div class="layout-switcher">
  {#each available as layout}
    <button 
      class="switcher-btn" 
      class:active={active === layout}
      on:click={() => select(layout)}
      title="Switch to {layout} layout"
      aria-label="Switch to {layout} layout"
    >
      <span class="icon">{icons[layout]}</span>
    </button>
  {/each}
</div>

<style>
  .layout-switcher {
    display: flex;
    gap: 2px;
    background: var(--color-bg-alt, #f5f5f5);
    padding: 2px;
    border-radius: var(--radius-sm, 4px);
    border: 1px solid var(--color-border, #e5e5e5);
  }

  .switcher-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: calc(var(--radius-sm, 4px) - 2px);
    transition: all 0.2s var(--easing, ease);
    color: var(--color-text-muted, #737373);
  }

  .switcher-btn:hover {
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #171717);
  }

  .switcher-btn.active {
    background: var(--color-surface, #ffffff);
    color: var(--color-accent, #2563eb);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .icon {
    font-size: 1.1rem;
    line-height: 1;
  }
</style>
