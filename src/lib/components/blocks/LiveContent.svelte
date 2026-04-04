<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let htmlContent: string = "";
	export let tag: string = "div";
	export let placeholder: string = "Type here...";

	const dispatch = createEventDispatcher<{ change: string }>();

	let isEditing: boolean = false;
	let elementRef: HTMLElement;
	let lastTap = 0;

	// Double-tap to edit logic
	function handleTap(e: MouseEvent | TouchEvent) {
		const currentTime = new Date().getTime();
		const tapLength = currentTime - lastTap;
		if (tapLength < 500 && tapLength > 0) {
			// Double tap!
			enableEdit(e);
		}
		lastTap = currentTime;
	}

	function enableEdit(e: Event) {
		e.preventDefault();
		isEditing = true;
		// Async focus to let DOM update contenteditable
		setTimeout(() => {
			if (elementRef) {
				elementRef.focus();
				// Move cursor to end
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(elementRef);
				range.collapse(false);
				selection?.removeAllRanges();
				selection?.addRange(range);
			}
		}, 0);
	}

	function handleBlur() {
		isEditing = false;
		if (elementRef) {
			const newContent = elementRef.innerHTML;
			if (newContent !== htmlContent) {
				htmlContent = newContent;
				dispatch('change', htmlContent);
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			elementRef?.blur(); // Triggers handleBlur
		}
	}
</script>

<svelte:element
	this={tag}
	bind:this={elementRef}
	class="live-content {isEditing ? 'is-editing' : ''} {$$props.class || ''}"
	contenteditable={isEditing}
	role="textbox"
	aria-multiline="true"
	tabindex="-1"
	on:blur={handleBlur}
	on:keydown={handleKeydown}
	data-placeholder={placeholder}
>
	<!-- Use @html carefully. The sanitization layer happens before passing down or on server -->
	{@html htmlContent || (isEditing ? '' : `<span class="placeholder">${placeholder}</span>`)}
</svelte:element>

<style>
	.live-content {
		outline: none;
		transition: background-color 0.2s ease, border-color 0.2s ease;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
	}

	/* Only show hover intent to edit when NOT editing */
	.live-content:not(.is-editing):hover {
		cursor: text;
		background-color: color-mix(in srgb, var(--color-surface), transparent 50%);
		border-color: color-mix(in srgb, var(--border-color-subtle), transparent 50%);
	}

	.live-content.is-editing {
		background-color: var(--color-surface);
		border-color: var(--color-accent);
		cursor: text;
		box-shadow: var(--shadow-sm);
	}

	.placeholder {
		opacity: 0.4;
		font-style: italic;
	}

	/* Hide placeholder purely when empty and not focused */
	.live-content:empty::before {
		content: attr(data-placeholder);
		opacity: 0.4;
		font-style: italic;
		pointer-events: none;
	}
</style>
