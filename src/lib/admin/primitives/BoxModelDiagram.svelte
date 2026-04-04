<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';

	export let margin: { top: number; right: number; bottom: number; left: number } = { top: 0, right: 0, bottom: 0, left: 0 };
	export let padding: { top: number; right: number; bottom: number; left: number } = { top: 0, right: 0, bottom: 0, left: 0 };
	export let label: string = 'SECTION';

	const dispatch = createEventDispatcher<{
		change: { layer: 'margin' | 'padding'; side: string; value: number };
	}>();

	let editingKey: string | null = null;
	let editValue: string = '';
	let activeInput: HTMLInputElement | null = null;

	async function startEdit(layer: 'margin' | 'padding', side: string, currentValue: number) {
		editingKey = `${layer}.${side}`;
		editValue = String(currentValue);
		await tick();
		activeInput?.focus();
		activeInput?.select();
	}

	function commitEdit() {
		if (!editingKey) return;
		const [layer, side] = editingKey.split('.') as ['margin' | 'padding', string];
		const parsed = parseInt(editValue, 10);
		if (!isNaN(parsed) && parsed >= 0) {
			dispatch('change', { layer, side, value: parsed });
		}
		editingKey = null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commitEdit();
		if (e.key === 'Escape') editingKey = null;
	}

	function getValue(layer: 'margin' | 'padding', side: string): number {
		const obj = layer === 'margin' ? margin : padding;
		return (obj as any)[side] ?? 0;
	}

	function isEditing(layer: string, side: string): boolean {
		return editingKey === `${layer}.${side}`;
	}
</script>

