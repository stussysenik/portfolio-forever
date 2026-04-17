<script lang="ts">
    import Katex from '$lib/components/Katex.svelte';
    import { parseMath } from '$lib/utils/parseMath';
    export let projects: any[] = [];
</script>

<div class="case-study-grid">
    {#each projects as project}
        <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            class="case-card"
        >
            <div class="accent-line"></div>
            <div class="card-body">
                <div class="card-top">
                    {#if project.category}
                        <span class="category-badge">{project.category}</span>
                    {/if}
                    {#if project.year}
                        <span class="year">{project.year}</span>
                    {/if}
                </div>
                <h2 class="card-title">{project.title}</h2>
                {#if project.description}
                    <p class="card-description">
                        {#each parseMath(project.description) as seg}
                            {#if seg.type === 'text'}
                                {seg.value}
                            {:else}
                                <Katex content={seg.value} displayMode={seg.displayMode} />
                            {/if}
                        {/each}
                    </p>
                {/if}
                {#if project.tools && project.tools.length > 0}
                    <div class="tech-stack">
                        {#each project.tools as tool}
                            <span class="tech-badge">{tool}</span>
                        {/each}
                    </div>
                {/if}
                <span class="visit-link">Visit project →</span>
            </div>
        </a>
    {/each}
</div>

<style>
    .case-study-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    @media (min-width: 640px) {
        .case-study-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .case-study-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .case-card {
        display: flex;
        flex-direction: row;
        background: #0A0A0A;
        color: #E8E8E8;
        border-radius: 6px;
        overflow: hidden;
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .case-card:hover {
        transform: scale(1.015);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }

    .accent-line {
        width: 3px;
        flex-shrink: 0;
        background: oklch(0.78 0.14 85);
    }

    .card-body {
        padding: 1.25rem 1.125rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    .card-top {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .category-badge {
        font-size: var(--font-size-xs, 0.75rem);
        font-family: var(--font-mono, monospace);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 0.2em 0.55em;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.08);
        color: oklch(0.78 0.14 85);
        border: 1px solid oklch(0.78 0.14 85 / 0.25);
    }

    .year {
        font-size: var(--font-size-xs, 0.75rem);
        font-family: var(--font-mono, monospace);
        color: rgba(232, 232, 232, 0.4);
        margin-left: auto;
    }

    .card-title {
        font-size: 1.05rem;
        font-weight: 600;
        color: #E8E8E8;
        margin: 0;
        line-height: 1.3;
        letter-spacing: -0.01em;
    }

    .card-description {
        font-size: 0.8rem;
        line-height: 1.55;
        color: rgba(232, 232, 232, 0.65);
        margin: 0;
        flex: 1;
    }

    .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
    }

    .tech-badge {
        font-size: var(--font-size-xs, 0.75rem);
        font-family: var(--font-mono, monospace);
        padding: 0.2em 0.5em;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(232, 232, 232, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .visit-link {
        font-size: var(--font-size-xs, 0.75rem);
        font-family: var(--font-mono, monospace);
        color: oklch(0.78 0.14 85 / 0.7);
        margin-top: 0.25rem;
        transition: color 0.15s ease;
    }

    .case-card:hover .visit-link {
        color: oklch(0.78 0.14 85);
    }
</style>
