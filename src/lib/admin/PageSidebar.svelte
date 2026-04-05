<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let pages: any[] = [];
	export let activePageId: string = '';
	export let featureFlags: any[] = [];
	export let entriesByTable: Record<string, any[]> = {};

	const dispatch = createEventDispatcher<{
		selectpage: { pageId: string };
		newpage: void;
		toggleflag: { key: string; category: string };
		reorderpages: { pageIds: string[] };
		togglepage: { pageId: string; visible: boolean };
	}>();

	let dragIndex: number | null = null;
	let dropIndex: number | null = null;

	function handleDragStart(e: DragEvent, index: number) {
		dragIndex = index;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', String(index));
		}
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dropIndex = index;
	}

	function handleDrop(e: DragEvent, index: number) {
		e.preventDefault();
		if (dragIndex === null || dragIndex === index) {
			dragIndex = null;
			dropIndex = null;
			return;
		}
		const reordered = [...sortedPages];
		const [moved] = reordered.splice(dragIndex, 1);
		reordered.splice(index, 0, moved);
		dispatch('reorderpages', { pageIds: reordered.map((p) => p.pageId) });
		dragIndex = null;
		dropIndex = null;
	}

	function handleDragEnd() {
		dragIndex = null;
		dropIndex = null;
	}

	const DEFAULT_FLAGS = [
		{ key: 'pixel-engine', label: 'Pixel Engine', category: 'visual' },
		{ key: 'ascii-donut', label: 'ASCII Donut', category: 'visual' },
		{ key: 'parallax', label: 'Parallax', category: 'visual' },
		{ key: 'view-transitions', label: 'View Trans.', category: 'visual' },
		{ key: 'wip-banner', label: 'WIP Banner', category: 'layout' },
		{ key: 'elevator', label: 'Elevator', category: 'visual' },
		{ key: 'terminal-matrix', label: 'Terminal Mtx', category: 'visual' },
		{ key: 'os-desktop', label: 'OS Desktop', category: 'visual' },
		{ key: 'social-links', label: 'Social Links', category: 'layout' },
		{ key: 'command-palette', label: 'Cmd Palette', category: 'layout' },
	];

	const FLAG_DESCRIPTIONS: Record<string, string> = {
		'pixel-engine': 'WebGL particle overlay (electrons, wanderers, cards)',
		'ascii-donut': 'Rotating ASCII donut animation in hero',
		'parallax': 'Parallax scroll effect on sections',
		'view-transitions': 'Smooth page transitions (View Transitions API)',
		'wip-banner': 'Show "Work in Progress" banner at top',
		'elevator': 'Back-to-top elevator button with music',
		'terminal-matrix': 'Matrix rain effect in terminal page',
		'os-desktop': 'Desktop OS simulation mode',
		'social-links': 'Show social media links in footer',
		'command-palette': 'Vim-style command palette (Cmd+K)',
	};

	$: homePage = pages.find((p) => p.pageId === 'home') ?? null;
	$: sortedPages = [...pages]
		.filter((p) => p.pageId !== 'home')
		.sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0));

	function getEntryCount(page: any): number {
		if (!page?.sections?.length) return 0;
		const dt = page.sections[0]?.dataTable;
		if (!dt) return 0;
		return entriesByTable[dt]?.length ?? 0;
	}

	function isFlagEnabled(key: string): boolean {
		const flag = featureFlags.find((f: any) => f.key === key);
		return flag ? flag.enabled : true;
	}
</script>

