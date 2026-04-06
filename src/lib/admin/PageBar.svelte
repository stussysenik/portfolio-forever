<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let pages: any[] = [];
	export let activePage: string = '';
	export let entriesByTable: Record<string, any[]> = {};

	const dispatch = createEventDispatcher<{
		selectpage: { pageId: string };
	}>();

	function getEntryCount(page: any): number {
		if (!page?.sections?.length) return 0;
		const dt = page.sections[0]?.dataTable;
		if (!dt) return 0;
		return entriesByTable[dt]?.length ?? 0;
	}

	$: activePageObj = pages.find((p) => p.pageId === activePage) ?? null;
</script>

<nav class="page-bar" aria-label="Pages">
	<div class="page-bar-scroll">
		{#each pages as page (page.pageId)}
			{@const count = getEntryCount(page)}
			{@const sectionCount = page.sections?.length ?? 0}
			{@const accentColor = page.themeOverrides?.accentColor ?? null}
			{@const isActive = activePage === page.pageId}
			<button
				class="pill"
				class:pill-active={isActive}
				on:click={() => dispatch('selectpage', { pageId: page.pageId })}
				aria-current={isActive ? 'page' : undefined}
			>
				{#if accentColor}
					<span class="pill-accent-dot" style="background: {accentColor};" aria-hidden="true"></span>
				{/if}
				<span class="pill-label">{page.label ?? page.pageId}</span>
				{#if sectionCount > 0}
					<span class="pill-section-count" aria-label="{sectionCount} sections">{sectionCount}</span>
				{/if}
				{#if count > 0}
					<span class="pill-entry-count" aria-label="{count} entries">{count}</span>
				{/if}
			</button>
		{/each}
	</div>
</nav>

<style>
	.page-bar {
		grid-area: pills;
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		background: var(--color-bg, #0a0a0a);
	}

	@media (min-width: 768px) {
		.page-bar {
			display: none;
		}
	}

	.page-bar-scroll {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		padding: var(--admin-space-2, 8px) var(--admin-space-4, 16px);
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.page-bar-scroll::-webkit-scrollbar {
		display: none;
	}

	/* === Pills === */
	.pill {
		display: inline-flex;
		align-items: center;
		gap: var(--admin-space-1, 4px);
		min-height: var(--admin-touch-min, 44px);
		padding: 6px 14px;
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		white-space: nowrap;
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-muted, #666);
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		flex-shrink: 0;
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

	/* === Pill indicators === */
	.pill-accent-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.pill-label {
		/* inherits pill font styles */
	}

	.pill-section-count {
		font-size: var(--admin-text-2xs, 7px);
		color: var(--admin-green, #44D62C);
		font-family: var(--font-mono);
		line-height: 1;
	}

	.pill-active .pill-section-count {
		color: var(--admin-green, #44D62C);
	}

	.pill-entry-count {
		font-size: var(--admin-text-2xs, 7px);
		color: var(--color-text-muted, #666);
		font-family: var(--font-mono);
		line-height: 1;
	}

	.pill-active .pill-entry-count {
		color: var(--color-bg, #0a0a0a);
		opacity: 0.6;
	}
</style>
