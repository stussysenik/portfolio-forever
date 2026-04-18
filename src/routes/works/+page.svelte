<script lang="ts">
  import WorksSection from "$lib/sections/WorksSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="works" fallback={WorksSection} fallbackId="works" />
