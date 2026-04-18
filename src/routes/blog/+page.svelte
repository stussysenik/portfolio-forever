<script lang="ts">
  import type { PageData } from "./$types";
  import BlogSection from "$lib/sections/BlogSection.svelte";
  import DynamicPage from "$lib/components/DynamicPage.svelte";
  export let data: PageData;
</script>

<DynamicPage pageId="blog" fallback={BlogSection} fallbackId="blog" blogPosts={data.posts} />
