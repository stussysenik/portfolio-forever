<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getConvexClient } from '$lib/convex';
  import { api } from '$convex/_generated/api';

  export let id = "os";
  export let embedded = false;

  // ── Default data (fallback when Convex is unavailable) ──────────────
  const DEFAULT_ICONS = [
    { label: 'My Computer', icon: '\u{1F4BB}', content: 'Nothing here yet.', order: 0 },
    { label: 'Trash', icon: '\u{1F5D1}\uFE0F', content: 'Empty.', order: 1 },
    { label: 'Documents', icon: '\u{1F4C1}', content: 'CV.pdf\nProjects.txt', order: 2 },
    { label: 'Exit OS', icon: '\u{1F50C}', action: 'exit', order: 3 },
  ];

  const DEFAULT_WINDOWS = [
    { title: 'Welcome.txt', content: 'Welcome to OS Mode.\nDouble click icons to open.\nDrag windows to organize.', x: 100, y: 100 },
    { title: 'System Info', content: 'CPU: Neural Engine\nRAM: Infinite\nOS: S3NIK OS v1', x: 200, y: 200 },
  ];

  // ── Runtime state ──────────────────────────────────────────────────
  let icons: Array<{ label: string; icon: string; content?: string; action?: string; order?: number }> = [...DEFAULT_ICONS];
  let desktopColor = '#008080';

  let windows: Array<{ id: number; title: string; content: string; x: number; y: number; z: number }> = DEFAULT_WINDOWS.map((w, i) => ({
    ...w,
    id: i + 1,
    z: i + 1,
  }));

  let activeWindowId = 2;
  let draggingId: number | null = null;
  let dragOffset = { x: 0, y: 0 };

  // ── Subscribe to Convex ────────────────────────────────────────────
  onMount(() => {
    try {
      const client = getConvexClient();
      const unsub = client.onUpdate(api.os.getOsConfig, {}, (data) => {
        if (data) {
          // Replace icons with Convex data, sorted by order
          const convexIcons = [...(data.icons ?? [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
          if (convexIcons.length > 0) {
            icons = convexIcons;
          }

          // Reset windows from Convex initial data
          const convexWindows = data.initialWindows ?? [];
          if (convexWindows.length > 0) {
            windows = convexWindows.map((w: any, i: number) => ({
              id: i + 1,
              title: w.title,
              content: w.content,
              x: w.x,
              y: w.y,
              z: i + 1,
            }));
            activeWindowId = windows.length;
          }

          // Desktop color
          if (data.desktopColor) {
            desktopColor = data.desktopColor;
          }
        }
      });
      return () => unsub();
    } catch {
      // Convex unavailable — keep hardcoded defaults
    }
  });

  function handleIconClick(icon: any) {
    if (icon.action === 'exit') {
        goto('/');
        return;
    }

    // Check if already open
    const existing = windows.find(w => w.title === icon.label);
    if (existing) {
        focusWindow(existing.id);
        return;
    }

    // Open new
    const newId = Date.now();
    windows = [...windows, {
        id: newId,
        title: icon.label,
        content: icon.content || 'Folder is empty.',
        x: 100 + (windows.length * 20),
        y: 100 + (windows.length * 20),
        z: getMaxZ() + 1
    }];
    activeWindowId = newId;
  }

  function closeWindow(id: number) {
    windows = windows.filter(w => w.id !== id);
  }

  function getMaxZ() {
    return Math.max(0, ...windows.map(w => w.z));
  }

  function onMouseDown(id: number, e: MouseEvent) {
    activeWindowId = id;
    // update Z
    const winIndex = windows.findIndex(w => w.id === id);
    if (winIndex >= 0) {
       windows[winIndex].z = getMaxZ() + 1;
    }

    draggingId = id;
    const rect = (e.target as HTMLElement).closest('.window')!.getBoundingClientRect();
    dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (draggingId === null) return;

    windows = windows.map(w => {
      if (w.id === draggingId) {
        return {
          ...w,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
      }
      return w;
    });
  }

  function onMouseUp() {
    draggingId = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  function focusWindow(id: number) {
    activeWindowId = id;
    const winIndex = windows.findIndex(w => w.id === id);
    if (winIndex >= 0) {
       windows[winIndex].z = getMaxZ() + 1;
    }
  }

</script>

<svelte:head>
  {#if !embedded}
    <title>OS Mode</title>
    <meta name="theme-color" content="#3b82f6" />
    <style>
      body {
          margin: 0;
          overflow: hidden;
          background-color: transparent;
          background-image: none;
      }
    </style>
  {/if}
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="desktop"
  {id}
  style:--desktop-position={embedded ? 'relative' : 'fixed'}
  style:--desktop-height={embedded ? '80vh' : 'calc(100vh - 100px)'}
  style:--desktop-top={embedded ? '0' : '100px'}
  style:--desktop-width={embedded ? '100%' : '100vw'}
  style:--desktop-bg={desktopColor}
>

  <div class="icons">
    {#each icons as icon}
      <button class="icon-item" on:dblclick={() => handleIconClick(icon)} on:touchstart={() => handleIconClick(icon)}>
        <div class="icon-emoji">{icon.icon}</div>
        <span class="icon-label">{icon.label}</span>
      </button>
    {/each}
  </div>

  {#each windows as win (win.id)}
    <div
      class="window"
      class:active={activeWindowId === win.id}
      style="left: {win.x}px; top: {win.y}px; z-index: {win.z}"
      on:mousedown={() => focusWindow(win.id)}
    >
      <div class="title-bar" on:mousedown={(e) => onMouseDown(win.id, e)}>
        <div class="title-bar-text">{win.title}</div>
        <div class="title-bar-controls">
          <button class="btn-close" on:click|stopPropagation={() => closeWindow(win.id)} aria-label="Close">&times;</button>
        </div>
      </div>
      <div class="content">
        <pre>{win.content}</pre>
      </div>
    </div>
  {/each}

  <div class="taskbar">
    <button class="start-btn" on:click={() => goto('/')}>EXIT</button>
    <div class="running-apps">
      {#each windows as win}
        <button class="taskbar-item" class:active={activeWindowId === win.id} on:click={() => focusWindow(win.id)}>
          {win.title}
        </button>
      {/each}
    </div>
    <div class="clock">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
  </div>

</div>

<style>
  .desktop {
    width: var(--desktop-width, 100vw);
    height: var(--desktop-height, calc(100vh - 100px));
    position: var(--desktop-position, fixed);
    top: var(--desktop-top, 100px);
    left: 0;
    background-color: var(--desktop-bg, #008080); /* Teal95 */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .icons {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    width: 80px;
    cursor: pointer;
    background: none;
    border: none;
    color: white;
  }

  .icon-item:hover {
     opacity: 0.8;
  }

  .icon-emoji {
    font-size: 32px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }

  .icon-label {
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    font-size: 12px;
    text-align: center;
    background: rgba(0,0,0,0.2);
    padding: 2px 4px;
    border-radius: 2px;
  }

  /* Windows 95 Style */
  .window {
    position: absolute;
    width: 300px;
    background: #c0c0c0;
    border: 2px solid #dfdfdf;
    border-right-color: #000000;
    border-bottom-color: #000000;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
  }

  .title-bar {
    background: #000080;
    padding: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: grab;
    margin: 2px;
  }

  .window.active .title-bar {
    background: #000080;
  }

  .window:not(.active) .title-bar {
    background: #808080;
  }

  .title-bar-text {
    color: white;
    font-weight: bold;
    font-size: 12px;
    margin-left: 2px;
  }

  .btn-close {
    width: 16px;
    height: 14px;
    background: #c0c0c0;
    border: 1px solid #ffffff;
    border-right-color: #000000;
    border-bottom-color: #000000;
    font-size: var(--font-size-2xs, 0.75rem);
    line-height: 1;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: 2px;
  }

  .btn-close:active {
    border: 1px solid #000000;
    border-right-color: #ffffff;
    border-bottom-color: #ffffff;
    transform: translate(1px, 1px);
  }

  .content {
    background: white;
    margin: 2px;
    flex: 1;
    min-height: 100px;
    font-size: 13px;
    border: 2px solid #808080;
    border-right-color: #ffffff;
    border-bottom-color: #ffffff;
    padding: 8px;
  }

  .content pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: monospace;
  }

  .taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 28px;
    background: #c0c0c0;
    border-top: 2px solid #ffffff;
    display: flex;
    align-items: center;
    padding: 2px;
    gap: 4px;
    z-index: 10000;
  }

  .start-btn {
    height: 22px;
    padding: 0 10px;
    font-weight: bold;
    background: #c0c0c0;
    border: 2px solid #ffffff;
    border-right-color: #000000;
    border-bottom-color: #000000;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .start-btn:active {
     border: 2px solid #000000;
     border-right-color: #ffffff;
     border-bottom-color: #ffffff;
  }

  .running-apps {
    flex: 1;
    display: flex;
    gap: 2px;
    padding-left: 4px;
    border-left: 1px solid #808080;
  }

  .taskbar-item {
    height: 22px;
    padding: 0 10px;
    background: #c0c0c0;
    border: 2px solid #ffffff;
    border-right-color: #000000;
    border-bottom-color: #000000;
    cursor: pointer;
    min-width: 100px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: var(--font-size-xs, 0.75rem);
  }

  .taskbar-item.active {
    background: #e0e0e0;
    border: 2px solid #000000;
    border-right-color: #ffffff;
    border-bottom-color: #ffffff;
    font-weight: bold;
    background: repeating-linear-gradient(
      45deg,
      #c0c0c0,
      #c0c0c0 2px,
      #ffffff 2px,
      #ffffff 4px
    );
  }

  .clock {
    padding: 0 10px;
    border: 2px solid #808080;
    border-right-color: #ffffff;
    border-bottom-color: #ffffff;
    background: #c0c0c0;
    height: 22px;
    display: flex;
    align-items: center;
    font-size: var(--font-size-xs, 0.75rem);
  }
</style>
