<script>
	import { onMount } from "svelte";
	import MediaSection from "$lib/sections/MediaSection.svelte";
	import { redirectIfOnePage } from "$lib/stores/siteMode";

	onMount(() => {
		redirectIfOnePage("media");
	});
</script>

<MediaSection />
