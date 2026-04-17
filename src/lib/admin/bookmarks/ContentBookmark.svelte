<script lang="ts">
	import { sectionEditors } from '$lib/admin/section-editors';
	import { sectionTypeRegistry } from '$lib/sections/registry';

	import WorksAdmin from '$lib/admin/WorksAdmin.svelte';
	import BlogAdmin from '$lib/admin/BlogAdmin.svelte';
	import CvAdmin from '$lib/admin/CvAdmin.svelte';
	import TalksAdmin from '$lib/admin/TalksAdmin.svelte';
	import GalleryAdmin from '$lib/admin/GalleryAdmin.svelte';
	import AcademiaAdmin from '$lib/admin/AcademiaAdmin.svelte';
	import LikesAdmin from '$lib/admin/LikesAdmin.svelte';
	import LabsAdmin from '$lib/admin/LabsAdmin.svelte';
	import MinorAdmin from '$lib/admin/MinorAdmin.svelte';
	import GiftsAdmin from '$lib/admin/GiftsAdmin.svelte';
	import ProcessAdmin from '$lib/admin/ProcessAdmin.svelte';
	import OsAdmin from '$lib/admin/OsAdmin.svelte';
	import TerminalAdmin from '$lib/admin/TerminalAdmin.svelte';
	import HeroContentEditor from './HeroContentEditor.svelte';

	// ── Props ──────────────────────────────────────────────────────────────────

	export let section: any = null;
	export let pageId: string = '';
	export let sectionIndex: number = 0;
	export let entriesByTable: Record<string, any[]> = {};
	export let client: any;
	export let api: any;
	export let heroConfig: any = null;
	export let cvProfile: any = null;

	// ── Helper ────────────────────────────────────────────────────────────────

	function getEntries(table: string): any[] {
		return entriesByTable[table] ?? [];
	}
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     CONTENT Bookmark — auto-dispatches the right admin editor per section type
════════════════════════════════════════════════════════════════════════════ -->
<div class="content-bookmark">

	{#if section?.sectionType === 'hero'}
		<HeroContentEditor {heroConfig} {cvProfile} {client} {api} />

	{:else if section?.sectionType === 'works-grid'}
		<WorksAdmin entries={getEntries('worksEntries')} {client} {api} compact />

	{:else if section?.sectionType === 'blog-feed'}
		<BlogAdmin entries={getEntries('blogPosts')} {client} {api} compact />

	{:else if section?.sectionType === 'cv'}
		<CvAdmin entries={getEntries('cvEntries')} sections={[]} languages={[]} {client} {api} compact />

	{:else if section?.sectionType === 'timeline'}
		<TalksAdmin entries={getEntries('talksEntries')} {client} {api} compact />

	{:else if section?.sectionType === 'gallery'}
		<GalleryAdmin entries={getEntries('galleryItems')} {client} {api} compact />

	{:else if section?.sectionType === 'academia'}
		<AcademiaAdmin entries={getEntries('academicEntries')} {client} {api} compact />

	{:else if section?.sectionType === 'likes'}
		<LikesAdmin categories={getEntries('likesCategories')} {client} {api} compact />

	{:else if section?.sectionType === 'labs'}
		<LabsAdmin entries={getEntries('labEntries')} {client} {api} compact />

	{:else if section?.sectionType === 'minor'}
		<MinorAdmin entries={getEntries('minorEntries')} {client} {api} compact />

	{:else if section?.sectionType === 'gifts'}
		<GiftsAdmin giftsConfig={getEntries('giftsConfig')?.[0] ?? null} {client} {api} compact />

	{:else if section?.sectionType === 'process'}
		<ProcessAdmin processConfig={getEntries('processConfig')?.[0] ?? null} {client} {api} compact />

	{:else if section?.sectionType === 'os'}
		<OsAdmin osConfig={getEntries('osConfig')?.[0] ?? null} {client} {api} compact />

	{:else if section?.sectionType === 'terminal'}
		<TerminalAdmin terminalConfig={getEntries('terminalConfig')?.[0] ?? null} {client} {api} compact />

	{:else}
		<div class="no-editor">
			<span class="no-editor-label">No content editor for {section?.sectionType}</span>
		</div>
	{/if}

</div>

<style>
	/* ── Bookmark root ────────────────────────────────────────────────── */
	.content-bookmark {
		max-width: 100%;
		overflow-x: auto;
	}

	/* ── No-editor fallback ───────────────────────────────────────────── */
	.no-editor {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--admin-space-4, 16px);
		text-align: center;
	}

	.no-editor-label {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--color-text-muted);
		text-transform: lowercase;
	}
</style>
