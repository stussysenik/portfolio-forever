<script lang="ts">
  import TerminalSection from "$lib/sections/TerminalSection.svelte";
  import { profile } from '$lib/data/content';
</script>

<svelte:head>
  <title>Terminal | {profile.name}</title>
</svelte:head>

<TerminalSection />
