/**
 * Works Adapter - Senior Technical Pattern
 * 
 * Dual-Core Architecture: Clojure + Svelte
 * 
 * This adapter provides a unified interface for both Clojure and Svelte Works implementations,
 * allowing seamless switching between implementations while maintaining the same API.
 * 
 * Pattern: Facade + Adapter + Strategy
 * - Facade: Simple unified interface
 * - Adapter: Converts between Clojure and Svelte data formats
 * - Strategy: Allows runtime switching between implementations
 * 
 * Usage:
 *   const worksAdapter = new WorksAdapter();
 *   await worksAdapter.init();
 *   const projects = worksAdapter.getProjects();
 * 
 *   // Use with Svelte component
 *   <WorksSection projects={worksAdapter.getProjects()} />
 *   
 *   // Use with Clojure component (via squint)
 *   <ColorfulWorks projects={worksAdapter.getProjects()} />
 */

import { getConvexClient } from '$lib/convex';
import { api } from '$convex/_generated/api';
import { browser } from '$app/environment';

// @ts-ignore - Clojure compiled modules
declare const clj_works: {
	setup_works_subscriptions: Function;
	override_vars: Function;
	use_static_preview_QMARK_: Function;
	use_video_preview_QMARK_: Function;
	get_object_position: Function;
	get_zoom_style: Function;
};

// @ts-ignore - Clojure data utilities
declare const dataUtils: {
	applyOverrides: Function;
};

/**
 * Type definitions for project data
 * Must be compatible with both Clojure and TypeScript
 */
export interface StyleOverrides {
	accentColor?: string;
	httpColor?: string;
	secondaryHighlight?: string;
	badgeStyle?: string;
}

export interface Project {
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
	// Clojure-specific metadata for immutability tracking
	_clj_metadata?: any;
	_clj_hash?: number;
}

/**
 * Configuration options for Works rendering
 */
export interface WorksConfig {
	displayMode?: 'grid' | 'list' | 'case-study' | 'minimal-list';
	columns?: number;
	showPreview?: boolean;
	useColorful?: boolean;
}

/**
 * Callback types for subscription updates
 */
export interface WorksCallbacks {
	onProjects?: (projects: Project[]) => void;
	onConfig?: (config: WorksConfig) => void;
	onError?: (error: Error) => void;
}

/**
 * Implementation Strategy interface
 * Allows plugging in different implementations (Svelte native, Clojure compiled)
 */
export interface WorksStrategy {
	init(client: any): Promise<void> | void;
	getProjects(): Project[];
	getConfig(): WorksConfig;
	subscribe(callbacks: WorksCallbacks): () => void;
	getOverrideVars(project: Project): string;
	useStaticPreview(project: Project): boolean;
	useVideoPreview(project: Project): boolean;
	getObjectPosition(project: Project): string;
	getZoomStyle(project: Project): string;
	destroy(): void;
}

/**
 * Svelte Native Strategy - Uses TypeScript implementations
 */
class SvelteStrategy implements WorksStrategy {
	private projects: Project[] = [];
	private config: WorksConfig = {};
	private thumbnailConfig: any = null;
	private sectionConfig: any = null;
	private unsubs: (() => void)[] = [];
	
	init(client: any): void {
		if (!browser) return;
		
		const unsub1 = client.onUpdate(api.works.getVisibleWorks, {}, (data: any[]) => {
			if (data && data.length > 0) {
				this.projects = this.normalizeProjects(data);
			}
		});
		
		const unsub2 = client.onUpdate(api.thumbnails.getConfig, { section: 'works' }, (data: any) => {
			this.thumbnailConfig = data;
			this.updateConfig();
		});
		
		const unsub3 = client.onUpdate(api.sectionRegistry.getBySectionId, { sectionId: 'works' }, (data: any) => {
			this.sectionConfig = data;
			this.updateConfig();
		});
		
		this.unsubs = [unsub1, unsub2, unsub3];
	}
	
	private normalizeProjects(data: any[]): Project[] {
		return data.map(p => ({
			...p,
			// Ensure all fields exist
			styleOverrides: p.styleOverrides || {},
			previewMode: p.previewMode || (p.preview ? 'static' : 'live')
		}));
	}
	
	private updateConfig(): void {
		this.config = {
			displayMode: this.thumbnailConfig?.displayMode,
			columns: this.thumbnailConfig?.columns,
			showPreview: this.thumbnailConfig?.showPreview,
			useColorful: this.sectionConfig?.useColorful
		};
	}
	
	getProjects(): Project[] {
		return [...this.projects]; // Return copy for immutability
	}
	
	getConfig(): WorksConfig {
		return { ...this.config };
	}
	
	subscribe(callbacks: WorksCallbacks): () => void {
		// For reactive updates
		const interval = setInterval(() => {
			if (callbacks.onProjects) callbacks.onProjects(this.getProjects());
			if (callbacks.onConfig) callbacks.onConfig(this.getConfig());
		}, 100);
		
		return () => clearInterval(interval);
	}
	
