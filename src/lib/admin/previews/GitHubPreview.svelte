<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let projects: any[] = [];

	const dispatch = createEventDispatcher();

	const langColors: Record<string, string> = {
		TypeScript: 'var(--bento-blue, #2563EB)',
		JavaScript: 'var(--bento-green, #44D62C)',
		Svelte: 'var(--bento-green, #44D62C)',
		Python: 'var(--bento-blue, #2563EB)',
		Rust: '#737373',
		Go: 'var(--bento-blue, #2563EB)',
	};

	function getLangColor(lang: string | undefined): string {
		if (!lang) return '#737373';
		return langColors[lang] || '#737373';
	}

	function truncate(text: string, max: number): string {
		if (!text) return '';
		return text.length > max ? text.slice(0, max) + '\u2026' : text;
	}

	function handleToggle(project: any) {
		dispatch('toggle', project._id);
	}
</script>

<div class="github-preview">
	{#each projects.slice(0, 6) as project}
		<div class="github-row">
			<span
				class="github-lang-dot"
				style="background: {getLangColor(project.language)}"
			></span>
			<span class="github-name">{project.repoName}</span>
			<span class="github-desc">{truncate(project.description, 30)}</span>
			{#if project.language}
				<span class="github-lang-tag">{project.language}</span>
			{/if}
			<button
				class="github-toggle"
				class:active={project.enabled}
				on:click={() => handleToggle(project)}
				aria-label="Toggle {project.repoName}"
			>
				<span class="github-toggle-thumb"></span>
			</button>
		</div>
	{/each}
	{#if projects.length === 0}
		<div class="github-empty">No projects</div>
	{/if}
</div>

<style>
	.github-preview {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.github-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 0;
		transition: background 160ms ease;
		border-radius: 2px;
	}

	.github-row:hover {
		background: var(--color-bg-alt);
	}

	.github-lang-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.github-name {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--color-text);
		font-weight: 500;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.github-desc {
		font-size: 8px;
		color: var(--color-text-subtle);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	.github-lang-tag {
		font-family: var(--font-mono);
		font-size: 6px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		background: var(--color-bg-alt);
		color: var(--color-text-muted);
		padding: 1px 4px;
		border-radius: 2px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* Toggle switch */
	.github-toggle {
		position: relative;
		width: 22px;
		height: 12px;
		background: var(--border-color);
		border-radius: 999px;
		cursor: pointer;
		transition: background 160ms ease;
		border: none;
		padding: 0;
		flex-shrink: 0;
	}

	.github-toggle.active {
		background: var(--bento-blue, #2563EB);
	}

	.github-toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-surface);
		transition: transform 160ms ease;
		pointer-events: none;
	}

	.github-toggle.active .github-toggle-thumb {
		transform: translateX(10px);
	}

	.github-empty {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 12px 0;
	}
</style>
