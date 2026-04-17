<script lang="ts">
    import { adminViewStore } from './stores/adminViewStore';
    import AdminIcon from './AdminIcon.svelte';
    import { 
        IconLayoutGrid, 
        IconFileText, 
        IconLayers, 
        IconSettings, 
        IconSparkles,
        IconTerminal
    } from './admin-icons';

    const mainNavItems = [
        { view: 'dashboard', label: 'Dashboard', icon: IconLayoutGrid },
        { view: 'pages', label: 'Pages', icon: IconFileText },
        { view: 'content', label: 'Content', icon: IconLayers },
        { view: 'themes', label: 'Themes', icon: IconSparkles },
        { view: 'settings', label: 'Settings', icon: IconSettings },
        { view: 'history', label: 'History', icon: IconTerminal },
    ];

    let currentView = 'dashboard';
    adminViewStore.subscribe(store => {
        currentView = store.currentView;
    });

    function handleNavClick(view: any) {
        adminViewStore.setView(view);
    }
</script>

<div class="cm-sidebar">
    <nav class="main-nav">
        {#each mainNavItems as item}
            <button 
                class="nav-item" 
                class:active={currentView === item.view}
                on:click={() => handleNavClick(item.view)}
                title={item.label}
            >
                <AdminIcon icon={item.icon} size="lg" />
            </button>
        {/each}
    </nav>
    <div class="sub-sidebar">
        <slot />
    </div>
    <div class="sidebar-footer">
        <slot name="footer" />
    </div>
</div>

<style>
    .cm-sidebar {
        display: flex;
        height: 100%;
    }

    .main-nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--admin-space-2, 8px);
        padding: var(--admin-space-4, 16px) var(--admin-space-2, 8px);
        border-right: 1px solid var(--admin-keyline);
        background: var(--admin-chrome-bg-darker, #111);
    }

    .nav-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: var(--admin-radius-md, 6px);
        background: transparent;
        border: none;
        color: var(--admin-text-muted);
        cursor: pointer;
        transition: all 120ms ease;
    }

    .nav-item:hover {
        background: var(--admin-frame-bg-hover, #2a2a2a);
        color: var(--admin-text);
    }

    .nav-item.active {
        background: var(--admin-active-bg, #2563eb);
        color: var(--admin-active-text, #fff);
    }

    .sub-sidebar {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }

    .sidebar-footer {
        margin-top: auto;
    }
</style>
