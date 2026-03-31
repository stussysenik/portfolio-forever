<script lang="ts">
	import { onMount } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import { getClerk } from '$lib/clerk';
	import { toast } from '$lib/stores/toast';

	import '$lib/admin/admin-shared.css';

	// Layout
	import BentoGrid from '$lib/admin/BentoGrid.svelte';
	import BentoCell from '$lib/admin/BentoCell.svelte';

	// Section admin panels (expanded view)
	import ProfileAdmin from '$lib/admin/ProfileAdmin.svelte';
	import WorksAdmin from '$lib/admin/WorksAdmin.svelte';
	import CvAdmin from '$lib/admin/CvAdmin.svelte';
	import TalksAdmin from '$lib/admin/TalksAdmin.svelte';
	import AcademiaAdmin from '$lib/admin/AcademiaAdmin.svelte';
	import BlogAdmin from '$lib/admin/BlogAdmin.svelte';
	import GalleryAdmin from '$lib/admin/GalleryAdmin.svelte';
	import LikesAdmin from '$lib/admin/LikesAdmin.svelte';
	import MinorAdmin from '$lib/admin/MinorAdmin.svelte';
	import LabsAdmin from '$lib/admin/LabsAdmin.svelte';
	import GiftsAdmin from '$lib/admin/GiftsAdmin.svelte';

	// Preview components
	import WorksPreview from '$lib/admin/previews/WorksPreview.svelte';
	import BlogPreview from '$lib/admin/previews/BlogPreview.svelte';
	import GalleryPreview from '$lib/admin/previews/GalleryPreview.svelte';
	import TerminalPreview from '$lib/admin/previews/TerminalPreview.svelte';
	import TimelinePreview from '$lib/admin/previews/TimelinePreview.svelte';
	import DesktopPreview from '$lib/admin/previews/DesktopPreview.svelte';
	import GitHubPreview from '$lib/admin/previews/GitHubPreview.svelte';
	import GenericListPreview from '$lib/admin/previews/GenericListPreview.svelte';
	import ProcessPreview from '$lib/admin/previews/ProcessPreview.svelte';

	// Control components
	import AppearanceCell from '$lib/admin/controls/AppearanceCell.svelte';
	import AnimationsCell from '$lib/admin/controls/AnimationsCell.svelte';
	import ConfigCell from '$lib/admin/controls/ConfigCell.svelte';
	import FlagsCell from '$lib/admin/controls/FlagsCell.svelte';
	import OrderCell from '$lib/admin/controls/OrderCell.svelte';
	import StreamsCell from '$lib/admin/controls/StreamsCell.svelte';

	const client = getConvexClient();

	// ── Auth State ──
	let authed = false;
	let authLoading = true;
	let authError = '';
	let userName = '';
	let userImage = '';
	let signInFn: (() => void) | null = null;

	// ── Appearance State ──
	let currentTheme = 'minimal';
	let currentFont = 'inter';

	// ── Data State ──
	let profile: any = null;
	let entries: any[] = [];
	let languages: any[] = [];
	let sections: any[] = [];
	let academicEntries: any[] = [];
	let worksEntries: any[] = [];
	let talksEntries: any[] = [];
	let likesCategories: any[] = [];
	let giftsConfig: any = null;
	let thumbnailConfigs: any[] = [];
	let siteConfigData: any = null;
	let featureFlags: any[] = [];
	let loading = true;
	let galleryEntries: any[] = [];
	let minorEntries: any[] = [];
	let labsEntries: any[] = [];
	let blogPosts: any[] = [];
	let displayConfigs: any[] = [];

	// ── New Data State (bento additions) ──
	let registrySections: any[] = [];
	let githubProjects: any[] = [];

	const ALLOWED_GITHUB_USERNAMES = ['stussysenik', 's3nik', 'itsmxzou@gmail.com'];

	onMount(async () => {
		try {
			const clerk = await getClerk();
			if (clerk.user) {
				const ghAccount = clerk.user.externalAccounts?.find(
					(a: any) => a.provider === 'github' || a.provider === 'oauth_github'
				);
				const ghUsername = ghAccount?.username || clerk.user.username || '';
				const email = clerk.user.primaryEmailAddress?.emailAddress || '';
				const isAllowed = ALLOWED_GITHUB_USERNAMES.includes(ghUsername.toLowerCase())
					|| ALLOWED_GITHUB_USERNAMES.includes(email.toLowerCase());

				if (isAllowed) {
					authed = true;
					userName = clerk.user.fullName || clerk.user.firstName || ghUsername;
					userImage = clerk.user.imageUrl || '';
				} else {
					authError = `Access denied. Account "${ghUsername || email}" is not authorized.`;
					authLoading = false;
					return;
				}
			} else {
				authLoading = false;
				signInFn = () => clerk.redirectToSignIn({ redirectUrl: window.location.href });
				return;
			}
		} catch (e: any) {
			if (e.message?.includes('publishable')) {
				authError = 'Clerk not configured. Add PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local';
			} else {
				authError = `Auth error: ${e.message}`;
			}
			authLoading = false;
			return;
		}
		authLoading = false;

		if (!authed) return;

		// ── Appearance init ──
		currentTheme = document.documentElement.dataset.theme || 'minimal';
		currentFont = document.documentElement.dataset.font || 'inter';

		// ── Convex Subscriptions ──
		const unsub1 = client.onUpdate(api.cv.getFullCV, {}, (data) => {
			if (data) {
				profile = data.profile;
				entries = data.entries;
				languages = data.languages;
				sections = data.sections;
				loading = false;
			}
		});
		const unsub2 = client.onUpdate(api.academia.getFullAcademia, {}, (data) => {
			if (data) academicEntries = data;
		});
		const unsub3 = client.onUpdate(api.works.getFullWorks, {}, (data) => {
			if (data) worksEntries = data;
		});
		const unsub4 = client.onUpdate(api.talks.getFullTalks, {}, (data) => {
			if (data) talksEntries = data;
		});
		const unsub5 = client.onUpdate(api.likes.getFullLikes, {}, (data) => {
			if (data) likesCategories = data;
		});
		const unsub6 = client.onUpdate(api.gifts.getGiftsConfig, {}, (data) => {
			giftsConfig = data;
		});
		const unsub7 = client.onUpdate(api.thumbnails.getAllConfigs, {}, (data) => {
			if (data) thumbnailConfigs = data;
		});
		const unsub8 = client.onUpdate(api.siteConfig.get, {}, (data) => {
			siteConfigData = data;
		});
		const unsub9 = client.onUpdate(api.siteConfig.getFeatureFlags, {}, (data) => {
			if (data) featureFlags = data;
		});
		const unsubDisplay = client.onUpdate(api.display.getAllConfigs, {}, (data: any) => {
			if (data) displayConfigs = data;
		});
		const unsub10 = client.onUpdate(api.gallery.getFullGallery, {}, (data: any) => {
			if (data) galleryEntries = data;
		});
		const unsub11 = client.onUpdate(api.minor.getFullMinor, {}, (data: any) => {
			if (data) minorEntries = data;
		});
		const unsub12 = client.onUpdate(api.labs.getFullLabs, {}, (data: any) => {
			if (data) labsEntries = data;
		});
		const unsub13 = client.onUpdate(api.blog.getFullPosts, {}, (data: any) => {
			if (data) blogPosts = data;
		});

		// ── New subscriptions for bento grid ──
		const unsubRegistry = client.onUpdate(api.sectionRegistry.getAll, {}, (data: any) => {
			if (data) registrySections = data;
		});
		const unsubGitHub = client.onUpdate(api.github.getAll, {}, (data: any) => {
			if (data) githubProjects = data;
		});

		return () => {
			unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6(); unsub7();
			unsub8(); unsub9(); unsubDisplay(); unsub10(); unsub11(); unsub12(); unsub13();
			unsubRegistry(); unsubGitHub();
		};
	});

	// ── Computed Streams ──
	$: computedStreams = [
		{ name: 'works', count: worksEntries.length, color: 'var(--bento-green, #44D62C)' },
		{ name: 'gallery', count: galleryEntries.length, color: 'var(--bento-blue, #2563EB)' },
		{ name: 'blog', count: blogPosts.length, color: '#737373' },
		{ name: 'talks', count: talksEntries.length, color: '#737373' },
		{ name: 'likes', count: likesCategories.length, color: '#737373' },
		{ name: 'labs', count: labsEntries.length, color: 'var(--bento-green, #44D62C)' },
		{ name: 'minor', count: minorEntries.length, color: '#737373' },
	];

	// ── GitHub Toggle Handler ──
	async function handleGitHubToggle(e: CustomEvent) {
		await client.mutation(api.github.toggleEnabled, { id: e.detail });
	}