<nav class="page-sidebar" aria-label="Admin pages">
	<!-- Home card — pinned above PAGES -->
	{#if homePage}
		<div class="sidebar-section">
			<button
				class="home-card"
				class:home-card--active={activePageId === 'home'}
				on:click={() => dispatch('selectpage', { pageId: 'home' })}
			>
				<div class="home-card-main">
					<span class="home-card-icon">&#8962;</span>
					<div class="home-card-text">
						<span class="home-card-title">Home</span>
						<span class="home-card-route">/ &middot; root page</span>
					</div>
				</div>
				<button
					class="page-dot-btn"
					on:click|stopPropagation={() => dispatch('togglepage', { pageId: 'home', visible: !homePage.visible })}
					title={homePage.visible ? 'Click to hide page' : 'Click to show page'}
					aria-label={homePage.visible ? 'Hide Home' : 'Show Home'}
				>
					<span
						class="home-card-dot"
						class:home-card-dot--visible={homePage.visible}
						class:home-card-dot--hidden={!homePage.visible}
					></span>
				</button>
			</button>
		</div>
	{/if}

	<!-- FLAGS section — promoted above pages -->
	<div class="sidebar-section flags-section">
		<span class="admin-label admin-label--xs sidebar-heading">FLAGS</span>
		<div class="flags-list">
			{#each DEFAULT_FLAGS as flag}
				<button
					class="flag-item"
					class:flag-item--on={isFlagEnabled(flag.key)}
					on:click={() => dispatch('toggleflag', { key: flag.key, category: flag.category })}
					aria-label="Toggle {flag.label}"
					aria-checked={isFlagEnabled(flag.key)}
					role="switch"
					title={FLAG_DESCRIPTIONS[flag.key] ?? flag.label}
				>
					<span
						class="flag-dot"
						class:flag-dot--on={isFlagEnabled(flag.key)}
						class:flag-dot--off={!isFlagEnabled(flag.key)}
					></span>
					<span class="flag-label">{flag.label}</span>
					<span class="flag-desc">{FLAG_DESCRIPTIONS[flag.key]?.split('(')[0]?.trim() ?? ''}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- PAGES section -->
	<div class="sidebar-section">
		<span class="admin-label admin-label--xs sidebar-heading">PAGES</span>
		<ul class="page-list" role="listbox" aria-label="Page list">
			{#each sortedPages as page, i (page.pageId)}
				{@const count = getEntryCount(page)}
				<li
					class="page-list-item"
					class:page-dragging={dragIndex === i}
					class:page-drop-above={dropIndex === i && dragIndex !== null && dragIndex !== i}
					draggable="true"
					on:dragstart={(e) => handleDragStart(e, i)}
					on:dragover={(e) => handleDragOver(e, i)}
					on:drop={(e) => handleDrop(e, i)}
					on:dragend={handleDragEnd}
				>
					<button
						class="page-row"
						class:page-row-active={activePageId === page.pageId}
						role="option"
						aria-selected={activePageId === page.pageId}
						on:click={() => dispatch('selectpage', { pageId: page.pageId })}
					>
						<span class="page-row-label">
							<button
								class="page-dot-btn"
								on:click|stopPropagation={() => dispatch('togglepage', { pageId: page.pageId, visible: !page.visible })}
								title={page.visible ? 'Click to hide page' : 'Click to show page'}
								aria-label={page.visible ? 'Hide ' + page.label : 'Show ' + page.label}
							>
								<span class="page-dot" class:page-dot--visible={page.visible} class:page-dot--hidden={!page.visible}></span>
							</button>
							{page.label}
						</span>
						{#if count > 0}
							<span class="page-row-count">{count}</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
		<button class="new-page-btn" on:click={() => dispatch('newpage')}>
			+ New Page
		</button>
	</div>
</nav>

<style>
	.page-sidebar {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: var(--admin-space-4, 16px) 0;
	}

	.sidebar-section {
		padding: 0 var(--admin-space-4, 16px);
	}

	.sidebar-heading {
		display: block;
		margin-bottom: var(--admin-space-3, 12px);
	}

	/* Home card */
	.home-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 8px;
		border: 1px solid var(--border-color-subtle);
		border-left: 2px solid var(--admin-blue, #2563EB);
		border-radius: 4px;
		background: rgba(37, 99, 235, 0.03);
		margin-bottom: 8px;
		cursor: pointer;
		font-family: var(--font-mono);
		transition: background var(--admin-transition, 120ms ease);
	}

	.home-card:hover {
		background: rgba(37, 99, 235, 0.06);
	}

	.home-card--active {
		background: rgba(37, 99, 235, 0.08);
	}

	.home-card--active:hover {
		background: rgba(37, 99, 235, 0.12);
	}

	.home-card-main {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.home-card-icon {
		font-size: 12px;
		color: var(--admin-blue, #2563EB);
		line-height: 1;
	}

	.home-card-text {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.home-card-title {
		font-size: 9px;
		font-weight: 600;
		color: var(--color-text);
	}

	.home-card-route {
		font-size: 7px;
		color: var(--color-text-subtle, #666);
	}

	.home-card-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.home-card-dot--visible {
		background: var(--admin-green, #44D62C);
	}

	.home-card-dot--hidden {
		background: var(--color-text-subtle, #444);
	}

	/* Page list */
	.page-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.page-list-item {
		margin: 0;
		padding: 0;
	}

	.page-dragging {
		opacity: 0.4;
	}

	.page-drop-above {
		border-top: 2px solid var(--admin-blue, #2563EB);
	}

	.page-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--admin-space-2, 8px) var(--admin-space-3, 12px);
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
		background: transparent;
		border: none;
		border-left: 2px solid transparent;
		color: var(--color-text-muted, #666);
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		text-align: left;
		min-height: var(--admin-touch-compact, 28px);
	}

	.page-row:hover {
		color: var(--color-text, #e5e5e5);
		background: var(--color-bg-alt, #111);
	}

	.page-row-active {
		background: #e8eeff;
		border-left-color: var(--admin-blue, #2563EB);
		color: #1a1a1a;
	}

	/* In dark themes, active row should use a dark tint */
	:global([data-theme="dark"]) .page-row-active,
	:global([data-theme="terminal"]) .page-row-active {
		background: rgba(37, 99, 235, 0.12);
		color: var(--color-text, #e5e5e5);
	}

	.page-row-active:hover {
		background: #e8eeff;
	}

	:global([data-theme="dark"]) .page-row-active:hover,
	:global([data-theme="terminal"]) .page-row-active:hover {
		background: rgba(37, 99, 235, 0.18);
	}

	.page-row-label {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.page-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.page-dot--visible {
		background: var(--admin-green, #44D62C);
	}

	.page-dot--hidden {
		background: var(--color-text-subtle, #444);
	}

	.page-dot-btn {
		background: none;
		border: none;
		padding: 4px;
		margin: -4px;
		cursor: pointer;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.page-dot-btn:hover .page-dot,
	.page-dot-btn:hover .home-card-dot {
		transform: scale(1.5);
		transition: transform 120ms ease;
	}

	.page-row-count {
		font-size: var(--admin-text-2xs, 7px);
		color: var(--color-text-subtle, #444);
		font-variant-numeric: tabular-nums;
	}

	.page-row-active .page-row-count {
		color: var(--admin-blue, #2563EB);
	}

	/* New page button */
	.new-page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: var(--admin-space-2, 8px);
		margin-top: var(--admin-space-2, 8px);
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-subtle, #444);
		background: transparent;
		border: 1px dashed var(--border-color-subtle, #222);
		border-radius: var(--admin-space-1, 4px);
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
	}

	.new-page-btn:hover {
		color: var(--admin-blue, #2563EB);
		border-color: var(--admin-blue, #2563EB);
	}

	/* Flags section — promoted above pages */
	.flags-section {
		padding-top: var(--admin-space-3, 12px);
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		padding-bottom: var(--admin-space-3, 12px);
		margin-bottom: var(--admin-space-2, 8px);
	}

	.flags-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.flag-item {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		padding: var(--admin-space-1, 4px) var(--admin-space-2, 8px);
		background: transparent;
		border: none;
		cursor: pointer;
		border-radius: 2px;
		transition: background var(--admin-transition, 120ms ease);
		text-align: left;
		width: 100%;
	}

	.flag-item:hover {
		background: var(--color-bg-alt, #111);
	}

	.flag-item--on {
		background: rgba(68, 214, 44, 0.04);
	}

	.flag-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
		transition: background var(--admin-transition, 120ms ease);
	}

	.flag-dot--on {
		background: var(--admin-green, #44D62C);
	}

	.flag-dot--off {
		background: var(--color-text-subtle, #444);
	}

	.flag-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted, #666);
	}

	.flag-desc {
		font-family: var(--font-mono);
		font-size: 6px;
		color: var(--color-text-subtle, #444);
		margin-left: auto;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 80px;
	}
</style>
