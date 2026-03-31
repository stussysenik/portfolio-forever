<script lang="ts">
	export let streams: { name: string; count: number; color: string }[] = [];

	$: maxCount = Math.max(...streams.map((s) => s.count), 1);
</script>

<div class="streams-cell">
	{#each streams as stream}
		<div class="stream-row">
			<span class="stream-dot" style="background: {stream.color}"></span>
			<span class="stream-name">{stream.name}</span>
			<div class="stream-bar-track">
				<div
					class="stream-bar-fill"
					style="width: {(stream.count / maxCount) * 100}%; background: {stream.color}"
				></div>
			</div>
			<span class="stream-count">{stream.count}</span>
		</div>
	{/each}

	{#if streams.length === 0}
		<div class="streams-empty">No data</div>
	{/if}
</div>

<style>
	.streams-cell {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.stream-row {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 2px 0;
	}

	.stream-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.stream-name {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		min-width: 40px;
		white-space: nowrap;
	}

	.stream-bar-track {
		flex: 1;
		height: 4px;
		background: var(--border-color-subtle);
		border-radius: 2px;
		overflow: hidden;
	}

	.stream-bar-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 160ms ease;
	}

	.stream-count {
		font-family: var(--font-mono);
		font-size: 7px;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
		min-width: 20px;
		text-align: right;
	}

	.streams-empty {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle);
		text-align: center;
		padding: 8px;
	}
</style>
