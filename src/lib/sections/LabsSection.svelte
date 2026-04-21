<script lang="ts">
  import { onMount } from 'svelte';
  import { getConvexClient } from '$lib/convex';
  import { setupLabsSubscriptions } from '$lib/sections/labs-logic';

  export let id = "labs";

  let labs: any[] = [];
  let loading = true;

  onMount(() => {
    const client = getConvexClient();
    return setupLabsSubscriptions(client, {
      onLabs: (data: any) => {
        if (data) labs = data;
        loading = false;
      }
    });
  });

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      'stable': 'status-stable',
      'beta': 'status-beta',
      'experimental': 'status-experimental',
      'archived': 'status-archived'
    };
    return labels[status] || status;
  }
</script>

<div {id} class="labs-container">
  <header class="labs-header">
    <h2 class="labs-title">Experiments & Labs</h2>
    <p class="labs-subtitle">Sandboxed WebGPU, WASM, and low-level graphics experiments.</p>
  </header>

  {#if loading}
    <div class="loading">Loading experiments...</div>
  {:else if labs.length === 0}
    <div class="empty">No active experiments found in the vault.</div>
  {:else}
    <div class="labs-grid">
      {#each labs as lab}
        <div class="lab-card" data-status={lab.status}>
          <div class="lab-header">
            <span class="lab-date">{lab.date}</span>
            <span class="lab-status">{getStatusLabel(lab.status)}</span>
          </div>
          <h3 class="lab-name">{lab.title}</h3>
          <p class="lab-desc">{lab.description}</p>
          <div class="lab-tags">
            {#each lab.tags || [] as tag}
              <span class="lab-tag">#{tag}</span>
            {/each}
          </div>
          <div class="lab-footer">
            <span class="lab-budget">{lab.memoryBudget}MB budget</span>
            <a href="/labs/{lab.slug}" class="lab-link">ENTER →</a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .labs-container { max-width: 1000px; margin: 0 auto; padding: var(--space-xl) var(--space-md); }
  .labs-header { margin-bottom: var(--space-2xl); border-bottom: 1px solid var(--border-color-subtle); padding-bottom: var(--space-md); }
  .labs-title { font-size: var(--font-size-2xl); font-weight: 600; }
  .labs-subtitle { color: var(--color-text-secondary); font-family: var(--font-mono); font-size: var(--font-size-sm); }
  .labs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-lg); }
  .lab-card { border: 1px solid var(--border-color-subtle); padding: var(--space-lg); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-sm); background: var(--color-bg-alt); transition: border-color 0.2s ease; }
  .lab-card:hover { border-color: var(--color-accent); }
  .lab-header { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: var(--font-size-2xs); color: var(--color-text-subtle); }
  .lab-name { font-size: var(--font-size-lg); font-weight: 500; }
  .lab-desc { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.5; flex: 1; }
  .lab-tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); }
  .lab-tag { font-family: var(--font-mono); font-size: var(--font-size-2xs); color: var(--color-accent); opacity: 0.8; }
  .lab-footer { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-sm); padding-top: var(--space-sm); border-top: 1px dashed var(--border-color-subtle); }
  .lab-budget { font-family: var(--font-mono); font-size: var(--font-size-2xs); color: var(--color-text-subtle); }
  .lab-link { color: var(--color-accent); font-weight: 600; text-decoration: none; font-size: var(--font-size-sm); }
  .loading, .empty { padding: var(--space-3xl); text-align: center; color: var(--color-text-muted); font-family: var(--font-mono); }
</style>
