<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import InlineSectionConfig from '$lib/admin/InlineSectionConfig.svelte';

	export let sections: Array<{
		sectionType: string;
		config: any;
		dataTable?: string;
		order: number;
		themeOverrides?: any;
		spacingBefore?: number;
		spacingAfter?: number;
		visible?: boolean;
	}> = [];

	export let pageId: string = '';
	export let client: any = null;
	export let api: any = null;

	const dispatch = createEventDispatcher<{
		reorder: { order: number[] };
		select: { index: number };
		delete: { index: number };
		add: void;
	}>();

	/** Accordion state — only one section expanded at a time */
	let expandedIndex: number | null = null;

	function toggleExpand(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
		dispatch('select', { index });
	}

	/** Sorted snapshot used for rendering */
	$: sorted = [...sections].sort((a, b) => a.order - b.order);

	function getTypeDef(type: string) {
		return sectionTypeRegistry[type] ?? { label: type, icon: '?', category: 'content' };
	}

	/* ── Drag state ── */
	let dragIndex: number | null = null;
	let dropIndex: number | null = null;
	let listEl: HTMLElement;

	/* ── Keyboard reorder state ── */
	let grabbed: number | null = null;

	/* ── Touch drag state ── */
	let touchTimer: ReturnType<typeof setTimeout> | null = null;
	let touchDragging = false;
	let touchStartY = 0;

	/* ── HTML5 drag ── */

	function onDragStart(e: DragEvent, index: number) {
		expandedIndex = null; // collapse during drag
		dragIndex = index;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', String(index));
		}
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (dragIndex === null || !listEl) return;
		const cards = listEl.querySelectorAll('.section-card');
		let closest = 0;
		let closestDist = Infinity;
		cards.forEach((card, i) => {
			const rect = card.getBoundingClientRect();
			const mid = rect.top + rect.height / 2;
			const dist = Math.abs(e.clientY - mid);
			if (dist < closestDist) {
				closestDist = dist;
				closest = e.clientY < mid ? i : i + 1;
			}
		});
		dropIndex = closest;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		commitReorder();
	}

	function onDragEnd() {
		dragIndex = null;
		dropIndex = null;
	}

	function commitReorder() {
		if (dragIndex === null || dropIndex === null) return;
		if (dragIndex === dropIndex || dragIndex + 1 === dropIndex) {
			dragIndex = null;
			dropIndex = null;
			return;
		}
		const newOrder = sorted.map((_, i) => i);
		const [moved] = newOrder.splice(dragIndex, 1);
		const insertAt = dropIndex > dragIndex ? dropIndex - 1 : dropIndex;
		newOrder.splice(insertAt, 0, moved);
		dispatch('reorder', { order: newOrder });
		dragIndex = null;
		dropIndex = null;
	}

	/* ── Touch long-press drag ── */

	function onTouchStart(e: TouchEvent, index: number) {
		touchStartY = e.touches[0].clientY;
		touchTimer = setTimeout(() => {
			touchDragging = true;
			dragIndex = index;
		}, 300);
	}

	function onTouchMove(e: TouchEvent) {
		if (!touchDragging) {
			// Cancel long-press if finger moved too far
			if (touchTimer && Math.abs(e.touches[0].clientY - touchStartY) > 10) {
				clearTimeout(touchTimer);
				touchTimer = null;
			}
			return;
		}
		e.preventDefault();
		if (!listEl) return;
		const y = e.touches[0].clientY;
		const cards = listEl.querySelectorAll('.section-card');
		let closest = 0;
		let closestDist = Infinity;
		cards.forEach((card, i) => {
			const rect = card.getBoundingClientRect();
			const mid = rect.top + rect.height / 2;
			const dist = Math.abs(y - mid);
			if (dist < closestDist) {
				closestDist = dist;
				closest = y < mid ? i : i + 1;
			}
		});
		dropIndex = closest;
	}

	function onTouchEnd() {
		if (touchTimer) {
			clearTimeout(touchTimer);
			touchTimer = null;
		}
		if (touchDragging) {
			commitReorder();
			touchDragging = false;
		}
		dragIndex = null;
		dropIndex = null;
	}

	/* ── Keyboard reorder (WCAG) ── */

	function onCardKeydown(e: KeyboardEvent, index: number) {
		if (e.key === ' ' || e.key === 'Space') {
			e.preventDefault();
			if (grabbed === null) {
				grabbed = index;
			} else {
				// Drop at current position (grabbed stays, index is target)
				if (grabbed !== index) {
					const newOrder = sorted.map((_, i) => i);
					const [moved] = newOrder.splice(grabbed, 1);
					const insertAt = index > grabbed ? index : index;
					newOrder.splice(insertAt, 0, moved);
					dispatch('reorder', { order: newOrder });
				}
				grabbed = null;
			}
		} else if (e.key === 'Escape' && grabbed !== null) {
			e.preventDefault();
			grabbed = null;
		} else if (e.key === 'ArrowUp' && grabbed !== null) {
			e.preventDefault();
			if (grabbed > 0) {
				const newOrder = sorted.map((_, i) => i);
				[newOrder[grabbed - 1], newOrder[grabbed]] = [newOrder[grabbed], newOrder[grabbed - 1]];
				dispatch('reorder', { order: newOrder });
				grabbed = grabbed - 1;
			}
		} else if (e.key === 'ArrowDown' && grabbed !== null) {
			e.preventDefault();
			if (grabbed < sorted.length - 1) {
				const newOrder = sorted.map((_, i) => i);
				[newOrder[grabbed], newOrder[grabbed + 1]] = [newOrder[grabbed + 1], newOrder[grabbed]];
				dispatch('reorder', { order: newOrder });
				grabbed = grabbed + 1;
			}
		} else if (e.key === 'Enter') {
			dispatch('select', { index });
		}
	}

	/* ── Spacing between sections ── */

	function getSpacingBetween(idx: number): number | null {
		if (idx >= sorted.length - 1) return null;
		const after = sorted[idx].spacingAfter;
		const before = sorted[idx + 1].spacingBefore;
		if (after != null) return after;
		if (before != null) return before;
		return 24; // default
	}

	onDestroy(() => {
		if (touchTimer) clearTimeout(touchTimer);
	});
