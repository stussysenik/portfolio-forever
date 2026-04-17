<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { AdminToggle, AdminChipGroup, AdminSlider } from '$lib/admin/primitives';
	import { stripConvexMeta } from '$lib/admin/constants';
	import AdminIcon from './AdminIcon.svelte';
	import { IconChevronDown } from './admin-icons';

	// Props
	export let featureFlags: any[] = [];
	export let siteConfig: any = null;
	export let expanded: boolean = false;
	export let client: any;
	export let api: any;

	const dispatch = createEventDispatcher<{ toggle: void }>();

	// DOM reference for scrollIntoView on expand
	let containerEl: HTMLElement;

	// Accessible IDs
	const headerId = 'gc-header';
	const regionId = 'gc-region';

	// Site mode chip options
	const siteModeOptions = [
		{ id: 'multi-page', label: 'MULTI-PAGE' },
		{ id: 'one-page', label: 'ONE-PAGE' },
		{ id: 'reader', label: 'READER' },
	];

	// Nav paradigm chip options
	const navModeOptions = [
		{ id: 'sidebar', label: 'SIDEBAR' },
		{ id: 'drawer', label: 'DRAWER' },
		{ id: 'hybrid', label: 'HYBRID' },
	];

	// Derived: active flag count
	$: activeCount = featureFlags.filter((f) => f.enabled).length;
	$: totalCount = featureFlags.length;
	$: flagCountLabel = `${activeCount}/${totalCount}`;

	// Derived: current site config values with fallbacks
	$: currentMode = siteConfig?.mode ?? 'multi-page';
	$: currentNavMode = siteConfig?.navMode ?? 'sidebar';
	$: currentParallax = siteConfig?.parallaxSpeed ?? 0.5;

	async function handleToggle() {
		dispatch('toggle');
		if (!expanded) {
			await tick();
			containerEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleToggle();
		}
	}

	function getFlagEnabled(key: string): boolean {
		const flag = featureFlags.find((f) => f.key === key);
		return flag ? flag.enabled : false;
	}

	function formatFlagLabel(key: string): string {
		return key.replace(/-/g, ' ').toUpperCase();
	}

	async function handleFlagToggle(flag: any) {
		const newEnabled = !flag.enabled;
		await client.mutation(api.siteConfig.setFeatureFlag, {
			key: flag.key,
			enabled: newEnabled,
			category: flag.category,
		});
	}

	async function handleSiteModeChange(e: CustomEvent<{ value: string | string[] }>) {
		const newMode = e.detail.value as string;
		const base = siteConfig ? stripConvexMeta(siteConfig) : {};
		await client.mutation(api.siteConfig.upsert, { ...base, mode: newMode });
	}

	async function handleNavModeChange(e: CustomEvent<{ value: string | string[] }>) {
		const newNavMode = e.detail.value as string;
		const base = siteConfig ? stripConvexMeta(siteConfig) : {};
		await client.mutation(api.siteConfig.upsert, { ...base, navMode: newNavMode });
	}

	async function handleParallaxChange(e: CustomEvent<{ value: number }>) {
		const base = siteConfig ? stripConvexMeta(siteConfig) : {};
		await client.mutation(api.siteConfig.upsert, { ...base, parallaxSpeed: e.detail.value });
	}
</script>

