<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { replaceState } from "$lib/app-shims";
  import { sections } from "$lib/sections/index";
  import { isReaderMode, siteConfig } from "$lib/stores/siteMode";
  import { depthController, physicsEngine } from "$lib/stores/controls";
  import { filterByDepth } from "$lib/utils/depth-filter";
  import { getParallaxMultiplier, getScrollBehavior } from "$lib/utils/scroll-physics";
  import { getConvexClient } from "$lib/convex";
  import { api } from "$convex/_generated/api";
  import { resolveComponentKey, sectionTypeRegistry } from "$lib/sections/registry";

  import Minimap from "$lib/components/Minimap.svelte";
  import HeroSection from "$lib/sections/HeroSection.svelte";
  import WorksSection from "$lib/sections/WorksSection.svelte";
  import ColorfulWorksTable from "$lib/components/ColorfulWorksTable.svelte";
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

  export let blogPosts: any[] = [];

  // Home page data from pages table (authoritative source for one-page section composition)
  let homePage: any = null;
  let homePageUnsub: (() => void) | null = null;
  let pageCatalog: any[] = [];
  let pageCatalogUnsub: (() => void) | null = null;

  // Derive section order from pages table, fall back to siteConfig
  $: pageSections = homePage?.sections
    ? [...homePage.sections].sort((a: any, b: any) => a.order - b.order)
    : null;
  $: rawSectionOrder = pageSections
    ? pageSections
        .filter((s: any) => s.visible !== false)
        .map((s: any) => resolveComponentKey(s.sectionType))
    : ($siteConfig?.sectionOrder || sections.map((s) => s.id));
    
  $: sectionOrder = (() => {
      const order = [...(rawSectionOrder || [])];
      
      // Ensure specific important sections are present if not already in order
      const worksIdx = order.indexOf('works');
      if (!order.includes('colored_works')) {
          if (worksIdx !== -1) {
              order.splice(worksIdx, 0, 'colored_works');
          } else {
              order.push('colored_works');
          }
      }

      const essentialSections = ['cv', 'process', 'media', 'academia', 'labs', 'likes', 'minor', 'gifts', 'talks', 'blog', 'terminal', 'os'];
      essentialSections.forEach(id => {
          if (!order.includes(id)) order.push(id);
      });
      
      return order;
  })();
  $: parallaxSpeed = $siteConfig?.parallaxSpeed ?? 0.5;

  // Depth-filtered sections: "full" returns all (default behavior unchanged)
  $: filteredSections = filterByDepth(sectionOrder, $depthController);

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
    const pageLabels: Record<string, string> = {};

    for (const page of pageCatalog) {
      if (page?.pageId && page?.label) {
        pageLabels[page.pageId] = page.label;
      }
    }

    if (pageSections) {
      for (const s of pageSections) {
        const key = resolveComponentKey(s.sectionType);
        labels[key] =
          pageLabels[key] ??
          sectionTypeRegistry[s.sectionType]?.label ??
          key;
      }
    }
    // Fallback labels from static sections metadata
    for (const s of sections) {
      if (!labels[s.id]) labels[s.id] = s.label;
    }
    labels.colored_works = labels.colored_works ?? "Selected Works";
    labels.hero = labels.hero ?? "Home";
    return labels;
  })();

  $: sectionRoutes = (() => {
    const routes: Record<string, string> = {};

    for (const section of sections) {
      routes[section.id] = section.route;
    }

    for (const page of pageCatalog) {
      if (page?.pageId && page?.route) {
        routes[page.pageId] = page.route;
      }
    }

    const fallbackRoutes: Record<string, string> = {
      hero: "/",
      colored_works: "/#colored_works",
      works: "/works",
      talks: "/talks",
      terminal: "/terminal",
      cv: "/cv",
      academia: "/academia",
      blog: "/blog",
      process: "/process",
      gallery: "/gallery",
      likes: "/likes",
      minor: "/minor",
      gifts: "/gifts",
      os: "/os",
      labs: "/labs",
      media: "/media",
    };

    for (const [id, route] of Object.entries(fallbackRoutes)) {
      if (!routes[id]) routes[id] = route;
    }

    return routes;
  })();

  // Map section IDs to components
  const componentMap: Record<string, any> = {
    hero: HeroSection,
    colored_works: ColorfulWorksTable,
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

  let activeSection = "hero";
  let sectionElements: Record<string, HTMLElement> = {};
  let observer: IntersectionObserver | undefined;
  let lazyObs: IntersectionObserver | undefined;
  let ticking = false;
  let scrollY = 0;
  let parallaxEnabled = false;

  // Track which sections are rendered. Initialize with all sections to show them by default.
  let visibleSections = new Set<string>();
  
  $: if (sectionOrder) {
    for (const id of sectionOrder) {
      visibleSections.add(id);
    }
    visibleSections = visibleSections;
  }

  // Viewport tracking for parallax (only apply transforms to visible sections)
  let inViewport = new Set<string>(["hero"]);
  let sectionOffsets: Record<string, number> = {};
  let _resizeHandler: (() => void) | null = null;
  let _hashChangeHandler: (() => void) | null = null;

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
    pageCatalogUnsub = client.onUpdate(api.pages.getAll, {}, (data: any) => {
      if (Array.isArray(data)) {
        pageCatalog = data;
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
            replaceState(`/#${activeSection}`, {});
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

    // Only handle hash navigation on explicit browser navigation (popstate),
    // not on initial page load to prevent unwanted auto-scrolling
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && sectionElements[hash]) {
        sectionElements[hash].scrollIntoView({ behavior: "smooth" });
      }
    };
    
    window.addEventListener('popstate', handleHashChange);
    _hashChangeHandler = handleHashChange;
  });

  onDestroy(() => {
    observer?.disconnect();
    lazyObs?.disconnect();
    homePageUnsub?.();
    pageCatalogUnsub?.();
    if (_resizeHandler) window.removeEventListener('resize', _resizeHandler);
    if (_hashChangeHandler) window.removeEventListener('popstate', _hashChangeHandler);
  });

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: getScrollBehavior($physicsEngine) });
    }
  }

  // Keyboard navigation: j/k to move between sections
  function handleKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    const currentIndex = filteredSections.indexOf(activeSection);
    if (e.key === "j" && currentIndex < filteredSections.length - 1) {
      e.preventDefault();
      scrollToSection(filteredSections[currentIndex + 1]);
    } else if (e.key === "k" && currentIndex > 0) {
      e.preventDefault();
      scrollToSection(filteredSections[currentIndex - 1]);
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

  function formatSectionIndex(index: number) {
    return String(index + 1).padStart(2, "0");
  }
</script>

<svelte:window on:keydown={handleKeydown} on:scroll={handleScroll} />

<div
  class="one-page safe-boundary-viewport"
  class:reader-mode={$isReaderMode}
  style:--color-accent={homePage?.themeOverrides?.accentColor ?? null}
>
  <div class="safety-rectangle"></div>
  
  <Minimap 
    sections={filteredSections} 
    {activeSection} 
    {sectionLabels}
  />
  
  <!-- Sections -->
  {#each filteredSections as id, index (id)}
    {@const sd = sectionDataMap[id]}
    <section
      class="section-wrapper"
      class:section-wrapper--hero={id === "hero"}
      class:parallaxing={parallaxEnabled && !$isReaderMode && inViewport.has(id)}
      {id}
      style:margin-top="{sd?.spacingBefore ?? 0}px"
      style:margin-bottom="{sd?.spacingAfter ?? 0}px"
      style:padding-top="{sd?.themeOverrides?.paddingTop ?? 0}px"
      style:padding-right="{sd?.themeOverrides?.paddingRight ?? 0}px"
      style:padding-bottom="{sd?.themeOverrides?.paddingBottom ?? 0}px"
      style:padding-left="{sd?.themeOverrides?.paddingLeft ?? 0}px"
      style:transform={parallaxEnabled && !$isReaderMode && inViewport.has(id)
        ? `translateY(${(scrollY - (sectionOffsets[id] ?? 0)) * parallaxSpeed * getParallaxMultiplier($physicsEngine)}px)`
        : undefined}
    >
      {#if id === "hero"}
        {#if visibleSections.has(id)}
          <svelte:component this={componentMap[id]} {...getSectionProps(id)} />
        {:else}
          <div class="section-placeholder" style="min-height: 50vh;"></div>
        {/if}
      {:else}
        <div class="home-module">
          <header class="home-module__header">
            <div class="home-module__meta">
              <span class="home-module__index">{formatSectionIndex(index)}</span>
              <span class="home-module__route">{sectionRoutes[id] ?? `/${id}`}</span>
            </div>
            <h2 class="home-module__title">{sectionLabels[id] ?? id}</h2>
          </header>

          <div class="home-module__body">
            {#if visibleSections.has(id)}
              <svelte:component this={componentMap[id]} {...getSectionProps(id)} />
            {:else}
              <div class="section-placeholder" style="min-height: 50vh;"></div>
            {/if}
          </div>
        </div>
      {/if}
    </section>
  {/each}
</div>

<style>
  .one-page {
    position: relative;
    width: 100%;
    display: grid;
  }

  .safe-boundary-viewport {
    position: relative;
    max-width: 116rem;
    margin: 0 auto;
    padding: clamp(1rem, 2vw, 2rem) clamp(0.35rem, 1vw, 0.9rem) var(--space-4xl);
    box-sizing: border-box;
    min-height: 100vh;
  }

  .safety-rectangle {
    position: absolute;
    inset: 0;
    border: 1px solid color-mix(in srgb, var(--border-color) 82%, transparent);
    pointer-events: none;
    z-index: 0;
    opacity: 0.65;
    border-radius: clamp(1rem, 2vw, 2rem);
  }

  .section-wrapper {
    min-height: 0;
    padding-block: clamp(2.5rem, 5vw, 5rem);
    position: relative;
    z-index: 1;
    scroll-margin-top: clamp(5rem, 10vw, 7rem);
  }

  .section-wrapper--hero {
    scroll-margin-top: 0;
  }

  .section-wrapper.parallaxing {
    will-change: transform;
  }

  .home-module {
    display: grid;
    gap: var(--space-xl);
    border-top: 1px solid color-mix(in srgb, var(--border-color-strong) 72%, transparent);
    padding-top: clamp(1rem, 1.75vw, 1.75rem);
  }

  .home-module__header {
    display: grid;
    gap: var(--space-xs);
    align-items: end;
    align-content: start;
  }

  .home-module__meta {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs, 0.6875rem);
    color: var(--color-text-subtle);
    letter-spacing: var(--letter-spacing-wide);
  }

  .home-module__index {
    color: var(--color-accent);
    font-variant-numeric: tabular-nums;
  }

  .home-module__route {
    opacity: 0.8;
  }

  .home-module__title {
    margin: 0;
    max-width: 11ch;
    font-size: clamp(1.45rem, 1.05rem + 1.8vw, 3rem);
    line-height: 0.96;
    letter-spacing: var(--letter-spacing-tight);
    font-weight: var(--font-weight-semibold, 600);
  }

  .home-module__body {
    min-width: 0;
    max-width: min(82rem, 100%);
  }

  @media (min-width: 768px) {
    .home-module {
      grid-template-columns: minmax(10rem, 15rem) minmax(0, 1fr);
      gap: var(--space-xl) var(--space-2xl);
      align-items: start;
    }

    .home-module__header {
      position: sticky;
      top: clamp(5rem, 9vh, 6.5rem);
      align-self: start;
      padding-block: 0.35rem 1rem;
      padding-right: var(--space-lg);
      border-right: 1px solid color-mix(in srgb, var(--border-color) 75%, transparent);
      background:
        linear-gradient(
          to bottom,
          color-mix(in srgb, var(--color-bg) 96%, transparent) 0%,
          color-mix(in srgb, var(--color-bg) 90%, transparent) 82%,
          transparent 100%
        );
    }

    .home-module__title {
      max-width: 7ch;
    }
  }

  @media (min-width: 1440px) {
    .safe-boundary-viewport {
      max-width: 120rem;
    }

    .home-module {
      grid-template-columns: minmax(12rem, 18rem) minmax(0, 1fr);
      gap: var(--space-2xl) var(--space-3xl);
    }

    .home-module__body {
      max-width: min(86rem, 100%);
    }
  }

  @media (min-width: 2200px) {
    .safe-boundary-viewport {
      max-width: 126rem;
      padding-inline: var(--space-md);
    }

    .section-wrapper {
      padding-block: clamp(3rem, 4vw, 6rem);
    }

    .home-module {
      grid-template-columns: minmax(13rem, 20rem) minmax(0, 1fr);
      gap: var(--space-2xl) clamp(3rem, 4vw, 5rem);
    }

    .home-module__body {
      max-width: min(92rem, 100%);
    }
  }
</style>
