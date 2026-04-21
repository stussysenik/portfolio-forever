<script lang="ts">
        import { onMount } from "svelte";
        import { profile, works as staticProjects } from "$lib/data/content";
        import { getConvexClient } from '$lib/convex';
        import { api } from '$convex/_generated/api';
        import { isScreenPass } from '$lib/stores/controls';
        import WorksCaseStudy from './works/WorksCaseStudy.svelte';
        import WorksMinimalList from './works/WorksMinimalList.svelte';
        import VideoPreview from '$lib/components/VideoPreview.svelte';
        import ColorfulWorksTable from '$lib/components/ColorfulWorksTable.svelte';

        import { siteMode, stagedOverrides, previewMode } from "$lib/stores/siteMode";
        import { applyOverrides } from '$lib/data/overrides';

        // Import from local logic ports
        import { 
                setupWorksSubscriptions, 
                overrideVars, 
                useStaticPreview, 
                useVideoPreview, 
                getObjectPosition, 
                getZoomStyle 
        } from '$lib/sections/works-logic';

        export let id = "works";
        export let forceViewMode: "grid" | "case-study" | "minimal-list" | "colorful-table" | null = null;

        interface Project {
                slug?: string;
                title: string;
                url: string;
                linkLabel?: string;
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
                styleOverrides?: {
                        accentColor?: string;
                        httpColor?: string;
                        secondaryHighlight?: string;
                };
        }

        let projects: Project[] = staticProjects;
        let loaded: Record<number, boolean> = {};
        let thumbnailConfig: any = null;
        let sectionConfig: any = null;
        let hoveredIndex: number = -1;
        let isTouchDevice = false;
        let visibleCards: Record<number, boolean> = {};

        function inview(node: HTMLElement, index: number) {
                const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                                visibleCards[index] = entry.isIntersecting;
                        });
                }, { threshold: 0.1 });
                observer.observe(node);
                return {
                        destroy() {
                                observer.unobserve(node);
                        }
                };
        }

        $: effectiveProjects = applyOverrides('worksEntries', projects, $stagedOverrides);
        $: effectiveThumbnailConfig = applyOverrides('thumbnails', thumbnailConfig, $stagedOverrides);
        $: effectiveSectionConfig = applyOverrides('pages', sectionConfig, $stagedOverrides);

        $: displayMode = effectiveThumbnailConfig?.displayMode ?? 'grid';
        $: gridCols = effectiveThumbnailConfig?.columns ?? 2;
        $: showPreview = effectiveThumbnailConfig?.showPreview ?? true;
        $: viewMode = forceViewMode ? forceViewMode : (effectiveSectionConfig?.immune ? 'grid' : (effectiveSectionConfig?.viewMode ?? 'grid'));

        $: visibleProjects = effectiveProjects;

        function handleLoad(index: number) {
                loaded = { ...loaded, [index]: true };
        }

        onMount(() => {
                isTouchDevice = window.matchMedia('(hover: none)').matches;

                const client = getConvexClient();
                const unsub = setupWorksSubscriptions(client, {
                        onWorks: (data: any[]) => {
                                if (data && data.length > 0) {
                                        projects = data.map((p: any) => {
                                                const url = p.url ?? p.link ?? p.links?.[0]?.url ?? '#';
                                                const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                                return {
                                                        ...p,
                                                        url,
                                                        slug
                                                };
                                        });
                                }
                        },
                        onThumbnails: (data: any) => {
                                thumbnailConfig = data;
                        },
                        onSection: (data: any) => {
                                sectionConfig = data;
                        }
                });

                document.querySelectorAll('.preview-image').forEach((img, _) => {
                        if ((img as HTMLImageElement).complete) {
                                const index = projects.findIndex(p => p.preview && (img as HTMLImageElement).src.includes(p.preview.replace(/^\//, '')));
                                if (index !== -1) handleLoad(index);
                        }
                });

                return () => { unsub(); };
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
                <span class="section-meta">live embeds · {visibleProjects.length} projects{$isScreenPass ? ` of ${projects.length}` : ''}</span>
        </header>

        {#if viewMode === 'grid'}
                <div class="projects-grid" role="list" class:list-mode={displayMode === 'list'} style="--grid-cols: {gridCols};">
                        {#each visibleProjects as project, i}
                                <div class="project-card"
                                        role="listitem"
                                        use:inview={i}
                                        on:mouseenter={() => hoveredIndex = i}
                                        on:mouseleave={() => hoveredIndex = -1}
                                        style={overrideVars(project)}
                                >
                                        {#if showPreview}
                                        <div class="project-embed" class:loaded={loaded[i]}>
                                                {#if !loaded[i]}
                                                        <div class="skeleton">
                                                                <div class="skeleton-shimmer"></div>
                                                        </div>
                                                {/if}
                                                {#if project.slug || project.title}
                                                        <iframe
                                                                src={`/embed/${project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
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
                                                {:else if useVideoPreview(project)}
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link" aria-label="Visit {project.title}">
                                                                <VideoPreview
                                                                        src={project.videoPreview}
                                                                        poster={project.preview || ''}
                                                                        playing={visibleCards[i] || false}
                                                                />
                                                        </a>
                                                {:else if useStaticPreview(project)}
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link" aria-label="Visit {project.title}">
                                                                <img src={project.preview} alt="Screenshot of {project.title}" class="preview-image" loading="lazy" on:load={() => handleLoad(i)} style="object-position: {getObjectPosition(project)}; {getZoomStyle(project)}" />
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
                                                {#if showPreview}
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-link">{project.linkLabel ?? project.url}</a>
                                                {/if}
                                        </div>
                                </div>
                        {/each}
                </div>
        {:else if viewMode === 'case-study'}
                <WorksCaseStudy {projects} />
        {:else if viewMode === 'minimal-list'}
                <WorksMinimalList {projects} />
        {:else if viewMode === 'colorful-table' || id === 'colorful-works'}
                <div class="works-table-wrapper">
                        <ColorfulWorksTable />
                </div>
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

	/* Grid — mobile-first responsive, 2 cols on mobile */
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-sm);
	}

	@media (min-width: 480px) {
		.projects-grid {
			grid-template-columns: repeat(min(var(--grid-cols, 2), 2), 1fr);
			gap: var(--space-lg);
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
		top: 50%;
		left: 50%;
		width: calc(var(--vp, 2.5) * 100%);
		height: calc(var(--vp, 2.5) * 100%);
		transform: translate(-50%, -50%) scale(calc(1 / var(--vp, 2.5)));
		transform-origin: center center;
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
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                        background: hsla(0, 0%, 0%, 0.8) !important;
                }

                .project-overlay {
                        background: hsla(0, 0%, 0%, 0.1) !important;
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
                flex-wrap: wrap;
                align-items: baseline;
                justify-content: space-between;
                gap: var(--space-xs) var(--space-sm);
                padding: 0 var(--space-xs);
                /* Left stripe consuming --works-stripe-color */
                border-left: 2px solid var(--works-stripe-color, transparent);
                padding-left: var(--space-sm);
        }

        .project-title {
                font-size: var(--font-size-sm);
                font-weight: 450;
                color: var(--color-text);
        }

        .project-category {
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                color: var(--works-secondary-highlight, var(--color-text-subtle));
                text-transform: lowercase;
        }

        .project-link {
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                color: var(--works-http-color, var(--color-accent));
                text-decoration: none;
                flex-basis: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
        }

        .project-link:hover {
                text-decoration: underline;
        }

        .works-table-wrapper {
                width: 100%;
                margin-top: var(--space-md);
        }
</style>
