<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { AdminSlider, AdminChipGroup, ChangeBadge, ResetButton } from '$lib/admin/primitives';
	import { TYPOGRAPHY_DEFAULTS } from '$lib/admin/constants';

	export let fontSize: number = TYPOGRAPHY_DEFAULTS.fontSize;
	export let fontWeight: number = TYPOGRAPHY_DEFAULTS.fontWeight;
	export let letterSpacing: number = TYPOGRAPHY_DEFAULTS.letterSpacing;
	export let lineHeight: number = TYPOGRAPHY_DEFAULTS.lineHeight;
	export let defaults = TYPOGRAPHY_DEFAULTS;
	export let timestamp: number | null = null;

	const dispatch = createEventDispatcher<{
		change: { field: string; value: number | string };
		reset: void;
	}>();

	$: isDefault = fontSize === defaults.fontSize
		&& fontWeight === defaults.fontWeight
		&& Math.abs(letterSpacing - defaults.letterSpacing) < 0.001
		&& Math.abs(lineHeight - defaults.lineHeight) < 0.01;

	const WEIGHT_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => ({
		id: String(w),
		label: String(w),
	}));

	function getSingleValue(value: string | string[]): string {
		return Array.isArray(value) ? value[0] ?? '' : value;
	}
</script>

<div class="typography-controls">
	<div class="control-header">
		<span class="field-label">TYPOGRAPHY</span>
		<ChangeBadge {timestamp} {isDefault} />
		<ResetButton visible={!isDefault} on:reset={() => dispatch('reset')} />
	</div>

	<AdminSlider
		label="SIZE"
		value={fontSize}
		min={0.5}
		max={6}
		step={0.125}
		width="fill"
		format={(v) => v + 'rem'}
		showReset={fontSize !== defaults.fontSize}
		resetValue={defaults.fontSize}
		on:change={(e) => dispatch('change', { field: 'fontSize', value: e.detail.value })}
	/>

	<div class="weight-row">
		<span class="field-label">WEIGHT</span>
		<AdminChipGroup
			options={WEIGHT_OPTIONS}
			value={String(fontWeight)}
			on:change={(e) => dispatch('change', { field: 'fontWeight', value: parseInt(getSingleValue(e.detail.value), 10) })}
		/>
	</div>

	<AdminSlider
		label="TRACKING"
		value={letterSpacing}
		min={-0.1}
		max={0.3}
		step={0.01}
		width="fill"
		format={(v) => v.toFixed(2) + 'em'}
		showReset={Math.abs(letterSpacing - defaults.letterSpacing) > 0.001}
		resetValue={defaults.letterSpacing}
		on:change={(e) => dispatch('change', { field: 'letterSpacing', value: e.detail.value })}
	/>

	<AdminSlider
		label="LEADING"
		value={lineHeight}
		min={0.8}
		max={2.5}
		step={0.05}
		width="fill"
		format={(v) => v.toFixed(2)}
		showReset={Math.abs(lineHeight - defaults.lineHeight) > 0.01}
		resetValue={defaults.lineHeight}
		on:change={(e) => dispatch('change', { field: 'lineHeight', value: e.detail.value })}
	/>
</div>

<style>
	.typography-controls {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.control-header {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.control-header .field-label {
		flex: 1;
	}

	.field-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.weight-row {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
</style>
