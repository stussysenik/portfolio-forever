<script lang="ts">
	import { onMount } from "svelte";
	import { useMachine } from "@xstate/svelte";
	import { match } from "ts-pattern";
	import * as R from "remeda";
	import { hiringMachine } from "./machine";
	import type { ApplicationStage, Application } from "./machine";
	import {
		applicationsStore,
		filterStageStore,
		filterTierStore,
		searchQueryStore,
		activeIdStore,
		filteredApplicationsStore,
		statsStore,
		activeApplicationStore,
		advanceApplication,
		rejectApplication,
		withdrawApplication,
		setActiveId,
		setFilterStage,
		setFilterTier,
		setSearchQuery,
		resetAll,
	} from "./store";
	import {
		classifyStage,
		stageEmoji,
		stageLabel,
		assignTier,
		groupByStage,
		sortByPriority,
		activeApplications,
		conversionRate,
		seedApplications,
	} from "./logic";
	import styles from "./styles.module.css";

	// Initialize xstate machine
	const { state, send } = useMachine(hiringMachine);

	// Sync xstate with nanostores on mount
	onMount(() => {
		const seeded = seedApplications();
		seeded.forEach((app) => {
			send({ type: "IDENTIFY", app });
		});
		applicationsStore.set(seeded);
	});

	// Local reactive references to store values
	$: filtered = filteredApplicationsStore;
	$: stats = statsStore;
	$: activeApp = activeApplicationStore;
	$: activeId = activeIdStore;
	$: filterStage = filterStageStore;
	$: filterTier = filterTierStore;
	$: searchQuery = searchQueryStore;

	// Stage options for filter
	const stages: ApplicationStage[] = [
		"identified",
		"researching",
		"applied",
		"screening",
		"technical",
		"onsite",
		"offer",
		"accepted",
		"declined",
		"rejected",
	];

	const tiers = ["tier1", "tier2", "tier3"] as const;

	function handleAdvance(id: string, stage: ApplicationStage) {
		advanceApplication(id, stage);
		send({ type: "ADVANCE", id, to: stage });
	}

	function handleReject(id: string) {
		rejectApplication(id);
		send({ type: "REJECT", id });
	}

	function handleWithdraw(id: string) {
		withdrawApplication(id);
		send({ type: "WITHDRAW", id });
	}

	// Next logical stages for advancement
	function nextStages(current: ApplicationStage): ApplicationStage[] {
		return match(current)
			.with("identified", () => ["researching", "applied"] as ApplicationStage[])
			.with("researching", () => ["applied"] as ApplicationStage[])
			.with("applied", () => ["screening", "technical"] as ApplicationStage[])
			.with("screening", () => ["technical", "onsite"] as ApplicationStage[])
			.with("technical", () => ["onsite", "offer"] as ApplicationStage[])
			.with("onsite", () => ["offer"] as ApplicationStage[])
			.with("offer", () => ["accepted"] as ApplicationStage[])
			.otherwise(() => []);
	}

	// Tier badge class using CSS modules
	function tierClass(tier: string): string {
		return match(tier)
			.with("tier1", () => styles.tier1)
			.with("tier2", () => styles.tier2)
			.with("tier3", () => styles.tier3)
			.otherwise(() => styles.tier3);
	}

	// Calculate conversion rate from store
	$: rate = conversionRate(applicationsStore);
	$: activeCount = activeApplications(applicationsStore).length;
</script>

