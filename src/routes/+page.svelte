<script lang="ts">
	import { siteMode } from "$lib/stores/siteMode";
	import HeroSection from "$lib/sections/HeroSection.svelte";
	import OnePageView from "$lib/components/OnePageView.svelte";
</script>

{#if $siteMode === 'one-page' || $siteMode === 'reader'}
	<OnePageView />
{:else}
	<HeroSection />
{/if}
