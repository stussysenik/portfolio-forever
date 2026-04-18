<script lang="ts">
  import TerminalSection from "$lib/sections/TerminalSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
  import { profile } from '$lib/data/content';
</script>

<svelte:head>
  <title>Terminal | {profile.name}</title>
</svelte:head>

<DynamicPage pageId="terminal" fallback={TerminalSection} fallbackId="terminal" />
