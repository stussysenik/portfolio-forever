<script lang="ts">
	import { api } from "../../../convex/_generated/api.js";
	import { getConvexClient } from "../convex";
	import { toast } from "../stores/toast";

	export let assets: any[] = [];

	let editingId: string | null = null;
	let editFields: any = {};

	function startEdit(asset: any) {
		editingId = asset._id;
		editFields = { ...asset };
	}

	async function saveEdit() {
		if (!editingId) return;
		try {
			const client = getConvexClient();
			await client?.mutation(api.mediaAssets.update, {
				id: editingId as any,
				...editFields
			});
			toast.success("Asset updated");
			editingId = null;
		} catch (e) {
			toast.error("Failed to update asset");
		}
	}

	async function toggleVisibility(asset: any) {
		try {
			const client = getConvexClient();
			await client?.mutation(api.mediaAssets.update, {
				id: asset._id,
				visible: !asset.visible
			});
			toast.success(asset.visible ? "Hidden" : "Published");
		} catch (e) {
			toast.error("Failed to toggle visibility");
		}
	}

	async function deleteAsset(id: string) {
		if (!confirm("Are you sure?")) return;
		try {
			const client = getConvexClient();
			await client?.mutation(api.mediaAssets.remove, { id: id as any });
			toast.success("Asset removed");
		} catch (e) {
			toast.error("Failed to remove asset");
		}
	}
</script>

<div class="media-admin">
	<div class="media-admin__actions">
		<button class="btn btn-primary">Add Asset (WIP)</button>
	</div>

	<div class="media-grid">
		{#each assets as asset (asset._id)}
			<div class="asset-card" class:editing={editingId === asset._id}>
				<div class="asset-card__preview">
					{#if asset.type === 'photo' || asset.type === 'gif'}
						<img src={asset.url} alt={asset.title} />
					{:else if asset.type === 'video'}
						<div class="video-placeholder">Video: {asset.muxPlaybackId || 'No ID'}</div>
					{/if}
				</div>
				
				<div class="asset-card__content">
					{#if editingId === asset._id}
						<input type="text" bind:value={editFields.title} placeholder="Title" />
						<select bind:value={editFields.type}>
							<option value="photo">Photo</option>
							<option value="video">Video</option>
							<option value="gif">GIF</option>
							<option value="lottie">Lottie</option>
							<option value="embed">Embed</option>
						</select>
						<input type="text" bind:value={editFields.url} placeholder="URL" />
						<div class="edit-actions">
							<button on:click={saveEdit}>Save</button>
							<button on:click={() => editingId = null}>Cancel</button>
						</div>
					{:else}
						<div class="asset-card__info">
							<strong>{asset.title}</strong>
							<span>{asset.type} • {asset.visible ? 'Visible' : 'Hidden'}</span>
						</div>
						<div class="asset-card__actions">
							<button on:click={() => startEdit(asset)}>Edit</button>
							<button on:click={() => toggleVisibility(asset)}>
								{asset.visible ? 'Hide' : 'Show'}
							</button>
							<button class="delete" on:click={() => deleteAsset(asset._id)}>Delete</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.media-admin {
		display: grid;
		gap: 1.5rem;
	}

	.media-admin__actions {
		display: flex;
		justify-content: flex-end;
	}

	.media-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.asset-card {
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 0.75rem;
		overflow: hidden;
		background: white;
		display: flex;
		flex-direction: column;
	}

	.asset-card__preview {
		aspect-ratio: 16/9;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.asset-card__preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.video-placeholder {
		font-size: 0.8rem;
		color: rgba(15, 23, 42, 0.5);
	}

	.asset-card__content {
		padding: 1rem;
		display: grid;
		gap: 0.5rem;
	}

	.asset-card__info {
		display: grid;
	}

	.asset-card__info strong {
		font-size: 0.95rem;
	}

	.asset-card__info span {
		font-size: 0.8rem;
		color: rgba(15, 23, 42, 0.5);
		text-transform: capitalize;
	}

	.asset-card__actions {
		display: flex;
		gap: 0.5rem;
	}

	.asset-card__actions button, .edit-actions button {
		flex: 1;
		padding: 0.4rem;
		font-size: 0.8rem;
		border: 1px solid rgba(15, 23, 42, 0.1);
		background: rgba(15, 23, 42, 0.03);
		border-radius: 0.4rem;
		cursor: pointer;
	}

	.asset-card__actions button:hover {
		background: rgba(15, 23, 42, 0.08);
	}

	.delete {
		color: #ef4444;
	}

	input, select {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 0.4rem;
		font: inherit;
		font-size: 0.9rem;
	}

	.edit-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.6rem 1rem;
		border-radius: 0.5rem;
		font: inherit;
		font-weight: 500;
		cursor: pointer;
		border: 1px solid rgba(15, 23, 42, 0.1);
	}

	.btn-primary {
		background: #0f172a;
		color: white;
		border-color: #0f172a;
	}
</style>
