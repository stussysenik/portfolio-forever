<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { fly, fade } from 'svelte/transition';
</script>

{#if $toast.length > 0}
	<div class="toast-container" aria-live="assertive" role="status">
		{#each $toast as t (t.id)}
			<div
				class="toast toast-{t.type}"
				transition:fly={{ y: 20, duration: 200 }}
			>
				<span class="toast-icon">
					{#if t.type === 'success'}✓{:else if t.type === 'error'}✕{:else}ℹ{/if}
				</span>
				<span class="toast-message">{t.message}</span>
				<button class="toast-dismiss" on:click={() => toast.dismiss(t.id)} aria-label="Dismiss notification">×</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: var(--space-lg);
		right: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		z-index: var(--z-tooltip, 9999);
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-md);
		font-size: var(--font-size-sm);
		color: var(--color-text);
		pointer-events: auto;
		max-width: 360px;
	}

	.toast-success { border-left: 3px solid var(--color-success); }
	.toast-error { border-left: 3px solid var(--color-danger); }
	.toast-info { border-left: 3px solid var(--color-accent); }

	.toast-icon {
		font-weight: 600;
		flex-shrink: 0;
	}

	.toast-success .toast-icon { color: var(--color-success); }
	.toast-error .toast-icon { color: var(--color-danger); }
	.toast-info .toast-icon { color: var(--color-accent); }

	.toast-message {
		flex: 1;
	}

	.toast-dismiss {
		background: none;
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 2px 4px;
		font-size: var(--font-size-sm);
		border-radius: var(--radius-sm);
	}

	.toast-dismiss:hover {
		background: var(--color-bg-alt);
		color: var(--color-text);
	}
</style>
