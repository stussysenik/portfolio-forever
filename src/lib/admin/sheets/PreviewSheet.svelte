<script lang="ts">
	import AdminSheet from '../AdminSheet.svelte';
	import PreviewFrame from '../PreviewFrame.svelte';

	export let open: boolean = false;
	export let siteUrl: string = '';
	export let path: string = '/';

	let refreshKey = 0;
	$: iframeSrc = siteUrl ? `${siteUrl}${path}` : path;
</script>

<AdminSheet {open} title="Preview" height="full" on:close>
	<div class="preview-sheet-body">
		{#if open && iframeSrc}
			<PreviewFrame route={path} url={iframeSrc} bind:refreshKey>
				<iframe
					src={iframeSrc}
					title="Site preview"
					sandbox="allow-scripts allow-same-origin allow-forms"
				></iframe>
			</PreviewFrame>
		{/if}
	</div>
</AdminSheet>

<style>
	.preview-sheet-body {
		position: absolute;
		inset: 0;
		padding: 0;
		background: var(--admin-frame-bg, #eeeeec);
		display: flex;
		flex-direction: column;
	}
	.preview-sheet-body iframe {
		flex: 1;
		width: 100%;
		height: 100%;
		border: 0;
		background: #fff;
	}
</style>
