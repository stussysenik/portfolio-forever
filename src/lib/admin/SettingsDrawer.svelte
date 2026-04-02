<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import AppearanceCell from './controls/AppearanceCell.svelte';
	import ConfigCell from './controls/ConfigCell.svelte';
	import FlagsCell from './controls/FlagsCell.svelte';
	import OrderCell from './controls/OrderCell.svelte';
	import AnimationsCell from './controls/AnimationsCell.svelte';

	export let open: boolean = false;
	export let client: any;
	export let api: any;

	// Data props for control cells
	export let currentTheme: string = 'minimal';
	export let currentFont: string = 'inter';
	export let siteConfig: any = null;
	export let featureFlags: any[] = [];
	export let registrySections: any[] = [];

	const dispatch = createEventDispatcher<{ close: void }>();

	function handleBackdropClick() {
		dispatch('close');
	}

	function handleBackdropKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			dispatch('close');
		}
	}

	onMount(() => {
		const handler = (e: KeyboardEvent) => {
			if (open && e.key === 'Escape') {
				dispatch('close');
			}
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	});
</script>

{#if open}
	<div
		class="drawer-backdrop"
		class:visible={open}
		on:click={handleBackdropClick}
		on:keydown={handleBackdropKeydown}
		role="button"
		tabindex="-1"
		aria-label="Close settings"
	></div>
{/if}

<aside
	class="drawer"
	class:open
	role="dialog"
	aria-label="Settings"
	aria-hidden={!open}
>
	<div class="drawer-header">
		<span class="drawer-title">Settings</span>
		<button
			class="drawer-close"
			on:click={() => dispatch('close')}
			aria-label="Close settings drawer"
		>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M4 4l8 8M12 4l-8 8" />
			</svg>
		</button>
	</div>

	<div class="drawer-content">
		<!-- Appearance -->
		<section class="drawer-section">
			<h3 class="drawer-section-label">Appearance</h3>
			<div class="drawer-section-body">
				<AppearanceCell {currentTheme} {currentFont} />
			</div>
		</section>

		<!-- Config -->
		<section class="drawer-section">
			<h3 class="drawer-section-label">Config</h3>
			<div class="drawer-section-body">
				<ConfigCell {siteConfig} {client} {api} />
			</div>
		</section>

		<!-- Feature Flags -->
		<section class="drawer-section">
			<h3 class="drawer-section-label">Flags</h3>
			<div class="drawer-section-body">
				<FlagsCell flags={featureFlags} {client} {api} />
			</div>
		</section>

		<!-- Section Order -->
		<section class="drawer-section">
			<h3 class="drawer-section-label">Order</h3>
			<div class="drawer-section-body">
				<OrderCell sections={registrySections} {client} {api} />
			</div>
		</section>

		<!-- Animations -->
		<section class="drawer-section">
			<h3 class="drawer-section-label">Animations</h3>
			<div class="drawer-section-body">
				<AnimationsCell sections={registrySections} {client} {api} />
			</div>
		</section>
	</div>
</aside>

<style>
	/* ── Backdrop ── */
	.drawer-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 1999;
		opacity: 0;
		transition: opacity 300ms var(--easing-out, cubic-bezier(0.16, 1, 0.3, 1));
		cursor: default;
	}

	.drawer-backdrop.visible {
		opacity: 1;
	}

	/* ── Drawer Panel ── */
	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 380px;
		max-width: 100%;
		background: var(--color-bg);
		border-left: 1px solid var(--border-color, #e5e5e5);
		z-index: 2000;
		transform: translateX(100%);
		transition: transform 300ms var(--easing-out, cubic-bezier(0.16, 1, 0.3, 1));
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.drawer.open {
		transform: translateX(0);
	}

	/* ── Drawer Header ── */
	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--border-color-subtle);
		flex-shrink: 0;
	}

	.drawer-title {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text);
	}

	.drawer-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition:
			border-color var(--duration-fast, 150ms) var(--easing, ease),
			color var(--duration-fast, 150ms) var(--easing, ease);
	}

	.drawer-close:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	/* ── Drawer Content ── */
	.drawer-content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		-webkit-overflow-scrolling: touch;
	}

	/* Hide scrollbar but keep it scrollable */
	.drawer-content::-webkit-scrollbar {
		width: 4px;
	}

	.drawer-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.drawer-content::-webkit-scrollbar-thumb {
		background: var(--border-color-subtle);
		border-radius: 2px;
	}

	.drawer-content::-webkit-scrollbar-thumb:hover {
		background: var(--border-color);
	}

	/* ── Sections ── */
	.drawer-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.drawer-section-label {
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		margin: 0;
		padding-bottom: 6px;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.drawer-section-body {
		padding: 4px 0;
	}

	/* ── Mobile: full-width drawer ── */
	@media (max-width: 640px) {
		.drawer {
			width: 100%;
		}
	}
</style>
