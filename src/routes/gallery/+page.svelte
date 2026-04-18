<script lang="ts">
  import GallerySection from "$lib/sections/GallerySection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="gallery" fallback={GallerySection} fallbackId="gallery" />
