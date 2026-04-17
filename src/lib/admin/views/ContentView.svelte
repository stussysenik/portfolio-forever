<script lang="ts">
    import DataTable from '$lib/admin/components/DataTable.svelte';
    import { adminViewStore } from '$lib/admin/stores/adminViewStore';
    import { getContext } from 'svelte';
    import type { AdminStore } from '$lib/admin/stores/adminStore';

    const adminStore = getContext<AdminStore>('adminStore');
    const { entriesByTable } = adminStore;

    // This would ideally be generated from the schema
    const contentTypes = [
        { name: 'Blog Posts', table: 'blogPosts', icon: 'IconFileText' },
        { name: 'Works', table: 'worksEntries', icon: 'IconLayers' },
        { name: 'Talks', table: 'talksEntries', icon: 'IconMessageSquare' },
        { name: 'CV', table: 'cvEntries', icon: 'IconFileText' },
        { name: 'Gallery', table: 'galleryItems', icon: 'IconImage' },
        { name: 'Likes', table: 'likesCategories', icon: 'IconSparkles' },
        { name: 'Minor Things', table: 'minorEntries', icon: 'IconList' },
        { name: 'Lab Experiments', table: 'labEntries', icon: 'IconBeaker' },
        { name: 'Academia', table: 'academicEntries', icon: 'IconBook' },
        { name: 'Hero Case Studies', table: 'heroCaseStudies', icon: 'IconStar' },
    ];

    $: tableData = contentTypes.map(ct => ({
        name: ct.name,
        count: ($entriesByTable[ct.table] || []).length,
        table: ct.table,
    }));

    const columns = [
        { key: 'name', label: 'Content Type' },
        { key: 'count', label: 'Entries' },
    ];

    function viewContentType(table: string) {
        adminViewStore.setView('content', table);
    }

</script>

<div class="content-view">
    <h1>Content Types</h1>
    <p>Select a content type to manage its entries.</p>
    
    <DataTable data={tableData} {columns}>
        <svelte:fragment slot="actions" let:row>
            <button class="btn-primary" on:click={() => viewContentType(row.table)}>
                Manage
            </button>
        </svelte:fragment>
    </DataTable>
</div>

<style>
    .content-view {
        display: flex;
        flex-direction: column;
        gap: var(--admin-space-6);
    }
    h1 {
        font-size: var(--admin-text-2xl);
        font-weight: 700;
    }
    p {
        color: var(--admin-text-muted);
        margin-top: calc(-1 * var(--admin-space-4));
    }
    .btn-primary {
        background: var(--admin-active-bg);
        color: var(--admin-active-text);
        border: none;
        padding: var(--admin-space-2) var(--admin-space-4);
        border-radius: var(--admin-radius-md);
        cursor: pointer;
        font-size: var(--admin-text-sm);
        font-weight: 500;
    }
</style>
