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
		padding: 6px 6px;
		min-height: 28px;
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