	getOverrideVars(project: Project): string {
		const o = project.styleOverrides ?? {};
		const parts: string[] = [];
		if (o.accentColor) parts.push(`--works-stripe-color: ${o.accentColor}`);
		if (o.httpColor) parts.push(`--works-http-color: ${o.httpColor}`);
		if (o.secondaryHighlight) parts.push(`--works-secondary-highlight: ${o.secondaryHighlight}`);
		return parts.join('; ');
	}
	
	useStaticPreview(project: Project): boolean {
		return project.previewMode === 'static' && !!project.preview;
	}
	
	useVideoPreview(project: Project): boolean {
		return project.previewMode === 'video' && !!project.videoPreview;
	}
	
	getObjectPosition(project: Project): string {
		if (project.focalX != null && project.focalY != null) {
			return `${project.focalX}% ${project.focalY}%`;
		}
		return project.cam ?? project.objectPosition ?? 'center top';
	}
	
	getZoomStyle(project: Project): string {
		const zoom = project.zoom ?? 1.0;
		if (zoom <= 1.0) return '';
		const originX = project.focalX ?? 50;
		const originY = project.focalY ?? 50;
		return `transform: scale(${zoom}); transform-origin: ${originX}% ${originY}%;`;
	}
	
	destroy(): void {
		this.unsubs.forEach(unsub => unsub && unsub());
		this.unsubs = [];
	}
}

/**
 * Clojure Strategy - Uses ClojureScript compiled implementations
 * Provides the same interface but delegates to Clojure functions
 */
class ClojureStrategy implements WorksStrategy {
	private projects: Project[] = [];
	private config: WorksConfig = {};
	private unsubs: (() => void)[] = [];
	private initialized = false;
	
	async init(client: any): Promise<void> {
		if (!browser) return;
		
		// Dynamically import Clojure modules
		try {
			// @ts-ignore
			const worksModule = await import('$lib/clj/portfolio/sections/works.mjs');
			// @ts-ignore
			const dataModule = await import('$lib/clj/portfolio/data/overrides.mjs');
			
			// Store references for use in methods
			// @ts-ignore
			window._clj_works = worksModule;
			// @ts-ignore
			window._clj_data_utils = dataModule;
			
			this.initialized = true;
			
			// Set up subscriptions using Clojure functions
			// @ts-ignore
			const cljSetup = worksModule.setup_works_subscriptions || worksModule.exports?.setup_works_subscriptions;
			// @ts-ignore
			const dataUtilsFn = dataModule.exports?.applyOverrides || dataModule.applyOverrides;
			
			if (typeof cljSetup === 'function') {
				const unsub = cljSetup(client, {
					onWorks: (data: any[]) => {
						this.projects = this.normalizeProjects(data);
					},
					onThumbnails: (data: any) => {
						// Would need to handle this
					},
					onSection: (data: any) => {
						// Would need to handle this
					}
				});
				this.unsubs.push(unsub);
			}
			
		} catch (error) {
			console.warn('Clojure modules not available, falling back to Svelte:', error);
			// Fall through to Svelte implementation
		}
	}
	
	private normalizeProjects(data: any[]): Project[] {
		return data.map(p => ({
			...p,
			styleOverrides: p.styleOverrides || {},
			previewMode: p.previewMode || (p.preview ? 'static' : 'live')
		}));
	}
	
	getProjects(): Project[] {
		return [...this.projects];
	}
	
	getConfig(): WorksConfig {
		return { ...this.config };
	}
	
	subscribe(callbacks: WorksCallbacks): () => void {
		const interval = setInterval(() => {
			if (callbacks.onProjects) callbacks.onProjects(this.getProjects());
			if (callbacks.onConfig) callbacks.onConfig(this.getConfig());
		}, 100);
		
		return () => clearInterval(interval);
	}
	
	getOverrideVars(project: Project): string {
		// @ts-ignore
		if (window._clj_works?.override_vars) {
			// @ts-ignore
			return window._clj_works.override_vars(project);
		}
		// Fallback
		const o = project.styleOverrides ?? {};
		const parts: string[] = [];
		if (o.accentColor) parts.push(`--works-stripe-color: ${o.accentColor}`);
		if (o.httpColor) parts.push(`--works-http-color: ${o.httpColor}`);
		if (o.secondaryHighlight) parts.push(`--works-secondary-highlight: ${o.secondaryHighlight}`);
		return parts.join('; ');
	}
	
	useStaticPreview(project: Project): boolean {
		// @ts-ignore
		if (window._clj_works?.use_static_preview_QMARK_) {
			// @ts-ignore
			return window._clj_works.use_static_preview_QMARK_(project);
		}
		return project.previewMode === 'static' && !!project.preview;
	}
	
	useVideoPreview(project: Project): boolean {
		// @ts-ignore
		if (window._clj_works?.use_video_preview_QMARK_) {
			// @ts-ignore
			return window._clj_works.use_video_preview_QMARK_(project);
		}
		return project.previewMode === 'video' && !!project.videoPreview;
	}
	
