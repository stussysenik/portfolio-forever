<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { AdminStore } from '$lib/admin/stores/adminStore';
  import AdminShell from '$lib/admin/AdminShell.svelte';

  const { client, api } = getContext<any>('admin');
  const adminStore = getContext<AdminStore>('adminStore');
  const { pages, featureFlags } = adminStore;

  let activePageId = 'home';
  $: activePage = ($pages ?? []).find((p) => p.pageId === activePageId) ?? null;

  async function handleToggleFlag(key: string, category: string) {
    const flag = ($featureFlags ?? []).find((f: any) => f.key === key);
    const newState = !(flag?.enabled ?? true);
    try {
      await client.mutation(api.siteConfig.setFeatureFlag, { key, enabled: newState, category });
    } catch (err) {
      console.error('Failed to toggle flag:', err);
    }
  }

  onMount(() => {
    const seedData = async () => {
      try { await client.mutation(api.pages.ensureSeeded, {}); } catch (_) { /* already seeded */ }
    };
    void seedData();
  });
</script>

<svelte:head>
  <title>Admin | Portfolio OS</title>
</svelte:head>

<AdminShell pages={$pages} {activePage} featureFlags={$featureFlags} onToggleFlag={handleToggleFlag} />
