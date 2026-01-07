<script lang="ts">
        import { profile } from "$lib/data/content";

        const categories = [
                // {
                //   title: 'List philosophy',
                //   items: [
                //     'Dieter Rams designs',
                //   ]
                // },
                {
                        title: "Things I have broken",
                        items: ["so many fucking cameras 🤮"],
                },
                // {
                //   title: 'Things I have lost',
                //   items: [
                //    ''
                //   ]
                // },
                {
                        title: "Wishlist",
                        items: ["Range Rover"],
                },
                {
                        title: "Bottled wishes/goals for the year",
                        items: [
                                "like all the things... I know I will do it is not a challenge for me",
                        ],
                },
                // {
                //   title: 'Objects',
                //   items: [
                //     'Dieter Rams designs',
                //     'Mechanical Keyboards (HHKB)',
                //     'Fountain Pens',
                //     'Analog Cameras',
                //   ]
                // },
                // {
                //   title: 'Digital',
                //   items: [
                //     'Minimal interfaces',
                //     'Unix philosophy',
                //     'Rust & Zig',
                //     'Typography',
                //   ]
                // },
                // {
                //   title: 'Media',
                //   items: [
                //     'Sci-Fi literature',
                //     'Electronic music',
                //     'Brutalist architecture',
                //     'Indie films',
                //   ]
                // }
        ];
</script>

<svelte:head>
        <title>Likes • {profile.name}</title>
</svelte:head>

<section class="section">
        <header class="section-header">
                <span class="section-marker">◆</span>
                <h1 class="section-title">THINGS I LIKE</h1>
                <span class="section-meta">curated list</span>
        </header>

        <div class="likes-grid">
                {#each categories as category}
                        <div class="category">
                                <h2 class="category-title">{category.title}</h2>
                                <ul class="item-list">
                                        {#each category.items as item}
                                                <li class="item">{item}</li>
                                        {/each}
                                </ul>
                        </div>
                {/each}
        </div>
</section>

<style>
        .section {
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
                font-size: var(--font-size-lg);
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

        .likes-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--space-xl);
        }

        @media (min-width: 768px) {
                .likes-grid {
                        grid-template-columns: repeat(3, 1fr);
                }
        }

        .category {
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
        }

        .category-title {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                text-transform: uppercase;
                letter-spacing: var(--letter-spacing-wider);
                color: var(--color-text-subtle);
                margin: 0;
                padding-bottom: var(--space-xs);
                border-bottom: var(--border-width) dashed
                        var(--border-color-subtle);
        }

        .item-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
        }

        .item {
                font-size: var(--font-size-sm);
                color: var(--color-text);
                transition: color var(--duration-fast);
        }

        .item:hover {
                color: var(--color-accent);
        }
</style>
