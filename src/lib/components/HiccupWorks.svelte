<script lang="ts">
  import { onMount } from "svelte";
  import { getConvexClient } from "$lib/convex";
  import Hiccup from "./Hiccup.svelte";
  import { setup_works_subscriptions, get_works_hiccup } from "$lib/clj/portfolio/sections/works.mjs";
  import { works as staticWorks } from "$lib/data/content";

  let projects: any[] = staticWorks;
  let thumbnailConfig: any = null;
  let sectionConfig: any = null;

  onMount(() => {
    const client = getConvexClient();
    return setup_works_subscriptions(client, {
      onWorks: (data: any) => { if (data && data.length > 0) projects = data; },
      onThumbnails: (data: any) => { thumbnailConfig = data; },
      onSection: (data: any) => { sectionConfig = data; }
    });
  });

  $: hiccupData = get_works_hiccup(
    projects,
    thumbnailConfig?.displayMode ?? 'grid',
    thumbnailConfig?.columns ?? 2,
    thumbnailConfig?.showPreview ?? true,
    'colorful-table',
    false // show all
  );
</script>

<Hiccup data={hiccupData} />

<style global>
  .works-list-container {
    width: 100%;
    font-family: var(--font-mono);
    margin-bottom: var(--space-xl);
  }

  .table-header {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border-color-subtle);
    margin-bottom: var(--space-md);
  }

  .table-marker {
    color: #2563eb;
    font-size: 0.7rem;
  }

  .table-title {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin: 0;
    text-transform: uppercase;
  }

  .table-count {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-subtle);
  }

  .work-row {
    display: grid;
    grid-template-columns: 80px 1fr 60px;
    align-items: center;
    padding: 6px var(--space-md);
    background: transparent;
    border-bottom: 1px solid var(--border-color-subtle);
    transition: transform 0.1s ease;
    text-decoration: none;
    color: var(--color-text);
    position: relative;
    min-height: 28px;
  }

  .work-row:hover {
    background: var(--color-bg-alt);
    z-index: 10;
  }

  .work-date {
    font-size: 0.7rem;
    color: var(--color-text-subtle);
    opacity: 0.8;
  }

  .work-title {
    font-size: 0.8rem;
    font-weight: 500;
    white-space: normal;
    line-height: 1.2;
  }

  .work-link {
    font-size: 0.7rem;
    text-align: right;
    color: #2563eb;
    opacity: 0.8;
  }

  .work-row[style*="--row-bg"] {
    background: var(--row-bg);
    border-bottom: none;
    margin-bottom: 2px;
    border-radius: 2px;
  }

  .work-row[style*="--row-bg"] .work-date,
  .work-row[style*="--row-bg"] .work-title,
  .work-row[style*="--row-bg"] .work-link {
    color: #000 !important;
    opacity: 1;
  }

  @media (max-width: 640px) {
    .work-row {
      grid-template-columns: 70px 1fr;
    }
    .work-link {
      display: none;
    }
  }
</style>
