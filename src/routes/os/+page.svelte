<script lang="ts">
  import OsSection from "$lib/sections/OsSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
</script>

<DynamicPage pageId="os" fallback={OsSection} fallbackId="os" />
