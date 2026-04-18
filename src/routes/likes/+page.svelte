<script lang="ts">
  import LikesSection from "$lib/sections/LikesSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="likes" fallback={LikesSection} fallbackId="likes" />
