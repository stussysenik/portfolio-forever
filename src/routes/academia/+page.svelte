<script lang="ts">
  import AcademiaSection from "$lib/sections/AcademiaSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="academia" fallback={AcademiaSection} fallbackId="academia" />
