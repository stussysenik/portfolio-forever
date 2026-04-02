<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let pages: any[] = [];
	export let entryCountMap: Record<string, number> = {};

	const dispatch = createEventDispatcher<{ navigate: string }>();

	/** Section type to icon glyph mapping */
	const TYPE_ICONS: Record<string, string> = {
		hero: '\u25CB',       /* circle */
		works: '\u25A0',      /* square */
		gallery: '\u25A3',    /* square with fill */
		blog: '\u270E',       /* pencil */
		cv: '\u2261',         /* triple bar */
		talks: '\u25B6',      /* play */
		terminal: '\u25B8',   /* small right triangle */
		likes: '\u2665',      /* heart */
		labs: '\u2699',       /* gear */
		gifts: '\u2606',      /* star */
		process: '\u21BB',    /* cycle arrow */
		os: '\u2318',         /* command */
		default: '\u25CB',    /* circle */
	};

	function getTypeIcon(page: any): string {
		const type = page?.sections?.[0]?.type || page?.type || 'default';
		return TYPE_ICONS[type] || TYPE_ICONS.default;
	}

	function formatIndex(idx: number): string {
		return String(idx + 1).padStart(2, '0');
	}

	function handleCardClick(page: any) {
		dispatch('navigate', page.pageId);
	}

	function handleKeydown(e: KeyboardEvent, page: any) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleCardClick(page);
		}
	}
</script>

<div class="page-grid">
	{#each pages as page, idx}
		<div
			class="page-card"
			class:published={page.visible !== false}
			class:hidden-page={page.visible === false}
			role="button"
			tabindex="0"
			on:click={() => handleCardClick(page)}
			on:keydown={(e) => handleKeydown(e, page)}
			aria-label="Open {page.label || page.name || 'Page'} editor"
		>
			<div class="card-top">
				<span class="card-number">{formatIndex(idx)}</span>
				<span class="card-status" class:active={page.visible !== false}></span>
			</div>

			<div class="card-body">
				<div class="card-name-row">
					<span class="card-type-icon" aria-hidden="true">{getTypeIcon(page)}</span>
					<span class="card-name">{page.label || page.name || 'Untitled'}</span>
				</div>

				{#if entryCountMap[page._id || page.id] !== undefined}
					<span class="card-count">
						{entryCountMap[page._id || page.id]} {entryCountMap[page._id || page.id] === 1 ? 'entry' : 'entries'}
					</span>
				{/if}
			</div>

			<div class="card-footer">
				<span class="card-id">{page.slug || page.sectionId || page._id || ''}</span>
			</div>
		</div>
	{/each}

	<div
		class="page-card new-page-card"
		role="button"
		tabindex="0"
		on:click={() => dispatch('navigate', '__new__')}
		on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch('navigate', '__new__'); } }}
		aria-label="Create new page"
	>
		<span class="new-page-icon">+</span>
		<span class="new-page-label">New Page</span>
	</div>
</div>

<style>
	.page-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		padding: 0;
	}

	@media (max-width: 1024px) {
		.page-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.page-grid {
			grid-template-columns: 1fr;
		}
	}

	/* ── Card ── */
	.page-card {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-md);
		background: var(--color-bg);
		cursor: pointer;
		transition:
			border-color var(--duration-fast) var(--easing),
			background var(--duration-fast) var(--easing);
		user-select: none;
		outline: none;
	}

	.page-card:hover {
		border-color: var(--color-text-muted);
	}

	.page-card:focus-visible {
		border-color: var(--bento-blue, #2563EB);
		box-shadow: 0 0 0 2px color-mix(in oklch, var(--bento-blue, #2563EB), transparent 80%);
	}

	.page-card.hidden-page {
		opacity: 0.55;
		border-style: dashed;
	}

	.page-card.hidden-page:hover {
		opacity: 0.8;
	}

	/* ── Card Top: number + status ── */
	.card-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.card-number {
		font-family: var(--font-mono);
		font-size: 28px;
		font-weight: 700;
		line-height: 1;
		color: var(--color-text);
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.card-status {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #737373;
		flex-shrink: 0;
		margin-top: 4px;
	}

	.card-status.active {
		background: var(--bento-green, #44D62C);
	}

	/* ── Card Body ── */
	.card-body {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.card-name-row {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.card-type-icon {
		font-size: 12px;
		color: var(--color-text-subtle);
		line-height: 1;
		flex-shrink: 0;
	}

	.card-name {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text);
	}

	.card-count {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}

	/* ── Card Footer ── */
	.card-footer {
		border-top: 1px solid var(--border-color-subtle);
		padding-top: 8px;
	}

	.card-id {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--color-text-subtle);
		letter-spacing: 0.04em;
		text-transform: lowercase;
	}

	/* ── New Page Card ── */
	.new-page-card {
		align-items: center;
		justify-content: center;
		border-style: dashed;
		border-color: var(--border-color-subtle);
		min-height: 140px;
		gap: 8px;
	}

	.new-page-card:hover {
		border-color: var(--bento-blue, #2563EB);
		background: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 96%);
	}

	.new-page-icon {
		font-size: 24px;
		font-weight: 300;
		color: var(--color-text-subtle);
		line-height: 1;
		transition: color var(--duration-fast) var(--easing);
	}

	.new-page-card:hover .new-page-icon {
		color: var(--bento-blue, #2563EB);
	}

	.new-page-label {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		transition: color var(--duration-fast) var(--easing);
	}

	.new-page-card:hover .new-page-label {
		color: var(--bento-blue, #2563EB);
	}
</style>
