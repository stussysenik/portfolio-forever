<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import { validateLabel, validateRoute } from '$lib/admin/admin-utils';
	import PagePanel from '$lib/admin/PagePanel.svelte';

	export let pages: any[] = [];
	export let featureFlags: any[] = [];
	export let client: any;
	export let api: any;
	export let entriesByTable: Record<string, any[]> = {};

	let activePageId: string = '';
	let showNewPageForm = false;
	let newLabel = '';
	let newRoute = '';

	$: if (pages.length > 0 && !activePageId) {
		activePageId = pages[0].pageId;
	}

	$: activePage = pages.find((p) => p.pageId === activePageId) ?? null;

	$: activeEntries = (() => {
		if (!activePage?.sections?.length) return [];
		const dt = sectionTypeRegistry[activePage.sections[0]?.sectionType]?.dataTable
			?? activePage.sections[0]?.dataTable;
		return dt ? (entriesByTable[dt] ?? []) : [];
	})();

	function selectTab(pageId: string) {
		activePageId = pageId;
		showNewPageForm = false;
	}

	function handleTabKeydown(e: KeyboardEvent) {
		const tabElements = Array.from(document.querySelectorAll('[role="tab"]'));
		const idx = tabElements.indexOf(e.currentTarget as HTMLElement);
		let nextIdx = idx;

		if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabElements.length;
		else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabElements.length) % tabElements.length;
		else if (e.key >= '1' && e.key <= '9') {
			const jumpIdx = parseInt(e.key) - 1;
			if (jumpIdx < pages.length) {
				selectTab(pages[jumpIdx].pageId);
				const target = tabElements[jumpIdx] as HTMLElement;
				target?.focus();
			}
			return;
		}
		else return;

		e.preventDefault();
		const next = tabElements[nextIdx] as HTMLElement;
		next.focus();
		next.click();
	}

	async function createNewPage() {
		const labelResult = validateLabel(newLabel);
		if (!labelResult.valid) {
			toast.error(labelResult.error!);
			return;
		}
		const routeResult = validateRoute(newRoute);
		if (!routeResult.valid) {
			toast.error(routeResult.error!);
			return;
		}

		const pageId = labelResult.value.toLowerCase().replace(/[^a-z0-9\-:]/g, '-');

		try {
			await client.mutation(api.pages.upsert, {
				pageId,
				label: labelResult.value,
				route: routeResult.value,
				navOrder: pages.length,
				navVisible: true,
				visible: true,
				sections: [],
			});
			activePageId = pageId;
			showNewPageForm = false;
			newLabel = '';
			newRoute = '';
			toast.success(`Created "${labelResult.value}"`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to create page');
		}
	}

	function getEntryCount(page: any): number {
		const dt = sectionTypeRegistry[page.sections?.[0]?.sectionType]?.dataTable
			?? page.sections?.[0]?.dataTable;
		if (!dt) return 0;
		return entriesByTable[dt]?.length ?? 0;
	}
</script>

<div class="content-hub">
	<div class="tab-bar" role="tablist" aria-label="Pages">
		{#each pages as page (page.pageId)}
			{@const count = getEntryCount(page)}
			<button
				role="tab"
				class="tab"
				class:active={activePageId === page.pageId}
				aria-selected={activePageId === page.pageId}
				tabindex={activePageId === page.pageId ? 0 : -1}
				on:click={() => selectTab(page.pageId)}
				on:keydown={handleTabKeydown}
			>
				{page.label}
				{#if count > 0}
					<span class="tab-count">{count}</span>
				{/if}
			</button>
		{/each}
		<button
			class="tab tab-new"
			on:click={() => (showNewPageForm = !showNewPageForm)}
			aria-label="Create new page"
		>
			+ New Page
		</button>
	</div>

	{#if showNewPageForm}
		<div class="new-page-form">
			<input
				class="new-page-input"
				type="text"
				bind:value={newLabel}
				placeholder="Page label (WYSIWYG)"
				on:keydown={(e) => e.key === 'Escape' && (showNewPageForm = false)}
			/>
			<input
				class="new-page-input"
				type="text"
				bind:value={newRoute}
				placeholder="/route"
				on:keydown={(e) => {
					if (e.key === 'Enter') createNewPage();
					if (e.key === 'Escape') showNewPageForm = false;
				}}
			/>
			<button class="new-page-submit" on:click={createNewPage}>Create</button>
			<button class="new-page-cancel" on:click={() => (showNewPageForm = false)}>Cancel</button>
		</div>
	{/if}

	{#if activePage}
		<PagePanel
			page={activePage}
			entries={activeEntries}
			{featureFlags}
			{client}
			{api}
		/>
	{/if}
</div>

<style>
	.content-hub {
		display: flex;
		flex-direction: column;
	}

	.tab-bar {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		overflow-x: auto;
		padding: 0 12px;
		scrollbar-width: none;
	}

	.tab-bar::-webkit-scrollbar {
		display: none;
	}

	.tab {
		font-family: var(--font-mono);
		font-size: 11px;
		padding: 10px 14px;
		color: var(--color-text-muted, #666);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		white-space: nowrap;
		transition: color var(--duration-fast, 120ms) var(--easing);
		min-height: 36px;
	}

	.tab:hover {
		color: var(--color-text, #fff);
	}

	.tab.active {
		color: var(--color-text, #fff);
		font-weight: 500;
		border-bottom-color: var(--bento-blue, #2563EB);
	}

	.tab:focus-visible {
		outline: 2px solid var(--bento-blue, #2563EB);
		outline-offset: -2px;
		border-radius: 2px;
	}

	.tab-count {
		font-size: 8px;
		color: var(--bento-green, #44D62C);
		margin-left: 3px;
	}

	.tab.active .tab-count {
		color: var(--bento-green, #44D62C);
	}

	.tab-new {
		color: var(--color-text-subtle, #555);
	}

	.tab-new:hover {
		color: var(--bento-blue, #2563EB);
	}

	.new-page-form {
		display: flex;
		gap: 6px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		align-items: center;
	}

	.new-page-input {
		font-family: var(--font-mono);
		font-size: 11px;
		padding: 4px 8px;
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 3px;
		color: var(--color-text, #fff);
		outline: none;
	}

	.new-page-input:focus {
		border-color: var(--bento-blue, #2563EB);
	}

	.new-page-submit {
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 4px 10px;
		background: var(--bento-green, #44D62C);
		color: #000;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		font-weight: 600;
	}

	.new-page-cancel {
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 4px 10px;
		background: none;
		color: var(--color-text-muted, #666);
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 3px;
		cursor: pointer;
	}
</style>
