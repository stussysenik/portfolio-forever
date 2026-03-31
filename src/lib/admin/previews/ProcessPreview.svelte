<script lang="ts">
	/* Static preview — no props needed */
</script>

<div class="process-preview">
	<div class="process-step">
		<div class="process-circle">
			<span class="process-abbr">IMG</span>
		</div>
		<span class="process-label">Imagine</span>
	</div>

	<span class="process-arrow">&rarr;</span>

	<div class="process-step">
		<div class="process-circle">
			<span class="process-abbr">RTK</span>
		</div>
		<span class="process-label">Re-think</span>
	</div>

	<span class="process-arrow">&rarr;</span>

	<div class="process-step">
		<div class="process-circle">
			<span class="process-abbr">SHP</span>
		</div>
		<span class="process-label">Ship</span>
	</div>

	<span class="process-loop">&#8617;</span>
</div>

<style>
	.process-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 8px 4px;
	}

	.process-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}

	.process-circle {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1.5px solid var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg);
		transition: border-color 160ms ease, background 160ms ease;
	}

	.process-step:hover .process-circle {
		border-color: var(--bento-blue, #2563EB);
		background: color-mix(in oklch, var(--bento-blue, #2563EB), transparent 92%);
	}

	.process-abbr {
		font-family: var(--font-mono);
		font-size: 7px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.process-step:hover .process-abbr {
		color: var(--bento-blue, #2563EB);
	}

	.process-label {
		font-family: var(--font-mono);
		font-size: 7px;
		color: var(--color-text-subtle);
		white-space: nowrap;
	}

	.process-arrow {
		font-size: 10px;
		color: var(--color-text-subtle);
		flex-shrink: 0;
		margin-top: -12px;
	}

	.process-loop {
		font-size: 12px;
		color: var(--color-text-subtle);
		margin-left: -2px;
		margin-top: -12px;
		transform: scaleX(-1);
	}
</style>
