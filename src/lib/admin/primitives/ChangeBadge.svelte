<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { format_relative_time as formatRelativeTime } from '$lib/clj/portfolio/admin/constants.mjs';

	export let timestamp: number | null = null;
	export let isDefault: boolean = true;

	const dispatch = createEventDispatcher<{ click: void }>();

	$: label = isDefault ? 'default' : timestamp ? formatRelativeTime(timestamp) : 'modified';

	function handleClick() {
		dispatch('click');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}
</script>

<span
	class="change-badge"
	class:default={isDefault}
	class:modified={!isDefault}
	role="button"
	tabindex={isDefault ? -1 : 0}
	on:click={handleClick}
	on:keydown={handleKeydown}
>
	{label}
</span>

<style>
	.change-badge {
		display: inline-flex;
		align-items: center;
		min-height: 14px;
		padding: 1px 4px;
		border-radius: 2px;
		font-family: var(--font-mono);
		font-size: 6px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		line-height: 1;
		white-space: nowrap;
		user-select: none;
	}

	.change-badge.default {
		background: rgba(68, 214, 44, 0.08);
		color: var(--admin-green, #44D62C);
		cursor: default;
	}

	.change-badge.modified {
		background: rgba(37, 99, 235, 0.08);
		color: var(--admin-blue, #2563EB);
		cursor: pointer;
	}
</style>