	getObjectPosition(project: Project): string {
		// @ts-ignore
		if (window._clj_works?.get_object_position) {
			// @ts-ignore
			return window._clj_works.get_object_position(project);
		}
		if (project.focalX != null && project.focalY != null) {
			return `${project.focalX}% ${project.focalY}%`;
		}
		return project.cam ?? project.objectPosition ?? 'center top';
	}
	
	getZoomStyle(project: Project): string {
		// @ts-ignore
		if (window._clj_works?.get_zoom_style) {
			// @ts-ignore
			return window._clj_works.get_zoom_style(project);
		}
		const zoom = project.zoom ?? 1.0;
		if (zoom <= 1.0) return '';
		const originX = project.focalX ?? 50;
		const originY = project.focalY ?? 50;
		return `transform: scale(${zoom}); transform-origin: ${originX}% ${originY}%;`;
	}
	
	destroy(): void {
		this.unsubs.forEach(unsub => unsub && unsub());
		this.unsubs = [];
	}
}

/**
 * Main Adapter Class
 * Uses Strategy pattern to switch between implementations
 */
export class WorksAdapter {
	private strategy: WorksStrategy;
	private currentStrategy: 'svelte' | 'clojure' | 'auto';
	private initialized = false;
	
	/**
	 * Create a new Works Adapter
	 * @param preferredStrategy - 'svelte', 'clojure', or 'auto' (tries clojure first, falls back to svelte)
	 */
	constructor(preferredStrategy: 'svelte' | 'clojure' | 'auto' = 'auto') {
		this.currentStrategy = preferredStrategy;
		
		// Auto-detect best strategy
		if (preferredStrategy === 'auto') {
			// Try Clojure first if available
			try {
				// @ts-ignore
				if (typeof window !== 'undefined' && window._clj_works) {
					this.strategy = new ClojureStrategy();
					this.currentStrategy = 'clojure';
				} else {
					this.strategy = new SvelteStrategy();
					this.currentStrategy = 'svelte';
				}
			} catch {
				this.strategy = new SvelteStrategy();
				this.currentStrategy = 'svelte';
			}
		} else if (preferredStrategy === 'clojure') {
			this.strategy = new ClojureStrategy();
		} else {
			this.strategy = new SvelteStrategy();
		}
	}
	
	/**
	 * Initialize the adapter with Convex client
	 */
async init(): Promise<void> {
		if (this.initialized) return;
		
		const client = getConvexClient();
		
		if (this.currentStrategy === 'clojure') {
			await (this.strategy as ClojureStrategy).init(client);
		} else {
			(this.strategy as SvelteStrategy).init(client);
		}
		
		this.initialized = true;
	}
	
	/**
	 * Get current projects
	 */
	getProjects(): Project[] {
		return this.strategy.getProjects();
	}
	
	/**
	 * Get current configuration
	 */
	getConfig(): WorksConfig {
		return this.strategy.getConfig();
	}
	
	/**
	 * Get the current strategy name
	 */
	getStrategy(): 'svelte' | 'clojure' | 'auto' {
		return this.currentStrategy;
	}
	
	/**
	 * Switch strategy at runtime
	 */
	async switchStrategy(strategy: 'svelte' | 'clojure'): Promise<void> {
		// Destroy current
		this.strategy.destroy();
		
		// Create new
		if (strategy === 'clojure') {
			this.strategy = new ClojureStrategy();
			this.currentStrategy = 'clojure';
		} else {
			this.strategy = new SvelteStrategy();
			this.currentStrategy = 'svelte';
		}
		
		// Re-initialize
		this.initialized = false;
		await this.init();
	}
	
	/**
	 * Subscribe to changes
	 */
	onChange(callbacks: WorksCallbacks): () => void {
		return this.strategy.subscribe(callbacks);
	}
	
	/**
	 * Get utility methods for use in components
	 * Returns an object with all the helper functions
	 */
	getHelpers() {
		return {
			overrideVars: (project: Project) => this.strategy.getOverrideVars(project),
			useStaticPreview: (project: Project) => this.strategy.useStaticPreview(project),
			useVideoPreview: (project: Project) => this.strategy.useVideoPreview(project),
			getObjectPosition: (project: Project) => this.strategy.getObjectPosition(project),
			getZoomStyle: (project: Project) => this.strategy.getZoomStyle(project)
		};
	}
	
	/**
	 * Cleanup
	 */
	destroy(): void {
		this.strategy.destroy();
		this.initialized = false;
	}
}

/**
 * Singleton instance for convenience
 */
let singletonInstance: WorksAdapter | null = null;

export function getWorksAdapter(): WorksAdapter {
	if (!singletonInstance) {
		singletonInstance = new WorksAdapter('auto');
	}
	return singletonInstance;
}

export function resetWorksAdapter(): void {
	if (singletonInstance) {
		singletonInstance.destroy();
		singletonInstance = null;
	}
}

/**
 * Static fallback data for when Convex is not available
 */
export const STATIC_PROJECTS: Project[] = [
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
