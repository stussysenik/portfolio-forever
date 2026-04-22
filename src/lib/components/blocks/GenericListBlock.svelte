<script lang="ts">
	import LiveContent from './LiveContent.svelte';

	export let title: string = "List Title";
	export let items: string[] = ["Item 1", "Item 2"];

	function updateTitle(e: CustomEvent<string>) {
		title = e.detail;
	}

	function updateItem(index: number, e: CustomEvent<string>) {
		items[index] = e.detail;
		// Normally here we'd trigger an overarching save to Convex or the CMS proxy wrapper
	}

	function addItem() {
		items = [...items, "New Item"];
	}
</script>

<div class="generic-list-block">
	<div class="list-header">
		<LiveContent
			tag="h3"
			class="text-xs uppercase tracking-widest text-muted font-mono"
			htmlContent={title}
			placeholder="List title"
			on:change={updateTitle}
		/>
	</div>

	<ul class="list-body">
		{#each items as item, i}
			<li class="list-item">
				<LiveContent
					tag="span"
					class="text-sm weight-medium text-text"
					htmlContent={item}
					placeholder="Add item..."
					on:change={(e) => updateItem(i, e)}
				/>
			</li>
		{/each}
	</ul>

	<!-- Small internal button just for fast drafting when editing -->
	<button class="add-btn text-2xs font-mono text-subtle mt-xs lowercase" on:click={addItem}>
		+ add
	</button>
</div>

<style>
	.generic-list-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-width: 200px;
	}

	.list-header {
		border-bottom: 1px dotted var(--border-color);
		padding-bottom: var(--space-2xs);
		margin-bottom: var(--space-xs);
	}

	.list-body {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.list-item {
		line-height: var(--line-height-snug);
	}

	.add-btn {
		background: transparent;
		border: none;
		padding: 2px 4px;
		cursor: pointer;
		opacity: 0;
		transition: opacity var(--duration-fast) var(--easing);
		align-self: flex-start;
	}

	.generic-list-block:hover .add-btn {
		opacity: 1;
	}

	.add-btn:hover {
		color: var(--color-accent);
	}
</style>
