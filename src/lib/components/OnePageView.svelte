<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { sections } from "$lib/sections/index";
  import { isReaderMode } from "$lib/stores/siteMode";

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

  export let sectionOrder: string[] = sections.map((s) => s.id);
  export let blogPosts: any[] = [];

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
  };

  let activeSection = "hero";
  let sectionElements: Record<string, HTMLElement> = {};
  let observer: IntersectionObserver | undefined;
  let ticking = false;

  // Lazy loading: track which sections are near viewport
  let visibleSections = new Set<string>(["hero"]); // Hero always rendered

  // Scroll spy via IntersectionObserver
  onMount(() => {
    // Lazy load observer: render sections when ~1 viewport away
    const lazyObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
            visibleSections = visibleSections; // trigger reactivity
            lazyObserver.unobserve(entry.target); // once visible, always rendered
          }
        }
      },
      { rootMargin: "100% 0px" }
    );

    // Observe placeholder elements for lazy loading
    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (el) lazyObserver.observe(el);
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
            // Update URL hash without scrolling
            history.replaceState(null, "", `/#${activeSection}`);
          }
        }
      },
      { rootMargin: "-40% 0px -60% 0px" }
    );

    // Observe all section wrappers
    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (el) {
        sectionElements[id] = el;
        observer.observe(el);
      }
    }

    // Handle initial hash
    const hash = window.location.hash.slice(1);
    if (hash && sectionElements[hash]) {
      sectionElements[hash].scrollIntoView({ behavior: "smooth" });
    }
  });

  onDestroy(() => {
    observer?.disconnect();
  });

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Keyboard navigation: j/k to move between sections
  function handleKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    const currentIndex = sectionOrder.indexOf(activeSection);
    if (e.key === "j" && currentIndex < sectionOrder.length - 1) {
      e.preventDefault();
      scrollToSection(sectionOrder[currentIndex + 1]);
    } else if (e.key === "k" && currentIndex > 0) {
      e.preventDefault();
      scrollToSection(sectionOrder[currentIndex - 1]);
    }
  }

  // Props for specific sections
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

<svelte:window on:keydown={handleKeydown} />

<div class="one-page" class:reader-mode={$isReaderMode}>
  <!-- Section nav (scroll spy) -->
  <nav class="section-nav" aria-label="Page sections">
    {#each sectionOrder as id}
      {@const meta = sections.find((s) => s.id === id)}
      {#if meta}
        <button
          class="section-nav-item"
          class:active={activeSection === id}
          on:click={() => scrollToSection(id)}
        >
          {meta.label}
        </button>
      {/if}
    {/each}
  </nav>

  <!-- Sections -->
  {#each sectionOrder as id (id)}
    <section class="section-wrapper" {id}>
      {#if visibleSections.has(id)}
        <svelte:component this={componentMap[id]} {...getSectionProps(id)} />
      {:else}
        <div class="section-placeholder" style="min-height: 50vh;"></div>
      {/if}
    </section>
  {/each}
</div>

<style>
  .one-page {
    position: relative;
  }

  .section-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    gap: var(--space-2xs);
    padding: var(--space-xs) var(--space-md);
    background: var(--color-bg);
    border-bottom: 1px solid var(--border-color-subtle);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .section-nav::-webkit-scrollbar {
    display: none;
  }

  .section-nav-item {
    all: unset;
    cursor: pointer;
    padding: var(--space-3xs) var(--space-xs);
    font-size: var(--font-size-xs);
    font-family: var(--font-mono);
    color: var(--color-text-subtle);
    white-space: nowrap;
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--easing);
  }

  .section-nav-item:hover {
    color: var(--color-text);
  }

  .section-nav-item.active {
    color: var(--color-accent);
    background: var(--color-bg-alt);
  }

  .section-wrapper {
    min-height: 50vh;
    padding-block: var(--space-2xl);
  }

  /* Reader mode hides the section nav */
  .reader-mode .section-nav {
    display: none;
  }
</style>
