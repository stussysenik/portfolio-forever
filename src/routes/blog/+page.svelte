<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import BlogSection from "$lib/sections/BlogSection.svelte";
  import { redirectIfOnePage } from "$lib/stores/siteMode";
  export let data: PageData;

  onMount(() => {
    redirectIfOnePage("blog");
  });
</script>

<BlogSection posts={data.posts} />
