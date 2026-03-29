<script lang="ts">
        import { onMount } from "svelte";
        import { profile } from "$lib/data/content";
        import { getConvexClient } from '$lib/convex';
        import { api } from '$convex/_generated/api';

        export let id = "works";

        interface Project {
                title: string;
                url: string;
                category?: string;
                preview?: string;
                viewport?: number;
                cam?: string;
        }

        // Static fallback
        const staticProjects: Project[] = [
                { title: "mymind.com clone", url: "https://curate-your-own-network.stussysenik.com", category: "personal software", preview: "/previews/curate-your-own-network.png" },
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

        $: displayMode = thumbnailConfig?.displayMode ?? 'grid';
        $: gridCols = thumbnailConfig?.columns ?? 2;
        $: showPreview = thumbnailConfig?.showPreview ?? true;

        function handleLoad(index: number) {
                loaded = { ...loaded, [index]: true };
        }

        onMount(() => {
                const client = getConvexClient();
                client.onUpdate(api.works.getVisibleWorks, {}, (data) => {
                        if (data && data.length > 0) {
                                projects = data;
                        }
                });
                client.onUpdate(api.thumbnails.getConfig, { section: 'works' }, (data) => {
                        thumbnailConfig = data;
                });

                document.querySelectorAll('.preview-image').forEach((img, _) => {
                        if ((img as HTMLImageElement).complete) {
                                const index = projects.findIndex(p => p.preview && (img as HTMLImageElement).src.includes(p.preview.replace(/^\//, '')));
                                if (index !== -1) handleLoad(index);
                        }
                });
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

        <div class="projects-grid" class:list-mode={displayMode === 'list'} style="--grid-cols: {gridCols};">
                {#each projects as project, i}
                        <div class="project-card">
                                {#if showPreview}
                                <div class="project-embed" class:loaded={loaded[i]}>
                                        {#if !loaded[i]}
                                                <div class="skeleton">
                                                        <div class="skeleton-shimmer"></div>
                                                </div>
                                        {/if}
                                        {#if project.preview}
                                                <a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link">
                                                        <img src={project.preview} alt={project.title} class="preview-image" loading="lazy" on:load={() => handleLoad(i)} />
                                                </a>
                                        {:else}
                                                <iframe
                                                        src={project.url}
                                                        title={project.title}
                                                        loading="lazy"
                                                        sandbox="allow-scripts allow-same-origin"
                                                        on:load={() => handleLoad(i)}
                                                        tabindex="-1"
                                                        style="--vp: {project.viewport ?? 2.5}; --cam: {project.cam ?? 'top left'};"
                                                ></iframe>
                                                <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-overlay">
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

        /* Grid */
        .projects-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--space-xl);
        }

        @media (min-width: 768px) {
                .projects-grid {
                        grid-template-columns: repeat(var(--grid-cols, 2), 1fr);
                }
        }

        /* List mode: single column, horizontal cards */
        .projects-grid.list-mode {
                grid-template-columns: 1fr;
        }

        .list-mode .project-card {
                flex-direction: row;
                align-items: center;
        }

        .list-mode .project-embed {
                max-width: 200px;
                flex-shrink: 0;
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
        }

        .preview-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center top;
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
