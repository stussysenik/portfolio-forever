<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import BookmarkTabs from './BookmarkTabs.svelte';
	import StyleBookmark from './bookmarks/StyleBookmark.svelte';
	import LayoutBookmark from './bookmarks/LayoutBookmark.svelte';

	// Props
	export let section: any = null;
	export let pageId: string = '';
	export let sectionIndex: number = 0;
	export let expanded: boolean = false;
	export let entryCount: number = 0;
	export let page: any = null;         // Full page object (for LayoutBookmark)
	export let client: any = null;       // Convex client
	export let api: any = null;          // Convex api
	export let heroConfig: any = null;   // For StyleBookmark hero controls

	// Suppress unused-export warnings — part of public API
	$: void pageId;
	$: void sectionIndex;

	const dispatch = createEventDispatcher<{ toggle: void }>();

	// DOM reference for scrollIntoView on expand
	let containerEl: HTMLElement;

	// Active bookmark tab
	let activeBookmark: 'content' | 'style' | 'layout' = 'content';

	// Derived registry info
	$: regDef = section?.sectionType ? sectionTypeRegistry[section.sectionType] : null;
	$: sectionLabel = regDef?.label ?? section?.sectionType ?? 'Section';
	$: sectionIcon = regDef?.icon ?? '·';
	$: isVisible = section?.visible !== false;
	$: accentColor = section?.config?.accentColor ?? null;

	// Accessible IDs
	$: headerId = `sc-header-${sectionIndex}`;
	$: regionId = `sc-region-${sectionIndex}`;

	async function handleToggle() {
		dispatch('toggle');
		if (!expanded) {
			// Will become expanded; reset to content tab and scroll into view
			activeBookmark = 'content';
			await tick();
			containerEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleToggle();
		}
	}
</script>

<div class="compartment" class:compartment--expanded={expanded} bind:this={containerEl}>
	<!-- Header row — always visible -->
	<div
		class="compartment__header"
		id={headerId}
		role="button"
		tabindex="0"
		aria-expanded={expanded}
		aria-controls={regionId}
		on:click={handleToggle}
		on:keydown={handleKeydown}
	>
		<!-- Left: icon + label -->
		<div class="compartment__identity">
			<span class="compartment__icon" aria-hidden="true">{sectionIcon}</span>
			<span class="compartment__label">{sectionLabel.toUpperCase()}</span>
		</div>

		<!-- Right: status indicators + chevron -->
		<div class="compartment__meta">
			<!-- Visibility dot -->
			<span
				class="compartment__dot"
				class:compartment__dot--active={isVisible}
				title={isVisible ? 'Visible' : 'Hidden'}
				aria-label={isVisible ? 'Section visible' : 'Section hidden'}
			></span>

			<!-- Entry count badge -->
			{#if entryCount > 0}
				<span class="compartment__count">{entryCount}</span>
			{/if}

			<!-- Accent color dot -->
			{#if accentColor}
				<span
					class="compartment__dot compartment__dot--accent"
					style="background: {accentColor};"
					title="Accent: {accentColor}"
					aria-hidden="true"
				></span>
			{/if}

			<!-- Chevron -->
			<span class="compartment__chevron" aria-hidden="true">
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="2,4 6,8 10,4" />
				</svg>
			</span>
		</div>
	</div>

	<!-- Expandable body -->
	<div
		class="compartment__body"
		id={regionId}
		role="region"
		aria-labelledby={headerId}
	>
		<div class="compartment__body-inner">
			<BookmarkTabs active={activeBookmark} on:change={(e) => (activeBookmark = e.detail.value)} />

			{#if activeBookmark === 'content'}
				<slot />
			{:else if activeBookmark === 'style'}
				<StyleBookmark {section} {pageId} {sectionIndex} {heroConfig} {client} {api} />
			{:else if activeBookmark === 'layout'}
				<LayoutBookmark {section} {pageId} {sectionIndex} {page} {client} {api} />
			{/if}
		</div>
	</div>
</div>

<style>
	/* === Compartment container === */
	.compartment {
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
	}

	/* === Header row === */
	.compartment__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--admin-space-2, 8px);
		min-height: var(--admin-touch-min, 44px);
		padding: 0 var(--admin-space-4, 16px);
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		outline: none;
		transition: background var(--admin-transition, 120ms ease);
	}

	.compartment__header:hover {
		background: color-mix(in srgb, var(--color-text, #e5e5e5) 4%, transparent);
	}

	.compartment__header:focus-visible {
		outline: 1px solid var(--admin-blue, #2563EB);
		outline-offset: -1px;
	}

	/* === Left: identity === */
	.compartment__identity {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		min-width: 0;
	}

	.compartment__icon {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
		color: var(--color-text-muted, #666);
		flex-shrink: 0;
		line-height: 1;
	}

	.compartment__label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text, #e5e5e5);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* === Right: meta indicators === */
	.compartment__meta {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		flex-shrink: 0;
	}

	/* Visibility / accent dot — 6px circle */
	.compartment__dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-text-subtle, #444);
		flex-shrink: 0;
	}

	.compartment__dot--active {
		background: var(--admin-green, #44D62C);
	}

	/* Accent dot inherits inline background */
	.compartment__dot--accent {
		/* background set inline */
	}

	/* Entry count badge */
	.compartment__count {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--admin-green, #44D62C);
		line-height: 1;
	}

	/* Chevron SVG wrapper */
	.compartment__chevron {
		display: flex;
		align-items: center;
		color: var(--color-text-subtle, #444);
		transition: transform var(--admin-transition, 120ms ease);
		flex-shrink: 0;
	}

	.compartment--expanded .compartment__chevron {
		transform: rotate(180deg);
	}

	/* === Expandable body === */
	.compartment__body {
		overflow: hidden;
		max-height: 0;
		transition: max-height var(--admin-transition, 120ms ease);
	}

	.compartment--expanded .compartment__body {
		/* Large enough for any realistic content; avoids animating to "auto" */
		max-height: 2000px;
	}

	.compartment__body-inner {
		/* Padding consumed here so it doesn't interfere with max-height clipping */
		padding-bottom: var(--admin-space-2, 8px);
	}
</style>
