<script lang="ts">
        /**
         * Colorful Works Table Component
         * 
         * A Svelte component that renders a colorful table of works/projects.
         * Matches the "WORKS" list in the user screenshot.
         */

        import { onMount } from 'svelte';
        import { getConvexClient } from '$lib/convex';
        import { api } from '$convex/_generated/api';
        import { works as staticWorks, formatDate } from '$lib/data/content';

        export let pageId = 'works';
        export let maxCount: number | null = null;

        interface Work {
                title: string;
                url: string;
                category?: string;
                date?: string;
                year?: number;
                month?: number;
                featured?: string;
                hidden?: boolean;
        }

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
                                                featured: w.featured || w.styleOverrides?.accentColor,
                                                date: w.date,
                                                year: w.year,
                                                month: w.month,
                                                hidden: w.hidden ?? false
                                        }));
                                        loaded = true;
                                }
                        });
                } catch (e) {
                        console.warn('Failed to load Convex data:', e);
                        works = (staticWorks as any).map((w: any) => ({
                                ...w,
                                url: w.links?.[0]?.url ?? w.url ?? '#'
                        }));
                        loaded = true;
                }
        }

        $: effectiveWorks = works.length > 0 ? works : (staticWorks as any).map((w: any) => ({
                ...w,
                url: w.links?.[0]?.url ?? w.url ?? '#'
        }));

        $: sortedWorks = [...effectiveWorks]
                .filter(w => !w.hidden)
                .sort((a, b) => {
                        const yearDiff = (b.year || 0) - (a.year || 0);
                        if (yearDiff !== 0) return yearDiff;
                        return (b.month || 0) - (a.month || 0);
                });

        $: displayWorks = maxCount ? sortedWorks.slice(0, maxCount) : sortedWorks;

        // Map featured color names to actual CSS values - More vibrant as per screenshot
        const colorMap: Record<string, string> = {
                orange: '#F97242',
                cloud: '#EBEBEB',
                ocean: '#BAF1F9',
                gold: '#DAB230',
                pink: '#FFC0CB',
                'electric-green': '#39FF14',
                green: '#4CAF50',
                yellow: '#FFEB3B',
                red: '#F44336'
        };

        function getRowStyle(work: any) {
                const color = work.featured ? (colorMap[work.featured] || work.featured) : null;
                if (!color) return '';
                return `--row-bg: ${color}`;
        }
</script>

<section class="works-list-container" id={pageId}>
        <style>
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
                        color: #2563eb; /* Blue diamond */
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

                .works-list {
                        display: block;
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

        <header class="table-header">
                <span class="table-marker">◆</span>
                <h2 class="table-title">WORKS</h2>
                <span class="table-count">[{displayWorks.length}]</span>
        </header>

        <div class="works-list">
                {#each displayWorks as work}
                        <a 
                                href={work.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="work-row"
                                style={getRowStyle(work)}
                        >
                                <span class="work-date">{formatDate(work)}</span>
                                <span class="work-title">{work.title}</span>
                                <span class="work-link">visit</span>
                        </a>
                {/each}
        </div>
</section>
