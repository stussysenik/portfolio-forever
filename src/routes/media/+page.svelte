<script lang="ts">
  import MediaSection from "$lib/sections/MediaSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="media" fallback={MediaSection} fallbackId="media" />
