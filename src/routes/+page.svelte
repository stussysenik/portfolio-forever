<script lang="ts">
        import {
                sortedWorks,
                profile,
                formatDate,
                getHighlight,
        } from "$lib/data/content";
        import AsciiDonut from "$lib/components/AsciiDonut.svelte";
        import Elevator from "$lib/components/Elevator.svelte";
</script>

<svelte:head>
        <title>Stüssy Senik</title>
        <meta name="description" content={profile.shortBio} />
</svelte:head>

<!-- Hero - Breathing Space -->
<header class="hero">
        <div class="hero-content">
                <div class="hero-main">
                        <h1 class="hero-name">{profile.name}</h1>
                        <p class="hero-tagline">{profile.taglines[0].text}</p>
                </div>

                <p class="hero-bio">{profile.shortBio}</p>

                <div class="hero-meta">
                        <span class="hero-location">{profile.location}</span>
                </div>
        </div>

        <div class="hero-visual">
                <AsciiDonut />
        </div>
</header>

<div class="page-sections">
<!-- THE WORK - First, because it speaks loudest -->
<section class="section">
        <header class="section-header">
                <span class="section-marker">◆</span>
                <h2 class="section-title">WORKS</h2>
                <span class="section-count">{sortedWorks.length}</span>
        </header>
        <ul class="entry-list">
                {#each sortedWorks as entry}
                        <li class="entry" data-highlight={getHighlight(entry)}>
                                <span class="entry-date"
                                        >{formatDate(entry)}</span
                                >
                                <span class="entry-title">{entry.title}</span>
                                {#if entry.links && entry.links.length > 0}
                                        <span class="entry-links">
                                                {#each entry.links as link}
                                                        <a href={link.url}
                                                                >{link.label}</a
                                                        >
                                                {/each}
                                        </span>
                                {/if}
                        </li>
                {/each}
        </ul>
</section>

<!-- Identity -->
<section class="section">
        <header class="section-header">
                <span class="section-marker">◆</span>
                <h2 class="section-title">IDENTITY</h2>
        </header>
        <div class="domains">
                <span class="domain-group">
                        <a href="https://mxzou.com" target="_blank" rel="noopener noreferrer">mxzou.com</a>
                        <span class="domains-sep">·</span>
                        <span class="domains-desc">main</span>
                </span>
                <span class="domain-group">
                        <a href="https://mengxuanzou.com" target="_blank" rel="noopener noreferrer">mengxuanzou.com</a>
                        <span class="domains-sep">·</span>
                        <span class="domains-desc">filmmaking</span>
                </span>
                <span class="domain-group">
                        <a href="https://stussysenik.com" target="_blank" rel="noopener noreferrer">stussysenik.com</a>
                        <span class="domains-sep">·</span>
                        <span class="domains-desc">dev + creative</span>
                </span>
        </div>
</section>
</div>

<!-- Elevator back-to-top with music -->
<Elevator showAfter={400} />

<style>
        /* HERO */
        .hero {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: var(--space-xl);
                padding-top: var(--space-md);
                gap: var(--space-2xl);
        }

        .hero-content {
                display: flex;
                flex-direction: column;
                gap: var(--space-lg);
                max-width: 50ch;
                flex: 1.618 1 320px;
        }

        .hero-visual {
                flex: 1 1 280px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-width: 280px;
                max-width: 600px;
                overflow: visible;
                position: relative;
        }

        .hero-visual::before {
                content: "";
                position: absolute;
                width: 80%;
                height: 80%;
                background: radial-gradient(
                        circle,
                        var(--color-accent-subtle),
                        transparent
                );
                opacity: 0.15;
                border-radius: 50%;
                z-index: -1;
        }

        .hero-main {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
        }

        .hero-name {
                font-family: var(--font-sans);
                font-size: var(--font-size-display);
                font-weight: 500;
                letter-spacing: var(--letter-spacing-tighter);
                line-height: var(--line-height-tight);
                margin: 0;
                color: var(--color-text);
        }

        .hero-tagline {
                font-family: var(--font-mono);
                font-size: var(--font-size-lg);
                font-weight: var(--font-weight-normal);
                color: var(--color-text-secondary);
                letter-spacing: var(--letter-spacing-normal);
                line-height: var(--line-height-snug);
                margin: 0;
                max-width: 32ch;
        }

        .hero-bio {
                font-family: var(--font-mono);
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-normal);
                color: var(--color-text-muted);
                line-height: var(--line-height-relaxed);
                margin: 0;
                max-width: 38ch;
        }

        .hero-meta {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                font-size: var(--font-size-sm);
                color: var(--color-text-subtle);
                padding-top: var(--space-xs);
        }

        .hero-location {
                font-weight: var(--font-weight-normal);
        }

        /* Mobile adjustments for hero - Intentional, commanding design */
        @media (max-width: 900px) {
                .hero {
                        min-height: auto;
                        padding-top: var(--space-2xl);
                        padding-bottom: var(--space-3xl);
                        flex-direction: column-reverse;
                        gap: var(--space-2xl);
                        text-align: center;
                }

                .hero-content {
                        max-width: 100%;
                        flex: none;
                        align-items: center;
                        gap: var(--space-xl);
                }

                .hero-main {
                        gap: var(--space-md);
                }

                /* Hero name: commanding presence on mobile - minimum 40px */
                .hero-name {
                        font-size: clamp(2.5rem, 12vw, 3.5rem); /* 40px minimum, up to 56px */
                        letter-spacing: -0.03em;
                        line-height: 1;
                }

                .hero-tagline {
                        font-size: var(--font-size-lg);
                        line-height: var(--line-height-snug);
                }

                .hero-bio {
                        font-size: var(--font-size-base);
                        max-width: 32ch;
                        margin: 0 auto;
                }

                .hero-meta {
                        justify-content: center;
                        padding-top: var(--space-md);
                }

                .hero-visual {
                        width: 100%;
                        max-width: 280px;
                        min-width: auto;
                        justify-content: center;
                        order: -1;
                        margin-left: auto;
                        margin-right: 10%;
                        margin-bottom: var(--space-md);
                }
        }

        /* Large screens */
        @media (min-width: 1440px) {
                .hero {
                        gap: var(--space-3xl);
                }

                .hero-content {
                        max-width: 55ch;
                }

                .hero-visual {
                        max-width: 650px;
                        min-width: 350px;
                }
        }

        @media (min-width: 2560px) {
                .hero-content {
                        max-width: 58ch;
                }
        }

        /* SECTIONS */
        .section {
                margin-bottom: var(--section-gap);
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

        /* ENTRY LIST */
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

        .entry:hover {
                opacity: 0.9;
        }

        .entry[data-highlight="1"] {
                color: var(--color-design);
        }

        .entry[data-highlight="2"] {
                color: var(--color-technology);
        }

        .entry[data-highlight="3"] {
                color: var(--color-art);
        }

        .entry[data-highlight="4"] {
                color: var(--color-film);
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

        /* DOMAIN DISCOVERY */
        .domains {
                display: flex;
                flex-wrap: wrap;
                align-items: baseline;
                justify-content: space-between;
                gap: var(--space-md);
                padding: var(--space-xl) 0;
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: var(--color-text-subtle);
        }

        .domain-group {
                display: inline-flex;
                align-items: baseline;
                gap: var(--space-xs);
        }

        .domains a {
                color: var(--color-text-muted);
                text-decoration: none;
                transition: color var(--duration-fast) var(--easing);
        }

        .domains a:hover {
                color: var(--color-accent);
        }

        .domains-sep {
                opacity: 0.4;
        }

        .domains-desc {
                color: var(--color-text-subtle);
        }

        @media (max-width: 600px) {
                .domains {
                        flex-direction: column;
                        gap: var(--space-sm);
                        align-items: center;
                }
        }

        /* Page sections flex container for mobile reordering */
        .page-sections {
                display: flex;
                flex-direction: column;
        }

        @media (max-width: 768px) {
                .page-sections .domains {
                        order: -1; /* Domains appear before works on mobile */
                }
        }
</style>
