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
	/* Shared admin styles come from admin-shared.css */
</style>
