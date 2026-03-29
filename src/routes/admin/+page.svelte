<script lang="ts">
	import { onMount } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import type { Id } from '$convex/_generated/dataModel';
	import { getClerk } from '$lib/clerk';
	import { toast } from '$lib/stores/toast';

	const client = getConvexClient();

	// ── Auth State ──
	let authed = false;
	let authLoading = true;
	let authError = '';
	let userName = '';
	let userImage = '';
	let signInFn: (() => void) | null = null;

	// ── State ──
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
	let saving = false;
	let editingId: string | null = null;
	let editingField: string | null = null;
	let editBuffer = '';
	let addingTo: string | null = null;

	const SECTION_TYPES = [
		'work', 'education', 'award', 'publication', 'project',
	];

	// Allowed GitHub user IDs — only these accounts can access admin
	const ALLOWED_GITHUB_USERNAMES = ['stussysenik', 's3nik', 'itsmxzou@gmail.com'];

	onMount(async () => {
		// ── Auth Gate ──
		try {
			const clerk = await getClerk();
			if (clerk.user) {
				// Try GitHub external account (provider is 'github', not 'oauth_github')
				const ghAccount = clerk.user.externalAccounts?.find(
					(a: any) => a.provider === 'github' || a.provider === 'oauth_github'
				);
				const ghUsername = ghAccount?.username || clerk.user.username || '';
				// Also check primary email as fallback
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
				// Not signed in — redirect to Clerk hosted sign-in
				authLoading = false;
				signInFn = () => clerk.redirectToSignIn({ redirectUrl: window.location.href });
				return;
			}
		} catch (e: any) {
			// If Clerk key is missing or invalid, show error
			if (e.message?.includes('publishable')) {
				authError = 'Clerk not configured. Add PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local';
			} else {
				authError = `Auth error: ${e.message}`;
			}
			authLoading = false;
			return;
		}
		authLoading = false;

		// ── Only subscribe to data if authenticated ──
		if (!authed) return;

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
		return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6(); unsub7(); unsub8(); unsub9(); };
	});

	// ── Helpers ──
	function entriesOfType(type: string) {
		return entries
			.filter((e: any) => e.type === type)
			.sort((a: any, b: any) => a.order - b.order);
	}

	function formatDate(d: string) {
		if (d === 'present') return 'present';
		const date = new Date(d);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	}

	// ── Inline Editing ──
	function startEdit(id: string, field: string, currentValue: string) {
		editingId = id;
		editingField = field;
		editBuffer = currentValue || '';
	}

	async function saveEdit(table: 'entry' | 'language' | 'profile', id: string) {
		if (!editingField) return;
		saving = true;
		try {
			if (table === 'entry') {
				await client.mutation(api.cv.updateEntry, {
					id: id as Id<"cvEntries">,
					[editingField]: editBuffer,
				});
			} else if (table === 'language') {
				await client.mutation(api.languages.updateLanguage, {
					id: id as Id<"cvLanguages">,
					[editingField]: editBuffer,
				});
			} else if (table === 'profile' && profile) {
				await client.mutation(api.cv.updateProfile, {
					id: profile._id,
					[editingField]: editBuffer,
				});
			}
			toast.success('Saved');
		} catch (e: any) {
			toast.error(`Save failed: ${e.message}`);
		} finally {
			saving = false;
			editingId = null;
			editingField = null;
			editBuffer = '';
		}
	}

	function cancelEdit() {
		editingId = null;
		editingField = null;
		editBuffer = '';
	}

	// A11y: trigger click on Enter/Space for interactive non-button elements
	function a11yClick(handler: () => void) {
		return (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
		};
	}

	function handleKeydown(e: KeyboardEvent, table: 'entry' | 'language' | 'profile', id: string) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			saveEdit(table, id);
		} else if (e.key === 'Escape') {
			cancelEdit();
		}
	}

	// ── Toggle Visibility ──
	async function toggleEntryVisibility(id: string) {
		await client.mutation(api.cv.toggleVisibility, { id: id as Id<"cvEntries"> });
	}

	// ── Delete ──
	async function deleteEntry(id: string) {
		await client.mutation(api.cv.deleteEntry, { id: id as Id<"cvEntries"> });
		toast.success('Entry deleted');
	}

	async function deleteLanguage(id: string) {
		await client.mutation(api.languages.deleteLanguage, { id: id as Id<"cvLanguages"> });
	}

	// ── Add Entry ──
	async function addEntry(type: string) {
		const existing = entriesOfType(type);
		await client.mutation(api.cv.createEntry, {
			type: type as any,
			title: 'New Entry',
			startDate: new Date().toISOString().slice(0, 7),
			order: existing.length,
			visible: true,
		});
		addingTo = null;
		toast.success('Entry added');
	}

	// ── Add Language ──
	async function addLanguage() {
		await client.mutation(api.languages.createLanguage, {
			name: 'NEW',
			level: 'Beginner',
			order: languages.length,
			visible: true,
		});
	}

	// ── Academia CRUD ──
	async function addAcademicEntry() {
		await client.mutation(api.academia.createEntry, {
			title: 'New Paper',
			authors: '',
			year: new Date().getFullYear(),
			order: academicEntries.length,
			visible: true,
		});
	}

	async function deleteAcademicEntry(id: string) {
		await client.mutation(api.academia.deleteEntry, { id: id as Id<"academicEntries"> });
		toast.success('Paper deleted');
	}

	async function toggleAcademicVisibility(id: string) {
		await client.mutation(api.academia.toggleVisibility, { id: id as Id<"academicEntries"> });
	}

	async function saveAcademicEdit(id: string) {
		if (!editingField) return;
		saving = true;
		try {
			const value = editingField === 'year' ? parseInt(editBuffer) : editBuffer;
			await client.mutation(api.academia.updateEntry, {
				id: id as Id<"academicEntries">,
				[editingField]: value,
			});
		} finally {
			saving = false;
			editingId = null;
			editingField = null;
			editBuffer = '';
		}
	}

	async function moveAcademicEntry(id: string, direction: -1 | 1) {
		const sorted = [...academicEntries].sort((a, b) => a.order - b.order);
		const idx = sorted.findIndex((e: any) => e._id === id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= sorted.length) return;
		await client.mutation(api.academia.reorderEntries, {
			updates: [
				{ id: sorted[idx]._id, order: swapIdx },
				{ id: sorted[swapIdx]._id, order: idx },
			],
		});
	}

	// ── Works CRUD ──
	async function addWorkEntry() {
		await client.mutation(api.works.createEntry, {
			title: 'New Project',
			url: 'https://',
			order: worksEntries.length,
			visible: true,
		});
	}

	async function deleteWorkEntry(id: string) {
		await client.mutation(api.works.deleteEntry, { id: id as Id<"worksEntries"> });
		toast.success('Project deleted');
	}

	async function toggleWorkVisibility(id: string) {
		await client.mutation(api.works.toggleVisibility, { id: id as Id<"worksEntries"> });
	}

	async function saveWorkEdit(id: string) {
		if (!editingField) return;
		saving = true;
		try {
			const numFields = ['viewport', 'year', 'month'];
			const value = numFields.includes(editingField) ? parseFloat(editBuffer) || 0 : editBuffer;
			await client.mutation(api.works.updateEntry, {
				id: id as Id<"worksEntries">,
				[editingField]: value,
			});
		} finally {
			saving = false;
			editingId = null;
			editingField = null;
			editBuffer = '';
		}
	}

	async function moveWorkEntry(id: string, direction: -1 | 1) {
		const sorted = [...worksEntries].sort((a, b) => a.order - b.order);
		const idx = sorted.findIndex((e: any) => e._id === id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= sorted.length) return;
		await client.mutation(api.works.reorderEntries, {
			updates: [
				{ id: sorted[idx]._id, order: swapIdx },
				{ id: sorted[swapIdx]._id, order: idx },
			],
		});
	}

	// ── Talks CRUD ──
	async function addTalkEntry(entryType: 'talk' | 'interview') {
		await client.mutation(api.talks.createEntry, {
			title: entryType === 'talk' ? 'New Talk' : 'New Interview',
			entryType,
			year: new Date().getFullYear(),
			order: talksEntries.length,
			visible: true,
		});
	}

	async function deleteTalkEntry(id: string) {
		await client.mutation(api.talks.deleteEntry, { id: id as Id<"talksEntries"> });
		toast.success('Talk deleted');
	}

	async function toggleTalkVisibility(id: string) {
		await client.mutation(api.talks.toggleVisibility, { id: id as Id<"talksEntries"> });
	}

	async function saveTalkEdit(id: string) {
		if (!editingField) return;
		saving = true;
		try {
			const numFields = ['year', 'month'];
			const value = numFields.includes(editingField) ? parseInt(editBuffer) || 0 : editBuffer;
			await client.mutation(api.talks.updateEntry, {
				id: id as Id<"talksEntries">,
				[editingField]: value,
			});
		} finally {
			saving = false;
			editingId = null;
			editingField = null;
			editBuffer = '';
		}
	}

	async function moveTalkEntry(id: string, direction: -1 | 1) {
		const sorted = [...talksEntries].sort((a, b) => a.order - b.order);
		const idx = sorted.findIndex((e: any) => e._id === id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= sorted.length) return;
		await client.mutation(api.talks.reorderEntries, {
			updates: [
				{ id: sorted[idx]._id, order: swapIdx },
				{ id: sorted[swapIdx]._id, order: idx },
			],
		});
	}

	// ── Add Section ──
	async function addSection(type: string) {
		await client.mutation(api.sections.createSection, {
			name: type.charAt(0).toUpperCase() + type.slice(1),
			type,
			order: sections.length,
			visible: true,
		});
	}

	// ── Reorder ──
	async function moveEntry(id: string, type: string, direction: -1 | 1) {
		const typeEntries = entriesOfType(type);
		const idx = typeEntries.findIndex((e: any) => e._id === id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= typeEntries.length) return;

		await client.mutation(api.cv.reorderEntries, {
			updates: [
				{ id: typeEntries[idx]._id, order: swapIdx },
				{ id: typeEntries[swapIdx]._id, order: idx },
			],
		});
	}

	// ── PDF Export ──
	function exportPDF() {
		window.open('/cv', '_blank');
		setTimeout(() => {
			// Hint: user can Ctrl+P from the CV page
			alert('Use Ctrl/Cmd+P on the CV page to print or save as PDF.');
		}, 500);
	}

	// ── Highlights editing ──
	let editingHighlights: { id: string; highlights: string[] } | null = null;

	function startEditHighlights(id: string, current: string[]) {
		editingHighlights = { id, highlights: [...(current || [])] };
	}

	function addHighlight() {
		if (editingHighlights) {
			editingHighlights.highlights = [...editingHighlights.highlights, ''];
		}
	}

	function removeHighlight(idx: number) {
		if (editingHighlights) {
			editingHighlights.highlights = editingHighlights.highlights.filter((_, i) => i !== idx);
		}
	}

	async function saveHighlights() {
		if (!editingHighlights) return;
		const filtered = editingHighlights.highlights.filter(h => h.trim());
		await client.mutation(api.cv.updateEntry, {
			id: editingHighlights.id as Id<"cvEntries">,
			highlights: filtered,
		});
		editingHighlights = null;
	}

	// ── Likes CRUD ──
	let editingLikesItems: { id: string; items: string[] } | null = null;

	async function addLikesCategory() {
		await client.mutation(api.likes.createCategory, {
			title: 'New Category',
			items: ['item 1'],
			order: likesCategories.length,
			visible: true,
		});
		toast.success('Category added');
	}

	async function deleteLikesCategory(id: string) {
		await client.mutation(api.likes.deleteCategory, { id: id as Id<"likesCategories"> });
		toast.success('Category deleted');
	}

	async function toggleLikesVisibility(id: string) {
		await client.mutation(api.likes.toggleVisibility, { id: id as Id<"likesCategories"> });
	}

	async function saveLikesEdit(id: string) {
		if (!editingField) return;
		saving = true;
		try {
			await client.mutation(api.likes.updateCategory, {
				id: id as Id<"likesCategories">,
				[editingField]: editBuffer,
			});
			toast.success('Saved');
		} finally {
			saving = false;
			editingId = null;
			editingField = null;
			editBuffer = '';
		}
	}

	function startEditLikesItems(id: string, current: string[]) {
		editingLikesItems = { id, items: [...(current || [])] };
	}

	async function saveLikesItems() {
		if (!editingLikesItems) return;
		const filtered = editingLikesItems.items.filter(i => i.trim());
		await client.mutation(api.likes.updateCategory, {
			id: editingLikesItems.id as Id<"likesCategories">,
			items: filtered,
		});
		editingLikesItems = null;
		toast.success('Items saved');
	}

	async function moveLikesCategory(id: string, direction: -1 | 1) {
		const sorted = [...likesCategories].sort((a, b) => a.order - b.order);
		const idx = sorted.findIndex((e: any) => e._id === id);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= sorted.length) return;
		await client.mutation(api.likes.reorderCategories, {
			updates: [
				{ id: sorted[idx]._id, order: swapIdx },
				{ id: sorted[swapIdx]._id, order: idx },
			],
		});
	}

	// ── Gifts CRUD ──
	async function saveGiftsEdit(field: string) {
		if (!giftsConfig?._id) {
			await client.mutation(api.gifts.upsertGiftsConfig, {
				[field]: editBuffer,
				visible: true,
			});
		} else {
			await client.mutation(api.gifts.upsertGiftsConfig, {
				id: giftsConfig._id,
				[field]: editBuffer,
			});
		}
		toast.success('Saved');
		editingId = null;
		editingField = null;
		editBuffer = '';
	}

	async function initGiftsConfig() {
		if (!giftsConfig) {
			await client.mutation(api.gifts.upsertGiftsConfig, {
				title: 'The Promise',
				manifesto: 'I build and design a lot of things with free value in mind. In return, you could send me kind gifts in the form of art supplies or film medium.',
				visible: true,
			});
			toast.success('Gifts config initialized');
		}
	}

	// ── Thumbnail Config ──
	function getThumbnailConfig(section: string) {
		return thumbnailConfigs.find((c: any) => c.section === section);
	}

	async function saveThumbnailConfig(section: string, field: string, value: any) {
		const existing = getThumbnailConfig(section);
		if (existing) {
			await client.mutation(api.thumbnails.upsertConfig, {
				id: existing._id,
				section,
				[field]: value,
			});
		} else {
			await client.mutation(api.thumbnails.upsertConfig, {
				section,
				displayMode: 'grid',
				showPreview: true,
				previewOnHover: true,
				[field]: value,
			});
		}
		toast.success('Thumbnail config saved');
	}

	// ── Site Config ──
	async function setSiteMode(mode: 'one-page' | 'multi-page' | 'reader') {
		await client.mutation(api.siteConfig.upsert, { mode });
		toast.success(`Site mode: ${mode}`);
	}

	async function setParallaxSpeed(speed: number) {
		await client.mutation(api.siteConfig.upsert, { parallaxSpeed: speed });
		toast.success(`Parallax speed: ${speed}`);
	}

	async function setSectionOrder(order: string[]) {
		await client.mutation(api.siteConfig.upsert, { sectionOrder: order });
		toast.success('Section order updated');
	}

	// ── Feature Flags ──
	async function toggleFeatureFlag(key: string, enabled: boolean, category: string) {
		await client.mutation(api.siteConfig.setFeatureFlag, { key, enabled, category });
		toast.success(`${key}: ${enabled ? 'ON' : 'OFF'}`);
	}

	// ── JSON Export ──
	function exportSiteConfig() {
		const config = {
			siteConfig: siteConfigData,
			featureFlags,
			thumbnailConfigs,
			exportedAt: new Date().toISOString(),
		};
		const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `site-config-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success('Config exported');
	}

	// ── Section Reorder Helpers ──
	const allSections = [
		{ id: "hero", label: "Home" },
		{ id: "works", label: "Works" },
		{ id: "talks", label: "Talks" },
		{ id: "terminal", label: "Terminal" },
		{ id: "cv", label: "CV" },
		{ id: "academia", label: "Re:mix" },
		{ id: "blog", label: "Blog" },
		{ id: "process", label: "Process" },
		{ id: "gallery", label: "Gallery" },
		{ id: "likes", label: "Likes" },
		{ id: "minor", label: "Minor" },
		{ id: "gifts", label: "Gifts" },
		{ id: "os", label: "OS" },
	];

	$: currentOrder = siteConfigData?.sectionOrder || allSections.map(s => s.id);

	function moveSectionInOrder(sectionId: string, direction: number) {
		const order = [...currentOrder];
		const idx = order.indexOf(sectionId);
		const swapIdx = idx + direction;
		if (swapIdx < 0 || swapIdx >= order.length) return;
		[order[idx], order[swapIdx]] = [order[swapIdx], order[idx]];
		setSectionOrder(order);
	}

	// Default feature flags for the site
	const DEFAULT_FLAGS = [
		{ key: 'ascii-donut', category: 'visual', label: 'ASCII Donut' },
		{ key: 'parallax', category: 'visual', label: 'Parallax Transitions' },
		{ key: 'view-transitions', category: 'visual', label: 'View Transitions' },
		{ key: 'wip-banner', category: 'layout', label: 'WIP Banner' },
		{ key: 'elevator', category: 'visual', label: 'Elevator (Back to Top)' },
		{ key: 'terminal-matrix', category: 'visual', label: 'Terminal Matrix Animation' },
		{ key: 'os-desktop', category: 'visual', label: 'OS Desktop Simulator' },
		{ key: 'social-links', category: 'layout', label: 'Social Links Dropdown' },
		{ key: 'command-palette', category: 'layout', label: 'Command Palette' },
	];

	function getFlagState(key: string): boolean {
		const flag = featureFlags.find((f: any) => f.key === key);
		return flag ? flag.enabled : true; // default enabled
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
	<header class="admin-header">
		<div class="admin-header-left">
			<h1>Portfolio Admin</h1>
			{#if userName}
				<span class="admin-user">
					{#if userImage}<img src={userImage} alt="" class="admin-avatar" />{/if}
					{userName}
				</span>
			{/if}
		</div>
		<div class="admin-actions">
			<button class="btn btn-accent" on:click={exportPDF}>Export PDF</button>
			<button class="btn" on:click={exportSiteConfig}>Export JSON</button>
			<a href="/cv" class="btn" target="_blank">CV →</a>
			<a href="/works" class="btn" target="_blank">Works →</a>
			<a href="/academia" class="btn" target="_blank">Academia →</a>
			<a href="/talks" class="btn" target="_blank">Talks →</a>
			<a href="/likes" class="btn" target="_blank">Likes →</a>
			<a href="/gifts" class="btn" target="_blank">Gifts →</a>
		</div>
	</header>

	{#if loading}
		<div class="loading">Loading CV data from Convex...</div>
	{:else}

	<!-- ── Site Configuration ── -->
	<section class="admin-section">
		<h2 class="section-label">Site Configuration</h2>
		<div class="card">
			<div class="field-row">
				<span class="field-label">Site Mode</span>
				<div class="mode-switcher">
					{#each ['multi-page', 'one-page', 'reader'] as mode}
						<button
							class="mode-btn"
							class:active={siteConfigData?.mode === mode || (!siteConfigData?.mode && mode === 'multi-page')}
							on:click={() => setSiteMode(mode)}
						>
							{mode}
						</button>
					{/each}
				</div>
			</div>
			<div class="field-row">
				<span class="field-label">Parallax Speed</span>
				<div class="slider-row">
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={siteConfigData?.parallaxSpeed ?? 0.5}
						on:change={(e) => setParallaxSpeed(parseFloat(e.currentTarget.value))}
						class="slider"
					/>
					<span class="slider-value">{siteConfigData?.parallaxSpeed ?? 0.5}</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ── Section Order ── -->
	<section class="admin-section">
		<h2 class="section-label">Section Order</h2>
		<div class="card">
			{#each currentOrder as sectionId, idx}
				{@const meta = allSections.find(s => s.id === sectionId)}
				{#if meta}
					<div class="section-order-row">
						<div class="reorder-btns">
							<button class="btn-icon" on:click={() => moveSectionInOrder(sectionId, -1)} disabled={idx === 0}>↑</button>
							<button class="btn-icon" on:click={() => moveSectionInOrder(sectionId, 1)} disabled={idx === currentOrder.length - 1}>↓</button>
						</div>
						<span class="section-order-label">{meta.label}</span>
						<span class="section-order-id">{sectionId}</span>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<!-- ── Feature Flags ── -->
	<section class="admin-section">
		<h2 class="section-label">Feature Flags</h2>
		<div class="card">
			{#each DEFAULT_FLAGS as flag}
				<div class="flag-row">
					<span class="flag-label">{flag.label}</span>
					<span class="flag-category">{flag.category}</span>
					<button
						class="flag-toggle"
						class:flag-on={getFlagState(flag.key)}
						on:click={() => toggleFeatureFlag(flag.key, !getFlagState(flag.key), flag.category)}
					>
						{getFlagState(flag.key) ? 'ON' : 'OFF'}
					</button>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── Profile ── -->
	{#if profile}
	<section class="admin-section">
		<h2 class="section-label">Profile</h2>
		<div class="card">
			{#each [
				{ field: 'name', label: 'Name', value: profile.name },
				{ field: 'jobTitle', label: 'Title', value: profile.jobTitle },
				{ field: 'summary', label: 'Summary', value: profile.summary },
			] as item}
				<div class="field-row">
					<span class="field-label">{item.label}</span>
					{#if editingId === profile._id && editingField === item.field}
						{#if item.field === 'summary'}
							<textarea
								class="field-input"
								bind:value={editBuffer}
								on:keydown={(e) => handleKeydown(e, 'profile', profile._id)}
								rows="3"
							></textarea>
						{:else}
							<input
								class="field-input"
								bind:value={editBuffer}
								on:keydown={(e) => handleKeydown(e, 'profile', profile._id)}
							/>
						{/if}
						<div class="field-actions">
							<button class="btn-sm btn-save" on:click={() => saveEdit('profile', profile._id)} disabled={saving}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
						</div>
					{:else}
						<span class="field-value" role="button" tabindex="0" on:click={() => startEdit(profile._id, item.field, item.value)} on:keydown={a11yClick(() => startEdit(profile._id, item.field, item.value))}>
							{item.value || '(empty)'}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	</section>
	{/if}

	<!-- ── CV Sections (Experience, Education, Awards, etc.) ── -->
	{#each sections.filter(s => s.visible) as section}
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">{section.name}</h2>
			<span class="section-count">{entriesOfType(section.type).length}</span>
			<button class="btn-sm btn-add" on:click={() => addEntry(section.type)}>+ Add</button>
		</div>

		{#each entriesOfType(section.type) as entry, idx}
			<div class="card" class:hidden-entry={!entry.visible}>
				<div class="card-header">
					<div class="card-title-row">
						<!-- Reorder -->
						<div class="reorder-btns">
							<button class="btn-icon" on:click={() => moveEntry(entry._id, section.type, -1)} disabled={idx === 0}>↑</button>
							<button class="btn-icon" on:click={() => moveEntry(entry._id, section.type, 1)} disabled={idx === entriesOfType(section.type).length - 1}>↓</button>
						</div>

						<!-- Title (click to edit) -->
						{#if editingId === entry._id && editingField === 'title'}
							<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'entry', entry._id)} />
							<button class="btn-sm btn-save" on:click={() => saveEdit('entry', entry._id)}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>×</button>
						{:else}							<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'title', entry.title)} on:keydown={a11yClick(() => startEdit(entry._id, 'title', entry.title))}>
								{entry.title}
							</span>
						{/if}

						<!-- Visibility + Delete -->
						<button class="btn-icon" on:click={() => toggleEntryVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>
							{entry.visible ? '👁' : '👁‍🗨'}
						</button>
						<button class="btn-icon btn-danger" on:click={() => deleteEntry(entry._id)} title="Delete" aria-label="Delete entry">×</button>
					</div>

					<!-- Meta line -->
					<div class="card-meta">
						{#if editingId === entry._id && editingField === 'organization'}
							<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'entry', entry._id)} />
							<button class="btn-sm btn-save" on:click={() => saveEdit('entry', entry._id)}>✓</button>
						{:else}							<span class="meta-org" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'organization', entry.organization || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'organization', entry.organization || ''))}>
								{entry.organization || '(org)'}
							</span>
						{/if}
						<span class="meta-sep">·</span>

						{#if editingId === entry._id && editingField === 'location'}
							<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'entry', entry._id)} />
							<button class="btn-sm btn-save" on:click={() => saveEdit('entry', entry._id)}>✓</button>
						{:else}							<span class="meta-loc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'location', entry.location || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'location', entry.location || ''))}>
								{entry.location || '(location)'}
							</span>
						{/if}
						<span class="meta-sep">·</span>
						<span class="meta-date">{formatDate(entry.startDate)} → {entry.endDate ? formatDate(entry.endDate) : '...'}</span>
					</div>
				</div>

				<!-- Description -->
				<div class="card-body">
					{#if editingId === entry._id && editingField === 'description'}
						<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'entry', entry._id)} rows="2"></textarea>
						<div class="field-actions">
							<button class="btn-sm btn-save" on:click={() => saveEdit('entry', entry._id)}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
						</div>
					{:else}						<p class="card-desc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'description', entry.description || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'description', entry.description || ''))}>
							{entry.description || '(click to add description)'}
						</p>
					{/if}

					<!-- Highlights -->
					{#if editingHighlights?.id === entry._id}
						<div class="highlights-editor">
							{#each editingHighlights.highlights as hl, i}
								<div class="highlight-row">
									<input class="field-input-sm flex-1" bind:value={editingHighlights.highlights[i]} placeholder="Highlight..." />
									<button class="btn-icon btn-danger" on:click={() => removeHighlight(i)}>×</button>
								</div>
							{/each}
							<div class="highlight-actions">
								<button class="btn-sm" on:click={addHighlight}>+ Add highlight</button>
								<button class="btn-sm btn-save" on:click={saveHighlights}>Save</button>
								<button class="btn-sm" on:click={() => editingHighlights = null}>Cancel</button>
							</div>
						</div>
					{:else if entry.highlights?.length}						<ul class="card-highlights" role="button" tabindex="0" on:click={() => startEditHighlights(entry._id, entry.highlights)} on:keydown={a11yClick(() => startEditHighlights(entry._id, entry.highlights))}>
							{#each entry.highlights as hl}
								<li>→ {hl}</li>
							{/each}
						</ul>
					{:else}
						<button class="btn-sm" on:click={() => startEditHighlights(entry._id, [])}>+ Add highlights</button>
					{/if}

					<!-- Tools tags -->
					{#if entry.tools?.length}
						<div class="card-tools">
							{#each entry.tools as tool}
								<span class="tool-tag">{tool}</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</section>
	{/each}

	<!-- ── Academia ── -->
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">Academia</h2>
			<span class="section-count">{academicEntries.length}</span>
			<button class="btn-sm btn-add" on:click={addAcademicEntry}>+ Add</button>
			<a href="/academia" class="btn-sm" target="_blank">View →</a>
		</div>

		{#each [...academicEntries].sort((a, b) => a.order - b.order) as entry, idx}
			<div class="card" class:hidden-entry={!entry.visible}>
				<div class="card-header">
					<div class="card-title-row">
						<div class="reorder-btns">
							<button class="btn-icon" on:click={() => moveAcademicEntry(entry._id, -1)} disabled={idx === 0}>↑</button>
							<button class="btn-icon" on:click={() => moveAcademicEntry(entry._id, 1)} disabled={idx === academicEntries.length - 1}>↓</button>
						</div>

						{#if editingId === entry._id && editingField === 'title'}
							<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveAcademicEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveAcademicEdit(entry._id)}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>×</button>
						{:else}							<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'title', entry.title)} on:keydown={a11yClick(() => startEdit(entry._id, 'title', entry.title))}>{entry.title}</span>
						{/if}

						<button class="btn-icon" on:click={() => toggleAcademicVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>
							{entry.visible ? '👁' : '👁‍🗨'}
						</button>
						<button class="btn-icon btn-danger" on:click={() => deleteAcademicEntry(entry._id)}>×</button>
					</div>

					<div class="card-meta">
						{#if editingId === entry._id && editingField === 'authors'}
							<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveAcademicEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveAcademicEdit(entry._id)}>✓</button>
						{:else}							<span class="meta-org" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'authors', entry.authors || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'authors', entry.authors || ''))}>{entry.authors || '(authors)'}</span>
						{/if}
						<span class="meta-sep">·</span>

						{#if editingId === entry._id && editingField === 'venue'}
							<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveAcademicEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveAcademicEdit(entry._id)}>✓</button>
						{:else}							<span class="meta-loc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'venue', entry.venue || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'venue', entry.venue || ''))}>{entry.venue || '(venue)'}</span>
						{/if}
						<span class="meta-sep">·</span>

						{#if editingId === entry._id && editingField === 'year'}
							<input class="field-input-sm" type="number" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveAcademicEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveAcademicEdit(entry._id)}>✓</button>
						{:else}							<span class="meta-date" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'year', String(entry.year))} on:keydown={a11yClick(() => startEdit(entry._id, 'year', String(entry.year)))}>{entry.year}</span>
						{/if}
					</div>
				</div>

				<div class="card-body">
					{#if editingId === entry._id && editingField === 'description'}
						<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveAcademicEdit(entry._id); } if (e.key === 'Escape') cancelEdit(); }} rows="2"></textarea>
						<div class="field-actions">
							<button class="btn-sm btn-save" on:click={() => saveAcademicEdit(entry._id)}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
						</div>
					{:else}						<p class="card-desc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'description', entry.description || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'description', entry.description || ''))}>{entry.description || '(click to add description)'}</p>
					{/if}

					<!-- Links row -->
					<div class="card-tools" style="margin-top: var(--space-xs);">
						{#each ['paperUrl', 'codeUrl', 'demoUrl', 'thumbnailUrl', 'muxPlaybackId'] as urlField}
							{#if editingId === entry._id && editingField === urlField}
								<input class="field-input-sm" bind:value={editBuffer} placeholder="{urlField}" on:keydown={(e) => { if (e.key === 'Enter') saveAcademicEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
								<button class="btn-sm btn-save" on:click={() => saveAcademicEdit(entry._id)}>✓</button>
							{:else}								<span class="tool-tag" on:click={() => startEdit(entry._id, urlField, entry[urlField] || '')} style="cursor:pointer;">
									{urlField.replace('Url', '')}: {entry[urlField] ? '✓' : '—'}
								</span>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</section>

	<!-- ── Works/Projects ── -->
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">Works / Projects</h2>
			<span class="section-count">{worksEntries.length}</span>
			<button class="btn-sm btn-add" on:click={addWorkEntry}>+ Add</button>
			<a href="/works" class="btn-sm" target="_blank">View →</a>
		</div>

		{#each [...worksEntries].sort((a, b) => a.order - b.order) as entry, idx}
			<div class="card" class:hidden-entry={!entry.visible}>
				<div class="card-header">
					<div class="card-title-row">
						<div class="reorder-btns">
							<button class="btn-icon" on:click={() => moveWorkEntry(entry._id, -1)} disabled={idx === 0}>↑</button>
							<button class="btn-icon" on:click={() => moveWorkEntry(entry._id, 1)} disabled={idx === worksEntries.length - 1}>↓</button>
						</div>

						{#if editingId === entry._id && editingField === 'title'}
							<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>×</button>
						{:else}							<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'title', entry.title)} on:keydown={a11yClick(() => startEdit(entry._id, 'title', entry.title))}>{entry.title}</span>
						{/if}

						<button class="btn-icon" on:click={() => toggleWorkVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>
							{entry.visible ? '👁' : '👁‍🗨'}
						</button>
						<button class="btn-icon btn-danger" on:click={() => deleteWorkEntry(entry._id)}>×</button>
					</div>

					<div class="card-meta">
						{#if editingId === entry._id && editingField === 'url'}
							<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>✓</button>
						{:else}							<span class="meta-org" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'url', entry.url)} on:keydown={a11yClick(() => startEdit(entry._id, 'url', entry.url))}>{entry.url}</span>
						{/if}
						<span class="meta-sep">·</span>

						{#if editingId === entry._id && editingField === 'category'}
							<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>✓</button>
						{:else}							<span class="meta-loc" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'category', entry.category || '')} on:keydown={a11yClick(() => startEdit(entry._id, 'category', entry.category || ''))}>{entry.category || '(category)'}</span>
						{/if}
						{#if entry.featured}
							<span class="meta-sep">·</span>							<span class="tool-tag" on:click={() => startEdit(entry._id, 'featured', entry.featured || '')} style="cursor:pointer;">{entry.featured}</span>
						{/if}
					</div>
				</div>

				<div class="card-body">
					<div class="card-tools" style="margin-top: var(--space-xs);">
						{#each ['preview', 'viewport', 'cam', 'muxPlaybackId'] as field}
							{#if editingId === entry._id && editingField === field}
								<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveWorkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
								<button class="btn-sm btn-save" on:click={() => saveWorkEdit(entry._id)}>✓</button>
							{:else}								<span class="tool-tag" on:click={() => startEdit(entry._id, field, String(entry[field] || ''))} style="cursor:pointer;">
									{field}: {entry[field] || '—'}
								</span>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</section>

	<!-- ── Talks & Interviews ── -->
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">Talks & Interviews</h2>
			<span class="section-count">{talksEntries.length}</span>
			<button class="btn-sm btn-add" on:click={() => addTalkEntry('talk')}>+ Talk</button>
			<button class="btn-sm btn-add" on:click={() => addTalkEntry('interview')}>+ Interview</button>
			<a href="/talks" class="btn-sm" target="_blank">View →</a>
		</div>

		{#each [...talksEntries].sort((a, b) => a.order - b.order) as entry, idx}
			<div class="card" class:hidden-entry={!entry.visible}>
				<div class="card-header">
					<div class="card-title-row">
						<div class="reorder-btns">
							<button class="btn-icon" on:click={() => moveTalkEntry(entry._id, -1)} disabled={idx === 0}>↑</button>
							<button class="btn-icon" on:click={() => moveTalkEntry(entry._id, 1)} disabled={idx === talksEntries.length - 1}>↓</button>
						</div>

						<span class="tool-tag">{entry.entryType}</span>

						{#if editingId === entry._id && editingField === 'title'}
							<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveTalkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveTalkEdit(entry._id)}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>×</button>
						{:else}							<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'title', entry.title)} on:keydown={a11yClick(() => startEdit(entry._id, 'title', entry.title))}>{entry.title}</span>
						{/if}

						<button class="btn-icon" on:click={() => toggleTalkVisibility(entry._id)} title={entry.visible ? 'Hide' : 'Show'}>
							{entry.visible ? '👁' : '👁‍🗨'}
						</button>
						<button class="btn-icon btn-danger" on:click={() => deleteTalkEntry(entry._id)}>×</button>
					</div>

					<div class="card-meta">
						{#if editingId === entry._id && editingField === 'year'}
							<input class="field-input-sm" type="number" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveTalkEdit(entry._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveTalkEdit(entry._id)}>✓</button>
						{:else}							<span class="meta-date" role="button" tabindex="0" on:click={() => startEdit(entry._id, 'year', String(entry.year))} on:keydown={a11yClick(() => startEdit(entry._id, 'year', String(entry.year)))}>{entry.year}</span>
						{/if}

						{#if entry.links?.length}
							<span class="meta-sep">·</span>
							{#each entry.links as link}
								<a href={link.url} target="_blank" rel="noopener" class="tool-tag" style="text-decoration:none;">{link.label}</a>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</section>

	<!-- ── Languages ── -->
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">Languages</h2>
			<button class="btn-sm btn-add" on:click={addLanguage}>+ Add</button>
		</div>
		<div class="languages-grid">
			{#each languages as lang}
				<div class="card card-compact">
					{#if editingId === lang._id && editingField === 'name'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'language', lang._id)} />
						<button class="btn-sm btn-save" on:click={() => saveEdit('language', lang._id)}>✓</button>
					{:else}						<span class="lang-name" role="button" tabindex="0" on:click={() => startEdit(lang._id, 'name', lang.name)} on:keydown={a11yClick(() => startEdit(lang._id, 'name', lang.name))}>{lang.name}</span>
					{/if}

					{#if editingId === lang._id && editingField === 'level'}
						<input class="field-input-sm" bind:value={editBuffer} on:keydown={(e) => handleKeydown(e, 'language', lang._id)} />
						<button class="btn-sm btn-save" on:click={() => saveEdit('language', lang._id)}>✓</button>
					{:else}						<span class="lang-level" role="button" tabindex="0" on:click={() => startEdit(lang._id, 'level', lang.level)} on:keydown={a11yClick(() => startEdit(lang._id, 'level', lang.level))}>{lang.level}</span>
					{/if}

					<button class="btn-icon btn-danger" on:click={() => deleteLanguage(lang._id)}>×</button>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── Likes Categories ── -->
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">Likes</h2>
			<span class="section-count">{likesCategories.length}</span>
			<button class="btn-sm btn-add" on:click={addLikesCategory}>+ Add Category</button>
			<a href="/likes" class="btn-sm" target="_blank">View →</a>
		</div>

		{#each [...likesCategories].sort((a, b) => a.order - b.order) as cat, idx}
			<div class="card" class:hidden-entry={!cat.visible}>
				<div class="card-header">
					<div class="card-title-row">
						<div class="reorder-btns">
							<button class="btn-icon" on:click={() => moveLikesCategory(cat._id, -1)} disabled={idx === 0}>↑</button>
							<button class="btn-icon" on:click={() => moveLikesCategory(cat._id, 1)} disabled={idx === likesCategories.length - 1}>↓</button>
						</div>

						{#if editingId === cat._id && editingField === 'title'}
							<input class="field-input flex-1" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveLikesEdit(cat._id); if (e.key === 'Escape') cancelEdit(); }} />
							<button class="btn-sm btn-save" on:click={() => saveLikesEdit(cat._id)}>Save</button>
							<button class="btn-sm" on:click={cancelEdit}>×</button>
						{:else}
							<span class="card-title flex-1" role="button" tabindex="0" on:click={() => startEdit(cat._id, 'title', cat.title)} on:keydown={a11yClick(() => startEdit(cat._id, 'title', cat.title))}>{cat.title}</span>
						{/if}

						<button class="btn-icon" on:click={() => toggleLikesVisibility(cat._id)} title={cat.visible ? 'Hide' : 'Show'}>
							{cat.visible ? '👁' : '👁‍🗨'}
						</button>
						<button class="btn-icon btn-danger" on:click={() => deleteLikesCategory(cat._id)}>×</button>
					</div>
				</div>

				<div class="card-body">
					{#if editingLikesItems?.id === cat._id}
						<div class="highlights-editor">
							{#each editingLikesItems.items as item, i}
								<div class="highlight-row">
									<input class="field-input-sm flex-1" bind:value={editingLikesItems.items[i]} placeholder="Item..." />
									<button class="btn-icon btn-danger" on:click={() => { if (editingLikesItems) editingLikesItems.items = editingLikesItems.items.filter((_, j) => j !== i); }}>×</button>
								</div>
							{/each}
							<div class="highlight-actions">
								<button class="btn-sm" on:click={() => { if (editingLikesItems) editingLikesItems.items = [...editingLikesItems.items, '']; }}>+ Add item</button>
								<button class="btn-sm btn-save" on:click={saveLikesItems}>Save</button>
								<button class="btn-sm" on:click={() => editingLikesItems = null}>Cancel</button>
							</div>
						</div>
					{:else}
						<div class="card-tools" role="button" tabindex="0" on:click={() => startEditLikesItems(cat._id, cat.items)} on:keydown={a11yClick(() => startEditLikesItems(cat._id, cat.items))} style="cursor:pointer;">
							{#each cat.items as item}
								<span class="tool-tag">{item}</span>
							{/each}
							{#if !cat.items?.length}
								<span class="tool-tag" style="opacity:0.5;">+ Add items</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</section>

	<!-- ── Gifts Config ── -->
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">Gifts / The Promise</h2>
			{#if !giftsConfig}
				<button class="btn-sm btn-add" on:click={initGiftsConfig}>Initialize</button>
			{/if}
			<a href="/gifts" class="btn-sm" target="_blank">View →</a>
		</div>

		{#if giftsConfig}
			<div class="card">
				{#each [
					{ field: 'title', label: 'Title', value: giftsConfig.title },
					{ field: 'manifesto', label: 'Manifesto', value: giftsConfig.manifesto },
					{ field: 'contactEmail', label: 'Contact Email', value: giftsConfig.contactEmail || '' },
					{ field: 'callToAction', label: 'Call to Action', value: giftsConfig.callToAction || '' },
				] as item}
					<div class="field-row">
						<span class="field-label">{item.label}</span>
						{#if editingId === 'gifts' && editingField === item.field}
							{#if item.field === 'manifesto'}
								<textarea class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveGiftsEdit(item.field); } if (e.key === 'Escape') cancelEdit(); }} rows="3"></textarea>
							{:else}
								<input class="field-input" bind:value={editBuffer} on:keydown={(e) => { if (e.key === 'Enter') saveGiftsEdit(item.field); if (e.key === 'Escape') cancelEdit(); }} />
							{/if}
							<div class="field-actions">
								<button class="btn-sm btn-save" on:click={() => saveGiftsEdit(item.field)} disabled={saving}>Save</button>
								<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
							</div>
						{:else}
							<span class="field-value" role="button" tabindex="0" on:click={() => { editingId = 'gifts'; editingField = item.field; editBuffer = item.value || ''; }} on:keydown={a11yClick(() => { editingId = 'gifts'; editingField = item.field; editBuffer = item.value || ''; })}>
								{item.value || '(empty)'}
							</span>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<p class="card" style="padding: var(--space-md); color: var(--color-text-muted);">Click "Initialize" to set up the gifts page content.</p>
		{/if}
	</section>

	<!-- ── Thumbnail Display Config ── -->
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">Thumbnail Settings</h2>
		</div>

		{#each ['works', 'academia'] as section}
			{@const config = getThumbnailConfig(section)}
			<div class="card card-compact" style="gap: var(--space-md); flex-wrap: wrap;">
				<span class="lang-name" style="min-width: 80px; text-transform: capitalize;">{section}</span>

				<label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-xs); color:var(--color-text-muted);">
					Mode:
					<select style="font-size:var(--font-size-xs); padding:2px 4px; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:var(--color-bg); color:var(--color-text);"
						on:change={(e) => saveThumbnailConfig(section, 'displayMode', e.currentTarget.value)}
					>
						{#each ['grid', 'list', 'carousel', 'masonry'] as mode}
							<option value={mode} selected={config?.displayMode === mode}>{mode}</option>
						{/each}
					</select>
				</label>

				<label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-xs); color:var(--color-text-muted);">
					<input type="checkbox" checked={config?.showPreview ?? true} on:change={(e) => saveThumbnailConfig(section, 'showPreview', e.currentTarget.checked)} />
					Show preview
				</label>

				<label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-xs); color:var(--color-text-muted);">
					<input type="checkbox" checked={config?.previewOnHover ?? true} on:change={(e) => saveThumbnailConfig(section, 'previewOnHover', e.currentTarget.checked)} />
					Preview on hover
				</label>
			</div>
		{/each}
	</section>

	<!-- ── Add New Section ── -->
	<section class="admin-section">
		<div class="section-header">
			<h2 class="section-label">Add CV Section</h2>
		</div>
		<div class="add-section-grid">
			{#each SECTION_TYPES.filter(t => !sections.some(s => s.type === t)) as type}
				<button class="btn btn-outline" on:click={() => addSection(type)}>
					+ {type}
				</button>
			{/each}
		</div>
	</section>

	{/if}
	{/if}
</div>

<style>
	.admin {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-md);
	}

	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-xl);
		padding-bottom: var(--space-md);
		border-bottom: 2px solid var(--border-color);
	}

	.admin-header h1 {
		font-size: var(--font-size-xl);
		font-weight: 600;
	}

	.admin-header-left {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.admin-user {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.admin-avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
	}

	/* Auth gate */
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
		color: var(--color-error, #e53e3e);
		padding: var(--space-md);
		border: 1px solid var(--color-error, #e53e3e);
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
		color: #fff;
		background: #24292f;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: background var(--duration-fast) var(--easing);
	}

	.btn-github:hover {
		background: #1b1f23;
	}

	.admin-actions {
		display: flex;
		gap: var(--space-sm);
	}

	.loading {
		text-align: center;
		padding: var(--space-3xl);
		color: var(--color-text-muted);
	}

	/* Sections */
	.admin-section {
		margin-bottom: var(--space-xl);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.section-label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}

	.section-count {
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
		background: var(--color-bg-alt);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
	}

	/* Cards */
	.card {
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		margin-bottom: var(--space-sm);
		transition: border-color var(--duration-fast) var(--easing);
	}

	.card:hover {
		border-color: var(--border-color);
	}

	.card.hidden-entry {
		opacity: 0.5;
		border-style: dashed;
	}

	.card-compact {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
	}

	.card-header {
		margin-bottom: var(--space-sm);
	}

	.card-title-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.card-title {
		font-weight: 500;
		cursor: pointer;
	}

	.card-title:hover {
		color: var(--color-accent);
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		margin-top: var(--space-xs);
		padding-left: 52px; /* align with title past reorder buttons */
	}

	.meta-org, .meta-loc {
		cursor: pointer;
	}

	.meta-org:hover, .meta-loc:hover {
		color: var(--color-accent);
	}

	.meta-sep {
		opacity: 0.4;
	}

	.card-body {
		padding-left: 52px;
	}

	.card-desc {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		cursor: pointer;
		line-height: 1.5;
	}

	.card-desc:hover {
		color: var(--color-text);
	}

	.card-highlights {
		list-style: none;
		padding: 0;
		margin: var(--space-xs) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
	}

	.card-highlights:hover {
		color: var(--color-text);
	}

	.card-highlights li {
		margin-bottom: 2px;
	}

	.card-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-sm);
	}

	.tool-tag {
		font-size: var(--font-size-xs);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		background: var(--color-bg-alt);
		color: var(--color-text-muted);
	}

	/* Reorder */
	.reorder-btns {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	/* Fields */
	.field-row {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.field-row:last-child {
		border-bottom: none;
	}

	.field-label {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		color: var(--color-text-muted);
		min-width: 70px;
		padding-top: 4px;
	}

	.field-value {
		flex: 1;
		cursor: pointer;
		padding: 2px 4px;
		border-radius: var(--radius-sm);
	}

	.field-value:hover {
		background: var(--color-bg-alt);
	}

	.field-input, .field-input-sm {
		font-family: inherit;
		font-size: inherit;
		padding: 4px 8px;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		color: var(--color-text);
		width: 100%;
	}

	.field-input:focus, .field-input-sm:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.field-input-sm {
		padding: 2px 6px;
		font-size: var(--font-size-sm);
	}

	textarea.field-input {
		resize: vertical;
		min-height: 60px;
	}

	.field-actions {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	/* Highlights editor */
	.highlights-editor {
		margin-top: var(--space-sm);
	}

	.highlight-row {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		margin-bottom: var(--space-xs);
	}

	.highlight-actions {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	/* Languages */
	.languages-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.lang-name {
		font-weight: 600;
		cursor: pointer;
	}

	.lang-name:hover {
		color: var(--color-accent);
	}

	.lang-level {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		cursor: pointer;
	}

	.lang-level:hover {
		color: var(--color-text);
	}

	/* Add section grid */
	.add-section-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	/* Buttons */
	.btn {
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		font-weight: 500;
		border: 1px solid var(--border-color);
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.btn:hover {
		border-color: var(--color-text-muted);
	}

	.btn-accent {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	.btn-outline {
		background: transparent;
		border-style: dashed;
	}

	.btn-sm {
		padding: 2px 8px;
		font-size: var(--font-size-xs);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color-subtle);
		background: var(--color-bg);
		color: var(--color-text-muted);
		cursor: pointer;
	}

	.btn-save {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	.btn-add {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.btn-icon {
		padding: 2px 6px;
		font-size: var(--font-size-xs);
		border: none;
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
		border-radius: var(--radius-sm);
	}

	.btn-icon:hover {
		background: var(--color-bg-alt);
	}

	.btn-icon:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.btn-danger {
		color: var(--color-error, #e53e3e);
	}

	.btn-danger:hover {
		background: rgba(229, 62, 62, 0.1);
	}

	/* Utility */
	.flex-1 {
		flex: 1;
	}

	@media (max-width: 767px) {
		.card-meta {
			padding-left: 0;
			flex-wrap: wrap;
		}

		.card-body {
			padding-left: 0;
		}

		.admin-header {
			flex-direction: column;
			gap: var(--space-sm);
			align-items: flex-start;
		}
	}

	/* ── Site Config ── */
	.mode-switcher {
		display: flex;
		gap: var(--space-xs);
	}

	.mode-btn {
		padding: var(--space-xs) var(--space-md);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
	}

	.mode-btn.active {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	.mode-btn:hover:not(.active) {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		flex: 1;
	}

	.slider {
		flex: 1;
		accent-color: var(--color-accent);
	}

	.slider-value {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		min-width: 3ch;
	}

	/* ── Section Order ── */
	.section-order-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.section-order-row:last-child {
		border-bottom: none;
	}

	.section-order-label {
		font-weight: 500;
		flex: 1;
	}

	.section-order-id {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
	}

	/* ── Feature Flags ── */
	.flag-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) 0;
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.flag-row:last-child {
		border-bottom: none;
	}

	.flag-label {
		flex: 1;
		font-size: var(--font-size-sm);
	}

	.flag-category {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs);
		color: var(--color-text-subtle);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.flag-toggle {
		padding: var(--space-2xs) var(--space-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		font-weight: 600;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		min-width: 4ch;
		transition: all var(--duration-fast) var(--easing);
	}

	.flag-toggle.flag-on {
		background: var(--color-success, #22c55e);
		color: #fff;
		border-color: var(--color-success, #22c55e);
	}
</style>