<div class="box-model-inspector">
	<!-- Margin layer (outer) -->
	<div class="layer margin-layer">
		<span class="layer-label margin-label">margin</span>

		<!-- Margin top -->
		<div class="edge edge-top">
			{#if isEditing('margin', 'top')}
				<input class="edge-input margin-input" type="number" min="0" step="4"
					bind:this={activeInput} bind:value={editValue} on:blur={commitEdit} on:keydown={handleKeydown} />
			{:else}
				<button class="edge-value margin-value" on:click={() => startEdit('margin', 'top', margin.top)}>
					{margin.top}
				</button>
			{/if}
		</div>

		<!-- Margin left -->
		<div class="edge edge-left">
			{#if isEditing('margin', 'left')}
				<input class="edge-input margin-input" type="number" min="0" step="4"
					bind:this={activeInput} bind:value={editValue} on:blur={commitEdit} on:keydown={handleKeydown} />
			{:else}
				<button class="edge-value margin-value" on:click={() => startEdit('margin', 'left', margin.left)}>
					{margin.left}
				</button>
			{/if}
		</div>

		<!-- Margin right -->
		<div class="edge edge-right">
			{#if isEditing('margin', 'right')}
				<input class="edge-input margin-input" type="number" min="0" step="4"
					bind:this={activeInput} bind:value={editValue} on:blur={commitEdit} on:keydown={handleKeydown} />
			{:else}
				<button class="edge-value margin-value" on:click={() => startEdit('margin', 'right', margin.right)}>
					{margin.right}
				</button>
			{/if}
		</div>

		<!-- Margin bottom -->
		<div class="edge edge-bottom">
			{#if isEditing('margin', 'bottom')}
				<input class="edge-input margin-input" type="number" min="0" step="4"
					bind:this={activeInput} bind:value={editValue} on:blur={commitEdit} on:keydown={handleKeydown} />
			{:else}
				<button class="edge-value margin-value" on:click={() => startEdit('margin', 'bottom', margin.bottom)}>
					{margin.bottom}
				</button>
			{/if}
		</div>

		<!-- Padding layer (inner) -->
		<div class="layer padding-layer">
			<span class="layer-label padding-label">padding</span>

			<!-- Padding top -->
			<div class="edge edge-top">
				{#if isEditing('padding', 'top')}
					<input class="edge-input padding-input" type="number" min="0" step="4"
						bind:this={activeInput} bind:value={editValue} on:blur={commitEdit} on:keydown={handleKeydown} />
				{:else}
					<button class="edge-value padding-value" on:click={() => startEdit('padding', 'top', padding.top)}>
						{padding.top}
					</button>
				{/if}
			</div>

			<!-- Padding left -->
			<div class="edge edge-left">
				{#if isEditing('padding', 'left')}
					<input class="edge-input padding-input" type="number" min="0" step="4"
						bind:this={activeInput} bind:value={editValue} on:blur={commitEdit} on:keydown={handleKeydown} />
				{:else}
					<button class="edge-value padding-value" on:click={() => startEdit('padding', 'left', padding.left)}>
						{padding.left}
					</button>
				{/if}
			</div>

			<!-- Padding right -->
			<div class="edge edge-right">
				{#if isEditing('padding', 'right')}
					<input class="edge-input padding-input" type="number" min="0" step="4"
						bind:this={activeInput} bind:value={editValue} on:blur={commitEdit} on:keydown={handleKeydown} />
				{:else}
					<button class="edge-value padding-value" on:click={() => startEdit('padding', 'right', padding.right)}>
						{padding.right}
					</button>
				{/if}
			</div>

			<!-- Padding bottom -->
			<div class="edge edge-bottom">
				{#if isEditing('padding', 'bottom')}
					<input class="edge-input padding-input" type="number" min="0" step="4"
						bind:this={activeInput} bind:value={editValue} on:blur={commitEdit} on:keydown={handleKeydown} />
				{:else}
					<button class="edge-value padding-value" on:click={() => startEdit('padding', 'bottom', padding.bottom)}>
						{padding.bottom}
					</button>
				{/if}
			</div>

			<!-- Content zone (innermost) -->
			<div class="content-zone">
				<span class="content-label">{label}</span>
			</div>
		</div>
	</div>
</div>

<style>
	.box-model-inspector {
		font-family: var(--font-mono);
		user-select: none;
	}

	/* Shared layer styles — nested boxes */
	.layer {
		position: relative;
		display: grid;
		grid-template-areas:
			".    top    ."
			"left center right"
			".    bottom .";
		grid-template-columns: 32px 1fr 32px;
		grid-template-rows: 22px 1fr 22px;
		min-height: 0;
	}

	.margin-layer {
		background: rgba(246, 178, 107, 0.3);
		border: 1px dashed rgba(246, 178, 107, 0.7);
		border-radius: 4px;
	}

	.padding-layer {
		grid-area: center;
		background: rgba(147, 196, 125, 0.3);
		border: 1px dashed rgba(147, 196, 125, 0.7);
		border-radius: 3px;
	}

	.content-zone {
		grid-area: center;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(140, 181, 217, 0.35);
		border: 1px dashed rgba(140, 181, 217, 0.7);
		border-radius: 2px;
		min-height: 28px;
		padding: 4px;
	}

	.content-label {
		font-size: 8px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-text-subtle, #737373);
	}

	/* Layer labels */
	.layer-label {
		position: absolute;
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		z-index: 1;
		pointer-events: none;
	}

	.margin-label {
		top: 2px;
		left: 4px;
		color: rgba(200, 130, 60, 0.7);
	}

	.padding-label {
		top: 2px;
		left: 4px;
		color: rgba(100, 160, 80, 0.7);
	}

	/* Edge value positions */
	.edge {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.edge-top { grid-area: top; }
	.edge-bottom { grid-area: bottom; }
	.edge-left { grid-area: left; }
	.edge-right { grid-area: right; }

	/* Clickable value buttons */
	.edge-value {
		all: unset;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 10px;
		font-variant-numeric: tabular-nums;
		padding: 1px 3px;
		border-radius: 2px;
		transition: background 100ms ease;
		min-width: 16px;
		text-align: center;
	}

	.margin-value {
		color: rgb(200, 130, 60);
	}

	.margin-value:hover {
		background: rgba(246, 178, 107, 0.25);
	}

	.padding-value {
		color: rgb(100, 160, 80);
	}

	.padding-value:hover {
		background: rgba(147, 196, 125, 0.25);
	}

	/* Inline edit inputs */
	.edge-input {
		width: 36px;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 10px;
		background: var(--color-bg, #fff);
		border-radius: 2px;
		padding: 1px 3px;
		outline: none;
		appearance: textfield;
		-moz-appearance: textfield;
	}

	.margin-input {
		color: rgb(200, 130, 60);
		border: 1px solid rgba(246, 178, 107, 0.7);
	}

	.padding-input {
		color: rgb(100, 160, 80);
		border: 1px solid rgba(147, 196, 125, 0.7);
	}

	.edge-input::-webkit-outer-spin-button,
	.edge-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
