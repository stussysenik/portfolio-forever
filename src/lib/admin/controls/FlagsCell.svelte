<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { AdminToggle } from '$lib/admin/primitives';
	import { FLAG_CATEGORIES } from '$lib/admin/constants';

	/** Flag key → enabled state */
	export let flags: Record<string, boolean> = {};

	const dispatch = createEventDispatcher<{
		toggle: { key: string; category: string };
	}>();

	const FLAG_LABELS: Record<string, string> = {
		'pixel-engine': 'Pixel Engine',
		'ascii-donut': 'ASCII Donut',
		'parallax': 'Parallax',
		'view-transitions': 'View Transitions',
		'wip-banner': 'WIP Banner',
		'elevator': 'Elevator',
		'terminal-matrix': 'Terminal Matrix',
		'os-desktop': 'OS Desktop',
		'social-links': 'Social Links',
		'command-palette': 'Cmd Palette',
	};

	let activeCategoryIndex = 0;
	let containerEl: HTMLDivElement;

	$: activeCategory = FLAG_CATEGORIES[activeCategoryIndex];
	$: categoryFlagKeys = activeCategory.flags as readonly string[];

	function isEnabled(key: string): boolean {
		return flags[key] ?? true;
	}

	function prevCategory() {
		if (activeCategoryIndex > 0) activeCategoryIndex--;
	}

	function nextCategory() {
		if (activeCategoryIndex < FLAG_CATEGORIES.length - 1) activeCategoryIndex++;
	}

	function handleToggle(key: string) {
		dispatch('toggle', { key, category: activeCategory.id });
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prevCategory();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			nextCategory();
		}
	}

	onMount(() => {
		if (containerEl) {
			containerEl.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		if (containerEl) {
			containerEl.removeEventListener('keydown', handleKeydown);
		}
	});
</script>

<div
	class="flags-cell"
	bind:this={containerEl}
	tabindex="0"
	role="region"
	aria-label="Feature flags — {activeCategory.label} category"
>
	<!-- Category header with nav arrows -->
	<div class="flags-header">
		<button
			class="flags-nav-btn"
			disabled={activeCategoryIndex === 0}
			on:click={prevCategory}
			aria-label="Previous category"
		>
			&#8592;
		</button>
		<span class="flags-category-label">{activeCategory.label}</span>
		<button
			class="flags-nav-btn"
			disabled={activeCategoryIndex === FLAG_CATEGORIES.length - 1}
			on:click={nextCategory}
			aria-label="Next category"
		>
			&#8594;
		</button>
	</div>

	<!-- Page dots -->
	<div class="flags-dots" aria-hidden="true">
		{#each FLAG_CATEGORIES as _, i}
			<span
				class="flags-dot"
				class:flags-dot--active={i === activeCategoryIndex}
			></span>
		{/each}
	</div>

	<!-- Flag toggles -->
	<div class="flags-toggle-list">
		{#each categoryFlagKeys as key}
			<div class="flags-toggle-row">
				<AdminToggle
					checked={isEnabled(key)}
					size="sm"
					color="green"
					label={FLAG_LABELS[key] ?? key}
					on:change={() => handleToggle(key)}
				/>
				<span class="flags-toggle-label">{FLAG_LABELS[key] ?? key}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.flags-cell {
		display: flex;
		flex-direction: column;
		gap: 4px;
		outline: none;
	}

	.flags-cell:focus-visible {
		outline: 1px solid var(--admin-blue, #2563EB);
		outline-offset: 2px;
		border-radius: 2px;
	}

	/* ── Header: arrows + label ── */
	.flags-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		padding-bottom: 6px;
	}

	.flags-category-label {
		font-family: var(--font-mono);
		font-size: 9px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text);
		user-select: none;
	}

	.flags-nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		padding: 0;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted, #666);
		background: transparent;
		border: 1px solid var(--border-color-subtle, #1a1a1a);
		border-radius: 2px;
		cursor: pointer;
		transition: all 120ms ease;
		-webkit-tap-highlight-color: transparent;
	}

	.flags-nav-btn:hover:not(:disabled) {
		color: var(--color-text);
		border-color: var(--color-text-subtle, #444);
	}

	.flags-nav-btn:disabled {
		opacity: 0.25;
		cursor: default;
	}

	/* ── Page dots ── */
	.flags-dots {
		display: flex;
		justify-content: center;
		gap: 6px;
		padding: 6px 0 2px;
	}

	.flags-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--border-color-subtle, #333);
		transition: background 120ms ease;
	}

	.flags-dot--active {
		background: var(--admin-blue, #2563EB);
	}

	/* ── Toggle rows ── */
	.flags-toggle-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.flags-toggle-row {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 0 2px;
	}

	.flags-toggle-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted, #666);
		user-select: none;
	}
</style>
