<script lang="ts">
  import CvSection from "$lib/sections/CvSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="cv" fallback={CvSection} fallbackId="cv" />
