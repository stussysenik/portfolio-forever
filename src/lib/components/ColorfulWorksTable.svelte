<script lang="ts">
        /**
         * Colorful Works Table Component
         * 
         * A Svelte component that renders a colorful striped table of works/projects.
         */

        import { onMount } from 'svelte';
        import { getConvexClient } from '$lib/convex';
        import { api } from '$convex/_generated/api';
        import { works as staticWorks } from '$lib/data/content';

        export let pageId = 'works';
        export let viewMode: 'table' | 'grid' | 'list' = 'table';
        export let palette: 'rainbow' | 'pastel' | 'cyberpunk' | 'monokai' = 'rainbow';
        export let maxCount: number | null = null;
        export let columns: string[] = ['title', 'category', 'description'];

        interface Work {
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
                styleOverrides?: {
                        accentColor?: string;
                        httpColor?: string;
                        secondaryHighlight?: string;
                };
                description?: string;
                tags?: string[];
                date?: string;
                hidden?: boolean;
        }

        // Color palettes
        const palettes: Record<string, string[]> = {
                rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
                pastel: ['#ffd1dc', '#ffec8b', '#c1ff8a', '#8afff6', '#e6e6fa', '#f0e6ff'],
                cyberpunk: ['#ff2ced', '#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff6600'],
                monokai: ['#ff6188', '#fc9867', '#ffd866', '#a9dc76', '#78dce8', '#ab9df2']
        };

        let works: Work[] = [];
        let loaded = false;

        async function loadConvexData() {
                const client = getConvexClient();

                try {
                        client.onUpdate(api.works.getVisibleWorks, {}, (data: any) => {
                                if (data && data.length > 0) {
                                        works = data.map((w: any) => ({
                                                title: w.title ?? w.name ?? 'Untitled',
                                                url: w.url ?? w.link ?? '#',
                                                category: w.category,
                                                preview: w.preview,
                                                previewMode: w.previewMode,
                                                videoPreview: w.videoPreview,
                                                viewport: w.viewport,
                                                cam: w.cam,
                                                objectPosition: w.objectPosition,
                                                focalX: w.focalX,
                                                focalY: w.focalY,
                                                zoom: w.zoom,
                                                styleOverrides: w.styleOverrides,
                                                description: w.description,
                                                tags: w.tags,
                                                date: w.date,
                                                hidden: w.hidden ?? false
                                        }));
                                        loaded = true;
                                }
                        });
                } catch (e) {
                        console.warn('Failed to load Convex data:', e);
                        works = staticWorks as any;
                        loaded = true;
                }
        }

        // Determine which works to display
        $: effectiveWorks = works.length > 0 ? works : (staticWorks as any);

        $: sortedWorks = [...effectiveWorks]
                .filter(w => !w.hidden)
                .sort((a, b) => {
                        const aDate = a.date ?? '0000-00-00';
                        const bDate = b.date ?? '0000-00-00';
                        return bDate.localeCompare(aDate);
                });

        $: displayWorks = maxCount ? sortedWorks.slice(0, maxCount) : sortedWorks;

        $: selectedPalette = palettes[palette] ?? palettes.rainbow;

        // CSS custom properties for color overrides
        $: stripeColor = selectedPalette[0];
        $: httpColor = selectedPalette[1];
        $: secondaryHighlight = selectedPalette[2];

        onMount(() => {
                loadConvexData();
        });
</script>

<section class="colorful-works-table" id={pageId}>
        <style>
                .colorful-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-family: var(--font-mono);
                        font-size: var(--font-size-sm);
                }

                .colorful-table th {
                        padding: var(--space-sm) var(--space-md);
                        text-align: left;
                        font-weight: 600;
                        color: var(--color-text);
                        border-bottom: 2px solid var(--border-color);
                }

                .colorful-table td {
                        padding: var(--space-sm) var(--space-md);
                        border-bottom: 1px solid var(--border-color);
                        vertical-align: middle;
                }

                .colorful-table tr {
                        transition: background-color 0.2s ease;
                        position: relative;
                }

                .colorful-table tr:hover {
                        background-color: var(--color-surface);
                }

                .colorful-table tr::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        width: 3px;
                        background: var(--works-stripe-color, var(--color-accent));
                        transform: skewX(-15deg);
                        transform-origin: bottom left;
                }

                .colorful-table a {
                        color: var(--works-http-color, var(--color-accent));
                        text-decoration: none;
                }

                .colorful-table a:hover {
                        text-decoration: underline;
                }

                .category-badge {
                        display: inline-block;
                        padding: 2px 8px;
                        background: var(--works-secondary-highlight, var(--color-bg-alt));
                        border-radius: 4px;
                        font-size: var(--font-size-2xs);
                        color: var(--color-text-subtle);
                        text-transform: lowercase;
                }

                .table-header {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    margin-bottom: var(--space-md);
                    padding-top: var(--space-xl);
                }

                .table-marker {
                    color: var(--color-accent);
                    font-size: var(--font-size-lg);
                }

                .table-title {
                    font-family: var(--font-sans);
                    font-size: var(--font-size-sm);
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: var(--letter-spacing-wider);
                }

                .table-meta {
                    font-family: var(--font-mono);
                    font-size: var(--font-size-2xs);
                    color: var(--color-text-subtle);
                    margin-left: auto;
                }

                @media (max-width: 768px) {
                        .colorful-table {
                                font-size: var(--font-size-xs);
                        }
                        .colorful-table th,
                        .colorful-table td {
                                padding: var(--space-xs) var(--space-sm);
                        }
                        .colorful-table tr::before {
                                width: 2px;
                        }
                        .table-meta {
                            display: none;
                        }
                }
        </style>

        <header class="table-header">
                <span class="table-marker">⣿</span>
                <h2 class="table-title">WORKS</h2>
                <span class="table-meta">
                        {displayWorks.length} projects · colorful table
                </span>
        </header>

        {#if viewMode === 'table'}
                <table class="colorful-table">
                        <thead>
                                <tr>
                                        {#if columns.includes('title')}<th>Project</th>{/if}
                                        {#if columns.includes('category')}<th>Category</th>{/if}
                                        {#if columns.includes('description')}<th>Description</th>{/if}
                                </tr>
                        </thead>
                        <tbody>
                                {#each displayWorks as work, i}
                                        <tr style="--works-stripe-color: {selectedPalette[i % selectedPalette.length]}; --works-http-color: {httpColor}; --works-secondary-highlight: {secondaryHighlight}">
                                                {#if columns.includes('title')}
                                                <td>
                                                        <a href={work.url} target="_blank" rel="noopener noreferrer">
                                                                {work.title ?? 'Untitled'}
                                                        </a>
                                                </td>
                                                {/if}
                                                {#if columns.includes('category')}
                                                <td>
                                                        {#if work.category}
                                                                <span class="category-badge">{work.category}</span>
                                                        {/if}
                                                </td>
                                                {/if}
                                                {#if columns.includes('description')}
                                                <td>{work.description ?? ''}</td>
                                                {/if}
                                        </tr>
                                {/each}
                        </tbody>
                </table>
        {/if}
</section>
