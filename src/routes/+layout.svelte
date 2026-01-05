<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { siteConfig, socialLinks } from '$lib/data/content';

  // Main navigation routes
  const mainNav = [
    { href: '/', label: 'works' },
    { href: '/cv', label: 'cv' },
    { href: '/notes', label: 'notes' },
    { href: '/labs', label: 'labs' },
    { href: '/scratchpad', label: 'scratchpad' },
    { href: '/minor', label: 'minor' },
  ];

  $: currentPath = $page.url.pathname;
</script>

<svelte:head>
  <title>{siteConfig.title}</title>
  <meta name="description" content="Portfolio of {siteConfig.name} - Creative Technologist" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;450;500;600&display=swap" rel="stylesheet">
</svelte:head>

<header class="header">
  <div class="header-identity">
    <a href="/" class="header-name-link">
      <span class="header-name">{siteConfig.name}</span>
    </a>
    <span class="header-tagline">{siteConfig.tagline}</span>
  </div>
  
  <!-- Main Navigation -->
  <nav class="main-nav" aria-label="Main navigation">
    {#each mainNav as item}
      <a 
        href={item.href} 
        class="main-nav-link"
        class:active={currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))}
        aria-current={currentPath === item.href ? 'page' : undefined}
      >
        {item.label}
      </a>
    {/each}
  </nav>
  
  <!-- Social Links -->
  <nav class="header-nav" aria-label="Social links">
    {#each socialLinks as link}
      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
    {/each}
  </nav>
</header>

<main>
  <slot />
</main>

<!-- Terminal Status Bar -->
<footer class="terminal-bar">
  <span class="terminal-text">◆ {currentPath}</span>
  <span class="terminal-hint">Press ? for keyboard shortcuts</span>
</footer>

<style>
  .header-name-link {
    color: inherit;
    text-decoration: none;
  }
  
  .main-nav {
    display: flex;
    gap: var(--space-lg);
  }
  
  .main-nav-link {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    text-transform: lowercase;
    position: relative;
    padding-bottom: var(--space-xs);
  }
  
  .main-nav-link::before {
    content: '→';
    position: absolute;
    left: calc(-1 * var(--space-md));
    opacity: 0;
    transition: opacity var(--duration-fast) var(--easing);
  }
  
  .main-nav-link:hover {
    color: var(--color-text);
  }
  
  .main-nav-link:hover::before,
  .main-nav-link.active::before {
    opacity: 1;
  }
  
  .main-nav-link.active {
    color: var(--color-text);
  }
  
  .main-nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-accent);
  }
  
  /* Terminal Status Bar */
  .terminal-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) var(--space-md);
    background: var(--color-surface);
    border-top: var(--border-width) solid var(--border-color);
    font-size: var(--font-size-xs);
    z-index: 100;
  }
  
  .terminal-text {
    color: hsl(140, 60%, 50%);
  }
  
  .terminal-hint {
    color: var(--color-text-subtle);
  }
  
  @media (max-width: 700px) {
    .main-nav {
      flex-wrap: wrap;
      gap: var(--space-md);
    }
    
    .terminal-bar {
      position: relative;
      margin-top: var(--space-2xl);
    }
  }
</style>
