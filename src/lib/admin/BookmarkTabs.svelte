<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let active: 'content' | 'style' | 'layout' = 'content';

	const dispatch = createEventDispatcher<{
		change: { value: 'content' | 'style' | 'layout' };
	}>();

	const tabs = [
		{ id: 'content', label: 'CONTENT' },
		{ id: 'style', label: 'STYLE' },
		{ id: 'layout', label: 'LAYOUT' },
	] as const;

	type TabId = (typeof tabs)[number]['id'];

	function select(id: TabId) {
		if (active === id) return;
		active = id;
		dispatch('change', { value: id });
	}

	function handleKeydown(e: KeyboardEvent) {
		const ids = tabs.map((t) => t.id);
		const currentIndex = ids.indexOf(active);

		if (e.key === 'ArrowRight') {
			e.preventDefault();
			const next = ids[(currentIndex + 1) % ids.length];
			select(next);
			focusTab(next);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			const prev = ids[(currentIndex - 1 + ids.length) % ids.length];
			select(prev);
			focusTab(prev);
		}
	}

	function focusTab(id: TabId) {
		// Schedule after Svelte re-render so aria-selected is updated first
		requestAnimationFrame(() => {
			const el = document.querySelector<HTMLButtonElement>(`[data-tab-id="${id}"]`);
			el?.focus();
		});
	}
</script>

<div
	class="bookmark-tabs"
	role="tablist"
	aria-label="Section bookmarks"
	on:keydown={handleKeydown}
>
	{#each tabs as tab (tab.id)}
		<button
			class="tab"
			class:tab--active={active === tab.id}
			role="tab"
			aria-selected={active === tab.id}
			tabindex={active === tab.id ? 0 : -1}
			data-tab-id={tab.id}
			on:click={() => select(tab.id)}
		>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.bookmark-tabs {
		display: flex;
		flex-direction: row;
		gap: var(--admin-space-2, 8px);
		padding: var(--admin-space-2, 8px) var(--admin-space-4, 16px);
		border-bottom: 1px solid var(--border-color-subtle);
		align-items: center;
	}

	.tab {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: var(--admin-touch-min, 44px);
		padding: 6px 14px;

		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		white-space: nowrap;

		background: transparent;
		color: var(--color-text-muted);
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		cursor: pointer;

		transition: background var(--admin-transition, 120ms ease),
			color var(--admin-transition, 120ms ease),
			border-color var(--admin-transition, 120ms ease);
	}

	.tab:focus-visible {
		outline: 2px solid var(--admin-blue, #2563eb);
		outline-offset: 2px;
	}

	.tab--active {
		background: var(--admin-blue, #2563eb);
		color: #fff;
		border-color: var(--admin-blue, #2563eb);
	}
</style>
