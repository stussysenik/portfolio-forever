<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import type { Id } from '$convex/_generated/dataModel';

	export let client: any;
	export let api: any;
	export let giftsConfig: any;

	let editingField: string | null = null;
	let editBuffer = '';
	let saving = false;

	function cancelEdit() { editingField = null; editBuffer = ''; }
	function a11yClick(handler: () => void) {
		return (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } };
	}

	async function saveGiftsEdit(field: string) {
		if (!giftsConfig?._id) {
			await client.mutation(api.gifts.upsertGiftsConfig, {
				[field]: editBuffer, visible: true,
			});
		} else {
			await client.mutation(api.gifts.upsertGiftsConfig, {
				id: giftsConfig._id, [field]: editBuffer,
			});
		}
		toast.success('Saved');
		editingField = null;
		editBuffer = '';
	}

	async function initGiftsConfig() {
		if (!giftsConfig) {
			await client.mutation(api.gifts.upsertGiftsConfig, {
				title: 'The Promise',
				manifesto: 'I build and design a lot of things with free value in mind. In return, you could send me kind gifts in the form of art supplies or film medium.',
				visible: true,
			});
			toast.success('Gifts config initialized');
		}
	}
</script>

<section class="admin-section">
	<div class="section-header">
		<h2 class="section-label">Gifts / The Promise</h2>
		{#if !giftsConfig}
			<button class="btn-sm btn-add" on:click={initGiftsConfig}>Initialize</button>
		{/if}
		<a href="/gifts" class="btn-sm" target="_blank">View &rarr;</a>
	</div>

	{#if giftsConfig}
		<div class="card">
			{#each [
				{ field: 'title', label: 'Title', value: giftsConfig.title },
				{ field: 'manifesto', label: 'Manifesto', value: giftsConfig.manifesto },
				{ field: 'contactEmail', label: 'Contact Email', value: giftsConfig.contactEmail || '' },
				{ field: 'callToAction', label: 'Call to Action', value: giftsConfig.callToAction || '' },
			] as item}
				<div class="field-row">
					<span class="field-label">{item.label}</span>
					{#if editingField === item.field}
						{#if item.field === 'manifesto'}
							<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveGiftsEdit(item.field); } if (e.key === 'Escape') cancelEdit(); }} rows="3"></textarea>
						{:else}
							<input class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveGiftsEdit(item.field); if (e.key === 'Escape') cancelEdit(); }} />
						{/if}
						<div class="field-actions">
							<button class="btn-sm btn-save" on:click={() => saveGiftsEdit(item.field)} disabled={saving}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
						</div>
					{:else}
						<span class="field-value" role="button" tabindex="0" on:click={() => { editingField = item.field; editBuffer = item.value || ''; }} on:keydown={a11yClick(() => { editingField = item.field; editBuffer = item.value || ''; })}>
							{item.value || '(empty)'}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<p class="card" style="padding: var(--space-md); color: var(--color-text-muted);">Click "Initialize" to set up the gifts page content.</p>
	{/if}
</section>

<style>
	/* Shared admin styles come from admin-shared.css */
</style>
