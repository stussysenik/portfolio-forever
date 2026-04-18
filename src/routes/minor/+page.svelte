<script lang="ts">
  import MinorSection from "$lib/sections/MinorSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="minor" fallback={MinorSection} fallbackId="minor" />
