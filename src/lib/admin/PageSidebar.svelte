<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { stripConvexMeta } from '$lib/admin/constants';
	import FlagsCell from './controls/FlagsCell.svelte';
	import SaveBar from './SaveBar.svelte';
	import { stagedCount } from '$lib/stores/stagedFlags';

	export let pages: any[] = [];
	export let activePageId: string = '';
	export let featureFlags: any[] = [];
	export let entriesByTable: Record<string, any[]> = {};
	export let client: any = null;
	export let api: any = null;

	const dispatch = createEventDispatcher<{
		selectpage: { pageId: string };
		newpage: void;
		toggleflag: { key: string; category: string };
		reorderpages: { pageIds: string[] };
		togglepage: { pageId: string; visible: boolean };
		archivepage: { pageId: string; archived: boolean };
		updatepage: { pageId: string; updates: Record<string, any> };
	}>();

	let dragIndex: number | null = null;
	let dropIndex: number | null = null;

	let editingPageId: string | null = null;
	let editField: 'label' | 'route' | 'navLabel' = 'label';
	let editBuffer = '';
	let editInputEl: HTMLInputElement | undefined;

	function startPageEdit(pageId: string, field: 'label' | 'route' | 'navLabel', value: string) {
		editingPageId = pageId;
		editField = field;
		editBuffer = value || '';
	}

	function cancelPageEdit() {
		editingPageId = null;
		editBuffer = '';
	}

	async function savePageEdit(pageId: string) {
		if (!editBuffer.trim()) { cancelPageEdit(); return; }
		const page = pages.find((p) => p.pageId === pageId);
		if (!page || !client || !api) { cancelPageEdit(); return; }
		try {
			const updates: Record<string, any> = { [editField]: editBuffer.trim() };
			dispatch('updatepage', { pageId, updates });
		} finally {
			editingPageId = null;
			editBuffer = '';
		}
	}

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

	$: homePage = pages.find((p) => p.pageId === 'home') ?? null;
	$: sortedPages = [...pages]
		.filter((p) => p.pageId !== 'home')
		.sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0));

	$: flagsRecord = featureFlags.reduce((acc: Record<string, boolean>, f: any) => {
		acc[f.key] = f.enabled;
		return acc;
	}, {} as Record<string, boolean>);

	function getEntryCount(page: any): number {
		if (!page?.sections?.length) return 0;
		const dt = page.sections[0]?.dataTable;
		if (!dt) return 0;
		return entriesByTable[dt]?.length ?? 0;
	}

	function handleFlagToggle(e: CustomEvent<{ key: string; category: string }>) {
		dispatch('toggleflag', e.detail);
	}
</script>

<nav class="page-sidebar" aria-label="Admin pages">
	<!-- Home card — pinned above PAGES -->
	{#if homePage}
		<div class="sidebar-section">
			<div
				class="home-card"
				class:home-card--active={activePageId === 'home'}
				role="button"
				tabindex="0"
				on:click={() => dispatch('selectpage', { pageId: 'home' })}
				on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch('selectpage', { pageId: 'home' }); } }}
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
			</div>
		</div>
	{/if}

	<!-- FLAGS section — paginated by category, staged -->
	<div class="sidebar-section flags-section">
		<span class="admin-label admin-label--xs sidebar-heading">FLAGS{#if $stagedCount > 0} · <span class="staged-indicator">{$stagedCount} staged</span>{/if}</span>
		<FlagsCell {featureFlags} {client} {api} on:toggle={handleFlagToggle} />
	</div>

	<!-- Save bar — shown when staged changes exist -->
	<SaveBar {client} {api} currentFlags={featureFlags} />

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
					class:page-row-archived={page.archived}
					role="option"
					aria-selected={activePageId === page.pageId}
					on:click={() => dispatch('selectpage', { pageId: page.pageId })}
				>
					<span class="page-row-label">
						<span
							class="page-dot-btn"
							role="button"
							tabindex="-1"
							on:click|stopPropagation={() => dispatch('togglepage', { pageId: page.pageId, visible: !page.visible })}
							on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch('togglepage', { pageId: page.pageId, visible: !page.visible }); } }}
							title={page.visible ? 'Click to hide page' : 'Click to show page'}
							aria-label={page.visible ? 'Hide ' + page.label : 'Show ' + page.label}
						>
							<span class="page-dot" class:page-dot--visible={page.visible && !page.archived} class:page-dot--hidden={!page.visible} class:page-dot--archived={page.archived && page.visible}></span>
						</span>
						{#if editingPageId === page.pageId}
							<input
								class="inline-edit"
								bind:this={editInputEl}
								bind:value={editBuffer}
								placeholder={editField}
								on:keydown={(e) => {
									if (e.key === 'Enter') { e.preventDefault(); savePageEdit(page.pageId); }
									if (e.key === 'Escape') cancelPageEdit();
								}}
								on:blur={() => savePageEdit(page.pageId)}
								on:click|stopPropagation
							/>
						{:else}
							<span
								class="page-label-text"
								on:dblclick|stopPropagation={() => startPageEdit(page.pageId, 'label', page.label)}
							>{page.label}</span>
						{/if}
					</span>
					<span class="page-row-right">
						{#if count > 0}
							<span class="page-row-count">{count}</span>
						{/if}
						<span
							class="edit-btn"
							role="button"
							tabindex="-1"
							title="Edit page label, route, nav label"
							on:click|stopPropagation={() => startPageEdit(page.pageId, 'label', page.label)}
							on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startPageEdit(page.pageId, 'label', page.label); } }}
						>✎</span>
						<span
							class="archive-btn"
							class:archive-btn--active={page.archived}
							role="button"
							tabindex="-1"
							title={page.archived ? 'Unarchive page' : 'Archive page'}
							on:click|stopPropagation={() => dispatch('archivepage', { pageId: page.pageId, archived: !page.archived })}
							on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch('archivepage', { pageId: page.pageId, archived: !page.archived }); } }}
						>A</span>
					</span>
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

	.page-dot--archived {
		background: #e54545;
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

	.page-row-right {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.page-row-count {
		font-size: var(--admin-text-2xs, 7px);
		color: var(--color-text-subtle, #444);
		font-variant-numeric: tabular-nums;
	}

	.page-row-active .page-row-count {
		color: var(--admin-blue, #2563EB);
	}

	/* Archived row — red tint */
	.page-row-archived {
		border-left-color: #e54545;
	}

	.page-row-archived .page-row-label {
		color: #e54545;
		opacity: 0.7;
	}

	.page-row-archived:hover .page-row-label {
		opacity: 1;
	}

	/* Archive toggle button — tiny "A" indicator */
	.archive-btn {
		font-family: var(--font-mono);
		font-size: 7px;
		font-weight: 700;
		color: var(--color-text-subtle, #444);
		opacity: 0;
		cursor: pointer;
		padding: 2px 3px;
		border-radius: 2px;
		transition: all 120ms ease;
		user-select: none;
		line-height: 1;
	}

	.page-row:hover .archive-btn {
		opacity: 0.5;
	}

	.page-row:hover .archive-btn:hover {
		opacity: 1;
		color: #e54545;
		background: rgba(229, 69, 69, 0.1);
	}

	.archive-btn--active {
		opacity: 1 !important;
		color: #e54545;
		background: rgba(229, 69, 69, 0.12);
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

	/* Flags section — paginated by category */
	.flags-section {
		padding-top: var(--admin-space-3, 12px);
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		padding-bottom: var(--admin-space-3, 12px);
		margin-bottom: var(--admin-space-2, 8px);
	}
</style>
