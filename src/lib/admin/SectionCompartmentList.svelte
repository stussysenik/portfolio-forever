<script lang="ts">
	import SectionCompartment from './SectionCompartment.svelte';
	import ContentBookmark from './bookmarks/ContentBookmark.svelte';
	import { sectionTypeRegistry } from '$lib/sections/registry';

	// Props
	export let sections: any[] = [];
	export let pageId: string = '';
	export let entriesByTable: Record<string, any[]> = {};
	export let featureFlags: any[] = [];
	export let siteConfig: any = null;
	export let client: any;
	export let api: any;
	export let page: any = null;           // Full page object (passed through to LayoutBookmark)
	export let heroConfig: any = null;     // Hero config data (passed through to StyleBookmark)
	export let cvProfile: any = null;      // CV profile data (passed through to ContentBookmark)

	// Suppress unused-export warnings — part of public API
	$: void featureFlags;
	$: void siteConfig;

	// Accordion state: only one compartment open at a time. null = all collapsed.
	let expandedIndex: number | null = null;

	// Sort sections by order field before rendering
	$: sortedSections = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

	function computeEntryCount(section: any): number {
		const dataTable = sectionTypeRegistry[section?.sectionType]?.dataTable;
		if (!dataTable) return 0;
		return entriesByTable[dataTable]?.length ?? 0;
	}

	function handleToggle(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
	}
</script>

<div class="compartment-list">
	<!-- GlobalCompartment will be inserted here (index -1 for accordion purposes) -->

	{#each sortedSections as section, i}
		<SectionCompartment
			{section}
			{pageId}
			sectionIndex={i}
			expanded={expandedIndex === i}
			entryCount={computeEntryCount(section)}
			page={page}
			{client}
			{api}
			heroConfig={section.sectionType === 'hero' ? heroConfig : null}
			on:toggle={() => handleToggle(i)}
		>
			<ContentBookmark
				{section}
				{pageId}
				sectionIndex={i}
				{entriesByTable}
				{client}
				{api}
				heroConfig={section.sectionType === 'hero' ? heroConfig : null}
				cvProfile={section.sectionType === 'hero' ? cvProfile : null}
			/>
		</SectionCompartment>
	{/each}
</div>

<style>
	.compartment-list {
		overflow-y: auto;
	}
</style>
