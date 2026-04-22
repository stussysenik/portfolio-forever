<script lang="ts">
	import { api } from "../../../convex/_generated/api.js";
	import { getConvexClient } from "../convex";
	import { toast } from "../stores/toast";

	export let collections: any[] = [];
	export let assets: any[] = [];

	let editingId: string | null = null;
	let editFields: any = {};

	function startEdit(collection: any) {
		editingId = collection._id;
		editFields = { ...collection };
	}

	async function saveEdit() {
		if (!editingId) return;
		try {
			const client = getConvexClient();
			await client?.mutation(api.photoCollections.update, {
				id: editingId as any,
				...editFields
			});
			toast.success("Collection updated");
			editingId = null;
		} catch (e) {
			toast.error("Failed to update collection");
		}
	}

	async function deleteCollection(id: string) {
		if (!confirm("Are you sure?")) return;
		try {
			const client = getConvexClient();
			await client?.mutation(api.photoCollections.remove, { id: id as any });
			toast.success("Collection removed");
		} catch (e) {
			toast.error("Failed to remove collection");
		}
	}
</script>

<div class="collection-admin">
	<div class="collection-admin__actions">
		<button class="btn btn-primary">Add Collection (WIP)</button>
	</div>

	<div class="collection-list">
		{#each collections as collection (collection._id)}
			<div class="collection-card">
				<div class="collection-card__header">
					<h3>{collection.title}</h3>
					<span class="badge">{collection.layout}</span>
				</div>
				<p>{collection.description || 'No description'}</p>
				
				<div class="collection-card__footer">
					<span>{collection.assetIds.length} photos • {collection.visible ? 'Visible' : 'Hidden'}</span>
					<div class="actions">
						<button on:click={() => startEdit(collection)}>Edit</button>
						<button class="delete" on:click={() => deleteCollection(collection._id)}>Delete</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.collection-admin {
		display: grid;
		gap: 1.5rem;
	}

	.collection-list {
		display: grid;
		gap: 1rem;
	}

	.collection-card {
		padding: 1.5rem;
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 0.75rem;
		background: white;
		display: grid;
		gap: 0.5rem;
	}

	.collection-card__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.collection-card h3 {
		margin: 0;
		font-size: 1.1rem;
	}

	.badge {
		font-size: 0.7rem;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		background: rgba(15, 23, 42, 0.05);
		text-transform: uppercase;
		font-weight: 600;
		color: rgba(15, 23, 42, 0.5);
	}

	.collection-card p {
		margin: 0;
		font-size: 0.9rem;
		color: rgba(15, 23, 42, 0.6);
	}

	.collection-card__footer {
		margin-top: 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.8rem;
		color: rgba(15, 23, 42, 0.5);
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.actions button {
		padding: 0.4rem 0.8rem;
		border-radius: 0.4rem;
		border: 1px solid rgba(15, 23, 42, 0.1);
		background: rgba(15, 23, 42, 0.03);
		font: inherit;
		cursor: pointer;
	}

	.delete { color: #ef4444; }

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
