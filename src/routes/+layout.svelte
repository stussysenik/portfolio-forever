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
        import { siteMode, readerOverride, isReaderMode, siteConfig as siteConfigStore, baseSiteConfig, featureFlags, baseFeatureFlags, wipBannerDismissed, previewMode, navParadigm, stagedOverrides, wipMode, wipConfig } from "$lib/stores/siteMode";
        import { getConvexClient } from "$lib/convex";
        import { api } from "$convex/_generated/api";
        import Embellishments from "$lib/components/Embellishments.svelte";
        import { parseSameAs } from "$lib/utils/social-links";
        import { themeMatrix } from "$lib/stores/controls";
        import NavSidebar from "$lib/components/nav/NavSidebar.svelte";
        import NavDrawer from "$lib/components/nav/NavDrawer.svelte";
        import NavHybrid from "$lib/components/nav/NavHybrid.svelte";

        // Force scroll to top on every navigation - prevent scroll restoration
        if (browser) {
                history.scrollRestoration = "manual";
        }

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
                { href: "/media", label: "media" },
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

        let navItems: { href: string; label: string; archived?: boolean }[] = staticNav;
        let siteConfigData: any = null;
        let profileName: string = siteConfig.name;
        let socialLinksData: { label: string; url: string }[] = socialLinks;
        let PixelCanvasComponent: any = null;
        let pixelCanvasPromise: Promise<void> | null = null;
        let socialOverflowOpen = false;
        let socialRailOpen = false;
        let focusedSocialIndex = -1;
        
        let profileAvailable: boolean = profile.available;
        let profileId: any = null;

        $: if (browser) {
                (window as any).profileAvailable = profileAvailable;
                (window as any).profileId = profileId;
        }

