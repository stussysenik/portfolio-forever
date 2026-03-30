<script>
  import { onMount } from "svelte";
  import AcademiaSection from "$lib/sections/AcademiaSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";

  onMount(() => {
    redirectIfOnePage("academia");
  });
</script>

<AcademiaSection />
