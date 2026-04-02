<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import './tokens/admin-tokens.css';
	import PageSidebar from './PageSidebar.svelte';

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
	}>();

	let configOpen = false;
	let overflowOpen = false;

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
		{ id: 'darkroom', label: 'Darkroom', accent: '#FF4444' },
		{ id: 'accessible', label: 'A11y', accent: '#0000FF' },
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

<div class="admin-shell" class:config-open={configOpen}>
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
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
			</button>
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

	<!-- Mobile page pills (visible < 768px) -->
	<nav class="mobile-pills" aria-label="Pages">
		{#each pages as page (page.pageId)}
			{@const count = getEntryCount(page)}
			<button
				class="pill"
				class:pill-active={activePageId === page.pageId}
				on:click={() => dispatch('selectpage', { pageId: page.pageId })}
			>
				{page.label}
				{#if count > 0}
					<span class="pill-count">{count}</span>
				{/if}
			</button>
		{/each}
	</nav>

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
			on:reorderpages
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
</div>

<style>
	/* === Shell grid === */
	.admin-shell {
		display: grid;
		grid-template-rows: var(--admin-topbar-h) auto 1fr;
		grid-template-columns: 1fr;
		grid-template-areas:
			"topbar"
			"pills"
			"builder";
		height: 100vh;
		overflow: hidden;
		background: var(--color-bg, #0a0a0a);
		color: var(--color-text, #e5e5e5);
	}

	/* Tablet: sidebar + main */
	@media (min-width: 768px) {
		.admin-shell {
			grid-template-rows: var(--admin-topbar-h) 1fr;
			grid-template-columns: var(--admin-sidebar-w) 1fr;
			grid-template-areas:
				"topbar topbar"
				"sidebar builder";
		}
	}

	/* Desktop: sidebar + builder + preview */
	@media (min-width: 1024px) {
		.admin-shell {
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
		grid-area: topbar;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--admin-space-4, 16px);
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		background: var(--color-bg, #0a0a0a);
		z-index: 10;
	}

	.topbar-left {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.topbar-right {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.breadcrumb {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
		display: flex;
		align-items: center;
		gap: var(--admin-space-1, 4px);
	}

	.breadcrumb-root {
		color: var(--color-text-muted, #666);
	}

	.breadcrumb-sep {
		color: var(--color-text-subtle, #444);
	}

	.breadcrumb-current {
		color: var(--color-text, #e5e5e5);
		font-weight: 500;
	}

	.chip {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: var(--admin-space-1, 4px) var(--admin-space-3, 12px);
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-muted, #666);
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		white-space: nowrap;
	}

	.chip:hover {
		border-color: var(--color-text-muted, #666);
		color: var(--color-text, #e5e5e5);
	}

	.chip-active {
		background: var(--admin-blue, #2563EB);
		border-color: var(--admin-blue, #2563EB);
		color: #fff;
	}

	.chip-active:hover {
		background: var(--admin-blue, #2563EB);
		border-color: var(--admin-blue, #2563EB);
		color: #fff;
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
		background: var(--color-bg, #0a0a0a);
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 4px;
		padding: 4px;
		z-index: 100;
		box-shadow: 0 4px 12px rgba(0,0,0,0.3);
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 6px 8px;
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		background: transparent;
		border: none;
		color: var(--color-text-muted, #666);
		cursor: pointer;
		border-radius: 2px;
		transition: all var(--admin-transition, 120ms ease);
		text-align: left;
	}

	.dropdown-item:hover {
		background: var(--color-bg-alt, #111);
		color: var(--color-text, #e5e5e5);
	}

	.dropdown-item-active {
		color: var(--admin-blue, #2563EB);
	}

	.theme-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* === Mobile pills === */
	.mobile-pills {
		grid-area: pills;
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		padding: var(--admin-space-2, 8px) var(--admin-space-4, 16px);
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
	}

	.mobile-pills::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 768px) {
		.mobile-pills {
			display: none;
		}
	}

	.pill {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 6px 14px;
		border-radius: 2px;
		border: 1px solid var(--border-color-subtle, #222);
		background: transparent;
		color: var(--color-text-muted, #666);
		cursor: pointer;
		white-space: nowrap;
		transition: all var(--admin-transition, 120ms ease);
		min-height: var(--admin-touch-min, 44px);
		display: inline-flex;
		align-items: center;
		gap: var(--admin-space-1, 4px);
	}

	.pill:hover {
		border-color: var(--color-text-muted, #666);
		color: var(--color-text, #e5e5e5);
	}

	.pill-active {
		background: var(--color-text, #e5e5e5);
		color: var(--color-bg, #0a0a0a);
		border-color: var(--color-text, #e5e5e5);
	}

	.pill-active:hover {
		background: var(--color-text, #e5e5e5);
		color: var(--color-bg, #0a0a0a);
	}

	.pill-count {
		font-size: var(--admin-text-2xs, 7px);
		color: var(--admin-green, #44D62C);
	}

	.pill-active .pill-count {
		color: var(--admin-green, #44D62C);
	}

	/* === Sidebar === */
	.sidebar {
		grid-area: sidebar;
		display: none;
		flex-direction: column;
		border-right: 1px solid var(--border-color-subtle, #1a1a1a);
		overflow-y: auto;
		background: var(--color-bg, #0a0a0a);
	}

	@media (min-width: 768px) {
		.sidebar {
			display: flex;
		}
	}

	.sidebar-footer {
		margin-top: auto;
	}

	/* === Builder === */
	.builder {
		grid-area: builder;
		overflow-y: auto;
		padding: var(--admin-space-4, 16px);
	}

	/* === Preview === */
	.preview {
		grid-area: preview;
		display: none;
		overflow-y: auto;
		border-left: 1px solid var(--border-color-subtle, #1a1a1a);
		background: var(--color-bg, #0a0a0a);
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
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		padding: var(--admin-space-1, 4px) var(--admin-space-3, 12px);
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		min-height: var(--admin-touch-compact, 28px);
		display: none; /* shown via media query */
		align-items: center;
		transition: all var(--admin-transition, 120ms ease);
	}
	.topbar-overflow-chip:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.topbar-overflow-dropdown {
		position: absolute;
		top: calc(var(--admin-topbar-h, 44px) + 4px);
		right: var(--admin-space-4, 16px);
		background: var(--color-bg, #0e0e0e);
		border: 1px solid var(--border-color-subtle);
		border-radius: 4px;
		padding: var(--admin-space-2, 8px);
		z-index: 50;
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-2, 8px);
		min-width: 160px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.2);
	}

	.overflow-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--admin-space-2, 8px);
	}

	.overflow-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		font-weight: 600;
	}
</style>
