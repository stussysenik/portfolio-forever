<script lang="ts">
	import HeroCaseStudyAdmin from '$lib/admin/HeroCaseStudyAdmin.svelte';
	import AdminChipGroup from '$lib/admin/primitives/AdminChipGroup.svelte';

	// ── Props ──────────────────────────────────────────────────────────────────

	export let heroConfig: any = null;
	export let cvProfile: any = null;    // { name, taglines, shortBio, location, available }
	export let client: any;
	export let api: any;

	// ── Derived state ─────────────────────────────────────────────────────────

	$: name      = cvProfile?.name         ?? '';
	$: tagline   = cvProfile?.taglines?.[0] ?? '';
	$: shortBio  = cvProfile?.shortBio     ?? '';
	$: location  = cvProfile?.location     ?? '';

	// ── Mutation helpers ──────────────────────────────────────────────────────

	function updateProfile(patch: Record<string, any>) {
		if (!cvProfile) return;
		client.mutation(api.cv.updateProfile, { id: cvProfile._id, ...patch });
	}

	// ── Field handlers ────────────────────────────────────────────────────────

	function handleName(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		updateProfile({ name: value });
	}

	function handleTagline(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		// Preserve existing taglines array; replace index 0
		const existing = cvProfile?.taglines ?? [];
		const updated = [{ lang: existing[0]?.lang ?? 'en', text: value }, ...existing.slice(1)];
		updateProfile({ taglines: updated });
	}

	function handleBio(e: Event) {
		const value = (e.currentTarget as HTMLTextAreaElement).value;
		updateProfile({ shortBio: value });
	}

	function handleLocation(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		updateProfile({ location: value });
	}

	function toggleAvailable() {
		updateProfile({ available: !cvProfile?.available });
	}

	function toggleArchived() {
		client.mutation(api.hero.upsertHeroConfig, {
			id: heroConfig?._id,
			archived: !heroConfig?.archived
		});
	}
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     HERO CONTENT EDITOR — profile fields + case studies
════════════════════════════════════════════════════════════════════════════ -->
<div class="hero-content-editor">

	<!-- ── LAYOUT ───────────────────────────────────────────────────────────── -->
	<div class="group">
		<span class="group-label">LAYOUT</span>
		<AdminChipGroup
			options={[
				{ id: 'default', label: 'default' },
				{ id: 'diptych', label: 'diptych' },
				{ id: 'editorial', label: 'editorial' },
				{ id: 'stacked', label: 'stacked' },
			]}
			value={heroConfig?.layout ?? 'default'}
			mode="exclusive"
			color="blue"
			equalWidth={true}
			on:change={(e) => {
				client.mutation(api.hero.upsertHeroConfig, {
					id: heroConfig?._id,
					layout: e.detail.value
				});
			}}
		/>
	</div>

	<!-- ── ARCHIVE / STATUS ─────────────────────────────────────────────────── -->
	<div class="group">
		<span class="group-label">ARCHIVE / STATUS</span>
		<div class="field-row">
			<span class="field-label">AVAILABLE</span>
			<button class="btn-toggle" class:active={cvProfile?.available} on:click={toggleAvailable}>
				{cvProfile?.available ? 'ACTIVE' : 'INACTIVE'}
			</button>
		</div>
		<div class="field-row">
			<span class="field-label">ARCHIVE s-t3U1eD8QnXou</span>
			<button class="btn-toggle" class:active={heroConfig?.archived ?? true} on:click={toggleArchived}>
				{heroConfig?.archived ?? true ? 'ARCHIVED' : 'VISIBLE'}
			</button>
		</div>
	</div>

	<!-- ── PROFILE ──────────────────────────────────────────────────────────── -->
	<div class="group">
		<span class="group-label">PROFILE</span>

		<div class="field">
			<span class="field-label">NAME</span>
			<input
				type="text"
				value={name}
				on:change={handleName}
				placeholder="Your name"
				aria-label="Name"
			/>
		</div>

		<div class="field">
			<span class="field-label">TAGLINE</span>
			<input
				type="text"
				value={tagline}
				on:change={handleTagline}
				placeholder="Your tagline"
				aria-label="Tagline"
			/>
		</div>

		<div class="field">
			<span class="field-label">BIO</span>
			<textarea
				value={shortBio}
				on:change={handleBio}
				placeholder="Short bio..."
				aria-label="Bio"
			></textarea>
		</div>

		<div class="field">
			<span class="field-label">LOCATION</span>
			<input
				type="text"
				value={location}
				on:change={handleLocation}
				placeholder="City, Country"
				aria-label="Location"
			/>
		</div>
	</div>

	<!-- ── CASE STUDIES ─────────────────────────────────────────────────────── -->
	<div class="group">
		<span class="group-label">CASE STUDIES</span>
		<HeroCaseStudyAdmin {client} {api} entries={heroConfig?.caseStudies ?? []} />
	</div>

</div>

<style>
	/* ── Editor root ──────────────────────────────────────────────────── */
	.hero-content-editor {
		display: flex;
		flex-direction: column;
	}

	/* ── Group (CSS divider compartment) ─────────────────────────────── */
	.group {
		border-top: 1px solid var(--border-color-subtle);
		padding: var(--admin-space-3, 12px) var(--admin-space-4, 16px);
		display: flex;
		flex-direction: column;
		gap: var(--admin-space-2, 8px);
	}

	/* ── Group label ─────────────────────────────────────────────────── */
	.group-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		line-height: 1;
	}

	/* ── Field wrapper ───────────────────────────────────────────────── */
	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	/* ── Field row ───────────────────────────────────────────────────── */
	.field-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 0;
	}

	/* ── Field label ─────────────────────────────────────────────────── */
	.field-label {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle);
		line-height: 1;
	}

	/* ── Toggle Button ───────────────────────────────────────────────── */
	.btn-toggle {
		background: transparent;
		border: 1px solid var(--border-color-subtle);
		border-radius: 4px;
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		padding: 4px 12px;
		cursor: pointer;
		transition: all 150ms ease;
	}

	.btn-toggle:hover {
		border-color: var(--color-text-subtle);
		color: var(--color-text);
	}

	.btn-toggle.active {
		background: var(--color-success-bg, #e6fffa);
		color: var(--color-success, #2d3748);
		border-color: var(--color-success);
	}

	/* ── Inputs ──────────────────────────────────────────────────────── */
	input,
	textarea {
		width: 100%;
		background: transparent;
		border: 1px solid var(--border-color-subtle);
		border-radius: 2px;
		color: var(--color-text);
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		padding: 8px;
		min-height: var(--admin-touch-min, 44px);
		box-sizing: border-box;
		outline: none;
		transition: border-color 120ms ease;
	}

	input:focus,
	textarea:focus {
		border-color: color-mix(in srgb, var(--color-text) 40%, transparent);
	}

	textarea {
		min-height: 80px;
		resize: vertical;
	}
</style>