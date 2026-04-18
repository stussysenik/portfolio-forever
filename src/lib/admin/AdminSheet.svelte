<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import AdminIcon from './AdminIcon.svelte';
	import { IconX } from './admin-icons';

	export let open: boolean = false;
	export let title: string = '';
	export let height: 'auto' | 'full' = 'auto';

	const dispatch = createEventDispatcher<{ close: void }>();

	const {
		elements: { portalled, overlay, content, title: titleEl, close: closeEl },
		states: { open: openStore }
	} = createDialog({
		forceVisible: true,
		preventScroll: true
	});

	// Sync the prop to the melt-ui store
	$: openStore.set(open);
	$: if (!$openStore && open) {
		dispatch('close');
	}

	let sheetEl: HTMLElement | undefined;
	let dragging = false;
	let startY = 0;
	let currentTranslateY = 0;

	function close() {
		dispatch('close');
	}

	function handleTouchStart(e: TouchEvent) {
		dragging = true;
		startY = e.touches[0].clientY;
		currentTranslateY = 0;
		if (sheetEl) sheetEl.style.transition = 'none';
	}

	function handleTouchMove(e: TouchEvent) {
		if (!dragging) return;
		const deltaY = e.touches[0].clientY - startY;
		currentTranslateY = Math.max(0, deltaY);
		if (sheetEl) sheetEl.style.transform = `translateY(${currentTranslateY}px)`;
	}

	function handleTouchEnd() {
		if (!dragging) return;
		dragging = false;
		if (sheetEl) sheetEl.style.transition = 'transform 140ms ease';
		if (currentTranslateY > 100) {
			close();
		} else if (sheetEl) {
			sheetEl.style.transform = 'translateY(0)';
		}
		currentTranslateY = 0;
	}
</script>

{#if $openStore}
	<div {...$portalled} use:melt={$portalled}>
		<div
			{...$overlay}
			use:melt={$overlay}
			class="sheet-backdrop"
			transition:fade={{ duration: 150 }}
		></div>
		<section
			{...$content}
			use:melt={$content}
			class="sheet-panel"
			class:sheet-panel--full={height === 'full'}
			bind:this={sheetEl}
		>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<header
				class="sheet-header"
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				on:touchend={handleTouchEnd}
			>
				<div class="sheet-handle" aria-hidden="true"></div>
				<div class="sheet-title" {...$titleEl} use:melt={$titleEl}>{title}</div>
				<button
					class="sheet-close"
					type="button"
					{...$closeEl}
					use:melt={$closeEl}
					on:click={close}
					aria-label="Close"
				>
					<AdminIcon icon={IconX} size="md" tone="inherit" />
				</button>
			</header>
			<div class="sheet-body">
				<slot />
			</div>
		</section>
	</div>
{/if}

<style>
	.sheet-root {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		font-family: var(--admin-font-sans, inherit);
	}
	.sheet-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(12, 12, 10, 0.38);
		backdrop-filter: saturate(110%) blur(2px);
	}
	.sheet-panel {
		position: relative;
		width: 100%;
		max-width: 100%;
		max-height: 85dvh;
		background: var(--admin-chrome-bg, #f8f8f6);
		color: var(--admin-text, #1a1a18);
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		box-shadow: 0 -12px 32px rgba(0, 0, 0, 0.14);
		display: flex;
		flex-direction: column;
		animation: sheet-in 200ms ease;
		will-change: transform;
	}
	.sheet-panel--full {
		max-height: 100dvh;
		height: 100dvh;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	@keyframes sheet-in {
		from { transform: translateY(12%); opacity: 0.85; }
		to   { transform: translateY(0);    opacity: 1; }
	}
	.sheet-header {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 10px 12px 8px;
		border-bottom: 1px solid var(--admin-keyline, rgba(0,0,0,0.1));
		position: relative;
		touch-action: none;
	}
	.sheet-handle {
		position: absolute;
		top: 6px;
		left: 50%;
		transform: translateX(-50%);
		width: 36px;
		height: 4px;
		border-radius: 999px;
		background: var(--admin-keyline-strong, rgba(0,0,0,0.18));
	}
	.sheet-title {
		grid-column: 2;
		text-align: center;
		font-family: var(--admin-font-mono, monospace);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--admin-text, currentColor);
		padding-top: 8px;
	}
	.sheet-close {
		grid-column: 3;
		justify-self: end;
		background: transparent;
		border: 1px solid var(--admin-keyline, rgba(0,0,0,0.1));
		border-radius: 4px;
		padding: 4px 6px;
		color: var(--admin-text-subtle, currentColor);
		cursor: pointer;
		min-height: 28px;
		display: inline-flex;
		align-items: center;
	}
	.sheet-close:hover {
		color: var(--admin-text);
		border-color: var(--admin-keyline-strong);
	}
	.sheet-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 12px;
		background: var(--admin-workspace-bg, #fff);
	}
</style>
