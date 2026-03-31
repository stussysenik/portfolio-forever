<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let activeGroup: string = 'content';
    export let activeSection: string = '';
    export let displayConfigs: any[] = [];

    const dispatch = createEventDispatcher();

    const groups: Record<string, { label: string; sections: string[] }> = {
        appearance: { label: 'Appearance', sections: ['theme', 'font', 'animation', 'layout'] },
        content: { label: 'Content', sections: [
            'profile', 'works', 'cv', 'talks', 'likes', 'gifts',
            'academia', 'gallery', 'minor', 'labs', 'blog'
        ]},
        system: { label: 'System', sections: ['flags', 'display', 'thumbnails', 'velocity', 'export', 'health'] },
    };

    function isImmune(section: string): boolean {
        return displayConfigs.some((c: any) => c.section === section && c.immune);
    }

    function navigate(group: string, section: string) {
        dispatch('navigate', { group, section });
    }
</script>

<nav class="admin-nav" aria-label="Admin navigation">
    <div class="nav-tabs" role="tablist" aria-label="Admin sections">
        {#each Object.entries(groups) as [key, group]}
            <button class="nav-tab" class:active={activeGroup === key}
                role="tab" aria-selected={activeGroup === key}
                on:click={() => navigate(key, groups[key].sections[0])}>
                {group.label}
            </button>
        {/each}
    </div>
    <div class="nav-sections" role="tabpanel" aria-label="{groups[activeGroup]?.label} sections">
        {#each groups[activeGroup]?.sections || [] as section}
            <button class="nav-section" class:active={activeSection === section}
                aria-current={activeSection === section ? 'page' : undefined}
                aria-label="{section}{isImmune(section) ? ' (locked)' : ''}"
                on:click={() => navigate(activeGroup, section)}>
                {#if isImmune(section)}<span class="lock-badge" aria-hidden="true">L</span>{/if}
                {section}
            </button>
        {/each}
    </div>
</nav>

<style>
    .admin-nav { border-bottom: 1px solid var(--color-border, #e0e0e0); margin-bottom: var(--space-lg, 24px); }
    .nav-tabs { display: flex; gap: var(--space-xs, 4px); }
    .nav-tab { padding: var(--space-sm, 8px) var(--space-md, 16px); background: none; border: none;
        border-bottom: 2px solid transparent; cursor: pointer; font-family: var(--font-mono);
        font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted, #666); }
    .nav-tab:focus-visible { outline: 2px solid var(--color-accent, #2563eb); outline-offset: -2px; }
    .nav-tab:hover { color: var(--color-text, #1a1a1a); }
    .nav-tab.active { border-bottom-color: var(--color-accent, #2563eb); color: var(--color-text, #1a1a1a); }
    .nav-sections { display: flex; flex-wrap: wrap; gap: var(--space-xs, 4px); padding: var(--space-sm, 8px) 0; }
    .nav-section { padding: var(--space-xs, 4px) var(--space-sm, 8px); background: none; border: 1px solid transparent;
        border-radius: 4px; cursor: pointer; font-family: var(--font-mono); font-size: 0.75rem;
        text-transform: capitalize; color: var(--color-text-muted, #666); }
    .nav-section:focus-visible { outline: 2px solid var(--color-accent, #2563eb); outline-offset: 1px; }
    .nav-section:hover { color: var(--color-text, #1a1a1a); border-color: var(--color-border, #e0e0e0); }
    .nav-section.active { background: var(--color-surface, #f5f5f5); border-color: var(--color-border, #e0e0e0); color: var(--color-text, #1a1a1a); }
    .lock-badge { font-size: 0.65rem; margin-right: 2px; color: var(--color-warning, #d97706); }
</style>
