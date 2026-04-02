<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { AdminToggle } from '$lib/admin/primitives';
	import { FLAG_CATEGORIES } from '$lib/admin/constants';

	export let flags: any[] = [];
	export let client: any;
	export let api: any;

	const DEFAULT_FLAGS = [
		{ key: 'pixel-engine', label: 'Pixel Engine', category: 'visual' },
		{ key: 'ascii-donut', label: 'ASCII Donut', category: 'visual' },
		{ key: 'parallax', label: 'Parallax', category: 'visual' },
		{ key: 'view-transitions', label: 'View Trans.', category: 'visual' },
		{ key: 'wip-banner', label: 'WIP Banner', category: 'layout' },
		{ key: 'elevator', label: 'Elevator', category: 'visual' },
		{ key: 'terminal-matrix', label: 'Terminal Mtx', category: 'visual' },
		{ key: 'os-desktop', label: 'OS Desktop', category: 'visual' },
		{ key: 'social-links', label: 'Social Links', category: 'layout' },
		{ key: 'command-palette', label: 'Cmd Palette', category: 'layout' },
	];

	let activeCategoryIndex = 0;

	$: activeCategory = FLAG_CATEGORIES[activeCategoryIndex];
	$: categoryFlags = DEFAULT_FLAGS.filter((f) => (activeCategory.flags as readonly string[]).includes(f.key));

	function isEnabled(key: string): boolean {
		const flag = flags.find((f: any) => f.key === key);
		return flag ? flag.enabled : true;
	}

	async function toggle(key: string, category: string) {
		const newState = !isEnabled(key);
		try {
			await client.mutation(api.siteConfig.setFeatureFlag, {
				key,
				enabled: newState,
				category,
			});
			toast.success(`${key}: ${newState ? 'ON' : 'OFF'}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to toggle flag');
		}
	}
</script>

<div class="flags-cell">
	<!-- Step bar -->
	<div class="flag-step-bar">
		{#each FLAG_CATEGORIES as cat, i}
			<button
				class="flag-step-chip"
				class:active={i === activeCategoryIndex}
				class:done={i < activeCategoryIndex}
				on:click={() => (activeCategoryIndex = i)}
			>{cat.label}</button>
		{/each}
	</div>

	<!-- Flag toggles for active category -->
	{#each categoryFlags as flag}
		<div class="flag-row">
			<AdminToggle
				checked={isEnabled(flag.key)}
				size="sm"
				color="green"
				label={flag.label}
				on:change={() => toggle(flag.key, flag.category)}
			/>
			<span class="flag-name">{flag.label}</span>
		</div>
	{/each}

	<!-- Arrow nav -->
	<div class="flag-nav">
		<button
			class="flag-nav-arrow"
			disabled={activeCategoryIndex === 0}
			on:click={() => activeCategoryIndex--}
		>
			&larr; {activeCategoryIndex > 0 ? FLAG_CATEGORIES[activeCategoryIndex - 1].label : ''}
		</button>
		<div class="flag-dots">
			{#each FLAG_CATEGORIES as _, i}
				<span class="flag-dot" class:active={i === activeCategoryIndex}></span>
			{/each}
		</div>
		<button
			class="flag-nav-arrow"
			disabled={activeCategoryIndex === FLAG_CATEGORIES.length - 1}
			on:click={() => activeCategoryIndex++}
		>
			{activeCategoryIndex < FLAG_CATEGORIES.length - 1
				? FLAG_CATEGORIES[activeCategoryIndex + 1].label
				: ''} &rarr;
		</button>
	</div>
</div>

<style>
	.flags-cell {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	/* Step bar */
	.flag-step-bar {
		display: flex;
		flex-direction: row;
		gap: 2px;
		margin-bottom: 8px;
	}

	.flag-step-chip {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 2px 8px;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		color: var(--color-text-subtle);
		background: transparent;
		min-height: 18px;
		cursor: pointer;
		transition: all 120ms ease;
	}

	.flag-step-chip.active {
		border-color: var(--admin-blue, #2563EB);
		color: var(--color-text);
		background: rgba(37, 99, 235, 0.06);
	}

	.flag-step-chip.done {
		color: var(--admin-green, #44D62C);
		border-color: rgba(68, 214, 44, 0.2);
	}

	/* Flag rows */
	.flag-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 2px 0;
	}

	.flag-name {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
	}

	/* Arrow nav */
	.flag-nav {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 8px;
	}

	.flag-nav-arrow {
		font-family: var(--font-mono);
		font-size: 7px;
		padding: 2px 6px;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		color: var(--color-text-subtle);
		min-height: 18px;
		cursor: pointer;
		background: transparent;
		transition: all 120ms ease;
	}

	.flag-nav-arrow:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.flag-nav-arrow:hover:not(:disabled) {
		color: var(--color-text);
		border-color: var(--color-text-subtle);
	}

	/* Dots */
	.flag-dots {
		display: flex;
		flex-direction: row;
		gap: 4px;
		align-items: center;
	}

	.flag-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--border-color-subtle, #333);
	}

	.flag-dot.active {
		background: var(--admin-blue, #2563EB);
	}
</style>