$: currentPath = $page.url.pathname;
	$: pixelCanvasEnabled = ($featureFlags.get("pixel-engine") ?? false) && !$isReaderMode;
	$: isInPreview = $previewMode;

        // Theme matrix: sync to data-matrix attribute + localStorage
        $: if (browser) {
                document.documentElement.setAttribute('data-matrix', $themeMatrix);
                localStorage.setItem('matrix', $themeMatrix);
        }

        $: if (browser && pixelCanvasEnabled && !PixelCanvasComponent) {
                pixelCanvasPromise ??= import("$lib/components/PixelCanvas.svelte").then(({ default: component }) => {
                        PixelCanvasComponent = component;
                });
        }

        // Scroll to top on every navigation + track page view
        afterNavigate(() => {
                // Force scroll to top and prevent scroll restoration
                if (browser) {
                        requestAnimationFrame(() => {
                                window.scrollTo(0, 0);
                                document.documentElement.scrollTop = 0;
                                document.body.scrollTop = 0;
                        });
                }
                trackPageView(window.location.href);
        });

        // Init PostHog + Convex siteConfig on mount
        onMount(() => {
                initPostHog();

                // Restore matrix mode from localStorage
                const savedMatrix = localStorage.getItem('matrix');
                if (savedMatrix === 'minimalist' || savedMatrix === 'brutalist' || savedMatrix === 'night-vision') {
                        themeMatrix.set(savedMatrix);
                }

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
				if (e.data?.type === 'admin:wipBadge' && e.data.visible !== undefined) {
					wipBannerDismissed.set(!e.data.visible);
				}
			};
                window.addEventListener('message', adminMessageHandler);

// DEFENSIVE: Skip all Convex subscriptions in admin or preview mode
// The admin has its own subscriptions; the public layout should not
// run redundant/expensive database calls when in admin or preview.
const isExcluded = window.location.pathname.startsWith('/admin') || window.location.search.includes('preview=true');

if (!isExcluded) {			// Load site config from Convex
			try {
				const client = getConvexClient();
				unsubSiteConfig = client.onUpdate(api.siteConfig.get, {}, (config: any) => {
					if (config?.mode) {
						siteMode.set(config.mode);
					}
					if (config) {
						baseSiteConfig.set({
							sectionOrder: config.sectionOrder,
							parallaxSpeed: config.parallaxSpeed,
							navMode: config.navMode,
						});
						if (config.navMode && ['sidebar', 'drawer', 'hybrid'].includes(config.navMode)) {
							navParadigm.set(config.navMode);
						}
						siteConfigData = config;
					}
				});
				// Subscribe to nav items from pages table
				unsubNavItems = client.onUpdate(api.pages.getNavItems, {}, (items: any[]) => {
					if (items && items.length > 0) {
						navItems = items.map((p: any) => ({
							href: p.route,
							label: p.label,
							archived: p.archived ?? false,
						}));
					}
				});
				// Subscribe to feature flags
				unsubFlags = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (flags: any[]) => {
					if (flags) {
						const map = new Map<string, boolean>();
						for (const f of flags) map.set(f.key, f.enabled);
						baseFeatureFlags.set(map);
					}
				});
				// Subscribe to profile for nav (name + social links)
				unsubProfile = client.onUpdate(api.cv.getVisibleCV, {}, (data: any) => {
					if (data?.profile?.name) {
						profileName = data.profile.name;
					}
					if (data?.profile?.sameAs && Array.isArray(data.profile.sameAs)) {
						socialLinksData = parseSameAs(data.profile.sameAs);
					}
					if (data?.profile) {
						profileAvailable = data.profile.available ?? true;
						profileId = data.profile._id;
					}
				});
			} catch (e) {
				// Convex not available — default to multi-page
				console.warn("Convex siteConfig not available, using multi-page mode");
			}
		} else {
			// In preview mode: receive data from admin parent via postMessage
			window.addEventListener('message', (e: MessageEvent) => {
				if (e.data?.type === 'admin:siteConfig' && e.data.config) {
					const config = e.data.config;
					if (config.mode) siteMode.set(config.mode);
					baseSiteConfig.set({
						sectionOrder: config.sectionOrder,
						parallaxSpeed: config.parallaxSpeed,
						navMode: config.navMode,
					});
					if (config.navMode && ['sidebar', 'drawer', 'hybrid'].includes(config.navMode)) {
						navParadigm.set(config.navMode);
					}
					siteConfigData = config;
				}
				if (e.data?.type === 'admin:navItems' && e.data.items) {
					navItems = e.data.items.map((p: any) => ({
						href: p.route,
						label: p.label,
						archived: p.archived ?? false,
					}));
				}
				if (e.data?.type === 'admin:featureFlags' && e.data.flags) {
					const map = new Map<string, boolean>();
					for (const f of e.data.flags) map.set(f.key, f.enabled);
					baseFeatureFlags.set(map);
				}
				if (e.data?.type === 'admin:profile' && e.data.profile) {
					if (e.data.profile.name) profileName = e.data.profile.name;
					if (e.data.profile.sameAs) socialLinksData = parseSameAs(e.data.profile.sameAs);
					profileAvailable = e.data.profile.available ?? true;
					profileId = e.data.profile._id;
				}
				if (e.data?.type === 'admin:wipBadge' && e.data.visible !== undefined) {
					wipBannerDismissed.set(!e.data.visible);
				}
			});
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

        // Sync header height to CSS var so content can offset correctly
        let headerResizeObserver: ResizeObserver | undefined;
        $: if (browser) {
                const topFrame = document.querySelector('.top-frame');
                if (topFrame && !headerResizeObserver) {
                        const sync = () => {
                                document.documentElement.style.setProperty('--header-height', `${topFrame.getBoundingClientRect().height}px`);
                        };
                        sync();
                        headerResizeObserver = new ResizeObserver(sync);
                        headerResizeObserver.observe(topFrame);
                }
        }

        // Cleanup
        let unsubSiteConfig: (() => void) | undefined;
        let unsubNavItems: (() => void) | undefined;
        let unsubFlags: (() => void) | undefined;
        let unsubProfile: (() => void) | undefined;
        let adminMessageHandler: ((e: MessageEvent) => void) | undefined;
        onDestroy(() => {
                headerResizeObserver?.disconnect();
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

{#if layoutConfig.showWipBanner && layoutConfig.wipBannerPosition !== 'hidden' && !$wipBannerDismissed && !currentPath.startsWith('/admin')}
	<div class="wip-banner" class:wip-banner--sticky={layoutConfig.wipBannerPosition === 'sticky'}>
		<span class="wip-text">
			<span class="wip-msg">{layoutConfig.wipBannerMessage}</span>
			<span class="wip-sep">·</span>
			<span class="wip-time">{pragueTime}</span>
		</span>
	</div>
{/if}

{#if $siteMode === 'disabled' && !currentPath.startsWith('/admin')}
	<div class="maintenance-lockscreen">
		<div class="lock-inner">
			<h2>{siteConfig?.title || 'System Offline'}</h2>
			<p>Evidence Engine is currently down for maintenance.</p>
			<span>{pragueTime}</span>
		</div>
	</div>
{:else if currentPath.startsWith('/admin')}
	<slot />
{:else if isInPreview}
<!-- PREVIEW MODE: WYSIWYG only — no Convex calls, no chrome, just the content -->
<main class="main-content preview-content" style="padding-top: 0; padding-bottom: 0;">
	<slot />
</main>
{:else if $navParadigm === 'sidebar'}
        <NavSidebar
                {navItems}
                socialLinks={socialLinksData}
                {profileName}
                currentPath={$page.url.pathname}
                profileAvailable={profileAvailable}
        />
        <main class="main-content main-content--sidebar">
                <slot />
        </main>
{:else if $navParadigm === 'drawer'}
        <NavDrawer
                {navItems}
                socialLinks={socialLinksData}
                {profileName}
                currentPath={$page.url.pathname}
        />
        <main class="main-content">
                <slot />
        </main>
{:else}
        <NavHybrid
                {navItems}
                socialLinks={socialLinksData}
                {profileName}
                currentPath={$page.url.pathname}
        />
        <main class="main-content">
                <slot />
        </main>
{/if}

<footer class="terminal" class:terminal--sidebar={$navParadigm === 'sidebar'}>
        <div class="terminal-left">
                <span class="terminal-edition">{siteConfigData?.footerEdition ?? 'Made with 💙 in Bed-Stuy by STÜSSY SENIK'} · {siteConfigData?.footerYear ?? new Date().getFullYear()}</span>
                <span class="terminal-sep">·</span>
                <span class="terminal-path">{currentPath}</span>
        </div>
        <div class="terminal-right">
                {#if profileAvailable}
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
               padding-top: var(--header-height, var(--space-3xl));
               padding-bottom: 80px;
        }

        .main-content--sidebar {
               margin-left: 220px;
               padding-top: var(--space-xl);
               padding-bottom: 80px;
        }

        @media (max-width: 767px) {
               .main-content--sidebar {
                       margin-left: 0;
                       padding-top: var(--header-height, var(--space-3xl));
               }
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
                gap: var(--space-xs) var(--space-md);
                align-items: baseline;
        }

        @media (min-width: 768px) {
                .nav {
                        gap: var(--space-sm) var(--space-lg);
                }
                .nav-link {
                        font-size: var(--font-size-sm);
                }
        }

        @media (min-width: 1024px) {
                .nav {
                        gap: var(--space-sm) var(--space-xl);
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
                letter-spacing: var(--letter-spacing-normal);
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
                bottom: -1px;
                left: 0;
                width: 100%;
                height: 1px;
                background: currentColor;
                transform: scaleX(0);
                transform-origin: right;
                transition: transform var(--duration-normal) var(--easing-out);
        }

        .nav-link:hover::after {
                transform: scaleX(1);
                transform-origin: left;
        }

        .nav-link.active::after {
                transform: scaleX(1);
                transform-origin: left;
                opacity: 0.5;
        }

        .nav-link.archived {
                color: #e54545;
                opacity: 0.55;
        }

        .nav-link.archived:hover {
                color: #ff4444;
                opacity: 0.85;
        }

        .nav-link.archived::after {
                background: #e54545;
        }

        .nav-link.external {
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs, 0.75rem);
                letter-spacing: var(--letter-spacing-wider);
                text-transform: uppercase;
                color: var(--color-text-subtle);
        }

        .nav-link.external::after {
                display: none;
        }

        .nav-link.external:hover {
                color: var(--color-text);
        }

        .nav-sep {
                color: var(--color-text-subtle);
                font-size: var(--font-size-2xs);
                margin: 0 var(--space-xs);
                user-select: none;
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
                transition: background-color var(--duration-slow) var(--easing), left var(--duration-normal) var(--easing-out);
        }

        .terminal--sidebar {
                left: calc(220px + var(--space-md));
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

                .terminal--sidebar {
                        left: var(--space-sm);
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
                        padding-top: var(--header-height, var(--space-3xl));
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
                font-size: var(--font-size-xs, 0.75rem); /* Readable on mobile */
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

        /* ─── Mobile header — iA Writer / Things DNA ───
           Stacked, left-aligned, compact, clear hierarchy.
           Social links get their own subtle row via flex line-break. */
        @media (max-width: 767px) {
                .header {
                        padding: var(--space-2xs) 0;
                        padding-bottom: var(--space-2xs);
                }

                .header-inner {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-2xs);
                        padding: 0 var(--space-md);
                }

                .header-name {
                        font-size: var(--font-size-sm);
                        font-weight: var(--font-weight-semibold);
                }

                .header-nav-group {
                        width: 100%;
                }

.nav {
                        justify-content: flex-start;
                        gap: 2px var(--space-sm);
                }

                .nav-link {
                        font-size: 12px;
                        padding: 2px 0;
                }

                .nav-sep {
                        margin: 0 var(--space-2xs);
                        font-size: var(--font-size-2xs, 0.75rem);
                }

                .nav-link.external {
                        font-size: var(--font-size-2xs, 0.75rem);
                }
        }

/* Scroll Lock for Process Page */
	:global(body.scroll-lock) {
		overflow: hidden !important;
		height: 100vh !important;
		touch-action: none; /* Disable touch scrolling */
	}

	.preview-content {
		background: var(--color-bg, var(--bg, #FFFFFF));
		min-height: 100vh;
	}
</style>
