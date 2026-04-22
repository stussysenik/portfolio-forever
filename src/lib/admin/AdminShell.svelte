<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { createNavParadigmMachine, type NavParadigm } from './stores/navParadigmMachine';

  // Props
  export let pages: any[] = [];
  export let activePage: any = null;
  export let featureFlags: any[] = [];
  export let onToggleFlag: (key: string, category: string) => void = () => {};

  // State machine for navigation paradigm
  const navMachine = createNavParadigmMachine('hybrid');
  let navState = navMachine.getState();

  const unsubNav = navMachine.subscribe((s) => {
    navState = s;
  });

  onMount(() => {
    return () => {
      unsubNav();
    };
  });

  // Preview URL and iframe ref
  $: previewUrl = activePage?.route ?? '/';
  let iframeEl: HTMLIFrameElement;
  let iframeKey = 0;

  // Send config to iframe via postMessage
  function syncToIframe() {
    if (iframeEl?.contentWindow) {
      iframeEl.contentWindow.postMessage({
        type: 'admin:setNavParadigm',
        navParadigm: navState.current === 'none' ? 'hybrid' : navState.current
      }, '*');
      iframeEl.contentWindow.postMessage({
        type: 'admin:setTheme',
        theme: currentTheme
      }, '*');
      iframeEl.contentWindow.postMessage({
        type: 'admin:setFont',
        font: currentFont
      }, '*');
    }
  }

  // Handle switching with animation
  async function handleSwitch(to: NavParadigm) {
    navMachine.send({ type: 'SWITCH', to });
    await tick();
    setTimeout(() => {
      navMachine.send({ type: 'TRANSITION_END' });
      syncToIframe();
    }, 300);
  }

  // Current meta
  let currentTheme = 'minimal';
  let currentFont = 'inter';

  onMount(() => {
    if (typeof document !== 'undefined') {
      currentTheme = document.documentElement.dataset.theme || 'minimal';
      currentFont = document.documentElement.dataset.font || 'inter';
    }
  });

  const paradigms: { id: NavParadigm; label: string }[] = [
    { id: 'sidebar', label: 'SIDEBAR' },
    { id: 'drawer', label: 'DRAWER' },
    { id: 'hybrid', label: 'HYBRID' },
    { id: 'none', label: 'NONE' },
  ];

  const themes = [
    { id: 'minimal', label: 'MINIMAL', swatch: '#2563EB' },
    { id: 'studio', label: 'STUDIO', swatch: '#8a8a8a' },
    { id: 'terminal', label: 'TERMINAL', swatch: '#00d9ff' },
    { id: 'bw', label: 'B&W', swatch: '#1a1a1a' },
    { id: 'inverse', label: 'INVERSE', swatch: '#ffffff' },
  ];

  function selectTheme(themeId: string) {
    currentTheme = themeId;
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = themeId;
      localStorage.setItem('theme', themeId);
    }
    syncToIframe();
  }

  function selectFont(fontId: string) {
    currentFont = fontId;
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.font = fontId;
      localStorage.setItem('preferred-font', fontId);
    }
    syncToIframe();
  }
</script>

