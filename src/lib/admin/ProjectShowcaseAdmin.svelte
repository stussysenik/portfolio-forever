<script lang="ts">
	import { api } from "../../../convex/_generated/api.js";
	import { getConvexClient } from "../convex";
	import { toast } from "../stores/toast";

	export let showcases: any[] = [];
	export let assets: any[] = [];

	let editingId: string | null = null;
	let editFields: any = {};

	function startEdit(showcase: any) {
		editingId = showcase._id;
		editFields = { ...showcase };
	}

	async function saveEdit() {
		if (!editingId) return;
		try {
			const client = getConvexClient();
			await client?.mutation(api.projectShowcases.update, {
				id: editingId as any,
				...editFields
			});
			toast.success("Showcase updated");
			editingId = null;
		} catch (e) {
			toast.error("Failed to update showcase");
		}
	}

	async function deleteShowcase(id: string) {
		if (!confirm("Are you sure?")) return;
		try {
			const client = getConvexClient();
			await client?.mutation(api.projectShowcases.remove, { id: id as any });
			toast.success("Showcase removed");
		} catch (e) {
			toast.error("Failed to remove showcase");
		}
	}
</script>

<div class="showcase-admin">
	<div class="showcase-admin__actions">
		<button class="btn btn-primary">Add Showcase (WIP)</button>
	</div>

	<div class="showcase-list">
		{#each showcases as showcase (showcase._id)}
			<div class="showcase-card">
				<div class="showcase-card__header">
					<h3>{showcase.title}</h3>
					<span class="badge tier-{showcase.tier}">Tier {showcase.tier}</span>
				</div>
				<p>{showcase.tagline || 'No tagline'}</p>
				
				<div class="showcase-card__footer">
					<span>{showcase.media.length} assets • {showcase.visible ? 'Visible' : 'Hidden'}</span>
					<div class="actions">
						<button on:click={() => startEdit(showcase)}>Edit</button>
						<button class="delete" on:click={() => deleteShowcase(showcase._id)}>Delete</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.showcase-admin {
		display: grid;
		gap: 1.5rem;
	}

	.showcase-list {
		display: grid;
		gap: 1rem;
	}

	.showcase-card {
		padding: 1.5rem;
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 0.75rem;
		background: white;
		display: grid;
		gap: 0.5rem;
	}

	.showcase-card__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.showcase-card h3 {
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
	}

	.tier-1 { color: #2563eb; background: rgba(37, 99, 235, 0.1); }
	.tier-2 { color: #10b981; background: rgba(16, 185, 129, 0.1); }

	.showcase-card p {
		margin: 0;
		font-size: 0.9rem;
		color: rgba(15, 23, 42, 0.6);
	}

	.showcase-card__footer {
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
