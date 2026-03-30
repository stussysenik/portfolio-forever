<script lang="ts">
        import { onMount } from 'svelte';
        import {
                sortedTalks as staticTalks,
                sortedInterviews as staticInterviews,
                profile,
                getHighlight,
        } from "$lib/data/content";
        import { getConvexClient } from '$lib/convex';
        import { api } from '$convex/_generated/api';

        export let id = "talks";

        let talks: any[] = staticTalks;
        let interviews: any[] = staticInterviews;

        function formatDate(entry: any) {
                if (entry.month) {
                        const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        return `${months[entry.month]} ${String(entry.year).slice(2)}`;
                }
                return String(entry.year);
        }

        onMount(() => {
                const client = getConvexClient();
                const unsub = client.onUpdate(api.talks.getVisibleTalks, {}, (data) => {
                        if (data && data.length > 0) {
                                talks = data.filter((e: any) => e.entryType === 'talk');
                                interviews = data.filter((e: any) => e.entryType === 'interview');
                        }
                });
                return () => unsub();
        });
</script>

<svelte:head>
        <title>Talks & Interviews | {profile.name}</title>
        <meta name="description" content="Talks, presentations, and interviews by {profile.name}" />
</svelte:head>

<div {id} class="talks-wrapper">
<div class="two-column">
        <section class="section">
                <header class="section-header">
                        <span class="section-marker">◆</span>
                        <h2 class="section-title">TALKS</h2>
                        <span class="section-count">{talks.length}</span>
                </header>
                <ul class="entry-list">
                        {#each talks as entry}
                                <li class="entry" data-highlight={getHighlight(entry)}>
                                        <span class="entry-date">{entry.month ? formatDate(entry) : entry.year}</span>
                                        <span class="entry-title">{entry.title}</span>
                                        {#if entry.links && entry.links.length > 0}
                                                <span class="entry-links">
                                                        {#each entry.links as link}
                                                                <a href={link.url}>{link.label}</a>
                                                        {/each}
                                                </span>
                                        {/if}
                                </li>
                        {/each}
                </ul>
        </section>

        <section class="section">
                <header class="section-header">
                        <span class="section-marker">◆</span>
                        <h2 class="section-title">INTERVIEWS</h2>
                        <span class="section-count">{interviews.length}</span>
                </header>
                <ul class="entry-list">
                        {#each interviews as entry}
                                <li class="entry" data-highlight={getHighlight(entry)}>
                                        <span class="entry-date">{entry.month ? formatDate(entry) : entry.year}</span>
                                        <span class="entry-title">{entry.title}</span>
                                        {#if entry.links && entry.links.length > 0}
                                                <span class="entry-links">
                                                        {#each entry.links as link}
                                                                <a href={link.url}>{link.label}</a>
                                                        {/each}
                                                </span>
                                        {/if}
                                </li>
                        {/each}
                </ul>
        </section>
</div>
</div>

<style>
        .talks-wrapper {
                max-width: 900px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
        }

        .two-column {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--space-3xl);
        }

        @media (min-width: 768px) {
                .two-column {
                        grid-template-columns: repeat(2, 1fr);
                }
        }

        .section {
                margin-bottom: 0;
        }

        .section-header {
                display: flex;
                align-items: baseline;
                gap: var(--space-sm);
                margin-bottom: var(--space-lg);
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

        .section-count {
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                color: var(--color-text-subtle);
        }

        .section-count::before {
                content: "[";
        }
        .section-count::after {
                content: "]";
        }

        .entry-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
        }

        .entry {
                display: flex;
                align-items: baseline;
                gap: var(--space-md);
                padding: var(--space-sm) 0;
        }

        .entry-date {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: var(--color-text-subtle);
                min-width: 5ch;
                flex-shrink: 0;
                font-variant-numeric: tabular-nums;
        }

        .entry-title {
                font-size: var(--font-size-sm);
                color: var(--color-text);
                font-weight: 450;
                flex-grow: 1;
        }

        .entry-links {
                display: flex;
                gap: var(--space-sm);
        }

        .entry-links a {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: var(--color-accent);
                text-decoration: none;
        }

        .entry-links a:hover {
                text-decoration: underline;
        }
</style>
