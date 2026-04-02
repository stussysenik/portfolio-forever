# Admin Content Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abstract PageGrid admin landing with a Linear-style tabbed content hub where every existing page (Works, Blog, CV, re:mix, Terminal, etc.) is immediately accessible with its real data, editable color strips, composable particle animations, and inline entry management.

**Architecture:** Tabbed hub component reads all pages from Convex `pages.getAll()`. Each tab renders a PagePanel showing page controls, color strip, particle presets, entry table, and section composer. Existing entry admin components are reused inside expandable table rows. New page creation stays as a `+` action in the tab bar.

**Tech Stack:** Svelte 4, Convex (real-time subscriptions), TypeScript, CSS custom properties (existing design system)

**Spec:** `docs/superpowers/specs/2026-04-01-admin-content-hub-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/lib/admin/ContentHub.svelte` | Tab bar + active panel orchestrator, subscription management |
| `src/lib/admin/PagePanel.svelte` | Active tab's content: controls, color strip, particles, entries, sections |
| `src/lib/admin/controls/ParticlesCell.svelte` | Toggle + multi-select preset chips for Lua particle engine |
| `src/lib/admin/controls/ColorStrip.svelte` | Editable color distribution bar with palette popover |
| `src/lib/admin/EntryTable.svelte` | Compact table that adapts columns per data table type |

### Modified Files
| File | Change |
|------|--------|
| `src/lib/admin/admin-utils.ts` | Add `validateLabel()`, `validateRoute()`, `NAMED_COLORS` |
| `src/routes/admin/+page.svelte` | Replace PageGrid with ContentHub, keep SettingsDrawer |
| `src/lib/admin/index.ts` | Add new component exports |
| `src/lib/admin/controls/index.ts` | Add ParticlesCell, ColorStrip exports |

### Preserved (no changes)
| File | Why |
|------|-----|
| `src/lib/admin/SectionList.svelte` | Reused in PagePanel |
| `src/lib/admin/SectionPicker.svelte` | Reused for adding sections |
| `src/lib/admin/SettingsDrawer.svelte` | Global settings, unchanged |
| `src/lib/admin/BlogAdmin.svelte` + all entry admins | Reused inside EntryTable expanded rows |
| `convex/pages.ts` | Mutations already support everything needed |
| `convex/sectionRegistry.ts` | Mutations already support everything needed |

---

### Task 1: String Validation Utilities

**Files:**
- Modify: `src/lib/admin/admin-utils.ts`

- [ ] **Step 1: Add validation helpers and color constants**

Add these functions to the end of `src/lib/admin/admin-utils.ts`:

```typescript
/** Named color palette — the canonical set for featured/accent colors */
export const NAMED_COLORS = [
	'orange', 'green', 'electric-green', 'ocean', 'gold', 'pink', 'cloud', 'red', 'yellow',
] as const;

export type NamedColor = typeof NAMED_COLORS[number];

/** CSS custom property for a named color */
export const COLOR_CSS: Record<NamedColor, string> = {
	orange: '#F97242',
	green: '#44D62C',
	'electric-green': '#44D62C',
	ocean: '#B3EBF2',
	gold: '#D2AF26',
	pink: '#FFC5D3',
	cloud: '#F0EEE9',
	red: '#691424',
	yellow: '#D2AF26',
};

/** WYSIWYG label validation — trim only, no case changes */
export function validateLabel(raw: string): { valid: boolean; value: string; error?: string } {
	const value = raw.trim();
	if (!value) return { valid: false, value, error: 'Label cannot be empty' };
	return { valid: true, value };
}

/** Route validation — must start with /, lowercase, hyphens/colons allowed */
export function validateRoute(raw: string): { valid: boolean; value: string; error?: string } {
	const value = raw.trim();
	if (!value) return { valid: false, value, error: 'Route cannot be empty' };
	if (!/^\/[a-z0-9\-:]*$/.test(value)) {
		return { valid: false, value, error: 'Route must start with / and contain only lowercase letters, numbers, hyphens, colons' };
	}
	return { valid: true, value };
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --skipLibCheck 2>&1 | head -20`
Expected: No errors from admin-utils.ts

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/admin-utils.ts
git commit -m "feat(admin): add WYSIWYG validation helpers and named color constants"
```

---

### Task 2: ParticlesCell Component

**Files:**
- Create: `src/lib/admin/controls/ParticlesCell.svelte`
- Modify: `src/lib/admin/controls/index.ts`

- [ ] **Step 1: Create ParticlesCell.svelte**

```svelte
<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let particles: string[] = [];
	export let enabled: boolean = false;
	export let pixelEngineGlobal: boolean = false;
	export let onToggle: (enabled: boolean) => void;
	export let onPresetsChange: (presets: string[]) => void;

	const PRESETS = ['electrons', 'wanderers', 'cards'] as const;

	function handleToggle() {
		onToggle(!enabled);
	}

	function handlePresetToggle(preset: string) {
		const next = particles.includes(preset)
			? particles.filter((p) => p !== preset)
			: [...particles, preset];
		onPresetsChange(next);
	}
</script>

