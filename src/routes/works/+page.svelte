<script lang="ts">
  import { onMount } from "svelte";
  import ColorfulWorksTable from "$lib/components/ColorfulWorksTable.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("works");
  });
</script>

<DynamicPage pageId="works" fallback={ColorfulWorksTable} fallbackId="works" />
