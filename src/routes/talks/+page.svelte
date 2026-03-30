<script>
  import { onMount } from "svelte";
  import TalksSection from "$lib/sections/TalksSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("talks");
  });
</script>

<TalksSection />
