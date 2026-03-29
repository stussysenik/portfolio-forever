<script>
  import { onMount } from "svelte";
  import LikesSection from "$lib/sections/LikesSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("likes");
  });
</script>

<LikesSection />
