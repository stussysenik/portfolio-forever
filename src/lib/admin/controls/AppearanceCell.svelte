<script lang="ts">
	import { AdminChipGroup } from '$lib/admin/primitives';

	export let currentTheme: string = 'minimal';
	export let currentFont: string = 'inter';

	const themes: { id: string; label: string; bg: string; accent: string }[] = [
		{ id: 'minimal',    label: 'Minimal',    bg: '#FAFAF9', accent: '#2563EB' },
		{ id: 'studio',     label: 'Studio',     bg: '#F5F5F5', accent: '#737373' },
		{ id: 'terminal',   label: 'Terminal',   bg: '#0A0A0A', accent: '#44D62C' },
		{ id: 'darkroom',   label: 'Darkroom',   bg: '#111111', accent: '#E5E5E5' },
		{ id: 'accessible', label: 'A11y',       bg: '#FFFFFF', accent: '#0000EE' },
	];

	const fonts: { id: string; name: string; family: string }[] = [
		{ id: 'inter',      name: 'Inter',       family: "'Inter', sans-serif" },
		{ id: 'rubik',      name: 'Rubik',       family: "'Rubik', sans-serif" },
		{ id: 'helvetica',  name: 'Helvetica',   family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" },
		{ id: 'crimson',    name: 'Crimson',     family: "'Crimson Pro', Georgia, serif" },
		{ id: 'times',      name: 'Times',       family: "'Times New Roman', 'Times', serif" },
		{ id: 'ibm-plex',   name: 'IBM Plex',    family: "'IBM Plex Mono', monospace" },
		{ id: 'jetbrains',  name: 'JetBrains',   family: "'JetBrains Mono', monospace" },
		{ id: 'fira',       name: 'Fira Code',   family: "'Fira Code', monospace" },
		{ id: 'space',      name: 'Space',       family: "'Space Grotesk', sans-serif" },
	];

	const palette = [
		{ label: 'Blue',  color: '#2563EB' },
		{ label: 'Green', color: '#44D62C' },
		{ label: 'Text',  color: 'var(--color-text)' },
		{ label: 'Muted', color: 'var(--color-text-muted)' },
		{ label: 'BG',    color: 'var(--color-bg)' },
	];

	function selectTheme(id: string) {
		currentTheme = id;
		document.documentElement.dataset.theme = id;
		localStorage.setItem('theme', id);
	}

	function selectFont(id: string) {
		currentFont = id;
		document.documentElement.dataset.font = id;
		localStorage.setItem('preferred-font', id);
	}
</script>

<div class="appearance-cell">
	<!-- Theme -->
	<div class="cell-section">
		<span class="cell-label">Theme</span>
		<div class="theme-chips">
			{#each themes as theme}
				<button
					class="theme-chip"
					class:active={currentTheme === theme.id}
					on:click={() => selectTheme(theme.id)}
					aria-label="Set theme to {theme.label}"
					aria-pressed={currentTheme === theme.id}
				>
					<span class="theme-swatch">
						<span class="swatch-bg" style="background: {theme.bg}"></span>
						<span class="swatch-accent" style="background: {theme.accent}"></span>
					</span>
					<span class="theme-name">{theme.label}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Font -->
	<div class="cell-section">
		<span class="cell-label">Font</span>
		<AdminChipGroup
			options={fonts.map(f => ({id: f.id, label: f.name}))}
			value={currentFont}
			layout="grid"
			columns={3}
			mode="exclusive"
			color="blue"
			on:change={(e) => selectFont(e.detail.value as string)}
		/>
	</div>

	<!-- Palette (display only) -->
	<div class="cell-section">
		<span class="cell-label">Palette</span>
		<div class="palette-grid">
			{#each palette as swatch}
				<div class="palette-swatch">
					<span class="swatch-circle" style="background: {swatch.color}"></span>
					<span class="swatch-name">{swatch.label}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.appearance-cell {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.cell-section {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.cell-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	/* ── Theme chips ── */
	.theme-chips {
		display: flex;
		gap: 4px;
	}

	.theme-chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		padding: 4px;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: transparent;
		cursor: pointer;
		transition: all 160ms ease;
		flex: 1;
	}

	.theme-chip:hover {
		border-color: var(--border-color);
	}

	.theme-chip.active {
		border-color: var(--bento-blue, #2563EB);
		background: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 92%);
	}

	.theme-swatch {
		display: flex;
		width: 16px;
		height: 16px;
		border-radius: 2px;
		overflow: hidden;
		border: 1px solid var(--border-color-subtle);
	}

	.swatch-bg {
		width: 50%;
		height: 100%;
	}

	.swatch-accent {
		width: 50%;
		height: 100%;
	}

	.theme-name {
		font-family: var(--font-mono);
		font-size: 6px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
	}

	/* ── Palette ── */
	.palette-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 4px;
	}

	.palette-swatch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}

	.swatch-circle {
		width: 16px;
		height: 16px;
		border-radius: 2px;
		border: 1px solid var(--border-color-subtle);
	}

	.swatch-name {
		font-family: var(--font-mono);
		font-size: 6px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
	}
</style>