</script>

<svelte:head>
	<title>Admin | Portfolio CMS</title>
</svelte:head>

<div class="admin">
	{#if authLoading}
		<div class="auth-gate">
			<div class="loading">Authenticating...</div>
		</div>
	{:else if !authed}
		<div class="auth-gate">
			{#if authError}
				<div class="auth-error">{authError}</div>
			{:else}
				<h1 class="auth-title">Portfolio Admin</h1>
				<p class="auth-subtitle">Sign in with GitHub to manage your portfolio.</p>
				{#if signInFn}
					<button class="btn-github" on:click={signInFn}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
						Sign in with GitHub
					</button>
				{/if}
			{/if}
		</div>
	{:else}
		<BentoGrid {userName} {userImage}>
			<!-- 01 · HERO — 12 cols -->
			<BentoCell idx="01" name="Hero" accentColor="blue" span={12}>
				{#if profile}
					<div class="hero-preview">
						<span class="hero-name">{profile.name || 'Name'}</span>
						<span class="hero-tagline">{profile.tagline || 'tagline'}</span>
					</div>
				{:else}
					<div class="hero-preview">
						<span class="hero-name">Loading...</span>
					</div>
				{/if}
				<svelte:fragment slot="expanded">
					<ProfileAdmin {client} api={api} {profile} />
				</svelte:fragment>
			</BentoCell>

			<!-- 02 · WORKS — 8 cols -->
			<BentoCell idx="02" name="Works" count={worksEntries.length} accentColor="green" span={8}>
				<WorksPreview entries={worksEntries} />
				<svelte:fragment slot="expanded">
					<WorksAdmin {client} api={api} entries={worksEntries} />
				</svelte:fragment>
			</BentoCell>

			<!-- APPEARANCE — 4 cols -->
			<BentoCell idx="··" name="Appearance" accentColor="blue" span={4}>
				<AppearanceCell {currentTheme} {currentFont} />
			</BentoCell>

			<!-- 03 · TALKS — 4 cols -->
			<BentoCell idx="03" name="Talks" count={talksEntries.length} accentColor="muted" span={4}>
				<TimelinePreview entries={talksEntries} type="talks" />
				<svelte:fragment slot="expanded">
					<TalksAdmin {client} api={api} entries={talksEntries} />
				</svelte:fragment>
			</BentoCell>

			<!-- 04 · TERMINAL — 4 cols -->
			<BentoCell idx="04" name="Terminal" accentColor="green" span={4}>
				<TerminalPreview />
			</BentoCell>

			<!-- 05 · CV — 4 cols -->
			<BentoCell idx="05" name="CV" count={entries.length} accentColor="muted" span={4}>
				<TimelinePreview {entries} type="cv" />
				<svelte:fragment slot="expanded">
					<CvAdmin {client} api={api} {entries} {languages} {sections} />
				</svelte:fragment>
			</BentoCell>

			<!-- 06 · ACADEMIA — 4 cols -->
			<BentoCell idx="06" name="Re:mix" count={academicEntries.length} accentColor="blue" span={4}>
				<GenericListPreview entries={academicEntries} />
				<svelte:fragment slot="expanded">
					<AcademiaAdmin {client} api={api} entries={academicEntries} />
				</svelte:fragment>
			</BentoCell>

			<!-- 07 · BLOG — 4 cols -->
			<BentoCell idx="07" name="Blog" count={blogPosts.length} accentColor="muted" span={4}>
				<BlogPreview entries={blogPosts} />
				<svelte:fragment slot="expanded">
					<BlogAdmin {client} api={api} entries={blogPosts} />
				</svelte:fragment>
			</BentoCell>

			<!-- 08 · PROCESS — 4 cols -->
			<BentoCell idx="08" name="Process" accentColor="muted" span={4}>
				<ProcessPreview />
			</BentoCell>

			<!-- 09 · GALLERY — 4 cols -->
			<BentoCell idx="09" name="Gallery" count={galleryEntries.length} accentColor="blue" span={4}>
				<GalleryPreview entries={galleryEntries} />
				<svelte:fragment slot="expanded">
					<GalleryAdmin {client} api={api} entries={galleryEntries} />
				</svelte:fragment>
			</BentoCell>

			<!-- 10 · LIKES — 4 cols -->
			<BentoCell idx="10" name="Likes" count={likesCategories.length} accentColor="muted" span={4}>
				<GenericListPreview entries={likesCategories} />
				<svelte:fragment slot="expanded">
					<LikesAdmin {client} api={api} categories={likesCategories} />
				</svelte:fragment>
			</BentoCell>

			<!-- 11 · MINOR — 4 cols -->
			<BentoCell idx="11" name="Minor" count={minorEntries.length} accentColor="muted" span={4}>
				<GenericListPreview entries={minorEntries} />
				<svelte:fragment slot="expanded">
					<MinorAdmin {client} api={api} entries={minorEntries} />
				</svelte:fragment>
			</BentoCell>

			<!-- 12 · LABS — 4 cols -->
			<BentoCell idx="12" name="Labs" count={labsEntries.length} accentColor="green" span={4}>
				<GenericListPreview entries={labsEntries} />
				<svelte:fragment slot="expanded">
					<LabsAdmin {client} api={api} entries={labsEntries} />
				</svelte:fragment>
			</BentoCell>

			<!-- 13 · GIFTS — 4 cols -->
			<BentoCell idx="13" name="Gifts" accentColor="muted" span={4}>
				<GenericListPreview entries={giftsConfig ? [giftsConfig] : []} />
				<svelte:fragment slot="expanded">
					<GiftsAdmin {client} api={api} {giftsConfig} />
				</svelte:fragment>
			</BentoCell>

			<!-- 14 · OS — 4 cols -->
			<BentoCell idx="14" name="OS" accentColor="blue" span={4}>
				<DesktopPreview />
			</BentoCell>

			<!-- GITHUB — 8 cols -->
			<BentoCell idx="··" name="GitHub" count={githubProjects.length} accentColor="muted" span={8}>
				<GitHubPreview projects={githubProjects} on:toggle={handleGitHubToggle} />
			</BentoCell>

			<!-- ANIMATIONS — 4 cols -->
			<BentoCell idx="··" name="Animations" accentColor="blue" span={4}>
				<AnimationsCell sections={registrySections} {client} api={api} />
			</BentoCell>

			<!-- SYSTEM ROW — 3 cols each -->
			<BentoCell idx="··" name="Config" accentColor="blue" span={3}>
				<ConfigCell siteConfig={siteConfigData} {client} api={api} />
			</BentoCell>

			<BentoCell idx="··" name="Streams" accentColor="green" span={3}>
				<StreamsCell streams={computedStreams} />
			</BentoCell>

			<BentoCell idx="··" name="Flags" accentColor="blue" span={3}>
				<FlagsCell flags={featureFlags} {client} api={api} />
			</BentoCell>

			<BentoCell idx="··" name="Order" accentColor="muted" span={3}>
				<OrderCell sections={registrySections} {client} api={api} />
			</BentoCell>
		</BentoGrid>
	{/if}
</div>

<style>
	.admin {
		min-height: 100vh;
	}

	.auth-gate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		text-align: center;
		gap: var(--space-md);
	}

	.auth-title {
		font-size: var(--font-size-2xl);
		font-weight: 600;
	}

	.auth-subtitle {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.auth-error {
		color: var(--color-error);
		padding: var(--space-md);
		border: 1px solid var(--color-error);
		border-radius: var(--radius-md);
		max-width: 400px;
	}

	.btn-github {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 12px 24px;
		font-size: var(--font-size-base);
		font-weight: 500;
		font-family: inherit;
		color: var(--color-surface);
		background: var(--color-admin-github-bg);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: background var(--duration-fast) var(--easing);
	}

	.btn-github:hover {
		background: var(--color-admin-github-hover);
	}

	.loading {
		text-align: center;
		padding: var(--space-3xl);
		color: var(--color-text-muted);
	}

	/* Hero preview inline */
	.hero-preview {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.hero-name {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--color-text);
	}

	.hero-tagline {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		color: var(--color-text-muted);
		letter-spacing: 0.02em;
	}
</style>
