<script>
  import { onMount } from "svelte";
  import GallerySection from "$lib/sections/GallerySection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("gallery");
  });
</script>

<GallerySection />
