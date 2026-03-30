<script lang="ts">
	import { siteMode } from "$lib/stores/siteMode";
	import HeroSection from "$lib/sections/HeroSection.svelte";
	import OnePageView from "$lib/components/OnePageView.svelte";
	import { profile } from "$lib/data/content";
</script>

<svelte:head>
	<title>Stüssy Senik</title>
	<meta name="description" content={profile.shortBio} />
</svelte:head>

{#if $siteMode === "one-page" || $siteMode === "reader"}
	<OnePageView />
{:else}
	<HeroSection />
{/if}
