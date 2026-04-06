<script lang="ts">
        import { browser } from "$app/environment";
        import { onMount, onDestroy } from "svelte";
        import "../app.css";
        import { page } from "$app/stores";
        import { afterNavigate, onNavigate } from "$app/navigation";
        import { siteConfig, socialLinks, profile } from "$lib/data/content";
        import { layoutConfig } from "$lib/data/layout-config";
        import CommandPalette from "$lib/components/CommandPalette.svelte";
        import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
        import FontSwitcher from "$lib/components/FontSwitcher.svelte";
        import Toast from "$lib/components/Toast.svelte";
        import { overlapDetector } from "$lib/utils/overlap-detector";
        import { initPostHog, trackPageView } from "$lib/posthog";
        import { siteMode, readerOverride, isReaderMode, siteConfig as siteConfigStore, featureFlags } from "$lib/stores/siteMode";
        import { getConvexClient } from "$lib/convex";
        import { api } from "$convex/_generated/api";
        import Embellishments from "$lib/components/Embellishments.svelte";

        // View Transitions API — smooth page-to-page animations
        onNavigate((navigation) => {
                if (!document.startViewTransition) return;
                return new Promise((resolve) => {
                        document.startViewTransition(async () => {
                                resolve();
                                await navigation.complete;
                        });
                });
        });

        // Navigation - static fallback for SSR, replaced by Convex data on mount
        const staticNav = [
                { href: "/academia", label: "re:mix" },
                { href: "/terminal", label: "terminal" },
                { href: "/process", label: "process" },
                { href: "/works", label: "works" },
                { href: "/talks", label: "talks" },
                { href: "/likes", label: "likes" },
                { href: "/blog", label: "blog" },
                { href: "/gifts", label: "gifts" },
                { href: "/cv", label: "cv" },
        ];

        let navItems: { href: string; label: string }[] = staticNav;
        let siteConfigData: any = null;
        let profileName: string = siteConfig.name;
        let PixelCanvasComponent: any = null;
        let pixelCanvasPromise: Promise<void> | null = null;

        $: currentPath = $page.url.pathname;
        $: pixelCanvasEnabled = ($featureFlags.get("pixel-engine") ?? false) && !$isReaderMode;

        $: if (browser && pixelCanvasEnabled && !PixelCanvasComponent) {
                pixelCanvasPromise ??= import("$lib/components/PixelCanvas.svelte").then(({ default: component }) => {
                        PixelCanvasComponent = component;
                });
        }

        // Scroll to top on every navigation + track page view
        afterNavigate(() => {
                document.documentElement.scrollTop = 0;
                trackPageView(window.location.href);
        });

        // Init PostHog + Convex siteConfig on mount
        onMount(() => {
                initPostHog();

                // Listen for admin preview messages (section scroll sync)
                adminMessageHandler = (e: MessageEvent) => {
                        if (e.data?.type === 'admin:scrollToSection') {
                                const el = document.getElementById(e.data.sectionId);
                                if (el) {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        el.classList.add('admin-highlight');
                                        setTimeout(() => el.classList.remove('admin-highlight'), 2000);
                                }
                        }
                };
                window.addEventListener('message', adminMessageHandler);

                // Load site config from Convex
                try {
                        const client = getConvexClient();
                        unsubSiteConfig = client.onUpdate(api.siteConfig.get, {}, (config: any) => {
                                if (config?.mode) {
                                        siteMode.set(config.mode);
                                }
                                if (config) {
                                        siteConfigStore.set({
                                                sectionOrder: config.sectionOrder,
                                                parallaxSpeed: config.parallaxSpeed,
                                        });
                                        siteConfigData = config;
                                }
                        });
                        // Subscribe to nav items from pages table
                        unsubNavItems = client.onUpdate(api.pages.getNavItems, {}, (items: any[]) => {
                                if (items && items.length > 0) {
                                        navItems = items.map((p: any) => ({
                                                href: p.route,
                                                label: p.label,
                                        }));
                                }
                        });
                        // Subscribe to feature flags
                        unsubFlags = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (flags: any[]) => {
                                if (flags) {
                                        const map = new Map<string, boolean>();
                                        for (const f of flags) map.set(f.key, f.enabled);
                                        featureFlags.set(map);
                                }
                        });
                        // Subscribe to profile name for nav
                        unsubProfile = client.onUpdate(api.cv.getVisibleCV, {}, (data: any) => {
                                if (data?.profile?.name) {
                                        profileName = data.profile.name;
                                }
                        });
                } catch (e) {
                        // Convex not available — default to multi-page
                        console.warn("Convex siteConfig not available, using multi-page mode");
                }

                // Check URL param for reader mode
                const url = new URL(window.location.href);
                if (url.searchParams.get("reader") === "true") {
                        readerOverride.set(true);
                }
        });

        // Apply reader mode class to body
        $: if (typeof document !== "undefined") {
                document.body.classList.toggle("reader-mode", $isReaderMode);
        }

        // Cleanup
        let unsubSiteConfig: (() => void) | undefined;
        let unsubNavItems: (() => void) | undefined;
        let unsubFlags: (() => void) | undefined;
        let unsubProfile: (() => void) | undefined;
        let adminMessageHandler: ((e: MessageEvent) => void) | undefined;
        onDestroy(() => {
                unsubSiteConfig?.();
                unsubNavItems?.();
                unsubFlags?.();
                unsubProfile?.();
                if (adminMessageHandler) window.removeEventListener('message', adminMessageHandler);
        });

        function handleGlobalKeydown(e: KeyboardEvent) {
                if (typeof document === "undefined") return;

                // Overlap detector: Ctrl+Option+Shift+D
                if (e.ctrlKey && e.shiftKey && e.altKey && e.code === 'KeyD') {
                        e.preventDefault();
                        overlapDetector.toggle();
                        return;
                }

                // Check if user is typing in an input
                const active = document.activeElement;
                if (
                        active?.tagName === "INPUT" ||
                        active?.tagName === "TEXTAREA" ||
                        active?.getAttribute("contenteditable") === "true"
                ) {
                        return;
                }

                // 'r' key toggles reader mode
                if (e.key === "r") {
                        readerOverride.update((current) => (current === null ? true : !current));
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

<svelte:window on:keydown={handleGlobalKeydown} />
<svelte:body class:scroll-lock={currentPath === '/process'} />

<svelte:head>
        <title>{siteConfig.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Command Palette (global) -->
<CommandPalette />
{#if pixelCanvasEnabled && PixelCanvasComponent}
        <svelte:component this={PixelCanvasComponent} />
{/if}
<Embellishments />
<Toast />

{#if $siteMode === 'disabled' && !currentPath.startsWith('/admin')}
	<div class="maintenance-lockscreen">
		<div class="lock-inner">
			<h2>{siteConfig?.title || 'System Offline'}</h2>
			<p>Evidence Engine is currently down for maintenance.</p>
			<span>{pragueTime}</span>
		</div>
	</div>
{:else}
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
                <a href="/" class="header-name">{profileName}</a>

                <div class="header-nav-group">
                        <!-- Main navigation -->
                        <nav class="nav" aria-label="Main">
                                {#each navItems as item}
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

                                <!-- External Links Inlined -->
                                {#if socialLinks.length > 0}
                                        <span class="nav-sep"></span>
                                        {#each socialLinks as link}
                                                <a href={link.url} target="_blank" rel="noopener" class="nav-link external" data-brand={link.label}>
                                                        {link.label}
                                                </a>
                                        {/each}
                                {/if}
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
                <span class="terminal-edition">{siteConfigData?.footerEdition ?? 'Made with 💙 in Bed-Stuy by STÜSSY SENIK'} · {siteConfigData?.footerYear ?? new Date().getFullYear()}</span>
                <span class="terminal-sep">·</span>
                <span class="terminal-path">{currentPath}</span>
        </div>
        <div class="terminal-right">
                {#if profile.available}
                        <span class="terminal-sep">·</span>
                        <span class="terminal-status">
                                <span class="status-indicator"></span>
                                available
                        </span>
                {/if}
                <span class="terminal-sep">·</span>
                <div class="terminal-controls">
                        <ThemeSwitcher />
                        <FontSwitcher />
                </div>
        </div>
</footer>
{/if}

<style>
	.maintenance-lockscreen {
		position: fixed;
		inset: 0;
		background: var(--color-bg);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.lock-inner {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		font-family: var(--font-mono);
	}
	.lock-inner h2 {
		font-size: var(--font-size-xl);
		color: var(--color-accent);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	.lock-inner p {
		color: var(--color-text-subtle);
		font-size: var(--font-size-sm);
	}

	:global(.admin-highlight) {
                outline: 2px dashed #2563EB;
                outline-offset: 4px;
                transition: outline-color 0.3s ease;
        }

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

        /* Fallback for browsers without backdrop-filter */
        @supports not (backdrop-filter: blur(12px)) {
                .top-frame {
                        background: var(--color-bg);
                }
        }

        .header {
                padding: var(--space-sm) 0;
                padding-bottom: 0;
                margin-bottom: 0;
                border-bottom: none;
        }

        .main-content {
               padding-top: var(--space-3xl);
               padding-bottom: 80px;
        }

        .header-inner {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-xl);
                width: 100%;
                max-width: var(--container-max);
                margin: 0 auto;
                padding: 0 calc(var(--container-padding) + var(--space-md));
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
                flex-wrap: wrap;
                gap: var(--space-xs) var(--space-sm);
                justify-content: center;
        }

        @media (min-width: 768px) {
                .nav {
                        gap: var(--space-sm) var(--space-md);
                }
                .nav-link {
                        font-size: var(--font-size-sm);
                }
        }

        @media (min-width: 1024px) {
                .nav {
                        gap: var(--space-sm) var(--space-lg);
                }
        }

        .nav-link {
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-medium);
                color: var(--color-text-secondary);
                text-transform: lowercase;
                padding: var(--space-2xs) 0;
                position: relative;
                transition: color var(--duration-fast) var(--easing);
                white-space: nowrap;
        }

        .nav-link:hover {
                color: var(--color-text);
        }

        .nav-link.active {
                color: var(--color-text);
                font-weight: var(--font-weight-semibold);
        }

        .nav-link::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--color-electric-green);
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

        .nav-sep {
                width: 1px;
                background: var(--border-color-subtle);
                margin: 0 var(--space-2xs);
                align-self: stretch;
        }

        .nav-link.external {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
        }

        .nav-link.external::after {
                display: none;
        }

        /* Brand gradient hover effects for external inline links */
        .nav-link.external:hover {
                background: transparent;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
                text-shadow: none;
        }

        .nav-link.external[data-brand="soundcloud"]:hover {
                background-image: linear-gradient(135deg, #ff5500, #ff8800);
        }
        .nav-link.external[data-brand="imdb"]:hover {
                background-image: linear-gradient(135deg, #F5C518, #E2B616);
        }
        .nav-link.external[data-brand="github"]:hover {
                background-image: linear-gradient(135deg, #24292f, #57606a);
        }
        :global([data-theme="darkroom"]) .nav-link.external[data-brand="github"]:hover {
                background-image: linear-gradient(135deg, #f0f6fc, #8b949e);
        }
        .nav-link.external[data-brand="linkedin"]:hover {
                background-image: linear-gradient(135deg, #0077b5, #00a0dc);
        }
        .nav-link.external[data-brand="instagram"]:hover {
                background-image: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }
        .nav-link.external[data-brand="x"]:hover {
                background-image: linear-gradient(135deg, #000000, #333333);
        }
        :global([data-theme="darkroom"]) .nav-link.external[data-brand="x"]:hover {
                background-image: linear-gradient(135deg, #ffffff, #cccccc);
        }
        .nav-link.external[data-brand="email"]:hover {
                background-image: linear-gradient(135deg, #2563EB, #1D4ED8);
        }

        .header-nav-group {
                position: relative;
                display: flex;
                align-items: center;
                gap: var(--space-sm);
        }

        @media (min-width: 768px) {
                .header-nav-group {
                        gap: var(--space-lg);
                }
        }

        @media (max-width: 1024px) {
                .header-inner {
                        gap: var(--space-sm);
                        justify-content: space-between;
                }

                .header-nav-group {
                        gap: var(--space-md);
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
                min-width: 0;
        }

        .terminal-right {
                padding-right: var(--space-xs);
        }

        .terminal-edition {
                color: var(--color-text-subtle);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                min-width: 0;
        }

        .terminal-sep {
                color: var(--color-text-subtle);
                opacity: 0.5;
        }

        .terminal-path {
                color: var(--color-text-muted);
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

        .terminal-controls {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
                flex-shrink: 0;
                overflow: visible;
        }

        @media (max-width: 767px) {
                .terminal {
                        bottom: var(--space-sm);
                        left: var(--space-sm);
                        right: var(--space-sm);
                        flex-wrap: wrap;
                        gap: var(--space-xs);
                        justify-content: space-between;
                        padding: var(--space-xs) var(--space-sm);
                }

                /* Hide edition text on mobile — path + controls are enough */
                .terminal-edition {
                        display: none;
                }

                /* Hide the separator after edition */
                .terminal-left .terminal-sep {
                        display: none;
                }

                .terminal-right {
                        padding-right: 0;
                }

                .terminal-controls {
                        gap: var(--space-xs);
                }

/* Also hide "available" status + its separator on mobile */
                .terminal-status {
                        display: none;
                }

                /* Hide separators in terminal-right on mobile */
                .terminal-right > .terminal-sep {
                        display: none;
                }

                .main-content {
                        padding-top: var(--space-3xl);
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
