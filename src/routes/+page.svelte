<script lang="ts">
	import OnePageView from "$lib/components/OnePageView.svelte";
	import { profile } from "$lib/data/content";
</script>

<svelte:head>
	<title>Stüssy Senik</title>
	<meta name="description" content={profile.shortBio} />
</svelte:head>

<OnePageView />
