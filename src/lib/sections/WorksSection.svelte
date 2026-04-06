<script lang="ts">
        import { onMount } from "svelte";
        import { profile } from "$lib/data/content";
        import { getConvexClient } from '$lib/convex';
        import { api } from '$convex/_generated/api';
        import WorksCaseStudy from './works/WorksCaseStudy.svelte';
        import WorksMinimalList from './works/WorksMinimalList.svelte';
        import VideoPreview from '$lib/components/VideoPreview.svelte';

        export let id = "works";

        interface Project {
                title: string;
                url: string;
                category?: string;
                preview?: string;
                previewMode?: 'live' | 'static' | 'video';
                videoPreview?: string;
                viewport?: number;
                cam?: string;
                objectPosition?: string;
                focalX?: number;
                focalY?: number;
                zoom?: number;
        }

        /** Show static image only when explicitly set to 'static' and preview exists */
        function useStaticPreview(p: Project): boolean {
                return p.previewMode === 'static' && !!p.preview;
        }

        /** Show video when mode is 'video' and videoPreview path exists */
        function useVideoPreview(p: Project): boolean {
                return p.previewMode === 'video' && !!p.videoPreview;
        }

        /** Compute CSS object-position from focal point. Fallback: focal -> cam -> objectPosition -> "center top" */
        function getObjectPosition(project: Project): string {
                if (project.focalX != null && project.focalY != null) {
                        return `${project.focalX}% ${project.focalY}%`;
                }
                return project.cam ?? project.objectPosition ?? 'center top';
        }

        /** Zoom transform when zoom > 1 */
        function getZoomStyle(project: Project): string {
                const zoom = project.zoom ?? 1.0;
                if (zoom <= 1.0) return '';
                const originX = project.focalX ?? 50;
                const originY = project.focalY ?? 50;
                return `transform: scale(${zoom}); transform-origin: ${originX}% ${originY}%;`;
        }

        let hoveredIndex: number = -1;
        let isTouchDevice = false;
        let visibleCards: Record<number, boolean> = {};

        /** Svelte action: IntersectionObserver for autoplay when visible */
        function inview(node: HTMLElement, index: number) {
                const observer = new IntersectionObserver(
                        ([entry]) => { visibleCards = { ...visibleCards, [index]: entry.isIntersecting }; },
                        { threshold: 0.3 }
                );
                observer.observe(node);
                return { destroy: () => observer.disconnect() };
        }

        // Static fallback
        const staticProjects: Project[] = [
                { title: "BYOA — Build Your Own Algorithm", url: "https://mymind-clone-production.up.railway.app/", category: "personal software", preview: "/previews/byoa-build-your-own-algorithm.png" },
                { title: "iPod emulator", url: "https://ipod-music.vercel.app", category: "tool", viewport: 2.0, cam: "center 30%" },
                { title: "spinning wheel AR filter", url: "https://spinning-wheel-filter.vercel.app", category: "AR/XR", viewport: 2.5, cam: "center center" },
                { title: "uyr-problem", url: "https://uyr-problem.vercel.app", category: "tool", viewport: 2.5, cam: "top center" },
                { title: "infinite checklist", url: "https://infinite-checklist.vercel.app", category: "tool", viewport: 2.5, cam: "top center" },
                { title: "typewriter", url: "https://clean-writer.vercel.app", category: "tool", viewport: 2.5, cam: "top left" },
                { title: "creative block", url: "https://creative-block.vercel.app", category: "art", viewport: 2.5, cam: "center center" },
                { title: "AR b-boy filter", url: "https://bboy-filter.vercel.app", category: "AR/XR", viewport: 2.5, cam: "center center" },
                { title: "PH-213 physics", url: "https://ph213.vercel.app", category: "science", viewport: 2.5, cam: "top center" },
                { title: "DVD corner", url: "https://dvd-video-animation.vercel.app", category: "art", viewport: 2.5, cam: "center center" },
                { title: "WAVELENGTH RADIO", url: "https://wavelength-radio.vercel.app", category: "music", viewport: 2.0, cam: "center center" },
        ];

        let projects: Project[] = staticProjects;
        let loaded: Record<number, boolean> = {};
        let thumbnailConfig: any = null;
        let sectionConfig: any = null;

        $: displayMode = thumbnailConfig?.displayMode ?? 'grid';
        $: gridCols = thumbnailConfig?.columns ?? 2;
        $: showPreview = thumbnailConfig?.showPreview ?? true;
        $: viewMode = sectionConfig?.immune ? 'grid' : (sectionConfig?.viewMode ?? 'grid');

        function handleLoad(index: number) {
                loaded = { ...loaded, [index]: true };
        }

        onMount(() => {
                isTouchDevice = window.matchMedia('(hover: none)').matches;

                const client = getConvexClient();
                const unsub1 = client.onUpdate(api.works.getVisibleWorks, {}, (data) => {
                        if (data && data.length > 0) {
                                projects = data;
                        }
                });
                const unsub2 = client.onUpdate(api.thumbnails.getConfig, { section: 'works' }, (data) => {
                        thumbnailConfig = data;
                });
                const unsub3 = client.onUpdate(api.sectionRegistry.getBySectionId, { sectionId: 'works' }, (data: any) => {
                        sectionConfig = data;
                });

                document.querySelectorAll('.preview-image').forEach((img, _) => {
                        if ((img as HTMLImageElement).complete) {
                                const index = projects.findIndex(p => p.preview && (img as HTMLImageElement).src.includes(p.preview.replace(/^\//, '')));
                                if (index !== -1) handleLoad(index);
                        }
                });

                return () => { unsub1(); unsub2(); unsub3(); };
        });
</script>

<svelte:head>
        <title>Works | {profile.name}</title>
        <meta name="description" content="Live project showcases by {profile.name}" />
</svelte:head>

<section {id} class="works-page">
        <header class="section-header">
                <span class="section-marker">◆</span>
                <h1 class="section-title">WORKS</h1>
                <span class="section-meta">live embeds · {projects.length} projects</span>
        </header>

        {#if viewMode === 'grid'}
                <div class="projects-grid" class:list-mode={displayMode === 'list'} style="--grid-cols: {gridCols};">
                        {#each projects as project, i}
                                <div class="project-card"
                                        use:inview={i}
                                        on:mouseenter={() => hoveredIndex = i}
                                        on:mouseleave={() => hoveredIndex = -1}
                                >
                                        {#if showPreview}
                                        <div class="project-embed" class:loaded={loaded[i]}>
                                                {#if !loaded[i]}
                                                        <div class="skeleton">
                                                                <div class="skeleton-shimmer"></div>
                                                        </div>
                                                {/if}
                                                {#if useVideoPreview(project)}
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link" aria-label="Visit {project.title}">
                                                                <VideoPreview
                                                                        src={project.videoPreview}
                                                                        poster={project.preview || ''}
                                                                        playing={visibleCards[i] || false}
                                                                />
                                                        </a>
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-overlay" aria-label="Visit {project.title}">
                                                                <span class="overlay-cta">Visit →</span>
                                                        </a>
                                                {:else if useStaticPreview(project)}
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link" aria-label="Visit {project.title}">
                                                                <img src={project.preview} alt="Screenshot of {project.title}" class="preview-image" loading="lazy" on:load={() => handleLoad(i)} style="object-position: {getObjectPosition(project)}; {getZoomStyle(project)}" />
                                                        </a>
                                                {:else}
                                                        <iframe
                                                                src={project.url}
                                                                title="Live preview of {project.title}"
                                                                loading="lazy"
                                                                sandbox="allow-scripts allow-same-origin"
                                                                on:load={() => handleLoad(i)}
                                                                tabindex="-1"
                                                                aria-hidden="true"
                                                                style="--vp: {project.viewport ?? 2.5}; --cam: {project.cam ?? 'top left'};"
                                                        ></iframe>
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-overlay" aria-label="Visit {project.title}">
                                                                <span class="overlay-cta">Visit →</span>
                                                        </a>
                                                {/if}
                                        </div>
                                        {/if}
                                        <div class="project-meta">
                                                {#if !showPreview}
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-title">{project.title}</a>
                                                {:else}
                                                        <span class="project-title">{project.title}</span>
                                                {/if}
                                                {#if project.category}
                                                        <span class="project-category">{project.category}</span>
                                                {/if}
                                        </div>
                                </div>
                        {/each}
                </div>
        {:else if viewMode === 'case-study'}
                <WorksCaseStudy {projects} />
        {:else if viewMode === 'minimal-list'}
                <WorksMinimalList {projects} />
        {/if}
</section>

<style>
        .works-page {
                margin-bottom: var(--section-gap);
        }

        .section-header {
                display: flex;
                align-items: baseline;
                gap: var(--space-sm);
                margin-bottom: var(--space-xl);
                padding-bottom: var(--space-sm);
                border-bottom: var(--border-width) solid var(--border-color);
        }

        .section-marker {
                color: var(--color-accent);
                font-size: var(--font-size-sm);
        }

        .section-title {
                font-family: var(--font-sans);
                font-size: var(--font-size-xs);
                font-weight: 600;
                letter-spacing: var(--letter-spacing-wider);
                color: var(--color-text);
                margin: 0;
        }

        .section-meta {
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                color: var(--color-text-subtle);
                margin-left: auto;
        }

        /* Grid — mobile-first responsive */
        .projects-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--space-lg);
        }

        @media (min-width: 480px) {
                .projects-grid {
                        grid-template-columns: repeat(min(var(--grid-cols, 2), 2), 1fr);
                }
        }

        @media (min-width: 768px) {
                .projects-grid {
                        grid-template-columns: repeat(var(--grid-cols, 2), 1fr);
                        gap: var(--space-xl);
                }
        }

        /* List mode */
        .projects-grid.list-mode {
                grid-template-columns: 1fr;
        }

        .list-mode .project-card {
                gap: var(--space-sm);
        }

        @media (min-width: 600px) {
                .list-mode .project-card {
                        flex-direction: row;
                        align-items: center;
                }

                .list-mode .project-embed {
                        max-width: 200px;
                        flex-shrink: 0;
                }
        }

        /* Card */
        .project-card {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
                transition: transform var(--duration-normal) var(--easing);
        }

        @media (min-width: 768px) {
                .project-card:hover {
                        transform: translateY(-2px);
                }
        }

        /* Embed container */
        .project-embed {
                position: relative;
                aspect-ratio: 16 / 10;
                border-radius: var(--radius-md);
                overflow: hidden;
                border: 1px solid var(--border-color);
                background: var(--color-surface);
                box-shadow: var(--shadow-sm);
                transition: box-shadow var(--duration-normal) var(--easing);
                contain: layout style paint;
        }

        .project-card:hover .project-embed {
                box-shadow: var(--shadow-md);
        }

        .project-embed iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: calc(var(--vp, 2.5) * 100%);
                height: calc(var(--vp, 2.5) * 100%);
                transform: scale(calc(1 / var(--vp, 2.5)));
                transform-origin: var(--cam, top left);
                border: none;
                pointer-events: none;
        }

        /* Static preview image for sites that block iframes */
        .preview-link {
                position: absolute;
                inset: 0;
                display: block;
                overflow: hidden;
        }

        .preview-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                /* object-position set via inline style with focal point fallback chain */
        }

        /* Overlay for desktop - click to visit */
        .project-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: hsla(0, 0%, 0%, 0);
                transition: background var(--duration-normal) var(--easing);
                text-decoration: none;
                z-index: 2;
        }

        .overlay-cta {
                font-family: var(--font-mono);
                font-size: var(--font-size-sm);
                font-weight: 500;
                color: #fff;
                background: hsla(0, 0%, 0%, 0.7);
                padding: var(--space-sm) var(--space-lg);
                border-radius: var(--radius-sm);
                opacity: 0;
                transform: translateY(4px);
                transition:
                        opacity var(--duration-normal) var(--easing),
                        transform var(--duration-normal) var(--easing);
        }

        .project-overlay:hover {
                background: hsla(0, 0%, 0%, 0.15);
        }

        .project-overlay:hover .overlay-cta {
                opacity: 1;
                transform: translateY(0);
        }

        /* Keyboard focus: show CTA */
        .project-overlay:focus-visible {
                box-shadow: inset 0 0 0 2px var(--color-accent);
        }

        .project-overlay:focus-visible .overlay-cta {
                opacity: 1;
                transform: translateY(0);
        }

        /* Mobile touch: always show CTA */
        @media (max-width: 767px) {
                .overlay-cta {
                        opacity: 1;
                        transform: translateY(0);
                }

                .project-overlay {
                        background: hsla(0, 0%, 0%, 0.08);
                }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
                .skeleton-shimmer { animation: none; }
                .project-card:hover { transform: none; }
                .overlay-cta { transition: none; }
                .project-overlay { transition: none; }
                .project-embed.loaded .skeleton { transition: none; }
        }

        /* Skeleton loading */
        .skeleton {
                position: absolute;
                inset: 0;
                background: var(--color-bg-alt);
                z-index: 1;
        }

        .skeleton-shimmer {
                position: absolute;
                inset: 0;
                background: linear-gradient(
                        90deg,
                        transparent 0%,
                        var(--color-surface) 50%,
                        transparent 100%
                );
                background-size: 200% 100%;
                animation: shimmer 1.8s ease-in-out infinite;
        }

        @keyframes shimmer {
                0% {
                        background-position: 200% 0;
                }
                100% {
                        background-position: -200% 0;
                }
        }

        .project-embed.loaded .skeleton {
                opacity: 0;
                pointer-events: none;
                transition: opacity var(--duration-slow) var(--easing);
        }

        /* Meta */
        .project-meta {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: var(--space-sm);
                padding: 0 var(--space-xs);
        }

        .project-title {
                font-size: var(--font-size-sm);
                font-weight: 450;
                color: var(--color-text);
        }

        .project-category {
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                color: var(--color-text-subtle);
                text-transform: lowercase;
        }
</style>
