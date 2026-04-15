<script lang="ts">
	import AdminSheet from '../AdminSheet.svelte';
	import SectionCompartmentList from '../SectionCompartmentList.svelte';

	export let open: boolean = false;
	export let sections: any[] = [];
	export let pageId: string = '';
	export let entriesByTable: Record<string, any[]> = {};
	export let featureFlags: any[] = [];
	export let siteConfig: any = null;
	export let client: any = null;
	export let api: any = null;
	export let page: any = null;
	export let heroConfig: any = null;
	export let cvProfile: any = null;
</script>

<AdminSheet {open} title="Sections" on:close>
	<SectionCompartmentList
		{sections}
		{pageId}
		{entriesByTable}
		{featureFlags}
		{siteConfig}
		{client}
		{api}
		{page}
		{heroConfig}
		{cvProfile}
	/>
</AdminSheet>
