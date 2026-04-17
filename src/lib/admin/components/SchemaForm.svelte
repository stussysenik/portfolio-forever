<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import FormField from './FormField.svelte';

    export let doc: any = {};
    export let schema: any; // Simplified schema definition
    export let tableName: string;

    const dispatch = createEventDispatcher();

    // Mock schema for development. This will be replaced with a dynamic schema loader.
    if (!schema) {
        tableName = 'blogPosts';
        schema = {
            fields: {
                title: { type: 'string' },
                slug: { type: 'string' },
                content: { type: 'string', component: 'textarea' },
                excerpt: { type: 'string', component: 'textarea' },
                publishedAt: { type: 'string' },
                order: { type: 'number' },
                visible: { type: 'boolean' },
            }
        };
        doc = {
            title: 'My First Post',
            slug: 'my-first-post',
            content: 'This is the full content.',
            excerpt: 'This is a short excerpt.',
            publishedAt: new Date().toISOString().slice(0, 10),
            order: 1,
            visible: true,
        };
    }

    let formData: any = { ...doc };

    function handleUpdate(event: CustomEvent) {
        const { path, value } = event.detail;
        
        // Super basic nested property updater
        const keys = path.split('.');
        let obj = formData;
        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        formData = formData; // Trigger reactivity
    }

    function handleSubmit() {
        dispatch('save', {
            tableName,
            docId: doc._id,
            updates: formData
        });
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="schema-form">
    <fieldset>
        <legend>Editing {tableName}</legend>
        
        {#each Object.entries(schema.fields) as [key, fieldSchema]}
            <FormField 
                fieldKey={key}
                {fieldSchema}
                value={formData[key]}
                path={key}
                on:update={handleUpdate}
            />
        {/each}

    </fieldset>
    <button type="submit">Save Changes</button>
</form>

<style>
    .schema-form {
        display: flex;
        flex-direction: column;
        gap: var(--admin-space-6);
    }
    fieldset {
        border: 1px solid var(--admin-keyline);
        padding: var(--admin-space-4);
        border-radius: var(--admin-radius-md);
        display: flex;
        flex-direction: column;
        gap: var(--admin-space-4);
    }
    legend {
        font-size: var(--admin-text-lg);
        font-weight: 600;
        padding: 0 var(--admin-space-2);
    }
    button[type="submit"] {
        align-self: flex-start;
        background: var(--admin-active-bg);
        color: var(--admin-active-text);
        border: none;
        padding: var(--admin-space-3) var(--admin-space-6);
        border-radius: var(--admin-radius-md);
        cursor: pointer;
        font-size: var(--admin-text-md);
        font-weight: 600;
    }
</style>
