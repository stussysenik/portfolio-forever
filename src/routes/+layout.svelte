<script lang="ts">
        import "../app.css";
        import { page } from "$app/stores";
        import { siteConfig, socialLinks, profile } from "$lib/data/content";
        import { layoutConfig } from "$lib/data/layout-config";
        import CommandPalette from "$lib/components/CommandPalette.svelte";

        // Navigation - ordered by importance
        const mainNav = [
                { href: "/", label: "works" },
                { href: "/likes", label: "likes" },
                { href: "/notes", label: "notes" },
                { href: "/cv", label: "cv" },
                { href: "/terminal", label: "terminal" },
                { href: "/process", label: "process" },
        ];

        $: currentPath = $page.url.pathname;

        // Social links toggle for mobile
        let socialExpanded = false;

        function toggleSocial() {
                socialExpanded = !socialExpanded;
        }

        function handleGlobalSlash(e: KeyboardEvent) {
                if (typeof document === "undefined") return;

                // Check if user is typing in an input
                const active = document.activeElement;
                if (
                        active?.tagName === "INPUT" ||
                        active?.tagName === "TEXTAREA" ||
                        active?.getAttribute("contenteditable") === "true"
                ) {
                        return;
                }

                if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
                        e.preventDefault();
                        // Trigger Command Palette with '?' key logic
                        window.dispatchEvent(
                                new KeyboardEvent("keydown", { key: "?" }),
                        );
                }
        }
</script>

<svelte:window on:keydown={handleGlobalSlash} />

