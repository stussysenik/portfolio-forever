<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';

	export let client: any;
	export let api: any;
	export let thumbnailConfigs: any[];

	function getThumbnailConfig(section: string) {
		return thumbnailConfigs.find((c: any) => c.section === section);
	}

	async function saveThumbnailConfig(section: string, field: string, value: any) {
		const existing = getThumbnailConfig(section);
		if (existing) {
			await client.mutation(api.thumbnails.upsertConfig, {
				id: existing._id, section, [field]: value,
			});
		} else {
			await client.mutation(api.thumbnails.upsertConfig, {
				section, displayMode: 'grid', showPreview: true, previewOnHover: true,
				[field]: value,
			});
		}
		toast.success('Thumbnail config saved');
	}
</script>

<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Thumbnail Settings</h2>
	</div>

	{#each ['works', 'academia'] as section}
		{@const config = getThumbnailConfig(section)}
		<div class="card card-compact" style="gap: var(--space-md); flex-wrap: wrap;">
			<span class="lang-name" style="min-width: 80px; text-transform: capitalize;">{section}</span>

			<label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-xs); color:var(--color-text-muted);">
				Mode:
				<select style="font-size:var(--font-size-xs); padding:2px 4px; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:var(--color-bg); color:var(--color-text);"
					on:change={(e) => saveThumbnailConfig(section, 'displayMode', e.currentTarget.value)}
				>
					{#each ['grid', 'list', 'carousel', 'masonry'] as mode}
						<option value={mode} selected={config?.displayMode === mode}>{mode}</option>
					{/each}
				</select>
			</label>

			<label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-xs); color:var(--color-text-muted);">
				<input type="checkbox" checked={config?.showPreview ?? true} on:change={(e) => saveThumbnailConfig(section, 'showPreview', e.currentTarget.checked)} />
				Show preview
			</label>

			<label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-xs); color:var(--color-text-muted);">
				<input type="checkbox" checked={config?.previewOnHover ?? true} on:change={(e) => saveThumbnailConfig(section, 'previewOnHover', e.currentTarget.checked)} />
				Preview on hover
			</label>
		</div>
	{/each}
</section>

<style>
	.admin-section {
		margin-bottom: var(--space-xl);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.section-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}

	.section-count {
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
		background: var(--color-bg-alt);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
	}

	.card {
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		margin-bottom: var(--space-sm);
		transition: border-color var(--duration-fast) var(--easing);
	}

	.card:hover {
		border-color: var(--border-color);
	}

	.card.hidden-entry {
		opacity: 0.5;
		border-style: dashed;
	}

	.card-compact {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
	}

	.card-header {
		margin-bottom: var(--space-sm);
	}

	.card-title-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.card-title {
		font-weight: 500;
		cursor: pointer;
	}

	.card-title:hover {
		color: var(--color-accent);
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		margin-top: var(--space-xs);
		padding-left: 52px;
	}

	.card-body {
		padding-left: 52px;
	}

	.card-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-sm);
	}

	.tool-tag {
		font-size: var(--font-size-xs);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		background: var(--color-bg-alt);
		color: var(--color-text-muted);
	}

	.reorder-btns {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.field-row {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.field-row:last-child {
		border-bottom: none;
	}

	.field-label {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		color: var(--color-text-muted);
		min-width: 70px;
		padding-top: 4px;
	}

	.field-value {
		flex: 1;
		cursor: pointer;
		padding: 2px 4px;
		border-radius: var(--radius-sm);
	}

	.field-value:hover {
		background: var(--color-bg-alt);
	}

	.field-input, .field-input-sm {
		font-family: inherit;
		font-size: inherit;
		padding: 4px 8px;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
		width: 100%;
	}

	.field-input:focus, .field-input-sm:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.field-input-sm {
		padding: 2px 6px;
		font-size: var(--font-size-sm);
	}

	textarea.field-input {
		resize: vertical;
		min-height: 60px;
	}

	.field-actions {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.highlights-editor {
		margin-top: var(--space-sm);
	}

	.highlight-row {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		margin-bottom: var(--space-xs);
	}

	.highlight-actions {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.lang-name {
		font-weight: 600;
		cursor: pointer;
	}

	.lang-name:hover {
		color: var(--color-accent);
	}

	.btn {
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		font-weight: 500;
		border: 1px solid var(--border-color);
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.btn:hover {
		border-color: var(--color-text-muted);
	}

	.btn-sm {
		padding: 2px 8px;
		font-size: var(--font-size-xs);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color-subtle);
		background: var(--color-bg);
		color: var(--color-text-muted);
		cursor: pointer;
	}

	.btn-save {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	.btn-add {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.btn-icon {
		padding: 2px 6px;
		font-size: var(--font-size-xs);
		border: none;
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
		border-radius: var(--radius-sm);
	}

	.btn-icon:hover {
		background: var(--color-bg-alt);
	}

	.btn-icon:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.btn-danger {
		color: var(--color-error);
	}

	.btn-danger:hover {
		background: color-mix(in oklch, var(--color-error), transparent 90%);
	}

	.flex-1 {
		flex: 1;
	}

	@media (max-width: 767px) {
		.card-compact {
			flex-direction: column;
			align-items: flex-start;
		}

		.card-body {
			padding-left: 0;
		}

		.card-meta {
			padding-left: 0;
			flex-wrap: wrap;
		}

		.section-header {
			flex-wrap: wrap;
		}
	}
</style>
