<script lang="ts">
	/**
	 * Colorful Works Component - Senior Pattern Implementation
	 * 
	 * This component provides a vibrant, colorful display of works/projects
	 * with animated, gradient backgrounds and accent colors.
	 * 
	 * Maintains dual-core compatibility with Clojure backend.
	 * Uses the same data interface as WorksSection for seamless integration.
	 */
	import { onMount } from "svelte";
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import { siteMode, stagedOverrides } from "$lib/stores/siteMode";
	// @ts-ignore
	import { exports as dataUtils } from '$lib/clj/portfolio/data/overrides.mjs';
	
	// Import from Clojure Works module
	// @ts-ignore
	import { setup_works_subscriptions, override_vars, use_static_preview_QMARK_, use_video_preview_QMARK_, get_object_position, get_zoom_style } from '$lib/clj/portfolio/sections/works.mjs';

	export let id = "colorful-works";
	export let projects: any[] = [];
	export let showPreview: boolean = true;
	export let displayMode: 'grid' | 'list' = 'grid';
	export let gridCols: number = 2;

	interface Project {
		title: string;
		url: string;
		linkLabel?: string;
		category?: string;
		preview?: string;
		previewMode?: 'live' | 'static' | 'video';
		videoPreview?: string;
		viewport?: number;
		cam?: string;
		objectPosition?: string;
		focalX?: number;
		focalY?: number;
		zoom?: number;
		styleOverrides?: {
			accentColor?: string;
			httpColor?: string;
			secondaryHighlight?: string;
			badgeStyle?: string;
		};
	}

	// Internal state
	let hoveredIndex: number = -1;
	let isTouchDevice = false;
	let visibleCards: Record<number, boolean> = {};
	let loaded: Record<number, boolean> = {};
	let thumbnailConfig: any = null;
	let sectionConfig: any = null;

	// Apply overrides from staged changes
	$: effectiveProjects = dataUtils?.applyOverrides 
		? dataUtils.applyOverrides('worksEntries', projects, $stagedOverrides) 
		: projects;
	
	$: effectiveThumbnailConfig = dataUtils?.applyOverrides 
		? dataUtils.applyOverrides('thumbnails', thumbnailConfig, $stagedOverrides) 
		: thumbnailConfig;
	
	$: effectiveSectionConfig = dataUtils?.applyOverrides 
		? dataUtils.applyOverrides('pages', sectionConfig, $stagedOverrides) 
		: sectionConfig;
	
	$: derivedDisplayMode = effectiveThumbnailConfig?.displayMode ?? displayMode;
	$: derivedGridCols = effectiveThumbnailConfig?.columns ?? gridCols;
	$: derivedShowPreview = effectiveThumbnailConfig?.showPreview ?? showPreview;
	$: viewMode = effectiveSectionConfig?.immune ? 'grid' : (effectiveSectionConfig?.viewMode ?? 'grid');

	// Color palette for gradient backgrounds
	const colorPalette = [
		'#ff6b6b', // coral
		'#4ecdc4', // teal
		'#45b7d1', // sky blue
		'#f9ca24', // yellow
		'#6c5ce7', // purple
		'#a0e7e5', // light teal
		'#fd79a8', // pink
		'#e84393', // magenta
		'#00b894', // green
		'#6c5ce7', // violet
	];

	function getGradient(index: number): string {
		const color1 = colorPalette[index % colorPalette.length];
		const color2 = colorPalette[(index + 3) % colorPalette.length];
		return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
	}

	function getColorForIndex(index: number): string {
		return colorPalette[index % colorPalette.length];
	}

	/** Svelte action: IntersectionObserver for autoplay when visible */
	function inview(node: HTMLElement, index: number) {
		const observer = new IntersectionObserver(
			([entry]) => { visibleCards = { ...visibleCards, [index]: entry.isIntersecting }; },
			{ threshold: 0.3 }
		);
		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	}

	function handleLoad(index: number) {
		loaded = { ...loaded, [index]: true };
	}

	function getOverrideVars(p: Project): string {
		// Use Clojure function if available, otherwise fallback to TS
		if (typeof override_vars === 'function') {
			return override_vars(p);
		}
		const o = p.styleOverrides ?? {};
		const parts: string[] = [];
		if (o.accentColor) parts.push(`--works-stripe-color: ${o.accentColor}`);
		if (o.httpColor) parts.push(`--works-http-color: ${o.httpColor}`);
		if (o.secondaryHighlight) parts.push(`--works-secondary-highlight: ${o.secondaryHighlight}`);
		return parts.join('; ');
	}

	// Static fallback data
	const staticProjects: Project[] = [
		{ title: "BYOA — Build Your Own Algorithm", url: "https://mymind-clone-production.up.railway.app/", category: "personal software", preview: "/previews/byoa-build-your-own-algorithm.png", styleOverrides: { accentColor: '#ff6b6b' } },
		{ title: "iPod emulator", url: "https://ipod-music.vercel.app", category: "tool", viewport: 2.0, cam: "center 30%", styleOverrides: { accentColor: '#4ecdc4' } },
		{ title: "spinning wheel AR filter", url: "https://spinning-wheel-filter.vercel.app", category: "AR/XR", viewport: 2.5, cam: "center center", styleOverrides: { accentColor: '#45b7d1' } },
		{ title: "uyr-problem", url: "https://uyr-problem.vercel.app", category: "tool", viewport: 2.5, cam: "top center", styleOverrides: { accentColor: '#f9ca24' } },
		{ title: "infinite checklist", url: "https://infinite-checklist.vercel.app", category: "tool", viewport: 2.5, cam: "top center", styleOverrides: { accentColor: '#6c5ce7' } },
		{ title: "typewriter", url: "https://clean-writer.vercel.app", category: "tool", viewport: 2.5, cam: "top left", styleOverrides: { accentColor: '#a0e7e5' } },
		{ title: "creative block", url: "https://creative-block.vercel.app", category: "art", viewport: 2.5, cam: "center center", styleOverrides: { accentColor: '#fd79a8' } },
		{ title: "AR b-boy filter", url: "https://bboy-filter.vercel.app", category: "AR/XR", viewport: 2.5, cam: "center center", styleOverrides: { accentColor: '#e84393' } },
		{ title: "PH-213 physics", url: "https://ph213.vercel.app", category: "science", viewport: 2.5, cam: "top center", styleOverrides: { accentColor: '#00b894' } },
		{ title: "DVD corner", url: "https://dvd-video-animation.vercel.app", category: "art", viewport: 2.5, cam: "center center", styleOverrides: { accentColor: '#6c5ce7' } },
		{ title: "WAVELENGTH RADIO", url: "https://wavelength-radio.vercel.app", category: "music", viewport: 2.0, cam: "center center", styleOverrides: { accentColor: '#ff6b6b' } },
	];

	// Initialize with static data
	let internalProjects: Project[] = projects.length > 0 ? projects : staticProjects;

	onMount(() => {
		isTouchDevice = window.matchMedia('(hover: none)').matches;

		// Only set up subscriptions if not in preview/admin mode
		const isPreview = window.location.search.includes('preview=true');
		const isAdmin = window.location.pathname.startsWith('/admin');
		
		if (!isPreview && !isAdmin) {
			const client = getConvexClient();
			
			// Use Clojure subscription setup if available
			if (typeof setup_works_subscriptions === 'function') {
				const unsub = setup_works_subscriptions(client, {
					onWorks: (data: any[]) => {
						if (data && data.length > 0) {
							internalProjects = data;
						}
					},
					onThumbnails: (data: any) => { thumbnailConfig = data; },
					onSection: (data: any) => { sectionConfig = data; }
				});
				return unsub;
			}
			// Fallback to direct subscriptions
			const unsub1 = client.onUpdate(api.works.getVisibleWorks, {}, (data: any[]) => {
				if (data && data.length > 0) {
					internalProjects = data;
				}
			});
			const unsub2 = client.onUpdate(api.thumbnails.getConfig, { section: 'works' }, (data: any) => {
				thumbnailConfig = data;
			});
			const unsub3 = client.onUpdate(api.sectionRegistry.getBySectionId, { sectionId: 'works' }, (data: any) => {
				sectionConfig = data;
			});

			return () => { unsub1(); unsub2(); unsub3(); };
		}
	});
