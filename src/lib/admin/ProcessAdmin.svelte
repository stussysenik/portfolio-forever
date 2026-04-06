<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let client: any;
	export let api: any;
	export let processConfig: any;
	export let compact: boolean = false;

	let editingPhases = false;
	let phasesBuffer: Array<{ label: string; description: string; order: number }> = [];
	let savingPhases = false;

	function startEditPhases() {
		phasesBuffer = (processConfig?.phases ?? []).map((p: any, i: number) => ({
			label: p.label || '',
			description: p.description || '',
			order: p.order ?? i,
		}));
		editingPhases = true;
	}

	function cancelEditPhases() {
		editingPhases = false;
		phasesBuffer = [];
	}

	function addPhase() {
		phasesBuffer = [
			...phasesBuffer,
			{ label: '', description: '', order: phasesBuffer.length },
		];
	}

	function removePhase(index: number) {
		phasesBuffer = phasesBuffer
			.filter((_, i) => i !== index)
			.map((p, i) => ({ ...p, order: i }));
	}

	function movePhase(index: number, direction: -1 | 1) {
		const target = index + direction;
		if (target < 0 || target >= phasesBuffer.length) return;
		const copy = [...phasesBuffer];
		[copy[index], copy[target]] = [copy[target], copy[index]];
		phasesBuffer = copy.map((p, i) => ({ ...p, order: i }));
	}

	async function savePhases() {
		savingPhases = true;
		try {
			const cleanPhases = phasesBuffer.map((p) => ({
				label: p.label,
				...(p.description ? { description: p.description } : {}),
				order: p.order,
			}));

			if (!processConfig?._id) {
				await client.mutation(api.process.upsertProcessConfig, {
					phases: cleanPhases,
					visible: true,
				});
			} else {
				await client.mutation(api.process.upsertProcessConfig, {
					id: processConfig._id,
					phases: cleanPhases,
				});
			}
			toast.success('Phases saved');
			editingPhases = false;
			phasesBuffer = [];
		} catch (err: any) {
			toast.error(err.message || 'Failed to save phases');
		} finally {
			savingPhases = false;
		}
	}

	async function initProcessConfig() {
		if (!processConfig) {
			await client.mutation(api.process.upsertProcessConfig, {
				phases: [
					{ label: 'IMAGINE', order: 0 },
					{ label: 'RE-THINK', order: 1 },
					{ label: 'SHIP', order: 2 },
				],
				visible: true,
			});
			toast.success('Process config initialized');
		}
	}
</script>

<section class="admin-section">
	{#if !compact}
	<div class="section-header">
		<h2 class="section-label">Process Cycle</h2>
		{#if !processConfig}
			<button class="btn-sm btn-add" on:click={initProcessConfig}>Initialize</button>
		{/if}
	</div>
	{/if}

	{#if processConfig}
		<div class="card">
			<!-- Phases list -->
			<div class="field-row">
				<span class="field-label">Phases</span>
				{#if !editingPhases}
					<div class="taglines-header">
						<span class="field-value">
							{(processConfig.phases ?? []).map((p: any) => p.label).join(' -> ') || '(none)'}
						</span>
						<button class="btn-sm" on:click={startEditPhases}>Edit</button>
					</div>
				{:else}
					<div class="taglines-list">
						{#each phasesBuffer as phase, i}
							<div class="tagline-row">
								<span class="phase-order">{i + 1}.</span>
								<input
									class="field-input"
									bind:value={phase.label}
									placeholder="Phase label"
									on:keydown={(e) => { if (e.key === 'Escape') cancelEditPhases(); }}
								/>
								<input
									class="field-input field-input--desc"
									bind:value={phase.description}
									placeholder="Description (optional)"
									on:keydown={(e) => { if (e.key === 'Escape') cancelEditPhases(); }}
								/>
								<div class="phase-actions">
									<button class="btn-sm" on:click={() => movePhase(i, -1)} disabled={i === 0} title="Move up" aria-label="Move up">&#8593;</button>
									<button class="btn-sm" on:click={() => movePhase(i, 1)} disabled={i === phasesBuffer.length - 1} title="Move down" aria-label="Move down">&#8595;</button>
									<button class="btn-sm btn-remove" on:click={() => removePhase(i)} title="Remove" aria-label="Remove">x</button>
								</div>
							</div>
						{/each}
					</div>
					<div class="taglines-footer">
						<button class="btn-sm btn-add" on:click={addPhase}>+ Add Phase</button>
						<div class="field-actions">
							<button class="btn-sm btn-save" on:click={savePhases} disabled={savingPhases}>Save</button>
							<button class="btn-sm" on:click={cancelEditPhases}>Cancel</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<p class="card" style="padding: var(--space-md); color: var(--color-text-muted);">Click "Initialize" to set up the process cycle content.</p>
	{/if}
</section>

<style>
	.phase-order {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted);
		min-width: 18px;
		flex-shrink: 0;
	}

	.field-input--desc {
		flex: 1.5;
	}

	.phase-actions {
		display: flex;
		gap: 2px;
		flex-shrink: 0;
	}

	/* Shared admin styles come from admin-shared.css */
</style>