<div class={styles.tracker}>
	<!-- Stats Bar -->
	<div class={styles.statsBar}>
		<div class={styles.statCell}>
			<span class={styles.statValue}>{stats.total}</span>
			<span class={styles.statLabel}>Total</span>
		</div>
		<div class={styles.statCell}>
			<span class={styles.statValue}>{stats.applied}</span>
			<span class={styles.statLabel}>Applied</span>
		</div>
		<div class={styles.statCell}>
			<span class={styles.statValue}>{stats.inProcess}</span>
			<span class={styles.statLabel}>In Process</span>
		</div>
		<div class={styles.statCell}>
			<span class={styles.statValue}>{stats.offers}</span>
			<span class={styles.statLabel}>Offers</span>
		</div>
		<div class={styles.statCell}>
			<span class={styles.statValue}>{stats.rejected}</span>
			<span class={styles.statLabel}>Closed</span>
		</div>
	</div>

	<!-- Conversion Rate -->
	<div class={styles.conversionBar}>
		<span class={styles.conversionLabel}>Conversion</span>
		<div class={styles.conversionTrack}>
			<div class={styles.conversionFill} style="width: {Math.min(rate, 100)}%"></div>
		</div>
		<span class={styles.conversionValue}>{rate.toFixed(1)}%</span>
	</div>

	<!-- Filters -->
	<div class={styles.filterBar}>
		<div class={styles.filterGroup}>
			<button
				class={filterStage === "all" ? styles.filterBtnActive : styles.filterBtn}
				on:click={() => setFilterStage("all")}
			>
				All
			</button>
			{#each stages as stage}
				<button
					class={filterStage === stage ? styles.filterBtnActive : styles.filterBtn}
					on:click={() => setFilterStage(stage)}
				>
					{stageEmoji(stage)} {stageLabel(stage)}
				</button>
			{/each}
		</div>
		<div class={styles.filterGroup}>
			{#each tiers as tier}
				<button
					class={filterTier === tier ? styles.filterBtnActive : styles.filterBtn}
					on:click={() => setFilterTier(filterTier === tier ? "all" : tier)}
				>
					{tier}
				</button>
			{/each}
		</div>
		<input
			type="text"
			class={styles.searchInput}
			placeholder="Search roles..."
			value={searchQuery}
			on:input={(e) => setSearchQuery(e.currentTarget.value)}
		/>
	</div>

	<!-- Application List -->
	{#if filtered.length > 0}
		<div class={styles.appList}>
			{#each sortByPriority(filtered) as app (app.id)}
				<div
					class={app.id === activeId ? styles.appRowActive : styles.appRow}
					on:click={() => setActiveId(app.id === activeId ? null : app.id)}
					on:keypress={(e) => e.key === "Enter" && setActiveId(app.id === activeId ? null : app.id)}
					role="button"
					tabindex="0"
				>
					<div class={styles.appHeader}>
						<div>
							<div class={styles.appCompany}>{app.company}</div>
							<div class={styles.appRole}>{app.role}</div>
						</div>
						<div class={styles.appMeta}>
							<span class={styles.stageBadge}>
								{stageEmoji(app.stage)} {stageLabel(app.stage)}
							</span>
							<span class={tierClass(app.tier)}>{app.tier}</span>
						</div>
					</div>

					{#if app.id === activeId}
						<div class={styles.actionBar}>
							{#each nextStages(app.stage) as nextStage}
								<button
									class={styles.actionBtn}
									on:click|stopPropagation={() => handleAdvance(app.id, nextStage)}
								>
									→ {stageLabel(nextStage)}
								</button>
							{/each}
							<button
								class={styles.actionBtn}
								on:click|stopPropagation={() => handleReject(app.id)}
							>
								❌ Reject
							</button>
							<button
								class={styles.actionBtn}
								on:click|stopPropagation={() => handleWithdraw(app.id)}
							>
								🚪 Withdraw
							</button>
							<a
								href={app.url}
								target="_blank"
								rel="noreferrer noopener"
								class={styles.detailLink}
								on:click|stopPropagation
							>
								View posting ↗
							</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class={styles.emptyState}>
			<p>No applications match your filters.</p>
			<button class={styles.filterBtn} on:click={() => { setFilterStage("all"); setFilterTier("all"); setSearchQuery(""); }}>
				Clear filters
			</button>
		</div>
	{/if}

	<!-- Machine State Debug (subtle) -->
	{#if $state.value}
		<div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
			<p style="font-family: var(--font-mono); font-size: var(--font-size-3xs); color: var(--color-text-subtle); margin: 0;">
				XState: {$state.value} · {activeCount} active · {R.pipe(applicationsStore, R.groupBy(a => a.company), R.keys).length} companies
			</p>
		</div>
	{/if}
</div>

<style>
	/* Component-scoped overrides — most styles come from CSS modules */
	:global(.hire-tracker-wrapper) {
		display: grid;
		gap: var(--hp-gap-lg, 2.5rem);
	}
</style>