<svelte:head>
        <title>{siteConfig.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Command Palette (global) -->
<CommandPalette />

<!-- WIP BANNER - First visible element, before everything -->
{#if layoutConfig.showWipBanner && layoutConfig.wipBannerPosition !== 'hidden'}
<div class="wip-banner" class:wip-banner--sticky={layoutConfig.wipBannerPosition === 'sticky'}>
        <span class="wip-icon">⚠</span>
        <span class="wip-text">{layoutConfig.wipBannerMessage}</span>
        <span class="wip-icon">⚠</span>
</div>
{/if}

<header class="header">
        <div class="header-inner">
                <a href="/" class="header-name">{siteConfig.name}</a>

                <div class="header-nav-group">
                        <!-- Main navigation -->
                        <nav class="nav" aria-label="Main">
                                {#each mainNav as item}
                                        <a
                                                href={item.href}
                                                class="nav-link"
                                                class:active={currentPath ===
                                                        item.href ||
                                                        (item.href !== "/" &&
                                                                currentPath.startsWith(
                                                                        item.href,
                                                                ))}
                                        >
                                                {item.label}
                                        </a>
                                {/each}
                        </nav>

                        <!-- Desktop: social links inline | Mobile: toggle button -->
                        <button 
                                class="social-toggle"
                                on:click={toggleSocial}
                                aria-expanded={socialExpanded}
                                aria-label="Toggle social links"
                        >
                                {socialExpanded ? '×' : '@'}
                        </button>

                        <nav class="social-links" class:mobile-expanded={socialExpanded} aria-label="Social">
                                {#each socialLinks as link}
                                        <a href={link.url} target="_blank" rel="noopener">{link.label}</a>
                                {/each}
                        </nav>
                </div>
        </div>
</header>

<main>
        <slot />
</main>

<footer class="terminal">
        <div class="terminal-left">
                <span class="terminal-edition">© 2026</span>
                <span class="terminal-sep">·</span>
                <span class="terminal-path">{currentPath}</span>
        </div>
        <div class="terminal-right">
                <button
                        class="terminal-hint-btn"
                        on:click={() =>
                                window.dispatchEvent(
                                        new KeyboardEvent("keydown", {
                                                key: "?",
                                        }),
                                )}
                >
                        <span class="terminal-hint">/ for CMDs</span>
                </button>
                {#if profile.available}
                        <span class="terminal-sep">·</span>
                        <span class="terminal-status">
                                <span class="status-indicator"></span>
                                available
                        </span>
                {/if}
        </div>
</footer>

<style>
        .header {
                margin-bottom: var(--space-xl);
                padding-bottom: var(--space-md);
                border-bottom: var(--border-width) solid
                        var(--border-color-subtle);
        }

        .header-inner {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                gap: var(--space-sm);
                max-width: var(--max-width);
                margin: 0 auto;
                padding: 0 var(--container-padding);
        }

        @media (min-width: 768px) {
                .header-inner {
                        gap: var(--space-lg);
                }
        }

        .header-name {
                font-family: var(--font-sans);
                font-size: var(--font-size-base);
                font-weight: var(--font-weight-medium);
                color: var(--color-text);
                text-decoration: none;
                letter-spacing: var(--letter-spacing-tight);
                margin-right: auto;
        }

        @media (min-width: 768px) {
                .header-name {
                        font-size: var(--font-size-lg);
                        margin-right: 0;
                }
        }

        .nav {
                display: flex;
                flex-wrap: nowrap;
                gap: var(--space-xs);
        }

        @media (min-width: 768px) {
                .nav {
                        margin-left: auto;
                        margin-right: 0;
                        gap: var(--space-lg);
                }
        }

        .nav-link {
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-normal);
                color: var(--color-text-muted);
                text-transform: lowercase;
                padding: var(--space-xs) 0;
                position: relative;
                transition: color var(--duration-fast) var(--easing);
        }

        .nav-link:hover {
                color: var(--color-text);
        }

        .nav-link.active {
                color: var(--color-text);
        }

        .nav-link.active::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1.5px;
                background: var(--color-text);
        }

        /* Nav group - contains nav + @ toggle inline */
        /* Nav group - contains nav + @ toggle inline */
        .header-nav-group {
                position: relative; /* Anchor for dropdown */
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                margin-left: auto;
        }

        .social-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                font-weight: 600;
                color: var(--color-text);
                background: transparent;
                border: 1px solid var(--color-text-muted);
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: all var(--duration-fast) var(--easing);
                flex-shrink: 0;
        }

        .social-toggle:hover {
                color: var(--color-accent);
                border-color: var(--color-accent);
        }

        /* Toggle visibility - localized to the component logic */
        @media (min-width: 1025px) {
                .social-toggle {
                        display: none;
                }
        }

        /* Social dropdown */
        /* Social links - desktop: inline, mobile: dropdown */
        .social-links {
                display: none; /* Hidden on mobile by default */
        }

        .social-links a {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                font-weight: 500;
                color: var(--color-text-muted);
                padding: var(--space-xs) var(--space-sm);
                border-radius: var(--radius-sm);
                transition: all var(--duration-fast) var(--easing);
                white-space: nowrap;
        }

        .social-links a:hover {
                background: var(--color-surface);
                color: var(--color-accent);
        }

        /* Mobile/Tablet Dropdown Styles (Up to 1024px) */
        @media (max-width: 1024px) {
                .social-links.mobile-expanded {
                        display: flex;
                        flex-direction: column;
                        position: absolute;
                        top: 100%;
                        right: 0;
                        margin-top: var(--space-xs);
                        background: var(--color-bg);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-md);
                        padding: var(--space-xs);
                        z-index: 200;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                        gap: 2px;
                        min-width: 140px;
                }

                .social-links.mobile-expanded a {
                        display: block;
                        width: 100%;
                }
        }

        /* Desktop: always visible, inline with separator */
        @media (min-width: 1025px) {
                .social-links {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        position: static;
                        background: transparent;
                        border: none;
                        border-left: 1px solid var(--border-color-subtle);
                        border-radius: 0;
                        padding: 0;
                        padding-left: var(--space-lg);
                        margin-left: var(--space-2xl);
                        box-shadow: none;
                        gap: var(--space-xs);
                        min-width: 0;
                }

                .social-links a {
                        padding: var(--space-2xs) var(--space-xs);
                        font-size: var(--font-size-2xs);
                }

                .social-links a:hover {
                        background: transparent;
                }
        }

        /* Mobile responsive adjustments */
        @media (max-width: 1024px) {
                .header-inner {
                        gap: var(--space-sm);
                        justify-content: space-between; /* Ensure logo/nav are balanced */
                }

                .header-nav-group {
                        gap: var(--space-md); /* Increased gap for Pro Max sizes */
                }

                .nav {
                        gap: var(--space-xs);
                }
        }

        /* Tight spacing for small screens (iPhone SE, etc) */
        @media (max-width: 380px) {
                 .header-inner {
                        gap: var(--space-xs);
                }
                .header-nav-group {
                        gap: var(--space-xs);
                }
                .nav {
                        gap: var(--space-2xs);
                }
        }

        /* Terminal Status Bar */
        .terminal {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-sm) var(--container-padding);
                background: var(--color-surface);
                border-top: var(--border-width) solid var(--border-color);
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                z-index: 100;
                transition: background-color var(--duration-slow) var(--easing);
        }

        .terminal-left,
        .terminal-right {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
        }

        .terminal-edition {
                color: var(--color-text-subtle);
        }

        .terminal-sep {
                color: var(--color-text-subtle);
                opacity: 0.5;
        }

        .terminal-path {
                color: var(--color-text-muted);
        }

        .terminal-hint-btn {
                background: none;
                border: none;
                padding: 0;
                cursor: pointer;
                font: inherit;
        }

        .terminal-hint {
                color: var(--color-text-subtle);
                padding: var(--space-3xs) var(--space-xs);
                background: var(--color-bg-alt);
                border-radius: var(--radius-sm);
        }

        .terminal-status {
                display: inline-flex;
                align-items: center;
                gap: var(--space-xs);
                color: var(--color-success);
        }

        .status-indicator {
                position: relative;
                width: 6px;
                height: 6px;
                background: #00ff00; /* Bright Green */
                border-radius: 50%;
                box-shadow: 0 0 5px #00ff00;
        }

        .status-indicator::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 1px solid #00ff00;
                animation: radar-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes radar-ping {
                0% {
                        width: 100%;
                        height: 100%;
                        opacity: 0.8;
                }
                100% {
                        width: 300%;
                        height: 300%;
                        opacity: 0;
                }
        }

        @keyframes pulse {
                0%,
                100% {
                        opacity: 1;
                }
                50% {
                        opacity: 0.4;
                }
        }

        @media (max-width: 767px) {
                .terminal {
                        position: relative;
                        margin-top: var(--space-3xl);
                        flex-wrap: wrap;
                        gap: var(--space-sm);
                }

                .terminal-hint {
                        display: none;
                }
        }

        /* WIP BANNER - VERY VISIBLE, First element */
        .wip-banner {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-lg);
                background: #ff6b6b;
                color: #ffffff;
                font-family: var(--font-mono);
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-medium);
                text-transform: uppercase;
                letter-spacing: var(--letter-spacing-wide);
                animation: wip-pulse 3s ease-in-out infinite;
                margin: calc(-1 * var(--container-padding));
                margin-bottom: var(--space-xl);
        }

        .wip-banner--sticky {
                position: sticky;
                top: 0;
                z-index: 1000;
        }

        .wip-icon {
                font-size: var(--font-size-lg);
                animation: wip-shake 2s ease-in-out infinite;
        }

        .wip-text {
                font-weight: 700;
        }

        @keyframes wip-pulse {
                0%, 100% {
                        background: #ff6b6b;
                }
                50% {
                        background: #ff5252;
                }
        }

        @keyframes wip-shake {
                0% {
                        transform: rotate(-3deg);
                }
                50% {
                        transform: rotate(3deg);
                }
                100% {
                        transform: rotate(-3deg);
                }
        }

        /* Mobile adjustments for WIP banner */
        @media (max-width: 600px) {
                .wip-banner {
                        flex-direction: column;
                        text-align: center;
                        gap: var(--space-xs);
                        padding: var(--space-md);
                }

                .wip-text {
                        font-size: var(--font-size-xs);
                }
        }
</style>
