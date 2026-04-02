<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { sectionTypeRegistry } from '$lib/sections/registry';

	export let sections: any[] = [];
	export let selectedIndex: number | null = null;

	const dispatch = createEventDispatcher<{
		select: number;
		reorder: any[];
		delete: number;
		add: void;
	}>();

	function getTypeDef(type: string) {
		return sectionTypeRegistry[type] ?? { label: type, icon: '?', category: 'content' };
	}

	function moveUp(i: number) {
		if (i === 0) return;
		const arr = [...sections];
		[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
		arr.forEach((s, idx) => (s.order = idx));
		dispatch('reorder', arr);
	}

	function moveDown(i: number) {
		if (i >= sections.length - 1) return;
		const arr = [...sections];
		[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
		arr.forEach((s, idx) => (s.order = idx));
		dispatch('reorder', arr);
	}
</script>

<div class="section-list">
	{#each sections.sort((a, b) => a.order - b.order) as section, i}
		{@const def = getTypeDef(section.sectionType)}
		<div
			class="section-row"
			class:selected={selectedIndex === i}
			on:click={() => dispatch('select', i)}
			on:keydown={(e) => { if (e.key === 'Enter') dispatch('select', i); }}
			role="button"
			tabindex="0"
			aria-label="Select {def.label} section"
			aria-pressed={selectedIndex === i}
		>
			<span class="section-handle">≡</span>
			<span class="section-icon">{def.icon}</span>
			<span class="section-label">{def.label}</span>
			<div class="section-actions">
				<button class="action-btn" on:click|stopPropagation={() => moveUp(i)} disabled={i === 0} aria-label="Move up">↑</button>
				<button class="action-btn" on:click|stopPropagation={() => moveDown(i)} disabled={i >= sections.length - 1} aria-label="Move down">↓</button>
				<button class="action-btn action-delete" on:click|stopPropagation={() => dispatch('delete', i)} aria-label="Delete section">×</button>
			</div>
		</div>
	{/each}

	<button class="add-btn" on:click={() => dispatch('add')}>+ Add Section</button>
</div>

<style>
	.section-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.section-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 8px;
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		background: transparent;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
		text-align: left;
		width: 100%;
		font-family: inherit;
	}

	.section-row:hover {
		border-color: var(--border-color);
		background: var(--color-bg-alt);
	}

	.section-row.selected {
		border-color: var(--bento-blue, #2563EB);
		background: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 94%);
	}

	.section-handle {
		color: var(--color-text-subtle);
		font-size: 10px;
		cursor: grab;
		user-select: none;
	}

	.section-icon {
		font-size: 11px;
		width: 16px;
		text-align: center;
	}

	.section-label {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text);
		flex: 1;
	}

	.section-actions {
		display: flex;
		gap: 2px;
		opacity: 0;
		transition: opacity var(--duration-fast) var(--easing);
	}

	.section-row:hover .section-actions {
		opacity: 1;
	}

	.action-btn {
		font-family: var(--font-mono);
		font-size: 10px;
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 0;
		transition: all var(--duration-fast) var(--easing);
	}

	.action-btn:hover:not(:disabled) {
		border-color: var(--border-color);
		color: var(--color-text);
	}

	.action-btn:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.action-delete:hover:not(:disabled) {
		color: var(--color-danger, #DC2626);
		border-color: var(--color-danger, #DC2626);
	}

	.add-btn {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted);
		background: transparent;
		border: 1px dashed var(--border-color-subtle);
		border-radius: var(--radius-sm);
		padding: 8px;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
		margin-top: 4px;
		text-align: center;
		width: 100%;
	}

	.add-btn:hover {
		border-color: var(--bento-blue, #2563EB);
		color: var(--bento-blue, #2563EB);
	}
</style>
