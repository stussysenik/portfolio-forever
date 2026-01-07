<script lang="ts">
        import {
                sortedWorks,
                sortedTalks,
                sortedInterviews,
                profile,
                formatDate,
                getHighlight,
        } from "$lib/data/content";
        import AsciiDonut from "$lib/components/AsciiDonut.svelte";
        import AsciiVideo from "$lib/components/AsciiVideo.svelte";

        // Featured showcase - the real thing
        const showcaseItems = [
                {
                        type: "video",
                        title: "Under Neon Lights",
                        subtitle: "Light • Film • 2024",
                        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        aspectRatio: "21/9",
                },
                {
                        type: "video",
                        title: "3D Comic",
                        subtitle: "WebGL • 2020",
                        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                        aspectRatio: "16/9",
                },
        ];
</script>

<svelte:head>
        <title>{profile.name}</title>
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

<!-- SHOWCASE - Live demos -->
<section class="section showcase-section">
        <header class="section-header">
                <span class="section-marker">◆</span>
                <h2 class="section-title">SHOWCASE</h2>
                <span class="section-meta">live embeds</span>
        </header>
        <div class="showcase-grid">
                {#each showcaseItems as item}
                        <div class="showcase-item">
                                <AsciiVideo
                                        src={item.src}
                                        title={item.title}
                                        aspectRatio={item.aspectRatio}
                                />
                                <div class="showcase-meta">
                                        <span class="showcase-title"
                                                >{item.title}</span
                                        >
                                        <span class="showcase-subtitle"
                                                >{item.subtitle}</span
                                        >
                                </div>
                        </div>
                {/each}
        </div>
</section>

<!-- TALKS & INTERVIEWS - Side by side, compact -->
<div class="two-column">
        <section class="section">
                <header class="section-header">
                        <span class="section-marker">◆</span>
                        <h2 class="section-title">TALKS</h2>
                        <span class="section-count">{sortedTalks.length}</span>
                </header>
                <ul class="entry-list">
                        {#each sortedTalks as entry}
                                <li
                                        class="entry"
                                        data-highlight={getHighlight(entry)}
                                >
                                        <span class="entry-date"
                                                >{formatDate(entry)}</span
                                        >
                                        <span class="entry-title"
                                                >{entry.title}</span
                                        >
                                        {#if entry.links && entry.links.length > 0}
                                                <span class="entry-links">
                                                        {#each entry.links as link}
                                                                <a
                                                                        href={link.url}
                                                                        >{link.label}</a
                                                                >
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
                        <span class="section-count"
                                >{sortedInterviews.length}</span
                        >
                </header>
                <ul class="entry-list">
                        {#each sortedInterviews as entry}
                                <li
                                        class="entry"
                                        data-highlight={getHighlight(entry)}
                                >
                                        <span class="entry-date"
                                                >{formatDate(entry)}</span
                                        >
                                        <span class="entry-title"
                                                >{entry.title}</span
                                        >
                                        {#if entry.links && entry.links.length > 0}
                                                <span class="entry-links">
                                                        {#each entry.links as link}
                                                                <a
                                                                        href={link.url}
                                                                        >{link.label}</a
                                                                >
                                                        {/each}
                                                </span>
                                        {/if}
                                </li>
                        {/each}
                </ul>
        </section>
</div>

<!-- Footer with technical signature -->
<footer class="page-footer">
        <div class="footer-content">
                <!-- <span class="footer-eof">/* EOF */</span> -->
                <span class="footer-copy"
                        >© {new Date().getFullYear()} {profile.name}</span
                >
                <!-- <span class="footer-edition">EDITION {profile.edition}</span> -->
        </div>
</footer>

<style>
        /* HERO */
        .hero {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                min-height: 65vh;
                min-height: 65dvh;
                margin-bottom: var(--section-gap);
                padding-top: var(--space-2xl);
                gap: var(--space-3xl);
        }

        .hero-content {
                display: flex;
                flex-direction: column;
                gap: var(--space-lg);
                max-width: 44ch;
                flex: 1 1 400px;
        }

        .hero-visual {
                flex: 1 1 400px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-width: 350px;
                max-width: 700px;
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
                font-size: var(--font-size-xl);
                font-weight: var(--font-weight-light);
                color: var(--color-text-secondary);
                letter-spacing: var(--letter-spacing-tight);
                line-height: var(--line-height-snug);
                margin: 0;
        }

        .hero-bio {
                font-size: var(--font-size-base);
                font-weight: var(--font-weight-normal);
                color: var(--color-text-muted);
                line-height: var(--line-height-relaxed);
                margin: 0;
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

        /* Mobile adjustments for hero */
        @media (max-width: 768px) {
                .hero {
                        min-height: auto;
                        padding-top: var(--space-xl);
                        flex-direction: column-reverse;
                        gap: var(--space-xl);
                        text-align: center;
                }

                .hero-content {
                        max-width: 100%;
                        flex: none;
                        align-items: center;
                }

                .hero-meta {
                        justify-content: center;
                }

                .hero-visual {
                        width: 100%;
                        max-width: 100%;
                        justify-content: center;
                        order: -1;
                        margin-bottom: var(--space-lg);
                }
        }

        /* Large screens */
        @media (min-width: 1440px) {
                .hero {
                        min-height: 60vh;
                        gap: var(--space-4xl);
                }

                .hero-content {
                        max-width: 50ch;
                }

                .hero-visual {
                        max-width: 800px;
                        min-width: 450px;
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

        .section-meta {
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                color: var(--color-text-subtle);
                margin-left: auto;
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
                transition: all var(--duration-fast) var(--easing);
        }

        .entry:hover {
                transform: translateX(2px);
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
                transition: opacity var(--duration-fast) var(--easing);
        }

        .entry-links a:hover {
                opacity: 0.7;
        }

        /* SHOWCASE */
        .showcase-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--space-xl);
        }

        @media (min-width: 768px) {
                .showcase-grid {
                        grid-template-columns: repeat(2, 1fr);
                }
        }

        .showcase-item {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
        }

        .showcase-meta {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                font-size: var(--font-size-sm);
                padding-top: var(--space-xs);
        }

        .showcase-title {
                font-weight: 500;
                color: var(--color-text);
        }

        .showcase-subtitle {
                font-size: var(--font-size-xs);
                color: var(--color-text-subtle);
        }

        /* TWO COLUMN */
        .two-column {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--space-3xl);
                margin-bottom: var(--section-gap);
        }

        @media (min-width: 768px) {
                .two-column {
                        grid-template-columns: repeat(2, 1fr);
                }
        }

        .two-column .section {
                margin-bottom: 0;
        }

        /* FOOTER */
        .page-footer {
                padding-top: var(--space-2xl);
                border-top: 1px solid var(--border-color-subtle);
                margin-top: var(--section-gap);
                padding-bottom: var(--space-2xl);
        }

        .footer-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: var(--color-text-subtle);
                opacity: 0.6;
        }

        .footer-eof {
                color: var(--color-accent);
        }

        /* Mobile adjustments */
        @media (max-width: 600px) {
                .footer-content {
                        flex-direction: column;
                        gap: var(--space-sm);
                }
        }
</style>
