<script lang="ts">
  import ProcessSection from "$lib/sections/ProcessSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="process" fallback={ProcessSection} fallbackId="process" />
