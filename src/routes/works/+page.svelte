<script>
  import { onMount } from "svelte";
  import WorksSection from "$lib/sections/WorksSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("works");
  });
</script>

<WorksSection />
