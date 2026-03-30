<script>
  import { onMount } from "svelte";
  import OsSection from "$lib/sections/OsSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("os");
  });
</script>

<OsSection />
