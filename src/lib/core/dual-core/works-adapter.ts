/**
 * Works Adapter - Senior Technical Pattern
 * 
 * Svelte Native Implementation
 * 
 * This adapter provides a unified interface for Works logic,
 * maintaining a consistent API while handling real-time data from Convex.
 * 
 * Pattern: Facade + Adapter + Strategy
 */

import { getConvexClient } from '$lib/convex';
import { api } from '$convex/_generated/api';
import { browser } from '$lib/app-shims';
import { setupWorksSubscriptions, overrideVars, useStaticPreview, useVideoPreview, getObjectPosition, getZoomStyle } from '$lib/sections/works-logic';

/**
 * Type definitions for project data
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
		
		const unsub = setupWorksSubscriptions(client, {
			onWorks: (data: any[]) => {
				if (data && data.length > 0) {
					this.projects = this.normalizeProjects(data);
				}
			},
			onThumbnails: (data: any) => {
				this.thumbnailConfig = data;
				this.updateConfig();
			},
			onSection: (data: any) => {
				this.sectionConfig = data;
				this.updateConfig();
			}
		});
		
		this.unsubs = [unsub];
	}
	
	private normalizeProjects(data: any[]): Project[] {
		return data.map(p => ({
			...p,
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
		return overrideVars(project);
	}
	
	useStaticPreview(project: Project): boolean {
		return useStaticPreview(project) && !!project.preview;
	}
	
	useVideoPreview(project: Project): boolean {
		return useVideoPreview(project) && !!project.videoPreview;
	}
	
	getObjectPosition(project: Project): string {
		return getObjectPosition(project);
	}
	
	getZoomStyle(project: Project): string {
		return getZoomStyle(project);
	}
	
	destroy(): void {
		this.unsubs.forEach(unsub => unsub && unsub());
		this.unsubs = [];
	}
}

/**
 * Main Adapter Class
 */
export class WorksAdapter {
	private strategy: WorksStrategy;
	private initialized = false;
	
	constructor() {
		this.strategy = new SvelteStrategy();
	}
	
	async init(): Promise<void> {
		if (this.initialized) return;
		const client = getConvexClient();
		this.strategy.init(client);
		this.initialized = true;
	}
	
	getProjects(): Project[] {
		return this.strategy.getProjects();
	}
	
	getConfig(): WorksConfig {
		return this.strategy.getConfig();
	}
	
	onChange(callbacks: WorksCallbacks): () => void {
		return this.strategy.subscribe(callbacks);
	}
	
	getHelpers() {
		return {
			overrideVars: (project: Project) => this.strategy.getOverrideVars(project),
			useStaticPreview: (project: Project) => this.strategy.useStaticPreview(project),
			useVideoPreview: (project: Project) => this.strategy.useVideoPreview(project),
			getObjectPosition: (project: Project) => this.strategy.getObjectPosition(project),
			getZoomStyle: (project: Project) => this.strategy.getZoomStyle(project)
		};
	}
	
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
		singletonInstance = new WorksAdapter();
	}
	return singletonInstance;
}

export function resetWorksAdapter(): void {
	if (singletonInstance) {
		singletonInstance.destroy();
		singletonInstance = null;
	}
}

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
