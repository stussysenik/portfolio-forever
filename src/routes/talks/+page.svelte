<script lang="ts">
  import TalksSection from "$lib/sections/TalksSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="talks" fallback={TalksSection} fallbackId="talks" />
