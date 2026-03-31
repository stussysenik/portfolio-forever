<script lang="ts">
	/* Static preview — no props needed */
	const icons = [
		{ emoji: '\u{1F5A5}', label: 'My PC' },
		{ emoji: '\u{1F4C1}', label: 'Docs' },
		{ emoji: '\u{1F5D1}', label: 'Trash' },
		{ emoji: '\u{1F6AA}', label: 'Exit' },
	];
</script>

<div class="desktop-preview">
	{#each icons as icon}
		<div class="desktop-icon">
			<span class="desktop-emoji">{icon.emoji}</span>
			<span class="desktop-label">{icon.label}</span>
		</div>
	{/each}
</div>

<style>
	.desktop-preview {
		background: var(--color-bg-alt);
		border-radius: var(--radius-sm);
		padding: 10px 8px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 4px;
	}

	.desktop-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		padding: 6px 4px;
		border-radius: 3px;
		transition: background 160ms ease;
		cursor: default;
	}

	.desktop-icon:hover {
		background: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 88%);
	}

	.desktop-emoji {
		font-size: 16px;
		line-height: 1;
	}

	.desktop-label {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-muted);
		white-space: nowrap;
	}
</style>
