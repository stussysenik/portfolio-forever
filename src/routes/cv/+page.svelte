<script>
  import { onMount } from "svelte";
  import CvSection from "$lib/sections/CvSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("cv");
  });
</script>

<CvSection />
