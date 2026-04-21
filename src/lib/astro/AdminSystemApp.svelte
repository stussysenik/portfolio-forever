<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { api } from "../../../convex/_generated/api.js";
	import { getClerk } from "../clerk";
	import { getConvexClient } from "../convex";
	import { layoutConfig } from "../data/layout-config";
	import { shellState, toggleShellState } from "../stores/shellState";

	type PageRecord = {
		_id?: string;
		_creationTime?: number;
		pageId: string;
		label: string;
		route: string;
		navLabel?: string;
		navOrder: number;
		navVisible: boolean;
		visible: boolean;
		archived?: boolean;
		sections: Array<{
			sectionType: string;
			config: Record<string, unknown>;
			dataTable?: string;
			order: number;
			themeOverrides?: Record<string, unknown>;
			spacingBefore?: number;
			spacingAfter?: number;
		}>;
		themeOverrides?: Record<string, unknown>;
		meta?: {
			title?: string;
			description?: string;
			ogImage?: string;
		};
	};

	type FeatureFlag = {
		_id?: string;
		key: string;
		category?: string;
		enabled: boolean;
	};

	type SiteConfig = {
		mode?: "one-page" | "multi-page" | "reader";
		parallaxSpeed?: number;
	};

	const previewWidths = [
		{ id: "mobile", label: "Mobile", width: 390 },
		{ id: "tablet", label: "Tablet", width: 820 },
		{ id: "desktop", label: "Desktop", width: 1280 },
	] as const;
	const ALLOWED_GITHUB_USERNAMES = ["stussysenik", "s3nik", "itsmxzou@gmail.com", "addyosmani"];
	const REQUIRED_FLAGS: FeatureFlag[] = [{ key: "wip-banner", category: "layout", enabled: layoutConfig.showWipBanner }];

	let pages: PageRecord[] = [];
	let flags: FeatureFlag[] = [];
	let siteConfig: SiteConfig | null = null;
	let selectedPageId = "home";
	let previewWidth = previewWidths[2].width;
	let statusMessage = "Subscribing to Convex runtime…";
	let connected = false;
	let busyKey = "";
	let error = "";
	let authed = false;
	let authLoading = true;
	let authError = "";
	let signInFn: (() => void) | null = null;

	let unsubscribePages: (() => void) | undefined;
	let unsubscribeFlags: (() => void) | undefined;
	let unsubscribeSiteConfig: (() => void) | undefined;
	let authBypass = false;

	$: selectedPage = pages.find((page) => page.pageId === selectedPageId) ?? pages[0] ?? null;
	$: selectedFlagCount = flags.filter((flag) => flag.enabled).length;
	$: displayFlags = REQUIRED_FLAGS.map((requiredFlag) => flags.find((flag) => flag.key === requiredFlag.key) ?? requiredFlag).concat(
		flags.filter((flag) => !REQUIRED_FLAGS.find((requiredFlag) => requiredFlag.key === flag.key)),
	);

	function shouldBypassAuth() {
		if (!import.meta.env.DEV || typeof window === "undefined") {
			return false;
		}

		return new URLSearchParams(window.location.search).get("bypassAuth") === "1";
	}

	function mountRuntimeSubscriptions(client: NonNullable<ReturnType<typeof getConvexClient>>) {
		void client.mutation(api.pages.ensureSeeded, {}).catch(() => undefined);

		unsubscribePages = client.onUpdate(api.pages.getAll, {}, (data: unknown) => {
			pages = Array.isArray(data) ? (data as PageRecord[]) : [];
			connected = true;
			statusMessage = `Synced ${pages.length} pages from Convex.`;
			if (!pages.find((page) => page.pageId === selectedPageId)) {
				selectedPageId = pages[0]?.pageId ?? "home";
			}
		});

		unsubscribeFlags = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (data: unknown) => {
			flags = Array.isArray(data) ? (data as FeatureFlag[]) : [];
		});

		unsubscribeSiteConfig = client.onUpdate(api.siteConfig.get, {}, (data: unknown) => {
			siteConfig = (data as SiteConfig | null) ?? null;
		});
	}

	onMount(async () => {
		const client = getConvexClient();
		if (!client) {
			authError = "Convex client unavailable. Set PUBLIC_CONVEX_URL to enable the system lane.";
			authLoading = false;
			return;
		}

		authBypass = shouldBypassAuth();
		if (authBypass) {
			authed = true;
			authLoading = false;
			statusMessage = "Local auth bypass enabled for system-lane verification.";
			mountRuntimeSubscriptions(client);
			return;
		}

		try {
			const clerk = await getClerk();

			if (clerk.user) {
				const ghAccount = clerk.user.externalAccounts?.find(
					(account: any) => account.provider === "github" || account.provider === "oauth_github",
				);
				const ghUsername = ghAccount?.username || clerk.user.username || "";
				const email = clerk.user.primaryEmailAddress?.emailAddress || "";
				const isAllowed =
					ALLOWED_GITHUB_USERNAMES.includes(ghUsername.toLowerCase()) ||
					ALLOWED_GITHUB_USERNAMES.includes(email.toLowerCase());

				if (!isAllowed) {
					authError = `Access denied. Account "${ghUsername || email}" is not authorized.`;
					authLoading = false;
					return;
				}

				authed = true;
				authLoading = false;
			} else {
				signInFn = () => clerk.redirectToSignIn({ redirectUrl: window.location.href });
				authLoading = false;
				return;
			}
		} catch (clerkError: any) {
			authError = clerkError?.message?.includes("publishable")
				? "Clerk not configured. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local"
				: `Auth error: ${clerkError?.message ?? "Unknown Clerk error."}`;
			authLoading = false;
			return;
		}

		mountRuntimeSubscriptions(client);
	});

	onDestroy(() => {
		unsubscribePages?.();
		unsubscribeFlags?.();
		unsubscribeSiteConfig?.();
	});

	function serializePage(page: PageRecord, overrides: Partial<PageRecord>) {
		return {
			pageId: page.pageId,
			label: overrides.label ?? page.label,
			route: overrides.route ?? page.route,
			navLabel: overrides.navLabel ?? page.navLabel,
			navOrder: overrides.navOrder ?? page.navOrder,
			navVisible: overrides.navVisible ?? page.navVisible,
			visible: overrides.visible ?? page.visible,
			archived: overrides.archived ?? page.archived,
			sections: overrides.sections ?? page.sections ?? [],
			themeOverrides: overrides.themeOverrides ?? page.themeOverrides,
			meta: overrides.meta ?? page.meta,
		};
	}

	async function mutateWithStatus(key: string, task: () => Promise<unknown>, successMessage: string) {
		const client = getConvexClient();
		if (!client) {
			error = "Convex client unavailable.";
			statusMessage = error;
			return;
		}

		busyKey = key;
		error = "";
		try {
			await task();
			statusMessage = successMessage;
		} catch (mutationError) {
			error = mutationError instanceof Error ? mutationError.message : "Mutation failed.";
			statusMessage = error;
		} finally {
			busyKey = "";
		}
	}

	async function setSiteMode(mode: NonNullable<SiteConfig["mode"]>) {
		await mutateWithStatus(
			`mode:${mode}`,
			() => getConvexClient()!.mutation(api.siteConfig.upsert, { mode }),
			`Site mode updated to ${mode}.`,
		);
	}

	async function toggleFlag(flag: FeatureFlag) {
		await mutateWithStatus(
			`flag:${flag.key}`,
			() =>
				getConvexClient()!.mutation(api.siteConfig.setFeatureFlag, {
					key: flag.key,
					enabled: !flag.enabled,
					category: flag.category ?? "visual",
				}),
			`${flag.key} ${flag.enabled ? "disabled" : "enabled"}.`,
		);
	}

	async function togglePageVisibility(page: PageRecord) {
		await mutateWithStatus(
			`page:${page.pageId}`,
			() =>
				getConvexClient()!.mutation(
					api.pages.upsert,
					serializePage(page, {
						visible: !page.visible,
					}),
				),
			`${page.label} ${page.visible ? "hidden" : "published"}.`,
		);
	}
