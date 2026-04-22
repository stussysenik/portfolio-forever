<script lang="ts">
  import LayoutSwitcher from '$lib/components/layout/LayoutSwitcher.svelte';
  import type { LayoutType } from '$lib/components/layout/LayoutSwitcher.svelte';
  import { createEventDispatcher } from 'svelte';

  export let title: string;
  export let subtitle: string | undefined = undefined;
  export let availableLayouts: LayoutType[] = [];
  export let activeLayout: LayoutType = 'grid';

  const dispatch = createEventDispatcher<{ layoutChange: LayoutType }>();
</script>

<section class="section-shell">
  <header class="section-header">
    <div class="section-header__text">
      <h2 class="section-title">{title}</h2>
      {#if subtitle}
        <p class="section-subtitle">{subtitle}</p>
      {/if}
    </div>
    
    {#if availableLayouts.length > 1}
      <LayoutSwitcher 
        available={availableLayouts} 
        active={activeLayout} 
        on:change={(e) => dispatch('layoutChange', e.detail)}
      />
    {/if}
  </header>
  <div class="section-divider"></div>
  
  <div class="section-content">
    <slot />
  </div>

  <div class="section-divider"></div>
  <footer class="section-footer">
    <!-- TODO: Item count, filters, pagination will go here -->
  </footer>
</section>

<style>
  .section-shell {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg, 1.5rem);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .section-title {
    font-family: var(--font-display, sans-serif);
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    line-height: 1.1;
    margin: 0;
  }

  .section-subtitle {
    margin: 0.5rem 0 0;
    color: var(--color-text-secondary, #525252);
    max-width: 60ch;
  }

  .section-divider {
    height: 1px;
    background-color: var(--color-border, #E5E5E5);
    width: 100%;
  }

  .section-footer {
    min-height: 2rem; /* Placeholder */
  }
</style>
