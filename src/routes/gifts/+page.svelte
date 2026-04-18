<script lang="ts">
  import GiftsSection from "$lib/sections/GiftsSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="gifts" fallback={GiftsSection} fallbackId="gifts" />