</script>

<div
	class="draggable-section-list"
	bind:this={listEl}
	on:dragover={onDragOver}
	on:drop={onDrop}
	role="listbox"
	aria-label="Page sections"
	tabindex="0"
>
	{#each sorted as section, i}
		{@const def = getTypeDef(section.sectionType)}
		{@const spacing = getSpacingBetween(i)}

		<!-- Drop indicator before this card -->
		{#if dropIndex === i}
			<div class="drop-indicator" aria-hidden="true"></div>
		{/if}

		<div
			class="section-card"
			class:dragging={dragIndex === i}
			class:grabbed={grabbed === i}
			class:expanded={expandedIndex === i}
			class:hidden-section={section.visible === false}
			draggable="true"
			on:dragstart={(e) => onDragStart(e, i)}
			on:dragend={onDragEnd}
			on:touchstart={(e) => onTouchStart(e, i)}
			on:touchmove={onTouchMove}
			on:touchend={onTouchEnd}
			on:click={() => toggleExpand(i)}
			on:keydown={(e) => onCardKeydown(e, i)}
			role="option"
			tabindex="0"
			aria-selected={expandedIndex === i}
			aria-grabbed={grabbed === i}
			aria-label="{def.label} section — press Space to grab, arrow keys to move"
		>
			<span class="drag-handle" aria-hidden="true">&#9776;</span>
			<span class="section-icon" aria-hidden="true">{def.icon}</span>
			<div class="section-info">
				<span class="section-label">{def.label}</span>
				<span class="section-meta">{section.sectionType} &middot; {section.visible === false ? 'hidden' : 'visible'}</span>
			</div>
			<div class="section-actions">
				<button
					class="action-btn action-delete"
					on:click|stopPropagation={() => dispatch('delete', { index: i })}
					aria-label="Delete {def.label}"
				>
					&#215;
				</button>
			</div>
		</div>

		<!-- Inline config panel (accordion expansion) -->
		{#if expandedIndex === i && client && api}
			<InlineSectionConfig
				{section}
				sectionIndex={i}
				{pageId}
				{client}
				{api}
				on:close={() => expandedIndex = null}
			/>
		{/if}

		<!-- Spacing indicator between sections -->
		{#if spacing !== null && expandedIndex !== i}
			<div class="spacing-indicator" aria-hidden="true">
				<span class="spacing-line"></span>
				<span class="spacing-label">{spacing}px</span>
				<span class="spacing-line"></span>
			</div>
		{/if}
	{/each}

	<!-- Drop indicator at the end -->
	{#if dropIndex === sorted.length}
		<div class="drop-indicator" aria-hidden="true"></div>
	{/if}

	<button class="add-section-btn" on:click={() => dispatch('add')}>
		+ Add Section
	</button>
</div>

<style>
	.draggable-section-list {
		display: flex;
		flex-direction: column;
		gap: 0;
		position: relative;
	}

	/* ── Section card ── */
	.section-card {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 14px;
		background: var(--color-surface, #f8f8f8);
		border: 1px solid var(--border-color-subtle);
		border-radius: 6px;
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		min-height: var(--admin-touch-min, 44px);
		user-select: none;
		position: relative;
	}

	.section-card:hover {
		border-color: var(--border-color);
		background: var(--color-bg-alt, #f4f4f4);
	}

	.section-card:focus-visible {
		outline: 2px solid var(--admin-blue, #2563EB);
		outline-offset: 2px;
	}

	.section-card.dragging {
		opacity: 0.4;
	}

	.section-card.grabbed {
		outline: 2px dashed var(--admin-blue, #2563EB);
		outline-offset: 2px;
		background: color-mix(in oklch, var(--admin-blue, #2563EB), transparent 94%);
	}

	.section-card.expanded {
		border-color: var(--bento-blue, #2563EB);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom-color: transparent;
	}

	.section-card.hidden-section {
		opacity: 0.5;
		border-style: dashed;
	}

	/* ── Drag handle ── */
	.drag-handle {
		color: #ccc;
		cursor: grab;
		font-size: 14px;
		flex-shrink: 0;
		line-height: 1;
	}

	.section-card.dragging .drag-handle,
	.section-card.grabbed .drag-handle {
		cursor: grabbing;
	}

	/* ── Icon ── */
	.section-icon {
		font-size: 14px;
		width: 20px;
		text-align: center;
		flex-shrink: 0;
	}

	/* ── Info block ── */
	.section-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.section-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
		font-weight: 600;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.section-meta {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		color: var(--color-text-subtle);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* ── Action buttons ── */
	.section-actions {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
		opacity: 0;
		transition: opacity var(--admin-transition, 120ms ease);
	}

	.section-card:hover .section-actions,
	.section-card:focus-within .section-actions {
		opacity: 1;
	}

	/* Always show on touch devices */
	@media (pointer: coarse) {
		.section-actions {
			opacity: 1;
		}
	}

	.action-btn {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-surface, #f8f8f8);
		border: 1px solid var(--border-color-subtle);
		border-radius: 4px;
		color: var(--color-text-muted);
		cursor: pointer;
		font-size: 14px;
		padding: 0;
		transition: all var(--admin-transition, 120ms ease);
		line-height: 1;
	}

	.action-btn:hover {
		border-color: var(--border-color);
		color: var(--color-text);
	}

	.action-delete:hover {
		color: var(--color-danger, #DC2626);
		border-color: var(--color-danger, #DC2626);
	}

	/* ── Drop indicator ── */
	.drop-indicator {
		height: 2px;
		background: var(--admin-blue, #2563EB);
		border-radius: 1px;
		margin: -1px 0;
		position: relative;
		z-index: 1;
	}

	/* ── Spacing indicator ── */
	.spacing-indicator {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 0;
	}

	.spacing-line {
		flex: 1;
		height: 1px;
		background: var(--border-color-subtle);
	}

	.spacing-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		color: var(--color-text-subtle);
		white-space: nowrap;
	}

	/* ── Add section button ── */
	.add-section-btn {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
		color: var(--color-text-muted);
		background: transparent;
		border: 1px dashed var(--border-color-subtle);
		border-radius: 6px;
		padding: 12px;
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		margin-top: 8px;
		text-align: center;
		width: 100%;
		min-height: var(--admin-touch-min, 44px);
	}

	.add-section-btn:hover {
		border-color: var(--admin-blue, #2563EB);
		color: var(--admin-blue, #2563EB);
	}
</style>