</script>

{#if authLoading}
	<section class="system-auth" data-testid="admin-auth-gate">
		<p class="system-app__eyebrow">Authentication</p>
		<h3>Authenticating system lane…</h3>
		<p>Checking Clerk before the Convex runtime controls mount.</p>
	</section>
{:else if !authed}
	<section class="system-auth" data-testid="admin-auth-gate">
		<p class="system-app__eyebrow">Authentication</p>
		<h3>Portfolio admin</h3>
		{#if authError}
			<p>{authError}</p>
		{:else}
			<p>Sign in with GitHub to access the Convex system lane.</p>
			{#if signInFn}
				<button type="button" class="system-auth__button" on:click={signInFn}>Sign in with GitHub</button>
			{/if}
		{/if}
	</section>
{:else}
	<section class="system-app" data-testid="admin-system-app">
		<div class="system-app__header">
			<div>
				<p class="system-app__eyebrow">Convex runtime</p>
				<h3>System controls that actually mutate live data.</h3>
				<p>
					The Astro host stays thin. This lane owns runtime composition, feature flags, and a previewable page
					surface, while Nano Stores keep cross-island UI state local.
				</p>
			</div>

			<div class="system-app__stats">
				<div>
					<span>connection</span>
					<strong>{connected ? "live" : "waiting"}</strong>
				</div>
				<div>
					<span>pages</span>
					<strong>{pages.length}</strong>
				</div>
				<div>
					<span>flags on</span>
					<strong>{selectedFlagCount}</strong>
				</div>
				<div>
					<span>nano store</span>
					<strong>{$shellState}</strong>
				</div>
			</div>
		</div>

		{#if authBypass}
			<p class="system-app__bypass" data-testid="admin-auth-bypass">
				Local auth bypass is active for `/admin/system`. This path exists only in Astro dev mode.
			</p>
		{/if}

		<div class="system-app__status" data-error={error ? "true" : undefined}>
			<strong>{statusMessage}</strong>
			<button type="button" on:click={toggleShellState}>Toggle shell state</button>
		</div>

		<div class="system-app__grid">
		<section class="system-card">
			<div class="system-card__header">
				<div>
					<p class="system-app__eyebrow">Composition</p>
					<h4>Pages</h4>
				</div>
				<div class="system-card__meta">{selectedPage ? `${selectedPage.sections.length} sections` : "No pages"}</div>
			</div>

			<div class="system-list">
				{#each pages as page}
					<button
						type="button"
						class="system-row"
						data-testid={`system-page-${page.pageId}`}
						data-active={page.pageId === selectedPageId ? "true" : undefined}
						on:click={() => (selectedPageId = page.pageId)}
					>
						<div>
							<strong>{page.label}</strong>
							<span>{page.route}</span>
						</div>
						<span>{page.visible ? "Live" : "Hidden"}</span>
					</button>
				{/each}
			</div>

			{#if selectedPage}
				<div class="system-actions">
					<button
						type="button"
						disabled={busyKey === `page:${selectedPage.pageId}`}
						on:click={() => togglePageVisibility(selectedPage)}
					>
						{selectedPage.visible ? "Hide page" : "Publish page"}
					</button>
					<a href={selectedPage.route} target="_blank" rel="noreferrer">Open live page</a>
				</div>
			{/if}
		</section>

		<section class="system-card">
			<div class="system-card__header">
				<div>
					<p class="system-app__eyebrow">Runtime config</p>
					<h4>Site mode</h4>
				</div>
				<div class="system-card__meta">{siteConfig?.mode ?? "multi-page"}</div>
			</div>

			<div class="system-chip-row">
				{#each ["multi-page", "one-page", "reader"] as mode}
					<button
						type="button"
						class="system-chip"
						data-active={siteConfig?.mode === mode ? "true" : undefined}
						disabled={busyKey === `mode:${mode}`}
						on:click={() => setSiteMode(mode as NonNullable<SiteConfig["mode"]>)}
					>
						{mode}
					</button>
				{/each}
			</div>

			<div class="system-card__header">
				<div>
					<p class="system-app__eyebrow">Feature flags</p>
					<h4>Live toggles</h4>
				</div>
			</div>

			<div class="system-list">
				{#each displayFlags as flag}
					<div class="system-flag" data-testid={`system-flag-${flag.key}`}>
						<div>
							<strong>{flag.key}</strong>
							<span>{flag.category ?? "visual"}</span>
						</div>
						<button
							type="button"
							class="system-chip"
							data-active={flag.enabled ? "true" : undefined}
							disabled={busyKey === `flag:${flag.key}`}
							on:click={() => toggleFlag(flag)}
						>
							{flag.enabled ? "On" : "Off"}
						</button>
					</div>
				{/each}
			</div>
		</section>

		<section class="system-card system-card--preview">
			<div class="system-card__header">
				<div>
					<p class="system-app__eyebrow">Preview</p>
					<h4>{selectedPage?.label ?? "No page selected"}</h4>
				</div>
				<div class="system-chip-row">
					{#each previewWidths as option}
						<button
							type="button"
							class="system-chip"
							data-active={previewWidth === option.width ? "true" : undefined}
							on:click={() => (previewWidth = option.width)}
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			{#if selectedPage}
				<div class="preview-frame" style={`--preview-width: ${previewWidth}px;`}>
					<iframe
						src={selectedPage.route}
						title={`${selectedPage.label} preview`}
						loading="lazy"
						data-testid="system-preview-iframe"
					></iframe>
				</div>
			{:else}
				<p class="preview-empty">Seed or load a page to inspect it here.</p>
			{/if}
		</section>
		</div>
	</section>
{/if}

<style>
	.system-auth {
		display: grid;
		gap: 0.7rem;
		max-width: 34rem;
		padding: 1rem 0 1.5rem;
	}

	.system-auth h3,
	.system-auth p {
		margin: 0;
	}

	.system-auth p {
		line-height: 1.6;
		color: rgba(15, 23, 42, 0.74);
	}

	.system-auth__button {
		width: fit-content;
		padding: 0.7rem 1rem;
		border: 1px solid rgba(15, 23, 42, 0.12);
		background: #0f172a;
		color: white;
		font: inherit;
		cursor: pointer;
	}

	.system-app {
		display: grid;
		gap: 1rem;
		padding: 1.2rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.96)),
			radial-gradient(circle at top left, rgba(15, 23, 42, 0.08), transparent 34%);
	}

	.system-app__header,
	.system-app__stats,
	.system-app__grid,
	.system-card,
	.system-actions,
	.system-chip-row,
	.system-list {
		display: grid;
	}

	.system-app__header {
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 24rem);
		gap: 1rem;
	}

	.system-app__eyebrow,
	.system-card__meta,
	.system-app__stats span,
	.system-row span,
	.system-flag span {
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(15, 23, 42, 0.54);
	}

	.system-app__header h3,
	.system-card h4 {
		margin: 0;
		letter-spacing: -0.04em;
	}

	.system-app__header p:last-child {
		margin: 0.75rem 0 0;
		max-width: 52ch;
		line-height: 1.6;
		color: rgba(15, 23, 42, 0.74);
	}

	.system-app__stats {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.system-app__stats div,
	.system-card,
	.system-app__status,
	.system-app__bypass {
		padding: 1rem;
		border-radius: 1.1rem;
		border: 1px solid rgba(15, 23, 42, 0.1);
		background: rgba(255, 255, 255, 0.82);
	}

	.system-app__bypass {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.5;
		color: rgba(15, 23, 42, 0.7);
	}

	.system-app__stats strong {
		display: block;
		margin-top: 0.35rem;
		font-size: 1.1rem;
	}

	.system-app__status {
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
	}

	.system-app__status[data-error="true"] {
		border-color: rgba(190, 24, 93, 0.22);
		background: rgba(190, 24, 93, 0.08);
	}

	.system-app__status button,
	.system-actions button,
	.system-actions a,
	.system-chip {
		padding: 0.7rem 0.9rem;
		border-radius: 999px;
		border: 1px solid rgba(15, 23, 42, 0.12);
		background: rgba(15, 23, 42, 0.04);
		color: inherit;
		font: inherit;
		text-decoration: none;
		cursor: pointer;
	}

	.system-app__grid {
		grid-template-columns: minmax(18rem, 24rem) minmax(18rem, 24rem) minmax(0, 1fr);
		gap: 1rem;
		align-items: start;
	}

	.system-card {
		gap: 1rem;
	}

	.system-card--preview {
		min-height: 32rem;
	}

	.system-card__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.system-list {
		gap: 0.6rem;
		max-height: 24rem;
		overflow: auto;
	}

	.system-row,
	.system-flag {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		padding: 0.85rem 0.95rem;
		border-radius: 1rem;
		border: 1px solid rgba(15, 23, 42, 0.08);
		background: rgba(15, 23, 42, 0.03);
		text-align: left;
	}

	.system-row {
		font: inherit;
		cursor: pointer;
	}

	.system-row strong,
	.system-flag strong {
		display: block;
	}

	.system-row[data-active="true"] {
		border-color: rgba(15, 23, 42, 0.22);
		background: rgba(15, 23, 42, 0.08);
	}

	.system-chip-row,
	.system-actions {
		grid-template-columns: repeat(auto-fit, minmax(8rem, max-content));
		gap: 0.6rem;
	}

	.system-chip[data-active="true"] {
		border-color: rgba(15, 23, 42, 0.28);
		background: #0f172a;
		color: white;
	}

	.preview-frame {
		width: 100%;
		max-width: 100%;
		overflow: auto;
		padding: 0.25rem;
		border-radius: 1rem;
		background: rgba(15, 23, 42, 0.04);
	}

	.preview-frame iframe {
		display: block;
		width: min(100%, var(--preview-width));
		height: 34rem;
		margin: 0 auto;
		border: 0;
		border-radius: 0.9rem;
		background: white;
		box-shadow: 0 16px 48px rgba(15, 23, 42, 0.12);
	}

	.preview-empty {
		margin: 0;
		color: rgba(15, 23, 42, 0.64);
	}

	@media (max-width: 1120px) {
		.system-app__grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 820px) {
		.system-app__header,
		.system-app__status {
			grid-template-columns: 1fr;
		}

		.system-app__stats {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 560px) {
		.system-app__stats {
			grid-template-columns: 1fr;
		}
	}
</style>
