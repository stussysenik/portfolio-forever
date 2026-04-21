<script lang="ts">
	import { onMount } from "svelte";
	import { api } from "../../../convex/_generated/api.js";
	import { getConvexClient } from "../convex";

	type HistoryEntry = {
		_id: string;
		_creationTime: number;
		table: string;
		field: string;
		oldValue: any;
		newValue: any;
		user?: string;
		timestamp: number;
	};

	let history: HistoryEntry[] = [];
	let loading = true;
	let error = "";

	onMount(async () => {
		const client = getConvexClient();
		if (!client) {
			error = "Convex client unavailable.";
			loading = false;
			return;
		}

		try {
			// Using query since onUpdate might be too heavy for history
			const data = await client.query(api.adminHistory.listRecent, { limit: 20 });
			history = data as HistoryEntry[];
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});

	function formatValue(val: any) {
		if (typeof val === "object" && val !== null) {
			return JSON.stringify(val);
		}
		return String(val);
	}
</script>

<div class="history-audit">
	<div class="history-header">
		<p class="history-eyebrow">Audit Lane</p>
		<h4>Change History</h4>
	</div>

	{#if loading}
		<p class="history-status">Loading audit trail…</p>
	{:else if error}
		<p class="history-status error">{error}</p>
	{:else if history.length === 0}
		<p class="history-status">No recorded changes yet.</p>
	{:else}
		<div class="history-list">
			{#each history as entry}
				<article class="history-item">
					<div class="history-item__meta">
						<span class="history-item__time">{new Date(entry.timestamp).toLocaleString()}</span>
						<span class="history-item__user">{entry.user ?? "system"}</span>
					</div>
					<div class="history-item__content">
						<strong>{entry.table}</strong> / <span>{entry.field}</span>
						<div class="history-item__values">
							<code class="old">{formatValue(entry.oldValue)}</code>
							<span class="arrow">→</span>
							<code class="new">{formatValue(entry.newValue)}</code>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	.history-audit {
		display: grid;
		gap: 1rem;
		padding: 1.2rem;
		background: var(--color-surface);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
	}

	.history-eyebrow {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
		margin: 0;
	}

	.history-header h4 {
		margin: 0.2rem 0 0;
		font-family: var(--font-display);
		letter-spacing: var(--letter-spacing-tight);
	}

	.history-status {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.history-status.error {
		color: #ef4444;
	}

	.history-list {
		display: grid;
		gap: 0.75rem;
		max-height: 400px;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.history-item {
		display: grid;
		gap: 0.4rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		background: var(--color-bg-alt);
		border-radius: var(--radius-sm);
	}

	.history-item__meta {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--color-text-muted);
	}

	.history-item__content {
		font-size: 0.85rem;
	}

	.history-item__content strong {
		color: var(--color-accent);
	}

	.history-item__values {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	code {
		padding: 0.2rem 0.4rem;
		border-radius: 2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 150px;
	}

	.old { background: #fee2e2; color: #991b1b; }
	.new { background: #dcfce7; color: #166534; }
	.arrow { color: var(--color-text-muted); }

	/* Custom Scrollbar */
	.history-list::-webkit-scrollbar {
		width: 4px;
	}
	.history-list::-webkit-scrollbar-track {
		background: transparent;
	}
	.history-list::-webkit-scrollbar-thumb {
		background: var(--border-color);
		border-radius: 10px;
	}
</style>
