<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let client: any;
	export let api: any;
	export let siteConfigData: any;

	const allSections = [
		{ id: "hero", label: "Home" },
		{ id: "works", label: "Works" },
		{ id: "talks", label: "Talks" },
		{ id: "terminal", label: "Terminal" },
		{ id: "cv", label: "CV" },
		{ id: "academia", label: "Re:mix" },
		{ id: "blog", label: "Blog" },
		{ id: "process", label: "Process" },
		{ id: "gallery", label: "Gallery" },
		{ id: "likes", label: "Likes" },
		{ id: "minor", label: "Minor" },
		{ id: "gifts", label: "Gifts" },
		{ id: "os", label: "OS" },
	];

	$: currentOrder = siteConfigData?.sectionOrder || allSections.map(s => s.id);

	async function setSectionOrder(order: string[]) {
		await client.mutation(api.siteConfig.upsert, { sectionOrder: order });
		toast.success('Section order updated');
	}

	function moveSectionInOrder(sectionId: string, direction: number) {
		const order = [...currentOrder];
		const idx = order.indexOf(sectionId);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= order.length) return;
		[order[idx], order[swapIdx]] = [order[swapIdx], order[idx]];
		setSectionOrder(order);
	}
</script>

<section class="admin-section">
	<h2 class="section-label">Section Order</h2>
	<div class="card">
		{#each currentOrder as sectionId, idx}
			{@const meta = allSections.find(s => s.id === sectionId)}
			{#if meta}
				<div class="section-order-row">
					<div class="reorder-btns">
						<button class="btn-icon" on:click={() => moveSectionInOrder(sectionId, -1)} disabled={idx === 0}>↑</button>
						<button class="btn-icon" on:click={() => moveSectionInOrder(sectionId, 1)} disabled={idx === currentOrder.length - 1}>↓</button>
					</div>
					<span class="section-order-label">{meta.label}</span>
					<span class="section-order-id">{sectionId}</span>
				</div>
			{/if}
		{/each}
	</div>
</section>

<style>
	.admin-section {
		margin-bottom: var(--space-xl);
	}

	.section-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
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

	.reorder-btns {
		display: flex;
		flex-direction: column;
		gap: 1px;
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

	.section-order-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.section-order-row:last-child {
		border-bottom: none;
	}

	.section-order-label {
		font-weight: 500;
		flex: 1;
	}

	.section-order-id {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
	}
</style>
