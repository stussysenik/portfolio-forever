<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import './tokens/admin-tokens.css';
	import './tokens/admin-shell-tokens.css';
	import PageSidebar from './PageSidebar.svelte';
	import CMSidebar from './CMSidebar.svelte';
	import { adminViewStore } from './stores/adminViewStore';
	import PageBar from './PageBar.svelte';
	import PreviewDrawer from './PreviewDrawer.svelte';
	import AdminIcon from './AdminIcon.svelte';
	import { IconSettings } from './admin-icons';
	import WipBadge from './WipBadge.svelte';
	import MobileDock from './MobileDock.svelte';

	export let pages: any[] = [];
	export let activePage: any = null;
	export let featureFlags: any[] = [];
	export let entriesByTable: Record<string, any[]> = {};
	export let siteConfig: any = null;
	export let registrySections: any[] = [];

	// Reference props to suppress unused-export warnings — these are part of the public API
	$: void siteConfig;
	$: void registrySections;

	const dispatch = createEventDispatcher<{
		selectpage: { pageId: string };
		selectsection: { index: number };
		opensettings: void;
		reorderpages: { pageIds: string[] };
		openpages: void;
		opensections: void;
		openpreview: void;
	}>();

	export let activeMobileSheet: 'pages' | 'sections' | 'preview' | null = null;

	let configOpen = false;
	let overflowOpen = false;
	let previewOpen = false;

	// Read theme/font/mode from document for top bar chips
	let currentTheme = '';
	let currentFont = '';

	function readDocMeta() {
		if (typeof document === 'undefined') return;
		currentTheme = document.documentElement.dataset.theme || 'minimal';
		currentFont = document.documentElement.dataset.font || 'inter';
	}

	// Initialise on mount-like first render
	$: if (typeof document !== 'undefined') {
		readDocMeta();
	}

	let themeDropdownOpen = false;
	let fontDropdownOpen = false;

	const THEME_OPTIONS = [
		{ id: 'minimal', label: 'Minimal', accent: '#2563EB' },
		{ id: 'studio', label: 'Studio', accent: '#8B7355' },
		{ id: 'terminal', label: 'Terminal', accent: '#00FF00' },
		{ id: 'bw', label: 'B&W', accent: '#000000' },
	];

	const FONT_OPTIONS = [
		{ id: 'inter', label: 'Inter' },
		{ id: 'rubik', label: 'Rubik' },
		{ id: 'helvetica', label: 'Helvetica' },
		{ id: 'crimson', label: 'Crimson' },
		{ id: 'times', label: 'Times' },
		{ id: 'ibm-plex', label: 'IBM Plex' },
		{ id: 'jetbrains', label: 'JetBrains' },
		{ id: 'fira', label: 'Fira Code' },
		{ id: 'space', label: 'Space' },
	];

	function selectTheme(themeId: string) {
		currentTheme = themeId;
		document.documentElement.dataset.theme = themeId;
		localStorage.setItem('theme', themeId);
		themeDropdownOpen = false;
	}

	function selectFont(fontId: string) {
		currentFont = fontId;
		document.documentElement.dataset.font = fontId;
		localStorage.setItem('font', fontId);
		fontDropdownOpen = false;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.dropdown-wrapper')) {
			themeDropdownOpen = false;
			fontDropdownOpen = false;
		}
		if (!target.closest('.topbar-overflow-chip') && !target.closest('.topbar-overflow-dropdown')) {
			overflowOpen = false;
		}
	}

	function toggleConfig() {
		configOpen = !configOpen;
	}

	$: activePageId = activePage?.pageId ?? '';

	function handleSelectPage(e: CustomEvent<{ pageId: string }>) {
		dispatch('selectpage', e.detail);
	}

	function getEntryCount(page: any): number {
		if (!page?.sections?.length) return 0;
		const dt = page.sections[0]?.dataTable;
		if (!dt) return 0;
		return entriesByTable[dt]?.length ?? 0;
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="admin-shell" data-admin class:config-open={configOpen}>
	<!-- Top bar -->
	<header class="topbar">
		<div class="topbar-left">
			<span class="breadcrumb">
				<span class="topbar-breadcrumb-full">
					<span class="breadcrumb-root">admin</span>
					{#if activePage}
						<span class="breadcrumb-sep">/</span>
						<span class="breadcrumb-current">{activePage.label ?? activePage.pageId}</span>
					{/if}
				</span>
				<span class="topbar-breadcrumb-short">
					<span class="breadcrumb-current">{activePage?.label ?? 'admin'}</span>
				</span>
			</span>
		</div>
		<div class="topbar-right">
			<button class="chip" on:click={() => dispatch('opensettings')} title="Open settings" aria-label="Settings">
				<AdminIcon icon={IconSettings} size="sm" tone="inherit" />
			</button>
			<WipBadge />
			<div class="topbar-collapsible">
				<div class="dropdown-wrapper">
					<button class="chip" on:click={() => { themeDropdownOpen = !themeDropdownOpen; fontDropdownOpen = false; }} title="Select theme">
						{currentTheme}
					</button>
					{#if themeDropdownOpen}
						<div class="dropdown">
							{#each THEME_OPTIONS as theme}
								<button
									class="dropdown-item"
									class:dropdown-item-active={currentTheme === theme.id}
									on:click={() => selectTheme(theme.id)}
								>
									<span class="theme-dot" style="background: {theme.accent};"></span>
									{theme.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<div class="dropdown-wrapper">
					<button class="chip" on:click={() => { fontDropdownOpen = !fontDropdownOpen; themeDropdownOpen = false; }} title="Select font">
						{currentFont}
					</button>
					{#if fontDropdownOpen}
						<div class="dropdown">
							{#each FONT_OPTIONS as font}
								<button
									class="dropdown-item"
									class:dropdown-item-active={currentFont === font.id}
									on:click={() => selectFont(font.id)}
								>
									{font.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<button class="topbar-overflow-chip" on:click={() => overflowOpen = !overflowOpen}>...</button>
			{#if overflowOpen}
				<div class="topbar-overflow-dropdown">
					<div class="overflow-row">
						<span class="overflow-label">THEME</span>
						<div class="dropdown-wrapper">
							<button class="chip" on:click={() => { themeDropdownOpen = !themeDropdownOpen; fontDropdownOpen = false; }} title="Select theme">
								{currentTheme}
							</button>
							{#if themeDropdownOpen}
								<div class="dropdown">
									{#each THEME_OPTIONS as theme}
										<button
											class="dropdown-item"
											class:dropdown-item-active={currentTheme === theme.id}
											on:click={() => selectTheme(theme.id)}
										>
											<span class="theme-dot" style="background: {theme.accent};"></span>
											{theme.label}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>
					<div class="overflow-row">
						<span class="overflow-label">FONT</span>
						<div class="dropdown-wrapper">
							<button class="chip" on:click={() => { fontDropdownOpen = !fontDropdownOpen; themeDropdownOpen = false; }} title="Select font">
								{currentFont}
							</button>
							{#if fontDropdownOpen}
								<div class="dropdown">
									{#each FONT_OPTIONS as font}
										<button
											class="dropdown-item"
											class:dropdown-item-active={currentFont === font.id}
											on:click={() => selectFont(font.id)}
										>
											{font.label}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
			<button
				class="chip"
				class:chip-active={configOpen}
				on:click={toggleConfig}
				title="Toggle config panel"
			>
				{configOpen ? 'preview' : 'config'}
			</button>
		</div>
	</header>

	<!-- Mobile page bar (visible < 768px) -->
	<PageBar
		{pages}
		activePage={activePageId}
		{entriesByTable}
		on:selectpage
	/>

	<!-- Sidebar (visible >= 768px) -->
	<aside class="sidebar">
		<PageSidebar
			{pages}
			{activePageId}
			{featureFlags}
			{entriesByTable}
			on:selectpage={handleSelectPage}
			on:newpage
			on:toggleflag
			on:togglepage
			on:reorderpages
			on:archivepage
		/>
		<div class="sidebar-footer">
			<slot name="sidebar-footer" />
		</div>
	</aside>

	<!-- Builder pane -->
	<main class="builder">
		<slot />
	</main>

	<!-- Preview pane (visible >= 1024px, hidden when config-open) -->
	<section class="preview">
		<slot name="preview" />
	</section>

	<!-- Mobile dock (shown on < 768px via CSS) -->
	<div class="mobile-dock-wrap">
		<MobileDock
			active={activeMobileSheet}
			on:openpages={() => dispatch('openpages')}
			on:opensections={() => dispatch('opensections')}
			on:openpreview={() => dispatch('openpreview')}
		/>
	</div>

	<!-- Legacy preview drawer (tablet only, hidden on mobile + desktop) -->
	<PreviewDrawer
		open={previewOpen}
		siteUrl={typeof window !== 'undefined' ? window.location.origin : ''}
		on:close={() => (previewOpen = false)}
		on:open={() => (previewOpen = true)}
	/>
</div>

<style>
	/* === Shell grid === */
	.admin-shell {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		width: 100vw;
		overflow: hidden;
		background: var(--admin-chrome-bg);
		color: var(--admin-text);
		font-family: var(--admin-font-sans);
	}

	/* Tablet: sidebar + main */
	@media (min-width: 768px) {
		.admin-shell {
			display: grid;
			grid-template-rows: var(--admin-topbar-h) minmax(0, 1fr);
			grid-template-columns: var(--admin-sidebar-w) 1fr;
			grid-template-areas:
				"topbar topbar"
				"sidebar builder";
		}
	}

	/* Desktop: sidebar + builder + preview */
	@media (min-width: 1024px) {
		.admin-shell {
			grid-template-rows: var(--admin-topbar-h) minmax(0, 1fr);
			grid-template-columns: var(--admin-sidebar-w) 1fr 1fr;
			grid-template-areas:
				"topbar topbar topbar"
				"sidebar builder preview";
		}

		/* Config mode: hide preview, expand builder */
		.admin-shell.config-open {
			grid-template-columns: var(--admin-sidebar-w) 1fr;
			grid-template-areas:
				"topbar topbar"
				"sidebar builder";
		}
	}

	/* === Top bar === */
	.topbar {
		flex: 0 0 var(--admin-topbar-h);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--admin-space-4, 16px);
		border-bottom: 1px solid var(--admin-keyline);
		background: var(--admin-chrome-bg);
		color: var(--admin-text);
		width: 100%;
	}

	@media (min-width: 768px) {
		.topbar {
			grid-area: topbar;
		}
	}

	.topbar-left {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		min-width: 0;
	}

	.topbar-right {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.breadcrumb {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 13px);
		display: flex;
		align-items: center;
		gap: var(--admin-space-1, 4px);
		overflow: hidden;
		white-space: nowrap;
	}

	.breadcrumb-root {
		color: var(--admin-text-muted);
	}

	.breadcrumb-sep {
		color: var(--admin-text-subtle);
	}

	.breadcrumb-current {
		color: var(--admin-text);
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chip {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-xs, 12px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: var(--admin-space-2, 8px) var(--admin-space-3, 12px);
		border: 1px solid var(--admin-keyline);
		border-radius: 2px;
		background: transparent;
		color: var(--admin-text-subtle);
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		white-space: nowrap;
		min-height: var(--admin-touch-compact, 36px);
	}

	.chip:hover {
		border-color: var(--admin-keyline-strong);
		color: var(--admin-text);
	}

	.chip-active {
		background: var(--admin-active-outline, #00FF00);
		border-color: var(--admin-active-outline, #00FF00);
		color: #000;
	}

	.chip-active:hover {
		background: var(--admin-active-outline, #00FF00);
		border-color: var(--admin-active-outline, #00FF00);
		color: #000;
	}

	/* === Dropdowns === */
	.dropdown-wrapper {
		position: relative;
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 4px);
		right: 0;
		min-width: 140px;
		background: var(--admin-chrome-bg);
		border: 1px solid var(--admin-keyline);
		border-radius: 4px;
		padding: 4px;
		z-index: 100;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 10px;
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-sm, 13px);
		background: transparent;
		border: none;
		color: var(--admin-text-subtle);
		cursor: pointer;
		border-radius: 2px;
		transition: all var(--admin-transition, 120ms ease);
		text-align: left;
		min-height: var(--admin-touch-compact, 36px);
	}

	.dropdown-item:hover {
		background: var(--admin-frame-bg);
		color: var(--admin-text);
	}

	.dropdown-item-active {
		color: var(--admin-active-outline, #00FF00);
	}

	.theme-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* Mobile pills styling now in PageBar.svelte */

	/* === Sidebar === */
	.sidebar {
		grid-area: sidebar;
		display: none;
		flex-direction: column;
		border-right: 1px solid var(--admin-keyline);
		overflow-y: auto;
		background: var(--admin-chrome-bg);
		color: var(--admin-text);
	}

	@media (min-width: 768px) {
		.sidebar {
			display: flex;
		}
	}

	.sidebar-footer {
		margin-top: auto;
	}

	/* === Mobile dock (bottom row, hidden tablet+) === */
	.mobile-dock-wrap {
		flex: 0 0 auto;
		display: block;
		width: 100%;
	}
	@media (min-width: 768px) {
		.mobile-dock-wrap {
			grid-area: dock;
			display: none;
		}
	}

	/* === Builder (workspace surface) === */
	.builder {
		flex: 1 1 0%;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: var(--admin-space-4, 16px);
		background: var(--admin-workspace-bg);
		color: var(--admin-text);
		width: 100%;
	}

	@media (min-width: 768px) {
		.builder {
			grid-area: builder;
		}
	}

	@media (max-width: 767px) {
		.builder {
			padding: var(--admin-space-2, 8px) 0;
		}
	}

	/* === Preview frame === */
	.preview {
		grid-area: preview;
		display: none;
		overflow-y: auto;
		border-left: 1px solid var(--admin-keyline);
		background: var(--admin-frame-bg);
		padding: 8px;
	}

	@media (min-width: 1024px) {
		.preview {
			display: block;
		}

		.config-open .preview {
			display: none;
		}
	}

	/* === Priority collapse === */
	@media (max-width: 1023px) {
		.topbar-collapsible { display: none; }
		.topbar-overflow-chip { display: inline-flex; }
		.topbar-breadcrumb-full { display: none; }
		.topbar-breadcrumb-short { display: inline; }
	}
	@media (min-width: 1024px) {
		.topbar-collapsible { display: flex; gap: 4px; }
		.topbar-overflow-chip { display: none; }
		.topbar-breadcrumb-full { display: inline; }
		.topbar-breadcrumb-short { display: none; }
	}

	.topbar-overflow-chip {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-sm, 13px);
		padding: var(--admin-space-2, 8px) var(--admin-space-3, 12px);
		border: 1px solid var(--admin-keyline);
		border-radius: 2px;
		background: transparent;
		color: var(--admin-text-subtle);
		cursor: pointer;
		min-height: var(--admin-touch-compact, 36px);
		display: none; /* shown via media query */
		align-items: center;
		transition: all var(--admin-transition, 120ms ease);
	}
	.topbar-overflow-chip:hover {
		border-color: var(--admin-keyline-strong);
		color: var(--admin-text);
	}

	.topbar-overflow-dropdown {
		position: absolute;
		top: calc(var(--admin-topbar-h, 44px) + 4px);
		right: var(--admin-space-4, 16px);
		background: var(--admin-chrome-bg);
		border: 1px solid var(--admin-keyline);
		border-radius: 4px;
		padding: var(--admin-space-2, 8px);
		z-index: 50;
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-2, 8px);
		min-width: 160px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	.overflow-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--admin-space-2, 8px);
	}

	.overflow-label {
		font-family: var(--admin-font-mono);
		font-size: var(--admin-text-xs, 12px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--admin-text-muted);
		font-weight: 600;
	}
</style>
08em;
		color: var(--admin-text-muted);
		font-weight: 600;
	}
</style>
