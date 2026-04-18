<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { getConvexClient } from "$lib/convex";
  import { api } from "$convex/_generated/api";
  import { resolveComponentKey } from "$lib/sections/registry";
  
  import HeroSection from "$lib/sections/HeroSection.svelte";
  import WorksSection from "$lib/sections/WorksSection.svelte";
  import TalksSection from "$lib/sections/TalksSection.svelte";
  import TerminalSection from "$lib/sections/TerminalSection.svelte";
  import CvSection from "$lib/sections/CvSection.svelte";
  import AcademiaSection from "$lib/sections/AcademiaSection.svelte";
  import BlogSection from "$lib/sections/BlogSection.svelte";
  import ProcessSection from "$lib/sections/ProcessSection.svelte";
  import GallerySection from "$lib/sections/GallerySection.svelte";
  import LikesSection from "$lib/sections/LikesSection.svelte";
  import MinorSection from "$lib/sections/MinorSection.svelte";
  import GiftsSection from "$lib/sections/GiftsSection.svelte";
  import OsSection from "$lib/sections/OsSection.svelte";
  import LabsSection from "$lib/sections/LabsSection.svelte";
  import MediaSection from "$lib/sections/MediaSection.svelte";

  export let pageId: string;
  // A fallback component type is passed from the parent if the db has no sections yet
  export let fallback: any = null;
  export let fallbackId: string = "";
  
  // Specific props that some sections might need
  export let blogPosts: any[] = [];

  let pageData: any = null;
  let pageUnsub: (() => void) | null = null;
  let loading = true;

  // Map section IDs to components
  const componentMap: Record<string, any> = {
    hero: HeroSection,
    works: WorksSection,
    talks: TalksSection,
    terminal: TerminalSection,
    cv: CvSection,
    academia: AcademiaSection,
    blog: BlogSection,
    process: ProcessSection,
    gallery: GallerySection,
    likes: LikesSection,
    minor: MinorSection,
    gifts: GiftsSection,
    os: OsSection,
    labs: LabsSection,
    media: MediaSection,
  };

  $: pageSections = pageData?.sections
    ? [...pageData.sections].sort((a: any, b: any) => a.order - b.order)
    : null;
    
  $: activeSections = pageSections
    ? pageSections.filter((s: any) => s.visible !== false)
    : [];

  onMount(() => {
    const client = getConvexClient();
    try {
      pageUnsub = client.onUpdate(api.pages.getByPageId, { pageId }, (data: any) => {
        pageData = data;
        loading = false;
      });
    } catch (e) {
      console.warn("Failed to subscribe to page data", e);
      loading = false;
    }
  });

  onDestroy(() => {
    pageUnsub?.();
  });

  function getSectionProps(id: string): Record<string, any> {
    const props: Record<string, any> = { id };
    if (id === "terminal" || id === "os") {
      props.embedded = true;
    }
    if (id === "blog") {
      props.posts = blogPosts;
    }
    return props;
  }
</script>

{#if loading}
  <!-- Loading state -->
{:else if activeSections.length === 0 && fallback}
  <!-- Render Fallback if no sections configured yet -->
  <section class="section-wrapper dynamic-page-section fallback-section">
    <svelte:component this={fallback} {...getSectionProps(fallbackId || pageId)} />
  </section>
{:else}
  <!-- Render dynamic sections from admin configuration -->
  <div class="dynamic-page" style:--color-accent={pageData?.themeOverrides?.accentColor ?? null}>
    {#each activeSections as section (section.sectionType + section.order)}
      {@const key = resolveComponentKey(section.sectionType)}
      {@const Comp = componentMap[key]}
      {#if Comp}
        <section
          class="section-wrapper dynamic-page-section"
          id={key}
          style:margin-top="{section?.spacingBefore ?? 0}px"
          style:margin-bottom="{section?.spacingAfter ?? 0}px"
          style:padding-top="{section?.themeOverrides?.paddingTop ?? 0}px"
          style:padding-right="{section?.themeOverrides?.paddingRight ?? 0}px"
          style:padding-bottom="{section?.themeOverrides?.paddingBottom ?? 0}px"
          style:padding-left="{section?.themeOverrides?.paddingLeft ?? 0}px"
        >
          <svelte:component this={Comp} {...getSectionProps(key)} />
        </section>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .dynamic-page {
    position: relative;
    width: 100%;
  }

  .dynamic-page-section {
    padding-block: var(--space-xl);
    width: 100%;
  }
  
  .fallback-section {
    padding-top: 0; /* Let the fallback component handle its own top padding if needed */
  }
</style>
