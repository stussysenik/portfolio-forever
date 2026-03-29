<script lang="ts">
  import type { PageData } from "./$types";
  import BlogSection from "$lib/sections/BlogSection.svelte";
  export let data: PageData;
</script>

<BlogSection posts={data.posts} />
