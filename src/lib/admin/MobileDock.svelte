<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AdminIcon from './AdminIcon.svelte';
	import { IconLayoutGrid, IconLayers, IconMonitor } from './admin-icons';

	export let active: 'pages' | 'sections' | 'preview' | null = null;

	const dispatch = createEventDispatcher<{
		openpages: void;
		opensections: void;
		openpreview: void;
	}>();
</script>

<nav class="mobile-dock" aria-label="Mobile admin dock">
	<button
		type="button"
		class="dock-btn"
		class:dock-btn--active={active === 'pages'}
		on:click={() => dispatch('openpages')}
	>
		<AdminIcon icon={IconLayoutGrid} size="md" tone="inherit" />
		<span class="dock-label">PAGES</span>
	</button>
	<button
		type="button"
		class="dock-btn"
		class:dock-btn--active={active === 'sections'}
		on:click={() => dispatch('opensections')}
	>
		<AdminIcon icon={IconLayers} size="md" tone="inherit" />
		<span class="dock-label">SECTIONS</span>
	</button>
	<button
		type="button"
		class="dock-btn"
		class:dock-btn--active={active === 'preview'}
		on:click={() => dispatch('openpreview')}
	>
		<AdminIcon icon={IconMonitor} size="md" tone="inherit" />
		<span class="dock-label">PREVIEW</span>
	</button>
</nav>

<style>
	.mobile-dock {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0;
		background: var(--admin-chrome-bg, #f8f8f6);
		border-top: 1px solid var(--admin-keyline, rgba(0,0,0,0.1));
		padding-bottom: env(safe-area-inset-bottom, 0);
		z-index: 20;
	}
	.dock-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		padding: 10px 8px 8px;
		background: transparent;
		border: none;
		color: var(--admin-text-subtle, currentColor);
		cursor: pointer;
		min-height: 56px;
		font-family: var(--admin-font-mono, monospace);
		transition: color 120ms ease;
	}
	.dock-btn:hover {
		color: var(--admin-text, currentColor);
	}
	.dock-btn--active {
		color: var(--admin-accent, #2563eb);
	}
	.dock-label {
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 600;
	}
</style>
