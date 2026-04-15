<script lang="ts">
	import AdminSheet from '../AdminSheet.svelte';
	import PageSidebar from '../PageSidebar.svelte';

	export let open: boolean = false;
	export let pages: any[] = [];
	export let activePageId: string = '';
	export let featureFlags: any[] = [];
	export let entriesByTable: Record<string, any[]> = {};
</script>

<AdminSheet {open} title="Pages" on:close>
	<div class="pages-sheet-body">
		<PageSidebar
			{pages}
			{activePageId}
			{featureFlags}
			{entriesByTable}
			on:selectpage
			on:newpage
			on:toggleflag
			on:togglepage
			on:reorderpages
			on:archivepage
		/>
	</div>
</AdminSheet>

<style>
	.pages-sheet-body {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
	.pages-sheet-body :global(.page-sidebar) {
		width: 100%;
		max-width: none;
	}
</style>
