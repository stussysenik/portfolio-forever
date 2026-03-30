<script lang="ts">
  import { onMount } from "svelte";
  import TerminalSection from "$lib/sections/TerminalSection.svelte";
  import { profile } from '$lib/data/content';
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("terminal");
  });
</script>

<svelte:head>
  <title>Terminal | {profile.name}</title>
</svelte:head>

<TerminalSection />
