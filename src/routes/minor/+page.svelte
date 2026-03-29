<script>
  import { onMount } from "svelte";
  import MinorSection from "$lib/sections/MinorSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("minor");
  });
</script>

<MinorSection />
