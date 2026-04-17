<script lang="ts">
	import { onMount } from 'svelte';
	import { navParadigm, type NavParadigm } from '$lib/stores/siteMode';

	const navModes: { id: NavParadigm; label: string; icon: string }[] = [
		{ id: 'sidebar', label: 'Sidebar', icon: '◧' },
		{ id: 'drawer',  label: 'Drawer',  icon: '◫' },
		{ id: 'hybrid',  label: 'Hybrid',  icon: '◪' },
	];

	let currentNav: NavParadigm = 'hybrid';
	let isOpen = false;

	onMount(() => {
		const saved = localStorage.getItem('navParadigm') as NavParadigm | null;
		if (saved && navModes.some(n => n.id === saved)) {
			currentNav = saved;
		} else {
			currentNav = 'hybrid';
		}

		const unsub = navParadigm.subscribe((v) => {
			currentNav = v;
		});

		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'l' && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
				e.preventDefault();
				isOpen = !isOpen;
			}
		};
		window.addEventListener('keydown', handleKeydown);

		return () => {
			unsub();
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	function isInputFocused(): boolean {
		const active = document.activeElement;
		return active instanceof HTMLInputElement ||
			active instanceof HTMLTextAreaElement ||
			active?.getAttribute('contenteditable') === 'true';
	}

	function selectNav(id: NavParadigm) {
		currentNav = id;
		navParadigm.set(id);
		isOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') isOpen = false;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="config-switcher">
	<button
		class="config-toggle"
		on:click={() => isOpen = !isOpen}
		aria-label="Change nav style"
		aria-expanded={isOpen}
		title="Nav (L)"
	>
		<span class="config-icon">◧</span>
	</button>

	{#if isOpen}
		<div class="config-dropdown" role="menu">
			{#each navModes as mode}
				<button
					class="config-option"
					class:active={currentNav === mode.id}
					on:click={() => selectNav(mode.id)}
					role="menuitem"
				>
					<span class="option-icon">{mode.icon}</span>
					<span class="option-label">{mode.label}</span>
					{#if currentNav === mode.id}
						<span class="option-check">✓</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.config-switcher {
		position: relative;
	}

	.config-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: transparent;
		border: var(--border-width) solid var(--border-color);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			border-color 160ms cubic-bezier(0.23, 1, 0.32, 1),
			background 160ms cubic-bezier(0.23, 1, 0.32, 1);
		-webkit-tap-highlight-color: transparent;
	}

	.config-toggle:hover {
		border-color: var(--color-text-muted);
		background: var(--color-surface);
	}

	.config-toggle:active {
		transform: scale(0.97);
	}

	.config-icon {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.config-dropdown {
		position: absolute;
		bottom: calc(100% + var(--space-xs));
		right: 0;
		min-width: 130px;
		background: var(--color-surface);
		border: var(--border-width) solid var(--border-color);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		padding: var(--space-xs);
		z-index: 100;
		animation: dropdown-in var(--duration-fast) var(--easing-out);
	}

	@keyframes dropdown-in {
		from { opacity: 0; transform: translateY(4px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.config-option {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-family: inherit;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		text-align: left;
		transition: background 160ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.config-option:hover {
		background: var(--color-bg-alt);
	}

	.config-option:active {
		transform: scale(0.98);
	}

	.config-option.active {
		color: var(--color-text);
	}

	.option-icon {
		font-size: var(--font-size-sm);
		opacity: 0.7;
		min-width: 1.2em;
		text-align: center;
	}

	.option-label {
		flex: 1;
	}

	.option-check {
		font-size: var(--font-size-xs);
		color: var(--color-accent);
	}
</style>
