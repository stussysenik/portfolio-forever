<script lang="ts">
    export let data: any[] = [];
    export let columns: { key: string; label: string }[] = [];

    // If no columns are provided, infer them from the first data object
    $: if (data.length > 0 && columns.length === 0) {
        columns = Object.keys(data[0])
            .filter(key => !key.startsWith('_')) // Exclude convex metadata
            .map(key => ({ key, label: key }));
    }

    function getNestedValue(obj: any, path: string) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
</script>

<div class="data-table-wrapper">
    <table class="data-table">
        <thead>
            <tr>
                {#each columns as column}
                    <th>{column.label}</th>
                {/each}
                <th class="actions-header">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#if data.length > 0}
                {#each data as row, rowIndex (row._id)}
                    <tr>
                        {#each columns as column}
                            <td>
                                <slot name="cell" {row} {column} value={getNestedValue(row, column.key)}>
                                    {getNestedValue(row, column.key)}
                                </slot>
                            </td>
                        {/each}
                        <td class="actions-cell">
                            <slot name="actions" {row} {rowIndex}></slot>
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <td colspan={columns.length + 1} class="empty-state">
                        No data available.
                    </td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

<style>
    .data-table-wrapper {
        border: 1px solid var(--admin-keyline);
        border-radius: var(--admin-radius-md);
        overflow: hidden;
        background: var(--admin-chrome-bg);
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        padding: var(--admin-space-3) var(--admin-space-4);
        text-align: left;
        font-size: var(--admin-text-sm);
        border-bottom: 1px solid var(--admin-keyline);
    }
    thead tr {
        background: var(--admin-frame-bg);
    }
    th {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--admin-text-muted);
    }
    tbody tr:last-child td {
        border-bottom: none;
    }
    tbody tr:hover td {
        background: var(--admin-frame-bg-hover);
    }
    .actions-header, .actions-cell {
        text-align: right;
        width: 1%;
        white-space: nowrap;
    }
    .empty-state {
        text-align: center;
        color: var(--admin-text-subtle);
        font-family: var(--admin-font-mono);
        padding: var(--admin-space-8) 0;
    }
</style>
