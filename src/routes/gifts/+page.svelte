<script>
  import { onMount } from "svelte";
  import GiftsSection from "$lib/sections/GiftsSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("gifts");
  });
</script>

<GiftsSection />
