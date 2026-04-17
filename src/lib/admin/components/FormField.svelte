<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let fieldKey: string;
    export let fieldSchema: any;
    export let value: any;
    export let path: string;

    const dispatch = createEventDispatcher();

    function updateValue(newValue: any) {
        dispatch('update', { path, value: newValue });
    }
</script>

<div class="form-field">
    <label for={path}>{fieldKey}</label>

    {#if fieldSchema.type === 'string'}
        <input 
            type="text" 
            id={path} 
            {value}
            on:input={(e) => updateValue(e.currentTarget.value)}
        />
    {:else if fieldSchema.type === 'number'}
        <input 
            type="number" 
            id={path} 
            {value} 
            on:input={(e) => updateValue(e.currentTarget.valueAsNumber)}
        />
    {:else if fieldSchema.type === 'boolean'}
        <input 
            type="checkbox" 
            id={path} 
            checked={value}
            on:change={(e) => updateValue(e.currentTarget.checked)}
        />
    {:else}
        <p class="unsupported">Unsupported type: {fieldSchema.type}</p>
    {/if}
</div>

<style>
    .form-field {
        display: grid;
        grid-template-columns: 1fr 2fr;
        align-items: center;
        gap: var(--admin-space-4);
    }
    label {
        font-weight: 500;
        text-transform: capitalize;
    }
    input[type="text"], input[type="number"] {
        width: 100%;
        padding: var(--admin-space-2) var(--admin-space-3);
        border: 1px solid var(--admin-keyline);
        background: var(--admin-frame-bg);
        color: var(--admin-text);
        border-radius: var(--admin-radius-md);
        font-size: var(--admin-text-sm);
    }
    input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
    }
    .unsupported {
        color: var(--admin-text-subtle);
        font-style: italic;
    }
</style>
