<script lang="ts">
        import { onMount } from "svelte";
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


        // Dynamic Clock
        let pragueTime = "";

        onMount(() => {
                const updateTime = () => {
                        const now = new Date();
                        const options: Intl.DateTimeFormatOptions = {
                                timeZone: 'Europe/Prague',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric'
                        };
                        try {
                                const formatter = new Intl.DateTimeFormat('en-US', {
                                        ...options,
                                        hour12: false
                                });
                                // Result ex: "SUN · JAN 11 · 00:05:30 PRAGUE"
                                pragueTime = formatter.format(now).replace(/,/g, ' ·').toUpperCase() + " PRAGUE";
                        } catch (e) {
                                pragueTime = "TIME ONLINE";
                        }
                };
                
                updateTime();
                const interval = setInterval(updateTime, 1000);
                return () => clearInterval(interval);
        });

</script>

<svelte:window on:keydown={handleGlobalSlash} />
<svelte:body class:scroll-lock={currentPath === '/process'} />

<svelte:head>
        <title>{siteConfig.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Command Palette (global) -->
<CommandPalette />

<div class="top-frame">
<!-- WIP BANNER - First visible element, before everything -->
{#if layoutConfig.showWipBanner && layoutConfig.wipBannerPosition !== 'hidden'}
        <div class="wip-banner" class:wip-banner--sticky={layoutConfig.wipBannerPosition === 'sticky'}>
                <span class="wip-text">
                        <span class="wip-msg">{layoutConfig.wipBannerMessage}</span>
                        <span class="wip-sep">·</span>
                        <span class="wip-time">{pragueTime}</span>
                </span>
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
                                        <a href={link.url} target="_blank" rel="noopener" data-brand={link.label}>{link.label}</a>
                                {/each}
                        </nav>
                </div>
        </div>
</header>
</div>

<main class="main-content">
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
                        <span class="terminal-hint"><kbd class="hint-key">/</kbd> for CMDs</span>
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

        .top-frame {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                background: color-mix(in srgb, var(--color-bg), transparent 15%);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                transition: transform var(--duration-normal) var(--easing);
                border-bottom: 1px solid color-mix(in srgb, var(--border-color-subtle), transparent 50%);
        }

        .header {
                /* Minimal padding: text height (approx 24px) + small space */
                padding: var(--space-xs) 0;
                border-bottom: none; /* Handled by top-frame for cleaner glass edge */
        }

        .main-content {
               /* Clear fixed header + banner (~ 30px banner + 70px header + spacing) */
               /* Clear fixed header + banner (~ 30px banner + 50px header + spacing) */
               /* Refined spacing for slimmer header */
               padding-top: 100px; 
               /* Clear floating terminal */
               padding-bottom: 140px;
        }

        .header-inner {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: center; /* Center everything */
                gap: var(--space-xl); /* Larger gap for centered look */
                max-width: var(--container-max); /* Fix variable name */
                margin: 0 auto;
                padding: 0 var(--container-padding);
        }

        @media (min-width: 768px) {
                .header-inner {
                        gap: var(--space-2xl);
                }
        }

        .header-name {
                font-family: var(--font-sans);
                font-size: var(--font-size-base);
                font-weight: var(--font-weight-medium);
                color: var(--color-text);
                text-decoration: none;
                letter-spacing: var(--letter-spacing-tight);
                margin-right: 0; /* Remove force left */
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
                        margin-left: 0; /* Remove force right */
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

        .nav-link::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1.5px;
                background: var(--color-text);
                transform: scaleX(0);
                transform-origin: right;
                transition: transform var(--duration-fast) var(--easing);
        }

        .nav-link:hover::after {
                transform: scaleX(1);
                transform-origin: left;
        }

        .nav-link.active::after {
                transform: scaleX(1);
                transform-origin: left;
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
                        /* Base hover handled by brand specific now, or fallback handled generally */
                }

                /* Brand Gradients - Desktop hover effects */
                .social-links a[data-brand] {
                        /* Prepare for gradient text */
                        background-clip: padding-box; /* Default */
                }

                .social-links a[data-brand]:hover {
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        color: transparent;
                }

                /* Specific Brand Maps */
                .social-links a[data-brand="soundcloud"]:hover {
                        background-image: linear-gradient(135deg, #ff5500, #ff8800);
                }
                .social-links a[data-brand="imdb"]:hover {
                        background-image: linear-gradient(135deg, #F5C518, #E2B616);
                }
                .social-links a[data-brand="github"]:hover {
                        /* White to Grey to keep visibility on dark */
                        background-image: linear-gradient(135deg, #ffffff, #999999);
                }
                .social-links a[data-brand="linkedin"]:hover {
                        background-image: linear-gradient(135deg, #0077b5, #00a0dc);
                }
                .social-links a[data-brand="instagram"]:hover {
                        /* Official Insta Gradient approximation */
                        background-image: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                }
                .social-links a[data-brand="x"]:hover {
                         /* Silver aura */
                        background-image: linear-gradient(135deg, #E0E0E0, #707070);
                }
                .social-links a[data-brand="email"]:hover {
                        /* Electric Blue/Teal */
                        background-image: linear-gradient(135deg, #2AFADF, #4C83FF);
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
                bottom: var(--space-md); /* Floating up */
                left: var(--space-md);
                right: var(--space-md);
                border-radius: var(--radius-md); /* Encapsulated look */
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-lg); /* Lift it up */

                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-sm) var(--container-padding);
                background: color-mix(in srgb, var(--color-surface), transparent 10%);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
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
		appearance: none;
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.terminal-hint-btn:hover .terminal-hint {
		color: var(--color-text);
	}

	        .terminal-hint {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
                color: var(--color-text-subtle);
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                padding: 0;
                background: none;
                border: none;
                transition: color var(--duration-fast) var(--easing);
        }

        .hint-key {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 1.6em;
                height: 1.6em;
                padding: 0 var(--space-xs);
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                font-weight: 500;
                color: var(--color-text-muted);
                background: var(--color-surface);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                transition: all var(--duration-fast) var(--easing);
        }

        .terminal-hint-btn:hover .hint-key {
                background: var(--color-accent);
                color: white;
                border-color: var(--color-accent);
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
                        bottom: var(--space-sm);
                        left: var(--space-sm);
                        right: var(--space-sm);
                        flex-wrap: wrap;
                        gap: var(--space-sm);
                        justify-content: center; /* Center content on mobile */
                }

                .terminal-hint {
                        display: block; /* Show hint on mobile */
                        font-size: var(--font-size-2xs); /* Make it smaller */
                        opacity: 0.7;
                }
                
                .main-content {
                        padding-top: 120px; /* Refined for slimmer banner on mobile */
                }
        }

        /* WIP BANNER - RED, SLIM, TECH */
        .wip-banner {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: var(--space-xs);
                padding: 4px var(--space-md); /* Very slim */
                margin-bottom: 0; /* No gap between banner and header */
                background: #ff6b6b; /* Warning Red restored */
                color: #ffffff; /* White text */
                font-family: "Helvetica", sans-serif;
                font-size: 11px; /* Micro tech text */
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                border-bottom: 1px solid rgba(0,0,0,0.1);
                margin: 0; /* Remove margin to stack tightly with header */
                width: 100%;
                z-index: 2000;
        }

        .wip-text {
                font-variant-numeric: tabular-nums;
                font-weight: bold;
        }

        /* Dot removed */

        /* Mobile adjustments for WIP banner */
        @media (max-width: 600px) {
                .wip-banner {
                        padding: 8px; /* Slightly more vertical padding */
                        text-align: center;
                }

                .wip-text {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 2px;
                        line-height: 1.3;
                        font-size: var(--font-size-xs);
                }

                .wip-sep {
                        display: none;
                }
        }

        /* Scroll Lock for Process Page */
        :global(body.scroll-lock) {
                overflow: hidden !important;
                height: 100vh !important;
                touch-action: none; /* Disable touch scrolling */
        }
</style>