</script>

<!-- Colorful Works Section -->
<section {id} class="colorful-works">
	<header class="colorful-header">
		<span class="header-marker">★</span>
		<h2 class="header-title">COLORFUL WORKS</h2>
		<span class="header-count">{internalProjects.length} projects</span>
	</header>

	{#if derivedDisplayMode === 'grid'}
		<div 
			class="colorful-grid" 
			class:list-mode={derivedDisplayMode === 'list'}
			style="--grid-cols: {derivedGridCols};"
		>
			{#each internalProjects as project, i}
				<div 
					class="colorful-card"
					role="listitem"
					use:inview={i}
					on:mouseenter={() => hoveredIndex = i}
					on:mouseleave={() => hoveredIndex = -1}
					style={getOverrideVars(project)}
					style:--card-gradient={getGradient(i)}
				>
					{#if derivedShowPreview}
						<div class="colorful-embed" class:loaded={loaded[i]}>
							{#if !loaded[i]}
								<div class="skeleton">
									<div class="skeleton-shimmer"></div>
								</div>
							{/if}
							
							{#if typeof use_video_preview_QMARK_ === 'function' && use_video_preview_QMARK_(project)}
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link" aria-label="Visit {project.title}">
									<!-- Video preview would go here -->
									<div class="video-placeholder" style="background: {getGradient(i)}">
										<span class="video-label">Video</span>
									</div>
								</a>
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="colorful-overlay" aria-label="Visit {project.title}">
									<span class="overlay-cta">Visit →</span>
								</a>
							{:else if typeof use_static_preview_QMARK_ === 'function' && use_static_preview_QMARK_(project)}
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link" aria-label="Visit {project.title}">
									<img 
										src={project.preview} 
										alt="Screenshot of {project.title}" 
										class="preview-image" 
										loading="lazy" 
										on:load={() => handleLoad(i)} 
										style="object-position: {typeof get_object_position === 'function' ? get_object_position(project) : (project.focalX != null && project.focalY != null ? `${project.focalX}% ${project.focalY}%` : project.cam ?? project.objectPosition ?? 'center top')}; {typeof get_zoom_style === 'function' ? get_zoom_style(project) : ''}"
									/>
								</a>
							{:else}
								<iframe
									src={project.url}
									title="Live preview of {project.title}"
									loading="lazy"
									sandbox="allow-scripts allow-same-origin"
									on:load={() => handleLoad(i)}
									tabindex="-1"
									aria-hidden="true"
									style="--vp: {project.viewport ?? 2.5}; --cam: {project.cam ?? 'top left'}; background: {getGradient(i)}"
								></iframe>
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="colorful-overlay" aria-label="Visit {project.title}">
									<span class="overlay-cta">Visit →</span>
								</a>
							{/if}
						</div>
					{/if}
					<div class="colorful-meta">
						<span class="meta-title">{project.title}</span>
						{#if project.category}
							<span class="meta-category" style:color={getColorForIndex(i)}>{project.category}</span>
						{/if}
						{#if derivedShowPreview && project.url}
							<a href={project.url} target="_blank" rel="noopener noreferrer" class="meta-link" style:color={getColorForIndex(i)}>
								{project.linkLabel ?? project.url}
							</a>
						{/if}
					</div>
					<div class="colorful-accent-bar" style:background={getColorForIndex(i)}></div>
				</div>
			{/each}
		</div>
	{:else if viewMode === 'case-study'}
		<div class="colorful-message">
			<p>Case study view is not yet implemented for ColorfulWorks.</p>
			<p>Falling back to default WorksSection for this mode.</p>
		</div>
	{/if}
</section>

<style>
	.colorful-works {
		margin-bottom: var(--section-gap);
		position: relative;
	}

	.colorful-header {
		display: flex;
		align-items: baseline;
		gap: var(--space-sm);
		margin-bottom: var(--space-xl);
		padding-bottom: var(--space-sm);
		border-bottom: 2px solid transparent;
		background: linear-gradient(90deg, transparent, var(--color-accent, #ff6b6b), transparent);
	}

	.header-marker {
		color: var(--color-accent, #ff6b6b);
		font-size: var(--font-size-sm);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.7; transform: scale(1.1); }
	}

	.header-title {
		font-family: var(--font-sans);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: var(--letter-spacing-wider);
		color: var(--color-text);
		margin: 0;
		background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
		background-size: 400% 100%;
		-webkit-background-clip: text;
		-background-clip: text;
		color: transparent;
		animation: gradient-shift 8s linear infinite;
	}

	@keyframes gradient-shift {
		0% { background-position: 0% 50%; }
		100% { background-position: 100% 50%; }
	}

	.header-count {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-subtle);
		margin-left: auto;
	}

	/* Colorful Grid */
	.colorful-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-md);
	}

	@media (min-width: 480px) {
		.colorful-grid {
			grid-template-columns: repeat(min(var(--grid-cols, 2), 2), 1fr);
			gap: var(--space-lg);
		}
	}

	@media (min-width: 768px) {
		.colorful-grid {
			grid-template-columns: repeat(var(--grid-cols, 2), 1fr);
			gap: var(--space-xl);
		}
	}

	.colorful-card {
		position: relative;
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all var(--duration-normal) var(--easing);
		background: var(--color-surface);
		border: 1px solid var(--border-color);
	}

	.colorful-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--card-gradient, linear-gradient(135deg, #ff6b6b, #4ecdc4));
		opacity: 0.1;
		z-index: 0;
		transition: opacity var(--duration-normal) var(--easing);
	}

	.colorful-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
	}

	.colorful-card:hover::before {
		opacity: 0.2;
	}

	.colorful-card:hover .colorful-accent-bar {
		transform: scaleX(1);
	}

	.colorful-embed {
		position: relative;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		z-index: 1;
	}

	.colorful-embed iframe {
		position: absolute;
		top: 50%;
		left: 50%;
		width: calc(var(--vp, 2.5) * 100%);
		height: calc(var(--vp, 2.5) * 100%);
		transform: translate(-50%, -50%) scale(calc(1 / var(--vp, 2.5)));
		transform-origin: center center;
		border: none;
		pointer-events: none;
		background: rgba(0, 0, 0, 0.05);
	}

	.preview-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preview-link {
		position: absolute;
		inset: 0;
		display: block;
		overflow: hidden;
	}

	.colorful-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: hsla(0, 0%, 0%, 0);
		transition: background var(--duration-normal) var(--easing);
		text-decoration: none;
		z-index: 3;
	}

	.colorful-overlay:hover {
		background: hsla(0, 0%, 0%, 0.1);
	}

	.overlay-cta {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: #fff;
		background: hsla(0, 0%, 0%, 0.8);
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-sm);
		opacity: 0;
		transform: translateY(4px);
		transition: all var(--duration-normal) var(--easing);
		border: 2px solid currentColor;
	}

	.colorful-overlay:hover .overlay-cta,
	.colorful-card:hover .overlay-cta {
		opacity: 1;
		transform: translateY(0);
	}

	/* Meta */
	.colorful-meta {
		position: relative;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-xs) var(--space-sm);
		padding: var(--space-md);
		background: color-mix(in srgb, var(--color-surface), transparent 80%);
		backdrop-filter: blur(8px);
	}

	.meta-title {
		font-size: var(--font-size-base);
		font-weight: 500;
		color: var(--color-text);
	}

	.meta-category {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		text-transform: lowercase;
		font-weight: 600;
	}

	.meta-link {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		text-decoration: none;
		flex-basis: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: var(--space-2xs);
	}

	.meta-link:hover {
		text-decoration: underline;
	}

	/* Accent bar at bottom */
	.colorful-accent-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 3px;
		width: 100%;
		transform: scaleX(0.8);
		transform-origin: left;
		transition: transform var(--duration-normal) var(--easing);
		z-index: 2;
	}

	/* Skeleton loading */
	.skeleton {
		position: absolute;
		inset: 0;
		background: var(--color-bg-alt);
		z-index: 1;
	}

	.skeleton-shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--color-surface) 50%,
			transparent 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.8s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	.colorful-embed.loaded .skeleton {
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--duration-slow) var(--easing);
	}

	/* Video placeholder */
	.video-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	.video-label {
		background: rgba(0, 0, 0, 0.5);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-sm);
	}

	/* Responsive */
	@media (max-width: 767px) {
		.overlay-cta {
			opacity: 1;
			transform: translateY(0);
		}

		.colorful-overlay {
			background: hsla(0, 0%, 0%, 0.05);
		}

		.colorful-meta {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.skeleton-shimmer { animation: none; }
		.colorful-card:hover { transform: none; }
		.overlay-cta { transition: none; }
		.colorful-overlay { transition: none; }
		.colorful-embed.loaded .skeleton { transition: none; }
		.header-title { animation: none; }
		.header-marker { animation: none; }
	}
</style>