<div class="global-compartment" class:global-compartment--expanded={expanded} bind:this={containerEl}>
	<!-- Header row — always visible -->
	<div
		class="gc-header"
		id={headerId}
		role="button"
		tabindex="0"
		aria-expanded={expanded}
		aria-controls={regionId}
		on:click={handleToggle}
		on:keydown={handleKeydown}
	>
		<!-- Left: icon + label -->
		<div class="gc-identity">
			<span class="gc-icon" aria-hidden="true">&#9881;</span>
			<span class="gc-label">GLOBAL</span>
		</div>

		<!-- Right: flag count + chevron -->
		<div class="gc-meta">
			{#if totalCount > 0}
				<span class="gc-count" aria-label="{activeCount} of {totalCount} flags active">{flagCountLabel}</span>
			{/if}
			<span class="gc-chevron" aria-hidden="true">
				<AdminIcon icon={IconChevronDown} size="xs" tone="inherit" />
			</span>
		</div>
	</div>

	<!-- Expandable body -->
	<div
		class="gc-body"
		id={regionId}
		role="region"
		aria-labelledby={headerId}
	>
		<div class="gc-body-inner">

			<!-- ── GROUP 1: FEATURE FLAGS ── -->
			<div class="gc-group">
				<div class="gc-group-header">
					<span class="gc-group-label">FEATURE FLAGS</span>
					{#if totalCount > 0}
						<span class="gc-group-count">{flagCountLabel}</span>
					{/if}
				</div>
				<div class="gc-flags">
					{#each featureFlags as flag (flag.key)}
						<div class="flag-row">
							<!-- Visibility dot -->
							<span
								class="flag-dot"
								class:flag-dot--active={flag.enabled}
								aria-hidden="true"
							></span>
							<!-- Flag label -->
							<span class="flag-label">{formatFlagLabel(flag.key)}</span>
							<!-- Spacer -->
							<span class="flag-spacer"></span>
							<!-- State label -->
							<span class="flag-state" class:flag-state--on={flag.enabled}>
								{flag.enabled ? 'ON' : 'OFF'}
							</span>
							<!-- Toggle -->
							<AdminToggle
								checked={flag.enabled}
								size="sm"
								color="green"
								label={formatFlagLabel(flag.key)}
								on:change={() => handleFlagToggle(flag)}
							/>
						</div>
					{/each}
				</div>
			</div>

			<!-- ── GROUP 2: SITE MODE ── -->
			<div class="gc-group">
				<div class="gc-group-header">
					<span class="gc-group-label">SITE MODE</span>
				</div>
				<div class="gc-group-content">
					<AdminChipGroup
						options={siteModeOptions}
						value={currentMode}
						mode="exclusive"
						color="blue"
						size="sm"
						on:change={handleSiteModeChange}
					/>
				</div>
			</div>

			<!-- ── GROUP 3: NAVIGATION ── -->
			<div class="gc-group gc-group--last">
				<div class="gc-group-header">
					<span class="gc-group-label">NAVIGATION</span>
				</div>
				<div class="gc-group-content">
					<!-- Nav mode row -->
					<div class="nav-row">
						<span class="nav-row-label">NAV PARADIGM</span>
						<AdminChipGroup
							options={navModeOptions}
							value={currentNavMode}
							mode="exclusive"
							color="blue"
							size="sm"
							on:change={handleNavModeChange}
						/>
					</div>
					<!-- Parallax row -->
					<div class="nav-row">
						<span class="nav-row-label">PARALLAX</span>
						<AdminSlider
							value={currentParallax}
							min={0}
							max={1}
							step={0.1}
							width="fill"
							on:change={handleParallaxChange}
						/>
					</div>
				</div>
			</div>

		</div>
	</div>
</div>

<style>
	/* === Container === */
	.global-compartment {
		border-bottom: 1px solid var(--border-color-subtle, #1a1a1a);
	}

	/* === Header row === */
	.gc-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--admin-space-2, 8px);
		min-height: var(--admin-touch-min, 44px);
		padding: 0 var(--admin-space-4, 16px);
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		outline: none;
		transition: background var(--admin-transition, 120ms ease);
	}

	.gc-header:hover {
		background: color-mix(in srgb, var(--color-text, #e5e5e5) 4%, transparent);
	}

	.gc-header:focus-visible {
		outline: 1px solid var(--admin-blue, #2563EB);
		outline-offset: -1px;
	}

	/* === Left: identity === */
	.gc-identity {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		min-width: 0;
	}

	.gc-icon {
		font-family: var(--font-mono);
		font-size: var(--admin-text-base, 14px);
		color: var(--color-text-muted, #666);
		flex-shrink: 0;
		line-height: 1;
	}

	.gc-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 13px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text, #e5e5e5);
		white-space: nowrap;
	}

	/* === Right: meta === */
	.gc-meta {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		flex-shrink: 0;
	}

	.gc-count {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 12px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--admin-green, #44D62C);
		line-height: 1;
	}

	.gc-chevron {
		display: flex;
		align-items: center;
		color: var(--color-text-subtle, #444);
		transition: transform var(--admin-transition, 120ms ease);
		flex-shrink: 0;
	}

	.global-compartment--expanded .gc-chevron {
		transform: rotate(180deg);
	}

	/* === Expandable body === */
	.gc-body {
		overflow: hidden;
		max-height: 0;
		transition: max-height var(--admin-transition, 120ms ease);
	}

	.global-compartment--expanded .gc-body {
		max-height: 2000px;
	}

	.gc-body-inner {
		padding-bottom: var(--admin-space-2, 8px);
	}

	/* === Control groups === */
	.gc-group {
		border-top: 1px solid var(--border-color-subtle, #1a1a1a);
		padding: var(--admin-space-3, 12px) var(--admin-space-4, 16px);
	}

	.gc-group--last {
		/* No extra bottom padding — body-inner handles it */
	}

	.gc-group-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--admin-space-2, 8px);
	}

	.gc-group-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 12px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle, #444);
		font-weight: 600;
		line-height: 1;
	}

	.gc-group-count {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 12px);
		letter-spacing: 0.06em;
		color: var(--admin-green, #44D62C);
		line-height: 1;
	}

	.gc-group-content {
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-2, 8px);
	}

	/* === Flag rows === */
	.gc-flags {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.flag-row {
		display: flex;
		align-items: center;
		gap: var(--admin-space-2, 8px);
		min-height: 36px;
	}

	.flag-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-text-subtle, #444);
		flex-shrink: 0;
	}

	.flag-dot--active {
		background: var(--admin-green, #44D62C);
	}

	.flag-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-sm, 13px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted, #666);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	.flag-spacer {
		flex: 1;
	}

	.flag-state {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 12px);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-subtle, #444);
		line-height: 1;
		flex-shrink: 0;
	}

	.flag-state--on {
		color: var(--admin-green, #44D62C);
	}

	/* === Navigation group rows === */
	.nav-row {
		display: flex;
		align-items: center;
		gap: var(--admin-space-3, 12px);
		min-height: 36px;
	}

	.nav-row-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 12px);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle, #444);
		font-weight: 600;
		white-space: nowrap;
		flex-shrink: 0;
		min-width: 80px;
	}
</style>
