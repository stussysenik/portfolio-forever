<script>
  import { onMount } from "svelte";
  import ColorfulWorksTable from "$lib/components/ColorfulWorksTable.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("works");
  });
</script>

<ColorfulWorksTable />
