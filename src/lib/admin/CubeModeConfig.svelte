<script lang="ts">
	import { AdminSlider } from '$lib/admin/primitives';
	import { toast } from '$lib/stores/toast';
	import { stripConvexMeta } from '$lib/admin/constants';
	import { sectionTypeRegistry } from '$lib/sections/registry';

	type FaceId = 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom';

	export let page: any = null;
	export let client: any;
	export let api: any;

	const FACE_ORDER: FaceId[] = ['front', 'right', 'back', 'left', 'top', 'bottom'];

	$: sections = page?.sections ?? [];
	$: cubeFaces = page?.themeOverrides?.cubeFaces ?? {};
	$: cubeSettings = page?.themeOverrides?.cubeSettings ?? { size: 500, rotationSpeed: 0.4 };

	$: visibleSections = sections
		.filter((s: any) => s.visible !== false)
		.sort((a: any, b: any) => a.order - b.order);

	function getSectionLabel(sectionType: string): string {
		return sectionTypeRegistry[sectionType]?.label ?? sectionType;
	}

	async function persistThemeOverrides(overrides: Record<string, any>) {
		if (!page?.pageId) return;
		try {
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				themeOverrides: overrides,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to update cube config');
		}
	}

	function handleFaceChange(face: FaceId, value: string) {
		const updatedFaces = { ...cubeFaces };
		if (value === '') {
			delete updatedFaces[face];
		} else {
			updatedFaces[face] = value;
		}
		persistThemeOverrides({ ...(page?.themeOverrides ?? {}), cubeFaces: updatedFaces });
	}

	function handleSizeChange(e: CustomEvent<{ value: number }>) {
		const settings = { ...cubeSettings, size: e.detail.value };
		persistThemeOverrides({ ...(page?.themeOverrides ?? {}), cubeSettings: settings });
	}

	function handleSpeedChange(e: CustomEvent<{ value: number }>) {
		const settings = { ...cubeSettings, rotationSpeed: e.detail.value };
		persistThemeOverrides({ ...(page?.themeOverrides ?? {}), cubeSettings: settings });
	}
</script>

<div class="cube-config">
	<span class="admin-label admin-label--xs">CUBE MODE</span>

	<div class="face-grid">
		{#each FACE_ORDER as face (face)}
			<div class="face-slot">
				<label class="face-label" for="cube-face-{face}">{face.toUpperCase()}</label>
				<select
					id="cube-face-{face}"
					class="face-select"
					value={cubeFaces[face] ?? ''}
					on:change={(e) => handleFaceChange(face, e.currentTarget.value)}
				>
					<option value="">Auto</option>
					{#each visibleSections as section (section.order)}
						<option value={section.sectionType}>{getSectionLabel(section.sectionType)}</option>
					{/each}
				</select>
			</div>
		{/each}
	</div>

	<AdminSlider
		label="SIZE"
		value={cubeSettings.size}
		min={300}
		max={800}
		step={10}
		width="fill"
		format={(v) => v + 'px'}
		showReset={cubeSettings.size !== 500}
		resetValue={500}
		on:change={handleSizeChange}
	/>

	<AdminSlider
		label="SPEED"
		value={cubeSettings.rotationSpeed}
		min={0.1}
		max={1.0}
		step={0.05}
		width="fill"
		format={(v) => v.toFixed(2) + 'x'}
		showReset={Math.abs(cubeSettings.rotationSpeed - 0.4) > 0.001}
		resetValue={0.4}
		on:change={handleSpeedChange}
	/>
</div>

<style>
	.cube-config {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-2, 8px);
	}

	.face-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--admin-space-1, 4px);
	}

	.face-slot {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.face-label {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle);
	}

	.face-select {
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 3px 4px;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		background: var(--color-bg, #0a0a0a);
		color: var(--color-text);
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
		line-height: 1.2;
	}

	.face-select:hover {
		border-color: var(--border-color);
	}

	.face-select:focus {
		outline: none;
		border-color: var(--bento-blue, #2563eb);
	}
</style>