<div class="particles-cell" role="group" aria-label="Particle animation">
	<span class="particles-label">Particles</span>

	<button
		class="particles-toggle"
		class:on={enabled}
		aria-label="Toggle particles"
		aria-pressed={enabled}
		on:click={handleToggle}
	>
		<span class="toggle-track">
			<span class="toggle-thumb"></span>
		</span>
	</button>

	{#if enabled}
		<div class="presets" role="group" aria-label="Particle presets">
			{#each PRESETS as preset}
				<button
					class="preset-chip"
					class:active={particles.includes(preset)}
					aria-pressed={particles.includes(preset)}
					on:click={() => handlePresetToggle(preset)}
				>
					{preset}
				</button>
			{/each}
		</div>
	{/if}

	{#if !pixelEngineGlobal}
		<span class="global-hint">pixel engine disabled globally — enable in Settings &gt; Flags</span>
	{/if}
</div>

<style>
	.particles-cell {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle, #1a1a1a);
		border-radius: var(--radius-sm, 6px);
		flex-wrap: wrap;
	}

	.particles-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-subtle, #666);
	}

	.particles-toggle {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.toggle-track {
		display: block;
		width: 28px;
		height: 14px;
		background: var(--border-color, #333);
		border-radius: 7px;
		position: relative;
		transition: background var(--duration-fast, 120ms) var(--easing);
	}

	.particles-toggle.on .toggle-track {
		background: var(--bento-green, #44D62C);
	}

	.toggle-thumb {
		display: block;
		width: 10px;
		height: 10px;
		background: #fff;
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: 2px;
		transition: left var(--duration-fast, 120ms) var(--easing);
	}

	.particles-toggle.on .toggle-thumb {
		left: 16px;
	}

	.presets {
		display: flex;
		gap: 2px;
	}

	.preset-chip {
		font-family: var(--font-mono);
		font-size: 8px;
		padding: 2px 6px;
		border-radius: 3px;
		border: 1px solid var(--border-color-subtle, #222);
		background: transparent;
		color: var(--color-text-muted, #666);
		cursor: pointer;
		transition: all var(--duration-fast, 120ms) var(--easing);
	}

	.preset-chip:hover {
		border-color: var(--color-text-muted, #666);
		color: var(--color-text, #fff);
	}

	.preset-chip.active {
		background: color-mix(in oklch, var(--bento-green, #44D62C), transparent 85%);
		border-color: color-mix(in oklch, var(--bento-green, #44D62C), transparent 60%);
		color: var(--bento-green, #44D62C);
	}

	.global-hint {
		font-family: var(--font-mono);
		font-size: 8px;
		color: var(--color-text-subtle, #555);
		width: 100%;
		margin-top: 2px;
	}
</style>
```

- [ ] **Step 2: Add export to controls/index.ts**

Add this line to `src/lib/admin/controls/index.ts`:

```typescript
export { default as ParticlesCell } from './ParticlesCell.svelte';
```

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit --skipLibCheck 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/admin/controls/ParticlesCell.svelte src/lib/admin/controls/index.ts
git commit -m "feat(admin): add composable ParticlesCell with multi-select presets"
```

---

### Task 3: ColorStrip Component

**Files:**
- Create: `src/lib/admin/controls/ColorStrip.svelte`
- Modify: `src/lib/admin/controls/index.ts`

- [ ] **Step 1: Create ColorStrip.svelte**

```svelte
<script lang="ts">
	import { NAMED_COLORS, COLOR_CSS, type NamedColor } from '$lib/admin/admin-utils';

	export let entries: any[] = [];
	export let colorField: string = 'featured';
	export let activeFilter: string | null = null;
	export let onFilterChange: (color: string | null) => void = () => {};
	export let onColorChange: (entryId: string, color: NamedColor) => void = () => {};

	/** Color → count of entries assigned that color */
	$: distribution = (() => {
		const counts: Record<string, number> = {};
		for (const c of NAMED_COLORS) counts[c] = 0;
		for (const entry of entries) {
			const c = entry[colorField];
			if (c && c in counts) counts[c]++;
		}
		return counts;
	})();

	let popoverEntryId: string | null = null;
	let popoverAnchor: HTMLElement | null = null;

	function handleSwatchClick(color: string) {
		if (activeFilter === color) {
			onFilterChange(null);
		} else {
			onFilterChange(color);
		}
	}

	function handleEntryDotClick(e: MouseEvent, entryId: string) {
		popoverEntryId = popoverEntryId === entryId ? null : entryId;
		popoverAnchor = e.currentTarget as HTMLElement;
	}

	function handleColorPick(color: NamedColor) {
		if (popoverEntryId) {
			onColorChange(popoverEntryId, color);
			popoverEntryId = null;
		}
	}
</script>

<div class="color-strip" role="group" aria-label="Color distribution">
	{#each NAMED_COLORS as color}
		{@const count = distribution[color] ?? 0}
		{#if count > 0 || activeFilter === color}
			<button
				class="swatch"
				class:active={activeFilter === color}
				class:empty={count === 0}
				aria-label="{color}: {count} entries"
				aria-pressed={activeFilter === color}
				on:click={() => handleSwatchClick(color)}
			>
				<span class="swatch-bar" style="background: {COLOR_CSS[color]}"></span>
				<span class="swatch-meta">{color} · {count}</span>
			</button>
		{/if}
	{/each}
</div>

{#if popoverEntryId}
	<div class="color-popover" role="listbox" aria-label="Pick a color">
		{#each NAMED_COLORS as color}
			<button
				class="popover-dot"
				role="option"
				aria-label={color}
				style="background: {COLOR_CSS[color]}"
				on:click={() => handleColorPick(color)}
			></button>
		{/each}
	</div>
{/if}

<style>
	.color-strip {
		display: flex;
		gap: 4px;
		padding: 8px 10px;
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle, #1a1a1a);
		border-radius: var(--radius-sm, 6px);
		flex-wrap: wrap;
	}

	.swatch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		cursor: pointer;
		background: none;
		border: none;
		padding: 2px;
		border-radius: 3px;
		transition: opacity var(--duration-fast, 120ms) var(--easing);
	}

	.swatch:hover {
		opacity: 0.8;
	}

	.swatch.active {
		outline: 1px solid var(--bento-blue, #2563EB);
		outline-offset: 1px;
	}

	.swatch.empty {
		opacity: 0.3;
	}

	.swatch-bar {
		display: block;
		width: 28px;
		height: 8px;
		border-radius: 2px;
	}

	.swatch-meta {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle, #666);
		white-space: nowrap;
	}

	.color-popover {
		display: flex;
		gap: 4px;
		padding: 6px;
		background: var(--color-surface, #1a1a1a);
		border: 1px solid var(--border-color, #333);
		border-radius: var(--radius-sm, 4px);
		margin-top: 4px;
	}

	.popover-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		transition: border-color var(--duration-fast, 120ms) var(--easing);
	}

	.popover-dot:hover {
		border-color: #fff;
	}

	.popover-dot:focus-visible {
		outline: 2px solid var(--bento-blue, #2563EB);
		outline-offset: 1px;
	}
</style>
```

- [ ] **Step 2: Add export to controls/index.ts**

Add this line to `src/lib/admin/controls/index.ts`:

```typescript
export { default as ColorStrip } from './ColorStrip.svelte';
```

- [ ] **Step 3: Verify compilation**

Run: `npx tsc --noEmit --skipLibCheck 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/admin/controls/ColorStrip.svelte src/lib/admin/controls/index.ts
git commit -m "feat(admin): add editable ColorStrip with palette popover"
```

---

### Task 4: EntryTable Component

**Files:**
- Create: `src/lib/admin/EntryTable.svelte`

This component renders a compact entry list and delegates expanded editing to the existing admin components (WorksAdmin, BlogAdmin, etc.).

- [ ] **Step 1: Create EntryTable.svelte**

```svelte
<script lang="ts">
	import { COLOR_CSS, type NamedColor } from '$lib/admin/admin-utils';

	export let entries: any[] = [];
	export let dataTable: string = '';
	export let colorField: string = 'featured';
	export let colorFilter: string | null = null;
	export let client: any;
	export let api: any;

	/** Column config per data table type */
	const TABLE_COLUMNS: Record<string, Array<{ key: string; label: string; width?: string }>> = {
		worksEntries: [
			{ key: 'title', label: 'Title' },
			{ key: 'category', label: 'Category', width: '80px' },
			{ key: 'year', label: 'Year', width: '50px' },
		],
		blogPosts: [
			{ key: 'title', label: 'Title' },
			{ key: 'tags', label: 'Tags', width: '100px' },
			{ key: 'publishedAt', label: 'Date', width: '80px' },
		],
		cvEntries: [
			{ key: 'title', label: 'Title' },
			{ key: 'organization', label: 'Org', width: '100px' },
			{ key: 'type', label: 'Type', width: '70px' },
		],
		academicEntries: [
			{ key: 'title', label: 'Title' },
			{ key: 'venue', label: 'Venue', width: '100px' },
			{ key: 'year', label: 'Year', width: '50px' },
		],
		talksEntries: [
			{ key: 'title', label: 'Title' },
			{ key: 'entryType', label: 'Type', width: '70px' },
			{ key: 'year', label: 'Year', width: '50px' },
		],
		galleryItems: [
			{ key: 'title', label: 'Title' },
			{ key: 'category', label: 'Category', width: '100px' },
			{ key: 'year', label: 'Year', width: '50px' },
		],
		labEntries: [
			{ key: 'title', label: 'Title' },
			{ key: 'status', label: 'Status', width: '80px' },
			{ key: 'date', label: 'Date', width: '80px' },
		],
		minorEntries: [
			{ key: 'text', label: 'Text' },
			{ key: 'category', label: 'Category', width: '80px' },
			{ key: 'year', label: 'Year', width: '50px' },
		],
		likesCategories: [
			{ key: 'title', label: 'Title' },
			{ key: '_itemCount', label: 'Items', width: '60px' },
		],
		giftsConfig: [
			{ key: 'title', label: 'Title' },
			{ key: 'callToAction', label: 'CTA', width: '120px' },
		],
	};

	$: columns = TABLE_COLUMNS[dataTable] ?? [{ key: 'title', label: 'Title' }];

	$: filteredEntries = colorFilter
		? entries.filter((e) => e[colorField] === colorFilter)
		: entries;

	$: sortedEntries = [...filteredEntries].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

	let expandedId: string | null = null;

	function toggleExpand(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	function getCellValue(entry: any, key: string): string {
		if (key === '_itemCount') return String(entry.items?.length ?? 0);
		const val = entry[key];
		if (Array.isArray(val)) return val.join(', ');
		if (val == null) return '';
		return String(val);
	}

	async function toggleVisibility(entry: any) {
		try {
			const mutationMap: Record<string, any> = {
				worksEntries: api.works.toggleVisibility,
				blogPosts: api.blog.toggleVisibility,
				talksEntries: api.talks.toggleVisibility,
				galleryItems: api.gallery.toggleVisibility,
				labEntries: api.labs.toggleVisibility,
				minorEntries: api.minor.toggleVisibility,
				likesCategories: api.likes.toggleVisibility,
				academicEntries: api.academia.toggleVisibility,
				cvEntries: api.cv.toggleEntryVisibility,
			};
			const mutation = mutationMap[dataTable];
			if (mutation) {
				await client.mutation(mutation, { id: entry._id });
			}
		} catch (e: any) {
			console.error('Toggle visibility failed:', e);
		}
	}
</script>

{#if sortedEntries.length > 0}
	<table class="entry-table" role="table">
		<thead>
			<tr>
				<th class="col-dot" aria-label="Color"></th>
				{#each columns as col}
					<th style={col.width ? `width: ${col.width}` : ''}>{col.label}</th>
				{/each}
				<th class="col-actions"></th>
			</tr>
		</thead>
		<tbody>
			{#each sortedEntries as entry (entry._id)}
				<tr
					class:hidden-entry={entry.visible === false}
					on:click={() => toggleExpand(entry._id)}
				>
					<td class="col-dot">
						{#if entry[colorField]}
							<span
								class="color-dot"
								style="background: {COLOR_CSS[entry[colorField]] ?? '#333'}"
								aria-label="Color: {entry[colorField]}"
							></span>
						{/if}
					</td>
					{#each columns as col, i}
						<td class={i === 0 ? 'col-title' : 'col-meta'}>
							{getCellValue(entry, col.key)}
						</td>
					{/each}
					<td class="col-actions">
						<button
							class="action-btn edit-btn"
							on:click|stopPropagation={() => toggleExpand(entry._id)}
						>
							{expandedId === entry._id ? 'close' : 'edit'}
						</button>
						<button
							class="action-btn vis-btn"
							class:visible={entry.visible !== false}
							aria-label="Toggle visibility"
							aria-pressed={entry.visible !== false}
							on:click|stopPropagation={() => toggleVisibility(entry)}
						>
							{entry.visible !== false ? 'visible' : 'hidden'}
						</button>
					</td>
				</tr>
				{#if expandedId === entry._id}
					<tr class="expanded-row">
						<td colspan={columns.length + 2}>
							<div class="expanded-content">
								<slot name="editor" {entry} />
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
{:else}
	<div class="empty-state">No entries{colorFilter ? ` with color "${colorFilter}"` : ''}</div>
{/if}

<style>
	.entry-table {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid var(--border-color-subtle, #1a1a1a);
		border-radius: var(--radius-sm, 6px);
		overflow: hidden;
	}

	thead tr {
		background: color-mix(in oklch, var(--color-bg, #000), transparent 50%);
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
	}

	th {
		padding: 6px 10px;
		font-family: var(--font-mono);
		font-size: 8px;
		font-weight: 400;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-subtle, #555);
		text-align: left;
	}

	tbody tr {
		border-bottom: 1px solid color-mix(in oklch, var(--border-color-subtle, #111), transparent 50%);
		cursor: pointer;
		transition: background var(--duration-fast, 120ms) var(--easing);
	}

	tbody tr:hover {
		background: color-mix(in oklch, var(--color-bg, #000), var(--color-surface, #111) 50%);
	}

	tbody tr:last-child {
		border-bottom: none;
	}

	td {
		padding: 7px 10px;
	}

	.col-dot {
		width: 20px;
	}

	.color-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.col-title {
		font-size: 11px;
		color: var(--color-text, #ddd);
	}

	.col-meta {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--color-text-muted, #666);
	}

	.col-actions {
		width: 90px;
		text-align: right;
	}

	.action-btn {
		font-family: var(--font-mono);
		font-size: 9px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 2px 4px;
	}

	.edit-btn {
		color: var(--bento-blue, #2563EB);
	}

	.vis-btn {
		color: var(--color-text-subtle, #555);
	}

	.vis-btn.visible {
		color: var(--bento-green, #44D62C);
	}

	.hidden-entry {
		opacity: 0.5;
	}

	.expanded-row td {
		padding: 0;
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
	}

	.expanded-content {
		padding: 12px;
		background: color-mix(in oklch, var(--color-bg, #000), var(--color-surface, #111) 30%);
	}

	.empty-state {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--color-text-subtle, #555);
		text-align: center;
		padding: 16px;
	}
</style>
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit --skipLibCheck 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/EntryTable.svelte
git commit -m "feat(admin): add EntryTable with adaptive columns and expandable rows"
```

---

### Task 5: PagePanel Component

**Files:**
- Create: `src/lib/admin/PagePanel.svelte`

The core panel that renders when a tab is active. Shows page controls, color strip, particles, entry table, and section composer.

- [ ] **Step 1: Create PagePanel.svelte**

```svelte
<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { validateLabel, validateRoute } from '$lib/admin/admin-utils';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import { VIEW_MODES } from '$lib/admin/constants';
	import { ParticlesCell, ColorStrip } from '$lib/admin/controls';
	import EntryTable from '$lib/admin/EntryTable.svelte';
	import SectionList from '$lib/admin/SectionList.svelte';
	import SectionPicker from '$lib/admin/SectionPicker.svelte';

	export let page: any;
	export let entries: any[] = [];
	export let featureFlags: any[] = [];
	export let client: any;
	export let api: any;

	let showSectionPicker = false;
	let colorFilter: string | null = null;

	$: sectionDef = sectionTypeRegistry[page?.sections?.[0]?.sectionType] ?? null;
	$: dataTable = sectionDef?.dataTable ?? page?.sections?.[0]?.dataTable ?? '';
	$: hasColorField = ['worksEntries', 'talksEntries', 'galleryItems'].includes(dataTable);
	$: colorField = dataTable === 'worksEntries' ? 'featured' : 'accentColor';
	$: pixelEngineFlag = featureFlags.find((f: any) => f.key === 'pixel-engine');
	$: pixelEngineGlobal = pixelEngineFlag?.enabled ?? false;
	$: pageParticles = page?.sections?.[0]?.config?.particles ?? [];
	$: pageParticlesEnabled = pageParticles.length > 0;

	// View mode cycling
	$: currentViewMode = page?.sections?.[0]?.config?.viewMode ?? 'grid';

	function cycleViewMode() {
		const idx = VIEW_MODES.indexOf(currentViewMode as any);
		const next = VIEW_MODES[(idx + 1) % VIEW_MODES.length];
		updateSectionConfig('viewMode', next);
	}

	async function togglePageVisibility() {
		try {
			await client.mutation(api.pages.upsert, {
				...page,
				visible: !page.visible,
			});
		} catch (e: any) {
			toast.error(e.message || 'Failed to toggle visibility');
		}
	}

	async function toggleNavVisibility() {
		try {
			await client.mutation(api.pages.upsert, {
				...page,
				navVisible: !page.navVisible,
			});
		} catch (e: any) {
			toast.error(e.message || 'Failed to toggle nav visibility');
		}
	}

	async function updateSectionConfig(key: string, value: any) {
		if (!page?.sections?.length) return;
		const sections = page.sections.map((s: any, i: number) =>
			i === 0 ? { ...s, config: { ...s.config, [key]: value } } : s,
		);
		try {
			await client.mutation(api.pages.updateSections, {
				pageId: page.pageId,
				sections,
			});
		} catch (e: any) {
			toast.error(e.message || 'Failed to update section config');
		}
	}

	function handleParticleToggle(enabled: boolean) {
		updateSectionConfig('particles', enabled ? ['electrons'] : []);
	}

	function handlePresetsChange(presets: string[]) {
		updateSectionConfig('particles', presets);
	}

	function handleColorChange(entryId: string, color: string) {
		// Delegate to the entry's update mutation based on dataTable
		const mutationMap: Record<string, any> = {
			worksEntries: api.works.updateEntry,
			talksEntries: api.talks.updateEntry,
			galleryItems: api.gallery.updateEntry,
		};
		const mutation = mutationMap[dataTable];
		if (mutation) {
			client.mutation(mutation, { id: entryId, [colorField]: color }).catch((e: any) => {
				toast.error(e.message || 'Failed to update color');
			});
		}
	}

	async function handleSectionPick(e: CustomEvent<string>) {
		const sectionType = e.detail;
		const def = sectionTypeRegistry[sectionType];
		const sections = [
			...(page.sections ?? []),
			{
				sectionType,
				config: {},
				dataTable: def?.dataTable,
				order: (page.sections?.length ?? 0),
			},
		];
		try {
			await client.mutation(api.pages.updateSections, {
				pageId: page.pageId,
				sections,
			});
			showSectionPicker = false;
			toast.success(`Added ${def?.label ?? sectionType} section`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to add section');
		}
	}
</script>

<div class="page-panel" role="tabpanel">
	<!-- Page controls row -->
	<div class="controls-row">
		<div class="panel-title-group">
			<h2 class="panel-title">{page.label}</h2>
			<span class="panel-route">{page.route}</span>
		</div>
		<div class="panel-chips">
			{#if dataTable && VIEW_MODES.includes(currentViewMode as any)}
				<button class="chip" on:click={cycleViewMode}>
					{currentViewMode} ▾
				</button>
			{/if}
			<button
				class="chip"
				class:chip-active={page.visible}
				aria-pressed={page.visible}
				on:click={togglePageVisibility}
			>
				{page.visible ? 'visible' : 'hidden'}
			</button>
			<button
				class="chip"
				class:chip-active={page.navVisible}
				aria-pressed={page.navVisible}
				on:click={toggleNavVisibility}
			>
				{page.navVisible ? 'in nav' : 'not in nav'}
			</button>
		</div>
	</div>

	<!-- Color strip (only for pages with color-able entries) -->
	{#if hasColorField && entries.length > 0}
		<ColorStrip
			{entries}
			{colorField}
			activeFilter={colorFilter}
			onFilterChange={(c) => (colorFilter = c)}
			onColorChange={handleColorChange}
		/>
	{/if}

	<!-- Particle animations -->
	<ParticlesCell
		particles={pageParticles}
		enabled={pageParticlesEnabled}
		{pixelEngineGlobal}
		onToggle={handleParticleToggle}
		onPresetsChange={handlePresetsChange}
	/>

	<!-- Entry table (only for data-driven pages) -->
	{#if dataTable && entries.length > 0}
		<EntryTable
			{entries}
			{dataTable}
			{colorField}
			{colorFilter}
			{client}
			{api}
		/>
	{:else if dataTable}
		<div class="empty-entries">
			<span>No entries yet</span>
			<button class="add-entry-btn" on:click>+ Add entry</button>
		</div>
	{/if}

	<!-- Section composer -->
	<div class="section-composer">
		<div class="composer-header">
			<span class="composer-label">Sections</span>
			<button class="add-section-btn" on:click={() => (showSectionPicker = true)}>
				+ Add section
			</button>
		</div>
		{#if page.sections?.length > 0}
			<div class="sections-list">
				{#each page.sections as section, idx}
					<div class="section-item">
						<span class="section-order">{idx + 1}</span>
						<span class="section-type">{sectionTypeRegistry[section.sectionType]?.label ?? section.sectionType}</span>
						{#if section.dataTable}
							<span class="section-data">{section.dataTable}</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
		<a class="composer-link" href="/admin/{page.pageId}">
			Open full composer
		</a>
	</div>
</div>

{#if showSectionPicker}
	<SectionPicker on:pick={handleSectionPick} on:close={() => (showSectionPicker = false)} />
{/if}

<style>
	.page-panel {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
	}

	.controls-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.panel-title-group {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.panel-title {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: -0.3px;
		margin: 0;
	}

	.panel-route {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--color-text-subtle, #444);
	}

	.panel-chips {
		display: flex;
		gap: 4px;
	}

	.chip {
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 3px 8px;
		border-radius: 3px;
		border: 1px solid var(--border-color-subtle, #222);
		background: var(--color-bg, #111);
		color: var(--color-text-muted, #888);
		cursor: pointer;
		transition: all var(--duration-fast, 120ms) var(--easing);
	}

	.chip:hover {
		border-color: var(--color-text-muted, #666);
		color: var(--color-text, #fff);
	}

	.chip-active {
		color: var(--bento-green, #44D62C);
		border-color: color-mix(in oklch, var(--bento-green, #44D62C), transparent 70%);
	}

	.empty-entries {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 24px;
		border: 1px dashed var(--border-color-subtle, #222);
		border-radius: var(--radius-sm, 6px);
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--color-text-subtle, #555);
	}

	.add-entry-btn {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--bento-green, #44D62C);
		background: none;
		border: none;
		cursor: pointer;
	}

	.section-composer {
		margin-top: 8px;
		padding-top: 12px;
		border-top: 1px solid var(--border-color-subtle, #1a1a1a);
	}

	.composer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.composer-label {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-subtle, #666);
	}

	.add-section-btn {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--bento-green, #44D62C);
		background: none;
		border: none;
		cursor: pointer;
	}

	.sections-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 8px;
	}

	.section-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 8px;
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle, #1a1a1a);
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 10px;
	}

	.section-order {
		font-size: 8px;
		color: var(--color-text-subtle, #555);
		min-width: 14px;
	}

	.section-type {
		color: var(--color-text, #ddd);
	}

	.section-data {
		font-size: 8px;
		color: var(--color-text-muted, #666);
		margin-left: auto;
	}

	.composer-link {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--bento-blue, #2563EB);
		text-decoration: none;
	}

	.composer-link:hover {
		text-decoration: underline;
	}
</style>
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit --skipLibCheck 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/PagePanel.svelte
git commit -m "feat(admin): add PagePanel with controls, colors, particles, entries, sections"
```

---

### Task 6: ContentHub Component

**Files:**
- Create: `src/lib/admin/ContentHub.svelte`

The main orchestrator: tab bar + active panel + new page action.

- [ ] **Step 1: Create ContentHub.svelte**

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast';
	import { sectionTypeRegistry } from '$lib/sections/registry';
	import { validateLabel, validateRoute } from '$lib/admin/admin-utils';
	import PagePanel from '$lib/admin/PagePanel.svelte';

	export let pages: any[] = [];
	export let featureFlags: any[] = [];
	export let client: any;
	export let api: any;

	/** Entry data keyed by dataTable name */
	export let entriesByTable: Record<string, any[]> = {};

	let activePageId: string = '';
	let showNewPageForm = false;
	let newLabel = '';
	let newRoute = '';

	// Auto-select first page when pages load
	$: if (pages.length > 0 && !activePageId) {
		activePageId = pages[0].pageId;
	}

	$: activePage = pages.find((p) => p.pageId === activePageId) ?? null;

	$: activeEntries = (() => {
		if (!activePage?.sections?.length) return [];
		const dt = sectionTypeRegistry[activePage.sections[0]?.sectionType]?.dataTable
			?? activePage.sections[0]?.dataTable;
		return dt ? (entriesByTable[dt] ?? []) : [];
	})();

	function selectTab(pageId: string) {
		activePageId = pageId;
		showNewPageForm = false;
	}

	function handleTabKeydown(e: KeyboardEvent) {
		const tabElements = Array.from(document.querySelectorAll('[role="tab"]'));
		const idx = tabElements.indexOf(e.currentTarget as HTMLElement);
		let nextIdx = idx;

		if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabElements.length;
		else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabElements.length) % tabElements.length;
		else if (e.key >= '1' && e.key <= '9') {
			// Quick jump: 1-9 selects tab by position
			const jumpIdx = parseInt(e.key) - 1;
			if (jumpIdx < pages.length) {
				selectTab(pages[jumpIdx].pageId);
				const target = tabElements[jumpIdx] as HTMLElement;
				target?.focus();
			}
			return;
		}
		else return;

		e.preventDefault();
		const next = tabElements[nextIdx] as HTMLElement;
		next.focus();
		next.click();
	}

	async function createNewPage() {
		const labelResult = validateLabel(newLabel);
		if (!labelResult.valid) {
			toast.error(labelResult.error!);
			return;
		}
		const routeResult = validateRoute(newRoute);
		if (!routeResult.valid) {
			toast.error(routeResult.error!);
			return;
		}

		const pageId = labelResult.value.toLowerCase().replace(/[^a-z0-9\-:]/g, '-');

		try {
			await client.mutation(api.pages.upsert, {
				pageId,
				label: labelResult.value,
				route: routeResult.value,
				navOrder: pages.length,
				navVisible: true,
				visible: true,
				sections: [],
			});
			activePageId = pageId;
			showNewPageForm = false;
			newLabel = '';
			newRoute = '';
			toast.success(`Created "${labelResult.value}"`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to create page');
		}
	}

	function getEntryCount(page: any): number {
		const dt = sectionTypeRegistry[page.sections?.[0]?.sectionType]?.dataTable
			?? page.sections?.[0]?.dataTable;
		if (!dt) return 0;
		return entriesByTable[dt]?.length ?? 0;
	}
</script>

<div class="content-hub">
	<!-- Tab Bar -->
	<div class="tab-bar" role="tablist" aria-label="Pages">
		{#each pages as page (page.pageId)}
			{@const count = getEntryCount(page)}
			<button
				role="tab"
				class="tab"
				class:active={activePageId === page.pageId}
				aria-selected={activePageId === page.pageId}
				tabindex={activePageId === page.pageId ? 0 : -1}
				on:click={() => selectTab(page.pageId)}
				on:keydown={handleTabKeydown}
			>
				{page.label}
				{#if count > 0}
					<span class="tab-count">{count}</span>
				{/if}
			</button>
		{/each}
		<button
			class="tab tab-new"
			on:click={() => (showNewPageForm = !showNewPageForm)}
			aria-label="Create new page"
		>
			+ New Page
		</button>
	</div>

	<!-- New Page Form -->
	{#if showNewPageForm}
		<div class="new-page-form">
			<input
				class="new-page-input"
				type="text"
				bind:value={newLabel}
				placeholder="Page label (WYSIWYG)"
				on:keydown={(e) => e.key === 'Escape' && (showNewPageForm = false)}
			/>
			<input
				class="new-page-input"
				type="text"
				bind:value={newRoute}
				placeholder="/route"
				on:keydown={(e) => {
					if (e.key === 'Enter') createNewPage();
					if (e.key === 'Escape') showNewPageForm = false;
				}}
			/>
			<button class="new-page-submit" on:click={createNewPage}>Create</button>
			<button class="new-page-cancel" on:click={() => (showNewPageForm = false)}>Cancel</button>
		</div>
	{/if}

	<!-- Active Tab Panel -->
	{#if activePage}
		<PagePanel
			page={activePage}
			entries={activeEntries}
			{featureFlags}
			{client}
			{api}
		/>
	{/if}
</div>

<style>
	.content-hub {
		display: flex;
		flex-direction: column;
	}

	.tab-bar {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		overflow-x: auto;
		padding: 0 12px;
		scrollbar-width: none;
	}

	.tab-bar::-webkit-scrollbar {
		display: none;
	}

	.tab {
		font-family: var(--font-mono);
		font-size: 10px;
		padding: 8px 14px;
		color: var(--color-text-muted, #666);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		white-space: nowrap;
		transition: color var(--duration-fast, 120ms) var(--easing);
	}

	.tab:hover {
		color: var(--color-text, #fff);
	}

	.tab.active {
		color: var(--color-text, #fff);
		font-weight: 500;
		border-bottom-color: var(--bento-blue, #2563EB);
	}

	.tab:focus-visible {
		outline: 2px solid var(--bento-blue, #2563EB);
		outline-offset: -2px;
		border-radius: 2px;
	}

	.tab-count {
		font-size: 8px;
		color: var(--bento-green, #44D62C);
		margin-left: 3px;
	}

	.tab.active .tab-count {
		color: var(--bento-green, #44D62C);
	}

	.tab-new {
		color: var(--color-text-subtle, #555);
	}

	.tab-new:hover {
		color: var(--bento-blue, #2563EB);
	}

	.new-page-form {
		display: flex;
		gap: 6px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
		align-items: center;
	}

	.new-page-input {
		font-family: var(--font-mono);
		font-size: 11px;
		padding: 4px 8px;
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 3px;
		color: var(--color-text, #fff);
		outline: none;
	}

	.new-page-input:focus {
		border-color: var(--bento-blue, #2563EB);
	}

	.new-page-submit {
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 4px 10px;
		background: var(--bento-green, #44D62C);
		color: #000;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		font-weight: 600;
	}

	.new-page-cancel {
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 4px 10px;
		background: none;
		color: var(--color-text-muted, #666);
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 3px;
		cursor: pointer;
	}
</style>
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit --skipLibCheck 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/ContentHub.svelte
git commit -m "feat(admin): add ContentHub with tab bar, new page form, and panel orchestration"
```

---

### Task 7: Wire Up Admin Landing Page

**Files:**
- Modify: `src/routes/admin/+page.svelte`

Replace PageGrid with ContentHub while preserving SettingsDrawer and all existing subscriptions.

- [ ] **Step 1: Rewrite +page.svelte**

Replace the entire content of `src/routes/admin/+page.svelte` with:

```svelte
<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import ContentHub from '$lib/admin/ContentHub.svelte';
	import SettingsDrawer from '$lib/admin/SettingsDrawer.svelte';

	const { client, api } = getContext<any>('admin');

	// ── Data State ──
	let pages: any[] = [];
	let siteConfigData: any = null;
	let featureFlags: any[] = [];
	let registrySections: any[] = [];

	// ── Entry data keyed by table name ──
	let entriesByTable: Record<string, any[]> = {};

	// ── Appearance ──
	let currentTheme = 'minimal';
	let currentFont = 'inter';

	// ── Settings Drawer ──
	let settingsOpen = false;

	onMount(() => {
		currentTheme = document.documentElement.dataset.theme || 'minimal';
		currentFont = document.documentElement.dataset.font || 'inter';

		const subs = [
			// Pages & config
			client.onUpdate(api.pages.getAll, {}, (data: any) => { if (data) pages = data; }),
			client.onUpdate(api.siteConfig.get, {}, (data: any) => { siteConfigData = data; }),
			client.onUpdate(api.siteConfig.getFeatureFlags, {}, (data: any) => { if (data) featureFlags = data; }),
			client.onUpdate(api.sectionRegistry.getAll, {}, (data: any) => { if (data) registrySections = data; }),
			// Entry data per table
			client.onUpdate(api.works.getFullWorks, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, worksEntries: data };
			}),
			client.onUpdate(api.talks.getFullTalks, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, talksEntries: data };
			}),
			client.onUpdate(api.blog.getFullPosts, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, blogPosts: data };
			}),
			client.onUpdate(api.gallery.getFullGallery, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, galleryItems: data };
			}),
			client.onUpdate(api.likes.getFullLikes, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, likesCategories: data };
			}),
			client.onUpdate(api.minor.getFullMinor, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, minorEntries: data };
			}),
			client.onUpdate(api.labs.getFullLabs, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, labEntries: data };
			}),
			client.onUpdate(api.academia.getFullAcademia, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, academicEntries: data };
			}),
			client.onUpdate(api.cv.getFullCV, {}, (data: any) => {
				if (data) entriesByTable = { ...entriesByTable, cvEntries: data.entries ?? [] };
			}),
		];

		return () => subs.forEach((fn) => fn());
	});
</script>

<svelte:head>
	<title>Admin | Portfolio OS</title>
</svelte:head>

<div class="admin-landing">
	<header class="admin-header">
		<div class="admin-header-left">
			<h1 class="admin-title">portfolio</h1>
			<span class="admin-sep">/</span>
			<span class="admin-sub">admin</span>
		</div>
		<div class="admin-header-right">
			<button
				class="settings-btn"
				on:click={() => (settingsOpen = true)}
				aria-label="Open settings"
			>
				Settings
			</button>
		</div>
	</header>

	<ContentHub
		{pages}
		{featureFlags}
		{entriesByTable}
		{client}
		{api}
	/>
</div>

<SettingsDrawer
	open={settingsOpen}
	{client}
	api={api}
	{currentTheme}
	{currentFont}
	siteConfig={siteConfigData}
	featureFlags={featureFlags}
	registrySections={registrySections}
	on:close={() => (settingsOpen = false)}
/>

<style>
	.admin-landing {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
		min-height: 100vh;
	}

	.admin-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.admin-header-left {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.admin-title {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: -0.3px;
		margin: 0;
	}

	.admin-sep {
		color: var(--color-text-subtle, #333);
	}

	.admin-sub {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted, #888);
	}

	.settings-btn {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		background: var(--color-bg, #111);
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-sm);
		padding: 4px 10px;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
	}

	.settings-btn:hover {
		color: var(--color-text);
		border-color: var(--border-color);
	}
</style>
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --skipLibCheck 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/admin/+page.svelte
git commit -m "feat(admin): wire ContentHub as admin landing, replace PageGrid"
```

---

### Task 8: Update Barrel Exports

**Files:**
- Modify: `src/lib/admin/index.ts`

- [ ] **Step 1: Add new component exports**

Add these lines to the end of `src/lib/admin/index.ts`:

```typescript
export { default as ContentHub } from './ContentHub.svelte';
export { default as PagePanel } from './PagePanel.svelte';
export { default as EntryTable } from './EntryTable.svelte';
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit --skipLibCheck 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/index.ts
git commit -m "chore(admin): export ContentHub, PagePanel, EntryTable from barrel"
```

---

### Task 9: Visual Verification

**Files:** None (read-only verification)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Server starts on localhost

- [ ] **Step 2: Open /admin in browser and verify**

Verify the following:
1. Tab bar shows all pages with WYSIWYG labels (labels match exactly what's in Convex — no case transformation)
2. Entry counts appear next to tabs that have data
3. Clicking a tab shows that page's content panel
4. Page controls (visible/hidden, in nav/not in nav) toggle correctly
5. Color strip appears for Works, Talks, Gallery tabs
6. Particle toggle + preset chips work (multi-select)
7. Entry table shows entries with color dots, title, metadata
8. "edit" expands inline, "visible"/"hidden" toggles entry visibility
9. "+ New Page" opens inline form with WYSIWYG label input
10. Creating a new page adds a tab immediately
11. SettingsDrawer opens and works as before
12. Section composer shows sections list and "Open full composer" link works

- [ ] **Step 3: Verify WYSIWYG string contract**

1. Check that `re:mix` tab displays as lowercase `re:mix` (or whatever the stored label is)
2. Create a new page with mixed case (e.g., "My Test") — verify the tab shows exactly "My Test"
3. Verify the same string appears in the page heading and the public site nav

- [ ] **Step 4: Run existing admin tests**

Run: `npx playwright test tests/e2e/admin.spec.ts`
Expected: Tests pass (may need minor selector updates if tests target PageGrid directly)

- [ ] **Step 5: Commit any test fixes**

```bash
git add tests/
git commit -m "test(admin): update selectors for ContentHub landing"
```

---

### Task 10: Integration Smoke Test

- [ ] **Step 1: Run full test suite**

Run: `npx playwright test`
Expected: All existing tests pass

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit --skipLibCheck`
Expected: Clean output

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address integration issues from admin content hub"
```
