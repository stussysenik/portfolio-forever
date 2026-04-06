<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let open: boolean = false;
	export let siteUrl: string = '';

	const dispatch = createEventDispatcher<{ close: void; open: void }>();

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
		// Close if dragged more than 100px
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

<!-- Persistent grab handle — visible when closed, hidden when open (sheet replaces it) -->
{#if !open}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="preview-handle"
		role="button"
		tabindex="0"
		aria-label="Open site preview"
		on:click={() => dispatch('open')}
		on:keydown={(e) => e.key === 'Enter' && dispatch('open')}
	>
		<div class="preview-handle-bar"></div>
	</div>
{/if}

{#if open}
	<div class="preview-backdrop" role="presentation">
		<button
			type="button"
			class="preview-dismiss"
			tabindex="-1"
			aria-label="Close preview"
			on:click={close}
		></button>
		<div
			class="preview-sheet"
			bind:this={sheetEl}
			role="dialog"
			aria-modal="true"
			aria-label="Site preview"
			tabindex="-1"
		>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="preview-sheet-handle-area"
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				on:touchend={handleTouchEnd}
			>
				<div class="preview-sheet-handle"></div>
			</div>

			<div class="preview-header">
				<span class="preview-label">PREVIEW</span>
				<button class="preview-done" on:click={close} aria-label="Close preview">
					DONE
				</button>
			</div>

			<div class="preview-iframe-wrap">
				{#if open && siteUrl}
					<iframe
						src={siteUrl}
						title="Site preview"
						class="preview-iframe"
						frameborder="0"
						allow="same-origin"
					></iframe>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* --- Persistent handle (closed state) --- */
	.preview-handle {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		background: var(--color-bg);
		border-top: 1px solid var(--border-color-subtle);
		cursor: pointer;
	}

	.preview-handle-bar {
		width: 36px;
		height: 4px;
		border-radius: 2px;
		background: var(--border-color, #333);
	}

	/* --- Backdrop --- */
	.preview-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 2000;
		animation: fadeIn var(--admin-transition, 120ms ease);
	}

	.preview-dismiss {
		position: absolute;
		inset: 0;
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	/* --- Sheet --- */
	.preview-sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--color-bg);
		border-top: 1px solid var(--border-color);
		border-radius: 16px 16px 0 0;
		display: flex;
		flex-direction: column;
		max-height: 70vh;
		box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
		animation: slideUp 120ms ease;
		transform: translateY(0);
		transition: transform 120ms ease;
		will-change: transform;
		z-index: 1;
		overscroll-behavior: contain;
	}

	.preview-sheet-handle-area {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px 0 4px;
		cursor: grab;
		touch-action: none;
		flex-shrink: 0;
	}

	.preview-sheet-handle-area:active {
		cursor: grabbing;
	}

	.preview-sheet-handle {
		width: 36px;
		height: 4px;
		border-radius: 2px;
		background: var(--border-color, #333);
	}

	/* --- Header --- */
	.preview-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 16px 12px;
		flex-shrink: 0;
	}

	.preview-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--color-text);
	}

	.preview-done {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 11px);
		font-weight: 600;
		padding: 4px 12px;
		border: none;
		border-radius: 4px;
		background: var(--admin-blue, #2563eb);
		color: #fff;
		cursor: pointer;
		transition: opacity var(--admin-transition, 120ms ease);
		min-width: var(--admin-touch-min, 44px);
		min-height: var(--admin-touch-min, 44px);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.preview-done:hover {
		opacity: 0.85;
	}

	/* --- iframe --- */
	.preview-iframe-wrap {
		flex: 1;
		overflow: hidden;
		min-height: 0;
	}

	.preview-iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}

	/* --- Desktop: hide mobile-only UI --- */
	@media (min-width: 1024px) {
		.preview-handle,
		.preview-backdrop {
			display: none;
		}
	}

	/* --- Animations --- */
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
