<script>
  import { onMount } from "svelte";
  import ProcessSection from "$lib/sections/ProcessSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("process");
  });
</script>

<ProcessSection />
