<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let open: boolean = false;
	export let title: string = '';
	export let width: 'sm' | 'md' | 'lg' = 'md';

	const dispatch = createEventDispatcher<{ close: void }>();

	$: maxWidth = width === 'sm' ? '360px' : width === 'lg' ? '640px' : '480px';

	function close() {
		dispatch('close');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	function handleBackdropClick() {
		close();
	}
</script>

<svelte:window on:keydown={open ? handleKeydown : undefined} />

{#if open}
	<div class="modal-backdrop" on:click={handleBackdropClick} role="presentation">
		<div
			class="modal-content"
			style="max-width: {maxWidth}"
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			<div class="modal-header">
				<span class="modal-title">{title}</span>
				<button class="modal-close" on:click={close} aria-label="Close">
					&#215;
				</button>
			</div>
			<div class="modal-body">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 120ms ease;
	}

	.modal-content {
		background: var(--color-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md, 8px);
		width: 90%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
		animation: scaleIn 120ms ease;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.modal-title {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text);
	}

	.modal-close {
		font-size: 18px;
		color: var(--color-text-muted);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0 4px;
		line-height: 1;
		min-width: 44px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: color 120ms ease;
	}

	.modal-close:hover {
		color: var(--color-text);
	}

	.modal-body {
		padding: 16px;
		overflow-y: auto;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
