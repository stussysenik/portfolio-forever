<script lang="ts">
	/**
	 * Works Section - Colorful Edition
	 * 
	 * This component provides a vibrant, colorful display of works/projects
	 * with animated, gradient backgrounds and accent colors.
	 * 
	 * Combines the data handling from WorksSection with the visual styling
	 * from ColorfulWorks for the best of both worlds.
	 */
	import { onMount } from "svelte";
	import { profile } from "$lib/data/content";
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import { isScreenPass } from '$lib/stores/controls';
	import WorksCaseStudy from './works/WorksCaseStudy.svelte';
	import WorksMinimalList from './works/WorksMinimalList.svelte';
	import VideoPreview from '$lib/components/VideoPreview.svelte';

	export let id = "works";

	interface StyleOverrides {
		accentColor?: string;
		httpColor?: string;
		secondaryHighlight?: string;
		badgeStyle?: string;
	}

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
		styleOverrides?: StyleOverrides;
	}

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

	/** Collect styleOverrides as inline CSS var declarations */
	function overrideVars(p: Project): string {
		const o = p.styleOverrides ?? {};
		const parts: string[] = [];
		if (o.accentColor) parts.push(`--works-stripe-color: ${o.accentColor}`);
		if (o.httpColor) parts.push(`--works-http-color: ${o.httpColor}`);
		if (o.secondaryHighlight) parts.push(`--works-secondary-highlight: ${o.secondaryHighlight}`);
		return parts.join('; ');
	}

	/** Show static image only when explicitly set to 'static' and preview exists */
	function useStaticPreview(p: Project): boolean {
		return p.previewMode === 'static' && !!p.preview;
	}

	/** Show video when mode is 'video' and videoPreview path exists */
	function useVideoPreview(p: Project): boolean {
		return p.previewMode === 'video' && !!p.videoPreview;
	}

	/** Compute CSS object-position from focal point */
	function getObjectPosition(project: Project): string {
		if (project.focalX != null && project.focalY != null) {
			return `${project.focalX}% ${project.focalY}%`;
		}
		return project.cam ?? project.objectPosition ?? 'center top';
	}

	/** Zoom transform when zoom > 1 */
	function getZoomStyle(project: Project): string {
		const zoom = project.zoom ?? 1.0;
		if (zoom <= 1.0) return '';
		const originX = project.focalX ?? 50;
		const originY = project.focalY ?? 50;
		return `transform: scale(${zoom}); transform-origin: ${originX}% ${originY}%;`;
	}

	let hoveredIndex: number = -1;
	let isTouchDevice = false;
	let visibleCards: Record<number, boolean> = {};
	let loaded: Record<number, boolean> = {};

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

	// Static fallback
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

	import { siteMode, stagedOverrides, previewMode } from "$lib/stores/siteMode";
	// @ts-ignore
	import { exports as dataUtils } from '$lib/clj/portfolio/data/overrides.mjs';

	let projects: Project[] = staticProjects;
	let thumbnailConfig: any = null;
	let sectionConfig: any = null;

	$: effectiveProjects = dataUtils.applyOverrides ? dataUtils.applyOverrides('worksEntries', projects, $stagedOverrides) : projects;
	$: effectiveThumbnailConfig = dataUtils.applyOverrides ? dataUtils.applyOverrides('thumbnails', thumbnailConfig, $stagedOverrides) : thumbnailConfig;
	$: effectiveSectionConfig = dataUtils.applyOverrides ? dataUtils.applyOverrides('pages', sectionConfig, $stagedOverrides) : sectionConfig;

	$: displayMode = effectiveThumbnailConfig?.displayMode ?? 'grid';
	$: gridCols = effectiveThumbnailConfig?.columns ?? 2;
	$: showPreview = effectiveThumbnailConfig?.showPreview ?? true;
	$: viewMode = effectiveSectionConfig?.immune ? 'grid' : (effectiveSectionConfig?.viewMode ?? 'grid');

	$: visibleProjects = $isScreenPass ? effectiveProjects.slice(0, 3) : effectiveProjects;

	onMount(() => {
		isTouchDevice = window.matchMedia('(hover: none)').matches;

		const client = getConvexClient();
		const unsub1 = client.onUpdate(api.works.getVisibleWorks, {}, (data: any[]) => {
			if (data && data.length > 0) {
				projects = data;
			}
		});
		const unsub2 = client.onUpdate(api.thumbnails.getConfig, { section: 'works' }, (data: any) => {
			thumbnailConfig = data;
		});
		const unsub3 = client.onUpdate(api.sectionRegistry.getBySectionId, { sectionId: 'works' }, (data: any) => {
			sectionConfig = data;
		});

		document.querySelectorAll('.preview-image').forEach((img, _) => {
			if ((img as HTMLImageElement).complete) {
				const index = projects.findIndex(p => p.preview && (img as HTMLImageElement).src.includes(p.preview.replace(/^\//, '')));
				if (index !== -1) handleLoad(index);
			}
		});

		return () => { unsub1(); unsub2(); unsub3(); };
	});
</script>

<svelte:head>
	<title>Works | {profile.name}</title>
	<meta name="description" content="Live project showcases by {profile.name}" />
</svelte:head>

<!-- Colorful Works Section -->
<section {id} class="colorful-works">
	<header class="colorful-header">
		<span class="header-marker">★</span>
		<h2 class="header-title">WORKS</h2>
		<span class="header-count">{visibleProjects.length} projects{$isScreenPass ? ` of ${projects.length}` : ''}</span>
	</header>

	{#if viewMode === 'grid'}
		<div 	class="colorful-grid" 	class:list-mode={displayMode === 'list'}	style="--grid-cols: {gridCols};">
			{#each visibleProjects as project, i}
				<div 	class="colorful-card"
					role="listitem"
					use:inview={i}
					on:mouseenter={() => hoveredIndex = i}
					on:mouseleave={() => hoveredIndex = -1}
					style={overrideVars(project)}
					style:--card-gradient={getGradient(i)}
				>
					{#if showPreview}
						<div class="colorful-embed" class:loaded={loaded[i]}>
							{#if !loaded[i]}
								<div class="skeleton">
									<div class="skeleton-shimmer"></div>
								</div>
							{/if}
							
							{#if useVideoPreview(project)}
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link" aria-label="Visit {project.title}">
									<VideoPreview
										src={project.videoPreview}
										poster={project.preview || ''}
										playing={visibleCards[i] || false}
									/>
								</a>
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="colorful-overlay" aria-label="Visit {project.title}">
									<span class="overlay-cta">Visit →</span>
								</a>
							{:else if useStaticPreview(project)}
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="preview-link" aria-label="Visit {project.title}">
									<img 	
										src={project.preview} 	
										alt="Screenshot of {project.title}" 	
										class="preview-image" 	
										loading="lazy" 	
										on:load={() => handleLoad(i)} 	
										style="object-position: {getObjectPosition(project)}; {getZoomStyle(project)}"
									/>
								</a>
								<a href={project.url} target="_blank" rel="noopener noreferrer" class="colorful-overlay" aria-label="Visit {project.title}">
									<span class="overlay-cta">Visit →</span>
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
						{#if showPreview && project.url}
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
		<WorksCaseStudy {projects} />
	{:else if viewMode === 'minimal-list'}
		<WorksMinimalList {projects} />
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
