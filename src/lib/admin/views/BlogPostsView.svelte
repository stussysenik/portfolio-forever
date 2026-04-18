<script lang="ts">
    import { getContext } from 'svelte';
    import type { AdminStore } from '$lib/admin/stores/adminStore';
    import DataTable from '$lib/admin/components/DataTable.svelte';
    import SchemaForm from '$lib/admin/components/SchemaForm.svelte';
    import { toast } from '$lib/stores/toast';

    const { client, api } = getContext<any>('admin');
    const adminStore = getContext<AdminStore>('adminStore');
    const { entriesByTable } = adminStore;

    let selectedPost: any | null = null;
    let showForm = false;

    $: blogPosts = $entriesByTable.blogPosts || [];

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'publishedAt', label: 'Published' },
        { key: 'visible', label: 'Visible' },
    ];

    function handleEdit(post: any) {
        selectedPost = post;
        showForm = true;
    }

    async function handleSave(event: CustomEvent) {
        const { docId, updates } = event.detail;
        try {
            // We need a generic update mutation or specific ones per table
            // await client.mutation(api.blog.update, { id: docId, ...updates });
            console.log('Saving:', { docId, updates });
            toast.success('Saved successfully! (Simulated)');
            showForm = false;
            selectedPost = null;
        } catch (err: any) {
            toast.error(err.message || 'Failed to save');
        }
    }
</script>

<div class="view-container">
    <h1>Blog Posts</h1>

    {#if showForm && selectedPost}
        <SchemaForm 
            doc={selectedPost}
            on:save={handleSave}
        />
        <button on:click={() => { showForm = false; selectedPost = null; }}>Back to list</button>
    {:else}
        <DataTable data={blogPosts} {columns}>
            <svelte:fragment slot="actions" let:row>
                <button on:click={() => handleEdit(row)}>Edit</button>
            </svelte:fragment>
        </DataTable>
    {/if}
</div>

<style>
    .view-container {
        display: flex;
        flex-direction: column;
        gap: var(--admin-space-6);
    }
    h1 {
        font-size: var(--admin-text-2xl);
        font-weight: 700;
    }
</style>