<div class="admin-shell" data-admin>
  <!-- Top bar — surgical precision -->
  <header class="topbar">
    <div class="topbar-left">
      <span class="brand">PORTFOLIO.OS</span>
      <span class="sep">|</span>
      <span class="meta">{navState.current.toUpperCase()}</span>
      <span class="sep">|</span>
      <span class="meta">{currentTheme.toUpperCase()}</span>
    </div>
    <div class="topbar-right">
      <span class="status-indicator" class:active={navState.status === 'idle'}></span>
      <span class="status-text">{navState.status.toUpperCase()}</span>
    </div>
  </header>

  <!-- Control surface — navigation paradigm switcher -->
  <nav class="control-surface">
    <div class="control-group">
      <span class="control-label">NAV</span>
      <div class="control-buttons">
        {#each paradigms as p}
          <button
            class="control-btn"
            class:active={navState.current === p.id}
            on:click={() => handleSwitch(p.id)}
          >
            {p.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">THEME</span>
      <div class="control-buttons">
        {#each themes as t}
          <button
            class="control-btn"
            class:active={currentTheme === t.id}
            on:click={() => selectTheme(t.id)}
          >
            <span class="swatch" style="background: {t.swatch}"></span>
            {t.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">FONT</span>
      <div class="control-buttons">
        {#each ['inter', 'jetbrains', 'crimson', 'space'] as f}
          <button
            class="control-btn"
            class:active={currentFont === f}
            on:click={() => selectFont(f)}
          >
            {f.toUpperCase()}
          </button>
        {/each}
      </div>
    </div>

    {#if featureFlags.length > 0}
      <div class="control-group">
        <span class="control-label">FLAGS</span>
        <div class="control-buttons">
          {#each featureFlags as flag}
            <button
              class="control-btn"
              class:active={flag.enabled}
              on:click={() => onToggleFlag(flag.key, flag.category)}
              title="{flag.key}: {flag.enabled ? 'ON' : 'OFF'}"
            >
              <span class="flag-dot" class:on={flag.enabled}></span>
              {flag.key.toUpperCase()}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </nav>

  <!-- Live preview — the proof -->
  <main class="preview-frame">
    <div class="preview-header">
      <span class="preview-label">LIVE PREVIEW</span>
      <span class="preview-route">{previewUrl}</span>
    </div>
    <div class="preview-container">
      {#key iframeKey}
        <iframe
          bind:this={iframeEl}
          src="{typeof window !== 'undefined' ? window.location.origin : ''}{previewUrl}?preview=true&nav={navState.current}"
          title="Live Preview"
          class="preview-iframe"
          sandbox="allow-scripts allow-same-origin"
          on:load={syncToIframe}
        ></iframe>
      {/key}
    </div>
  </main>
</div>

<style>
  /* === Right-Angle Edges Philosophy === */
  /* 0px border-radius. 1px borders. Monospace. Precision. */

  .admin-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    width: 100vw;
    overflow: hidden;
    background: #0a0a0a;
    color: #e8e8e8;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    line-height: 1.4;
    letter-spacing: 0.02em;
  }

  /* === Top Bar === */
  .topbar {
    flex: 0 0 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    border-bottom: 1px solid #1a1a1a;
    background: #0a0a0a;
    text-transform: uppercase;
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .brand {
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #fff;
  }

  .sep {
    color: #333;
  }

  .meta {
    color: #666;
    letter-spacing: 0.06em;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-indicator {
    width: 6px;
    height: 6px;
    background: #333;
    border-radius: 0; /* Right-angle */
  }

  .status-indicator.active {
    background: #44D62C;
    box-shadow: 0 0 4px #44D62C;
  }

  .status-text {
    color: #666;
    font-size: 10px;
    letter-spacing: 0.08em;
  }

  /* === Control Surface === */
  .control-surface {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    border-bottom: 1px solid #1a1a1a;
    background: #0f0f0f;
  }

  .control-group {
    display: flex;
    align-items: center;
    border-right: 1px solid #1a1a1a;
  }

  .control-group:last-child {
    border-right: none;
  }

  .control-label {
    padding: 8px 10px;
    color: #444;
    font-size: 10px;
    letter-spacing: 0.12em;
    font-weight: 600;
    border-right: 1px solid #1a1a1a;
    user-select: none;
  }

  .control-buttons {
    display: flex;
    gap: 0;
  }

  .control-btn {
    padding: 8px 12px;
    font-family: inherit;
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: transparent;
    border: none;
    border-right: 1px solid #1a1a1a;
    color: #666;
    cursor: pointer;
    transition: all 120ms ease;
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
  }

  .control-btn:last-child {
    border-right: none;
  }

  .control-btn:hover {
    color: #ccc;
    background: #1a1a1a;
  }

  .control-btn.active {
    color: #fff;
    background: #1a1a1a;
    border-left: 2px solid #2563EB;
    padding-left: 10px; /* compensate for border */
  }

  .swatch {
    width: 8px;
    height: 8px;
    border-radius: 0;
    border: 1px solid #333;
  }

  .flag-dot {
    width: 6px;
    height: 6px;
    background: #333;
    border-radius: 0;
    transition: background 120ms ease;
  }

  .flag-dot.on {
    background: #44D62C;
    box-shadow: 0 0 3px #44D62C;
  }

  /* === Preview Frame === */
  .preview-frame {
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    background: #000;
  }

  .preview-header {
    flex: 0 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    border-bottom: 1px solid #1a1a1a;
    background: #0a0a0a;
    text-transform: uppercase;
  }

  .preview-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    color: #444;
    font-weight: 600;
  }

  .preview-route {
    font-size: 10px;
    color: #666;
    letter-spacing: 0.04em;
  }

  .preview-container {
    flex: 1 1 0%;
    position: relative;
    overflow: hidden;
    background: #000;
  }

  .preview-iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    background: var(--color-bg, #fff);
  }

  /* === GPU Morphing Animation === */
  /* Applied when nav paradigm changes */
  @keyframes morphIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .preview-iframe {
    animation: morphIn 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* === Responsive === */
  @media (max-width: 767px) {
    .control-surface {
      flex-direction: column;
    }

    .control-group {
      border-right: none;
      border-bottom: 1px solid #1a1a1a;
      width: 100%;
    }

    .control-group:last-child {
      border-bottom: none;
    }

    .control-buttons {
      flex-wrap: wrap;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .preview-iframe {
      animation: none;
    }

    .control-btn {
      transition: none;
    }
  }
</style>
