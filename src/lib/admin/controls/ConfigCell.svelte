<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { AdminChipGroup, AdminSlider } from '$lib/admin/primitives';

	export let siteConfig: any;
	export let client: any;
	export let api: any;

	const MODES = ['multi-page', 'one-page', 'reader'] as const;
	$: mode = siteConfig?.mode ?? 'multi-page';
	$: parallax = siteConfig?.parallaxSpeed ?? 0.5;

	async function setMode(m: string) {
		try {
			await client.mutation(api.siteConfig.upsert, { mode: m });
			toast.success(`Mode: ${m}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to set mode');
		}
	}

	async function setParallax(speed: number) {
		try {
			await client.mutation(api.siteConfig.upsert, { parallaxSpeed: speed });
			toast.success(`Parallax: ${speed.toFixed(1)}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to set parallax');
		}
	}


</script>

<div class="config-cell">
	<!-- Mode -->
	<div class="config-section">
		<span class="config-label">Mode</span>
		<AdminChipGroup
			options={MODES.map(m => ({id: m, label: m}))}
			value={mode}
			mode="exclusive"
			color="blue"
			equalWidth={true}
			on:change={(e) => setMode(e.detail.value as string)}
		/>
	</div>

	<!-- Parallax -->
	<div class="config-section">
		<AdminSlider
			value={parallax}
			min={0}
			max={1}
			step={0.1}
			label="Parallax"
			format={(v) => v.toFixed(1)}
			width="compact"
			on:change={(e) => setParallax(e.detail.value)}
		/>
	</div>

</div>

<style>
	.config-cell {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.config-section {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.config-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}
</style>
