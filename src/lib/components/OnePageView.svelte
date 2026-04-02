<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { sections } from "$lib/sections/index";
  import { isReaderMode, siteConfig } from "$lib/stores/siteMode";
  import { getConvexClient } from "$lib/convex";
  import { api } from "$convex/_generated/api";
  import { resolveComponentKey, sectionTypeRegistry } from "$lib/sections/registry";

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

  export let blogPosts: any[] = [];

  // Home page data from pages table (authoritative source for one-page section composition)
  let homePage: any = null;
  let homePageUnsub: (() => void) | null = null;

  // Derive section order from pages table, fall back to siteConfig
  $: pageSections = homePage?.sections
    ? [...homePage.sections].sort((a: any, b: any) => a.order - b.order)
    : null;
  $: sectionOrder = pageSections
    ? pageSections
        .filter((s: any) => s.visible !== false)
        .map((s: any) => resolveComponentKey(s.sectionType))
    : ($siteConfig?.sectionOrder || sections.map((s) => s.id));
  $: parallaxSpeed = $siteConfig?.parallaxSpeed ?? 0.5;

  // Build section data lookup (component key → section data with spacing/themeOverrides)
  $: sectionDataMap = (() => {
    const map: Record<string, any> = {};
    if (pageSections) {
      for (const s of pageSections) {
        const key = resolveComponentKey(s.sectionType);
        map[key] = s;
      }
    }
    return map;
  })();

  // Build nav label lookup from pages sections + registry
  $: sectionLabels = (() => {
    const labels: Record<string, string> = {};
    if (pageSections) {
      for (const s of pageSections) {
        const key = resolveComponentKey(s.sectionType);
        labels[key] = sectionTypeRegistry[s.sectionType]?.label ?? key;
      }
    }
    // Fallback labels from static sections metadata
    for (const s of sections) {
      if (!labels[s.id]) labels[s.id] = s.label;
    }
    return labels;
  })();

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
  };

  let activeSection = "hero";
  let sectionElements: Record<string, HTMLElement> = {};
  let observer: IntersectionObserver | undefined;
  let lazyObs: IntersectionObserver | undefined;
  let ticking = false;
  let scrollY = 0;
  let parallaxEnabled = true;

  // Lazy loading: track which sections are near viewport
  let visibleSections = new Set<string>(["hero"]); // Hero always rendered
  // Viewport tracking for parallax (only apply transforms to visible sections)
  let inViewport = new Set<string>(["hero"]);
  let sectionOffsets: Record<string, number> = {};
  let _resizeHandler: (() => void) | null = null;

  // Re-observe section elements (called imperatively from subscription callback, not reactively)
  function reobserveSections() {
    for (const id of sectionOrder) {
      visibleSections.add(id);
    }
    visibleSections = visibleSections;

    if (observer) {
      observer.disconnect();
      for (const id of sectionOrder) {
        const el = document.getElementById(id);
        if (el) {
          sectionElements[id] = el;
          sectionOffsets[id] = el.offsetTop;
          observer.observe(el);
        }
      }
    }
  }

  // Scroll spy via IntersectionObserver
  onMount(() => {
    // Subscribe to home page from pages table
    const client = getConvexClient();
    homePageUnsub = client.onUpdate(api.pages.getByPageId, { pageId: "home" }, (data: any) => {
      if (data) {
        homePage = data;
        tick().then(reobserveSections);
      }
    });

    // Lazy load observer: render sections when ~1 viewport away
    lazyObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
            visibleSections = visibleSections; // trigger reactivity
            lazyObs!.unobserve(entry.target); // once visible, always rendered
          }
        }
      },
      { rootMargin: "100% 0px" }
    );

    // Observe placeholder elements for lazy loading
    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (el) lazyObs.observe(el);
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
            inViewport.add(entry.target.id);
            history.replaceState(null, "", `/#${activeSection}`);
          } else {
            inViewport.delete(entry.target.id);
          }
        }
        inViewport = inViewport;
      },
      { rootMargin: "-40% 0px -60% 0px" }
    );

    // Observe all section wrappers + cache offsets
    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (el) {
        sectionElements[id] = el;
        sectionOffsets[id] = el.offsetTop;
        observer.observe(el);
      }
    }

    // Recache offsets on resize
    const recacheOffsets = () => {
      for (const [id, el] of Object.entries(sectionElements)) {
        sectionOffsets[id] = el.offsetTop;
      }
    };
    window.addEventListener('resize', recacheOffsets);
    _resizeHandler = recacheOffsets;

    // Handle initial hash
    const hash = window.location.hash.slice(1);
    if (hash && sectionElements[hash]) {
      sectionElements[hash].scrollIntoView({ behavior: "smooth" });
    }
  });

  onDestroy(() => {
    observer?.disconnect();
    lazyObs?.disconnect();
    homePageUnsub?.();
    if (_resizeHandler) window.removeEventListener('resize', _resizeHandler);
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

  function handleScroll() {
    if (!parallaxEnabled || $isReaderMode) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      scrollY = window.scrollY;
      ticking = false;
    });
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

<svelte:window on:keydown={handleKeydown} on:scroll={handleScroll} />

<div class="one-page" class:reader-mode={$isReaderMode}>
  <!-- Section nav (scroll spy) -->
  <nav class="section-nav" aria-label="Page sections">
    {#each sectionOrder as id}
      {@const label = sectionLabels[id]}
      {#if label && componentMap[id]}
        <button
          class="section-nav-item"
          class:active={activeSection === id}
          on:click={() => scrollToSection(id)}
        >
          {label}
        </button>
      {/if}
    {/each}
  </nav>

  <!-- Sections -->
  {#each sectionOrder as id (id)}
    {@const sd = sectionDataMap[id]}
    <section
      class="section-wrapper"
      class:parallaxing={parallaxEnabled && !$isReaderMode && inViewport.has(id)}
      {id}
      style:margin-top="{sd?.spacingBefore ?? 0}px"
      style:margin-bottom="{sd?.spacingAfter ?? 0}px"
      style:padding-top="{sd?.themeOverrides?.paddingTop ?? 0}px"
      style:padding-right="{sd?.themeOverrides?.paddingRight ?? 0}px"
      style:padding-bottom="{sd?.themeOverrides?.paddingBottom ?? 0}px"
      style:padding-left="{sd?.themeOverrides?.paddingLeft ?? 0}px"
      style:transform={parallaxEnabled && !$isReaderMode && inViewport.has(id)
        ? `translateY(${(scrollY - (sectionOffsets[id] ?? 0)) * parallaxSpeed * 0.1}px)`
        : undefined}
    >
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
    top: var(--header-height, 3.5rem);
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

  .section-wrapper.parallaxing {
    will-change: transform;
  }

  /* Reader mode hides the section nav */
  .reader-mode .section-nav {
    display: none;
  }
</style>
