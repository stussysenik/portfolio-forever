<script lang="ts">
    export let projects: any[] = [];
</script>

<ul class="minimal-list">
    {#each projects as project}
        <li class="list-row">
            <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                class="row-title"
            >{project.title}</a>
            <span class="row-sep" aria-hidden="true">·</span>
            {#if project.category}
                <span class="row-meta">{project.category}</span>
                <span class="row-sep" aria-hidden="true">·</span>
            {/if}
            {#if project.year}
                <span class="row-meta">{project.year}</span>
            {/if}
        </li>
    {/each}
</ul>

<style>
    .minimal-list {
        list-style: none;
        margin: 0;
        padding: 0;
        font-family: var(--font-mono, monospace);
    }

    .list-row {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        padding: 0.35rem 0;
        border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
        flex-wrap: wrap;
    }

    .list-row:last-child {
        border-bottom: none;
    }

    .row-title {
        font-size: 0.82rem;
        font-weight: 500;
        color: var(--color-text, #111);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color 0.12s ease, color 0.12s ease;
    }

    .row-title:hover {
        color: var(--color-accent, #000);
        border-bottom-color: currentColor;
    }

    .row-sep {
        font-size: 0.75rem;
        color: var(--color-text-subtle, #aaa);
        user-select: none;
    }

    .row-meta {
        font-size: 0.72rem;
        color: var(--color-text-subtle, #aaa);
        text-transform: lowercase;
    }
</style>
