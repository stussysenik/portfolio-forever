<script lang="ts">
	import { AdminToggle, AdminChipGroup, BoxModelDiagram } from '$lib/admin/primitives';
	import { stripConvexMeta } from '$lib/admin/constants';
	import { toast } from '$lib/stores/toast';
	import AdminIcon from '$lib/admin/AdminIcon.svelte';
	import { IconArrowUp, IconArrowDown, IconX } from '$lib/admin/admin-icons';

	// Props
	export let section: any = null;
	export let pageId: string = '';
	export let sectionIndex: number = 0;
	export let page: any = null;
	export let client: any;
	export let api: any;

	// ── Spacing presets ──────────────────────────────────────────────────────
	const SPACING_PRESETS = [
		{ id: 'none', label: 'NONE' },
		{ id: 'sm',   label: 'SM'   },
		{ id: 'md',   label: 'MD'   },
		{ id: 'lg',   label: 'LG'   },
		{ id: 'xl',   label: 'XL'   },
	];

	const PRESET_PX: Record<string, number> = {
		none:  0,
		sm:   16,
		md:   32,
		lg:   48,
		xl:   64,
	};

	/** Map a raw pixel value back to a preset id, or fall back to 'none'. */
	function pxToPreset(px: number | undefined): string {
		const value = px ?? 0;
		for (const [id, px] of Object.entries(PRESET_PX)) {
			if (px === value) return id;
		}
		return 'none';
	}

	// ── Derived state ────────────────────────────────────────────────────────
	$: isVisible = section?.visible !== false;

	$: spacingBeforePreset = pxToPreset(section?.spacingBefore);
	$: spacingAfterPreset  = pxToPreset(section?.spacingAfter);

	$: margin  = section?.config?.margin  ?? { top: 0, right: 0, bottom: 0, left: 0 };
	$: padding = section?.config?.padding ?? { top: 0, right: 0, bottom: 0, left: 0 };

	$: sections      = page?.sections ?? [];
	$: isFirst       = sectionIndex === 0;
	$: isLast        = sectionIndex >= sections.length - 1;

	// ── Handlers ─────────────────────────────────────────────────────────────

	/** 1. VISIBILITY */
	async function handleVisibilityToggle(e: CustomEvent<{ checked: boolean }>) {
		if (!page?.pageId) return;
		try {
			const updated = sections.map((s: any, i: number) =>
				i === sectionIndex ? { ...s, visible: e.detail.checked } : s
			);
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				sections: updated,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to update visibility');
		}
	}

	/** 2. SPACING — before */
	async function handleSpacingBefore(e: CustomEvent<{ value: string | string[] }>) {
		const id = Array.isArray(e.detail.value) ? e.detail.value[0] : e.detail.value;
		const spacingBefore = PRESET_PX[id] ?? 0;
		try {
			await client.mutation(api.pages.updateSectionSpacing, {
				pageId,
				sectionIndex,
				spacingBefore,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to update spacing before');
		}
	}

	/** 2. SPACING — after */
	async function handleSpacingAfter(e: CustomEvent<{ value: string | string[] }>) {
		const id = Array.isArray(e.detail.value) ? e.detail.value[0] : e.detail.value;
		const spacingAfter = PRESET_PX[id] ?? 0;
		try {
			await client.mutation(api.pages.updateSectionSpacing, {
				pageId,
				sectionIndex,
				spacingAfter,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to update spacing after');
		}
	}

	/** 3. BOX MODEL */
	async function handleBoxModelChange(
		e: CustomEvent<{ layer: 'margin' | 'padding'; side: string; value: number }>
	) {
		if (!page?.pageId) return;
		const { layer, side, value } = e.detail;
		const currentMargin  = section?.config?.margin  ?? { top: 0, right: 0, bottom: 0, left: 0 };
		const currentPadding = section?.config?.padding ?? { top: 0, right: 0, bottom: 0, left: 0 };

		const newConfig =
			layer === 'margin'
				? { margin:  { ...currentMargin,  [side]: value }, padding: currentPadding }
				: { margin:  currentMargin, padding: { ...currentPadding, [side]: value } };

		try {
			await client.mutation(api.pages.updateSectionConfig, {
				pageId,
				sectionIndex,
				config: newConfig,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to update box model');
		}
	}

	/** 4. POSITION — move up */
	async function handleMoveUp() {
		if (isFirst || !page?.pageId) return;
		try {
			const sorted = [...sections].sort((a: any, b: any) => a.order - b.order);
			const reordered = sorted.map((s: any, i: number) => {
				if (i === sectionIndex - 1) return { ...s, order: sectionIndex };
				if (i === sectionIndex)     return { ...s, order: sectionIndex - 1 };
				return s;
			});
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				sections: reordered,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to move section up');
		}
	}

	/** 4. POSITION — move down */
	async function handleMoveDown() {
		if (isLast || !page?.pageId) return;
		try {
			const sorted = [...sections].sort((a: any, b: any) => a.order - b.order);
			const reordered = sorted.map((s: any, i: number) => {
				if (i === sectionIndex)     return { ...s, order: sectionIndex + 1 };
				if (i === sectionIndex + 1) return { ...s, order: sectionIndex };
				return s;
			});
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				sections: reordered,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to move section down');
		}
	}

	/** 4. POSITION — remove */
	async function handleRemove() {
		if (!page?.pageId) return;
		const confirmed = window.confirm(
			'Remove this section? This cannot be undone.'
		);
		if (!confirmed) return;
		try {
			const filtered = sections
				.filter((_: any, i: number) => i !== sectionIndex)
				.map((s: any, i: number) => ({ ...s, order: i }));
			await client.mutation(api.pages.upsert, {
				...stripConvexMeta(page),
				sections: filtered,
			});
		} catch (err: any) {
			toast.error(err.message || 'Failed to remove section');
		}
	}
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     LAYOUT Bookmark — visibility · spacing · box model · position
════════════════════════════════════════════════════════════════════════════ -->
<div class="layout-bookmark">

	<!-- 1. VISIBILITY ─────────────────────────────────────────────────────── -->
	<div class="group">
		<div class="group-label">VISIBILITY</div>
		<div class="row row--spread">
			<span class="control-label">VISIBLE</span>
			<AdminToggle
				checked={isVisible}
				color="green"
				size="sm"
				label="Toggle section visibility"
				on:change={handleVisibilityToggle}
			/>
		</div>
	</div>

	<!-- 2. SPACING ──────────────────────────────────────────────────────────── -->
	<div class="group">
		<div class="group-label">SPACING</div>

		<div class="spacing-row">
			<span class="control-label">BEFORE</span>
			<AdminChipGroup
				options={SPACING_PRESETS}
				value={spacingBeforePreset}
				mode="exclusive"
				color="blue"
				on:change={handleSpacingBefore}
			/>
		</div>

		<div class="spacing-row spacing-row--mt">
			<span class="control-label">AFTER</span>
			<AdminChipGroup
				options={SPACING_PRESETS}
				value={spacingAfterPreset}
				mode="exclusive"
				color="blue"
				on:change={handleSpacingAfter}
			/>
		</div>
	</div>

	<!-- 3. BOX MODEL ────────────────────────────────────────────────────────── -->
	<div class="group">
		<div class="group-label">BOX MODEL</div>
		<BoxModelDiagram
			{margin}
			{padding}
			label={section?.sectionType?.toUpperCase() ?? 'SECTION'}
			on:change={handleBoxModelChange}
		/>
	</div>

	<!-- 4. POSITION ─────────────────────────────────────────────────────────── -->
	<div class="group">
		<div class="group-label">POSITION</div>

		<div class="position-row">
			<button
				class="pos-btn"
				disabled={isFirst}
				on:click={handleMoveUp}
				aria-label="Move section up"
			>
				<AdminIcon icon={IconArrowUp} size="xs" tone="inherit" />
				MOVE UP
			</button>

			<button
				class="pos-btn"
				disabled={isLast}
				on:click={handleMoveDown}
				aria-label="Move section down"
			>
				<AdminIcon icon={IconArrowDown} size="xs" tone="inherit" />
				MOVE DOWN
			</button>
		</div>

		<div class="position-row position-row--mt">
			<button
				class="pos-btn pos-btn--danger"
				on:click={handleRemove}
				aria-label="Remove section"
			>
				<AdminIcon icon={IconX} size="xs" tone="inherit" />
				REMOVE SECTION
			</button>
		</div>
	</div>

</div>

<style>
	/* ── Outer container ─────────────────────────────────────────────────── */
	.layout-bookmark {
		display: flex;
		flex-direction: column;
	}

	/* ── Group (divider pattern) ─────────────────────────────────────────── */
	.group {
		border-top: 1px solid var(--border-color-subtle);
		padding: var(--admin-space-3, 12px) var(--admin-space-4, 16px);
	}

	.group-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		font-weight: 600;
		margin-bottom: 8px;
	}

	/* ── Shared row utilities ────────────────────────────────────────────── */
	.row {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
	}

	.row--spread {
		justify-content: space-between;
	}

	.control-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	/* ── Spacing rows ────────────────────────────────────────────────────── */
	.spacing-row {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.spacing-row--mt {
		margin-top: var(--admin-space-3, 12px);
	}

	/* ── Position button rows ────────────────────────────────────────────── */
	.position-row {
		display: flex;
		gap: var(--admin-space-2, 8px);
	}

	.position-row--mt {
		margin-top: var(--admin-space-2, 8px);
	}

	/* ── Position buttons ────────────────────────────────────────────────── */
	.pos-btn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		min-height: var(--admin-touch-min, 44px);
		padding: 0 var(--admin-space-3, 12px);
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		background: transparent;
		border: 1px solid var(--border-color-subtle);
		border-radius: 3px;
		cursor: pointer;
		transition: color var(--admin-transition, 120ms ease),
		            border-color var(--admin-transition, 120ms ease),
		            background var(--admin-transition, 120ms ease);
		flex: 1;
		justify-content: center;
	}

	.pos-btn:hover:not(:disabled) {
		color: var(--color-text);
		border-color: color-mix(in srgb, var(--color-text) 40%, transparent);
		background: color-mix(in srgb, var(--color-text) 5%, transparent);
	}

	.pos-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	/* Danger / remove button */
	.pos-btn--danger {
		color: var(--color-danger, #ef4444);
		border-color: color-mix(in oklch, #ef4444 40%, transparent);
	}

	.pos-btn--danger:hover:not(:disabled) {
		color: var(--color-danger, #ef4444);
		border-color: var(--color-danger, #ef4444);
		background: color-mix(in oklch, #ef4444 8%, transparent);
	}
</style>
