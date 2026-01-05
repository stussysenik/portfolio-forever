<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { siteConfig, socialLinks, profile } from '$lib/data/content';
  import CommandPalette from '$lib/components/CommandPalette.svelte';

  // Navigation - ordered by importance
  const mainNav = [
    { href: '/', label: 'works' },
    { href: '/likes', label: 'likes' },
    { href: '/notes', label: 'notes' },
    { href: '/cv', label: 'cv' },
    { href: '/terminal', label: 'terminal' },
    { href: '/process', label: 'process' },
    // { href: '/labs', label: 'labs' },
    // { href: '/gallery', label: 'gallery' }, // this is supposed to be the video grid reference that I saw, the more pictures you gather so it becomes the medium
    // { href: '/os', label: 'os' },
  ];

  $: currentPath = $page.url.pathname;

  function handleGlobalSlash(e: KeyboardEvent) {
    if (typeof document === 'undefined') return;

    // Check if user is typing in an input
    const active = document.activeElement;
    if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || active?.getAttribute('contenteditable') === 'true') {
      return;
    }

    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      // Trigger Command Palette with '?' key logic
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
    }
  }
</script>

<svelte:window on:keydown={handleGlobalSlash} />

<svelte:head>
  <title>{siteConfig.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Command Palette (global) -->
<CommandPalette />

<header class="header">
  <div class="header-inner">
    <a href="/" class="header-name">{siteConfig.name}</a>

    <nav class="nav" aria-label="Main">
      {#each mainNav as item}
        <a
          href={item.href}
          class="nav-link"
          class:active={currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="header-actions">
      <nav class="social" aria-label="Social">
        {#each socialLinks.slice(0, 3) as link}
          <a href={link.url} target="_blank" rel="noopener">{link.label}</a>
        {/each}
      </nav>
    </div>
  </div>
</header>

<main>
  <slot />
</main>

<footer class="terminal">
  <div class="terminal-left">
    <span class="terminal-os">SENIK OS</span>
    <span class="terminal-sep">·</span>
    <span class="terminal-path">{currentPath}</span>
  </div>
  <div class="terminal-right">
    <button class="terminal-hint-btn" on:click={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))}>
      <span class="terminal-hint">/ for CMDs</span>
    </button>
    {#if profile.available}
      <span class="terminal-sep">·</span>
      <span class="terminal-status">
        <span class="status-indicator"></span>
        available
      </span>
    {/if}
  </div>
</footer>

<style>
  .header {
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-md);
    border-bottom: var(--border-width) solid var(--border-color-subtle);
  }

  .header-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm);
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--container-padding);
  }

  @media (min-width: 768px) {
    .header-inner {
      gap: var(--space-lg);
    }
  }

  .header-name {
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    text-decoration: none;
    letter-spacing: var(--letter-spacing-tight);
    margin-right: auto;
  }

  @media (min-width: 768px) {
    .header-name {
      font-size: var(--font-size-lg);
      margin-right: 0;
    }
  }

  .nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  @media (min-width: 768px) {
    .nav {
      margin-left: auto;
      gap: var(--space-lg);
    }
  }

  .nav-link {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-muted);
    text-transform: lowercase;
    padding: var(--space-xs) 0;
    position: relative;
    transition: color var(--duration-fast) var(--easing);
  }

  .nav-link:hover {
    color: var(--color-text);
  }

  .nav-link.active {
    color: var(--color-text);
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--color-text);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-left: auto;
  }

  @media (min-width: 768px) {
    .header-actions {
       margin-left: 0;
    }
  }

  .social {
    display: none;
    gap: var(--space-md);
  }

  @media (min-width: 768px) {
    .social {
      display: flex;
    }
  }

  .social a {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    transition: color var(--duration-fast) var(--easing);
  }

  .social a:hover {
    color: var(--color-text-muted);
  }

  /* Terminal Status Bar */
  .terminal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--container-padding);
    background: var(--color-surface);
    border-top: var(--border-width) solid var(--border-color);
    font-family: var(--font-mono);
    font-size: var(--font-size-2xs);
    z-index: 100;
    transition: background-color var(--duration-slow) var(--easing);
  }

  .terminal-left,
  .terminal-right {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .terminal-os {
    color: var(--color-text-subtle);
  }

  .terminal-sep {
    color: var(--color-text-subtle);
    opacity: 0.5;
  }

  .terminal-path {
    color: var(--color-text-muted);
  }

  .terminal-hint-btn {
     background: none;
     border: none;
     padding: 0;
     cursor: pointer;
     font: inherit;
  }

  .terminal-hint {
    color: var(--color-text-subtle);
    padding: var(--space-3xs) var(--space-xs);
    background: var(--color-bg-alt);
    border-radius: var(--radius-sm);
  }

  .terminal-status {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--color-success);
  }

  .status-indicator {
    position: relative;
    width: 6px;
    height: 6px;
    background: #00ff00; /* Bright Green */
    border-radius: 50%;
    box-shadow: 0 0 5px #00ff00;
  }

  .status-indicator::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #00ff00;
    animation: radar-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  @keyframes radar-ping {
    0% {
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
    100% {
      width: 300%;
      height: 300%;
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @media (max-width: 767px) {
    .terminal {
      position: relative;
      margin-top: var(--space-3xl);
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .terminal-hint {
      display: none;
    }
  }
</style>
