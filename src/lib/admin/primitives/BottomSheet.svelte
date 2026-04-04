<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	export let open: boolean = false;
	export let title: string = '';

	const dispatch = createEventDispatcher<{ close: void }>();

	let sheetEl: HTMLElement | undefined;
	let dragging = false;
	let startY = 0;
	let currentTranslateY = 0;

	function close() {
		dispatch('close');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	function handleTouchStart(e: TouchEvent) {
		dragging = true;
		startY = e.touches[0].clientY;
		currentTranslateY = 0;
		if (sheetEl) {
			sheetEl.style.transition = 'none';
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (!dragging) return;
		const deltaY = e.touches[0].clientY - startY;
		// Only allow dragging downward
		currentTranslateY = Math.max(0, deltaY);
		if (sheetEl) {
			sheetEl.style.transform = `translateY(${currentTranslateY}px)`;
		}
	}

	function handleTouchEnd() {
		if (!dragging) return;
		dragging = false;
		if (sheetEl) {
			sheetEl.style.transition = 'transform 120ms ease';
		}
		// Close if dragged more than 100px or with enough velocity
		if (currentTranslateY > 100) {
			close();
		} else {
			// Snap back
			if (sheetEl) {
				sheetEl.style.transform = 'translateY(0)';
			}
		}
		currentTranslateY = 0;
	}
</script>

<svelte:window on:keydown={open ? handleKeydown : undefined} />

{#if open}
	<div class="sheet-backdrop" role="presentation">
		<button
			type="button"
			class="sheet-dismiss"
			tabindex="-1"
			aria-label={title ? `Close ${title}` : 'Close bottom sheet'}
			on:click={close}
		></button>
		<div
			class="sheet"
			bind:this={sheetEl}
			role="dialog"
			aria-modal="true"
			aria-label={title}
			tabindex="-1"
		>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="sheet-handle-area"
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				on:touchend={handleTouchEnd}
			>
				<div class="sheet-handle"></div>
			</div>

			<div class="sheet-header">
				<span class="sheet-title">{title}</span>
				<button class="sheet-done" on:click={close} aria-label="Close bottom sheet">
					Done
				</button>
			</div>

			<div class="sheet-body">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.sheet-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 2000;
		animation: fadeIn 120ms ease;
	}

	.sheet-dismiss {
		position: absolute;
		inset: 0;
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	.sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--color-bg);
		border-top: 1px solid var(--border-color);
		border-radius: 16px 16px 0 0;
		display: flex;
		flex-direction: column;
		max-height: 85vh;
		box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
		animation: slideUp 120ms ease;
		transform: translateY(0);
		transition: transform 120ms ease;
		will-change: transform;
		z-index: 1;
		overscroll-behavior: contain;
	}

	.sheet-handle-area {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px 0 4px;
		cursor: grab;
		touch-action: none;
	}

	.sheet-handle-area:active {
		cursor: grabbing;
	}

	.sheet-handle {
		width: 36px;
		height: 4px;
		border-radius: 2px;
		background: var(--border-color, #333);
	}

	.sheet-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 16px 12px;
	}

	.sheet-title {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text);
	}

	.sheet-done {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		padding: 4px 12px;
		border: none;
		border-radius: 4px;
		background: var(--bento-blue, #2563EB);
		color: #fff;
		cursor: pointer;
		transition: opacity 120ms ease;
		min-width: 44px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.sheet-done:hover {
		opacity: 0.85;
	}

	.sheet-body {
		padding: 0 16px 16px;
		overflow-y: auto;
		flex: 1;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
