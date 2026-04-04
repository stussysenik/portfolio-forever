<!-- 
  ExperimentLoader Component
  Loads sandboxed WebGPU/WASM experiments with feature detection and fallbacks
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { checkAllFeatures, type LabExperiment } from '$lib/data/labs';

  export let experiment: LabExperiment;

  let container: HTMLDivElement;
  let support = { supported: false, missing: [] as string[] };
  let isLoading = true;
  let hasError = false;
  let errorMessage = '';

  onMount(() => {
    support = checkAllFeatures(experiment.requiredFeatures);
    
    if (!support.supported) {
      isLoading = false;
    }
  });

  function handleIframeLoad() {
    isLoading = false;
  }

  function handleIframeError() {
    isLoading = false;
    hasError = true;
    errorMessage = 'Failed to load experiment';
  }

  function getFeatureIcon(feature: string): string {
    switch (feature) {
      case 'webgpu': return '◆';
      case 'webgl2': return '◇';
      case 'wasm': return '⬡';
      case 'shared-array-buffer': return '⟐';
      case 'audio-worklet': return '♪';
      default: return '○';
    }
  }
</script>

<div class="experiment-loader" bind:this={container}>
  <!-- Header -->
  <header class="loader-header">
    <span class="loader-title">{experiment.title}</span>
    <span class="loader-status">{experiment.status.toUpperCase()}</span>
  </header>

  <!-- Main Content Area -->
  <div class="loader-content">
    {#if support.supported && !hasError}
      <!-- Iframe for experiment -->
      <iframe
        src={experiment.entryPoint}
        title={experiment.title}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        on:load={handleIframeLoad}
        on:error={handleIframeError}
        class="experiment-iframe"
        class:loading={isLoading}
      ></iframe>

      {#if isLoading}
        <div class="loading-overlay">
          <div class="loading-spinner">
            <span class="spinner-char">◐</span>
            <span class="spinner-char">◓</span>
            <span class="spinner-char">◑</span>
            <span class="spinner-char">◒</span>
          </div>
          <span class="loading-text">Initializing experiment...</span>
          <span class="loading-memory">Memory budget: {experiment.memoryBudget}MB</span>
        </div>
      {/if}
    {:else}
      <!-- Fallback for unsupported browsers -->
      <div class="fallback-container">
        <img 
          src={experiment.fallbackImage} 
          alt="Fallback preview for {experiment.title}"
          class="fallback-image"
          on:error={(e) => (e.currentTarget as HTMLElement).style.display = 'none'}
        />

        <div class="fallback-overlay">
          <div class="fallback-icon">⚠</div>
          
          {#if hasError}
            <p class="fallback-title">Experiment Failed to Load</p>
            <p class="fallback-message">{errorMessage}</p>
          {:else}
            <p class="fallback-title">Browser Not Supported</p>
            <p class="fallback-message">
              This experiment requires features not available in your browser.
            </p>
          {/if}

          <div class="missing-features">
            <span class="missing-label">Missing:</span>
            {#each support.missing as feature}
              <span class="missing-badge">
                {getFeatureIcon(feature)} {feature}
              </span>
            {/each}
          </div>

          <div class="browser-hints">
            <p class="hint-text">Try opening in:</p>
            <ul class="hint-list">
              <li>Chrome 113+ (Desktop)</li>
              <li>Edge 113+ (Desktop)</li>
            </ul>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Footer with feature badges -->
  <footer class="loader-footer">
    <div class="feature-badges">
      {#each experiment.requiredFeatures as feature}
        <span 
          class="feature-badge"
          class:missing={support.missing.includes(feature)}
        >
          {getFeatureIcon(feature)} {feature}
        </span>
      {/each}
    </div>

    {#if experiment.sourceUrl}
      <a 
        href={experiment.sourceUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        class="source-link"
      >
        view source →
      </a>
    {/if}
  </footer>
</div>

<style>
  .experiment-loader {
    display: flex;
    flex-direction: column;
    background: #000;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    font-family: var(--font-mono);
  }

  .loader-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    background: var(--color-surface);
    border-bottom: var(--border-width) solid var(--border-color);
  }

  .loader-title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text);
  }

  .loader-status {
    font-size: var(--font-size-xs);
    color: hsl(140, 60%, 50%);
    letter-spacing: var(--letter-spacing-wide);
  }

  .loader-content {
    position: relative;
    aspect-ratio: 16/9;
    background: #000;
  }

  .experiment-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  .experiment-iframe.loading {
    visibility: hidden;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    background: #000;
  }

  .loading-spinner {
    display: flex;
    gap: var(--space-xs);
  }

  .spinner-char {
    font-size: var(--font-size-xl);
    color: var(--color-accent);
    animation: spin 1s steps(4) infinite;
  }

  .spinner-char:nth-child(2) {
    animation-delay: 0.25s;
  }

  .spinner-char:nth-child(3) {
    animation-delay: 0.5s;
  }

  .spinner-char:nth-child(4) {
    animation-delay: 0.75s;
  }

  @keyframes spin {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .loading-text {
    font-size: var(--font-size-sm);
    color: hsl(140, 60%, 50%);
  }

  .loading-memory {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  .fallback-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .fallback-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
  }

  .fallback-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    padding: var(--space-xl);
    text-align: center;
  }

  .fallback-icon {
    font-size: var(--font-size-2xl);
    color: hsl(45, 100%, 50%);
  }

  .fallback-title {
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: hsl(60, 100%, 95%);
  }

  .fallback-message {
    font-size: var(--font-size-sm);
    color: hsl(60, 10%, 70%);
    max-width: 40ch;
  }

  .missing-features {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    justify-content: center;
    margin-top: var(--space-sm);
  }

  .missing-label {
    font-size: var(--font-size-xs);
    color: hsl(60, 10%, 60%);
  }

  .missing-badge {
    font-size: var(--font-size-xs);
    color: hsl(0, 70%, 60%);
    border: 1px solid hsl(0, 70%, 60%);
    padding: 2px var(--space-xs);
    border-radius: var(--radius-sm);
  }

  .browser-hints {
    margin-top: var(--space-md);
    padding: var(--space-md);
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-sm);
  }

  .hint-text {
    font-size: var(--font-size-xs);
    color: hsl(60, 10%, 60%);
    margin-bottom: var(--space-xs);
  }

  .hint-list {
    list-style: none;
    font-size: var(--font-size-xs);
    color: hsl(140, 60%, 50%);
  }

  .hint-list li::before {
    content: '→ ';
  }

  .loader-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    background: var(--color-surface);
    border-top: var(--border-width) solid var(--border-color);
  }

  .feature-badges {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  .feature-badge {
    font-size: var(--font-size-xs);
    color: var(--color-accent);
    border: 1px solid var(--color-accent);
    padding: 2px var(--space-xs);
    border-radius: var(--radius-sm);
  }

  .feature-badge.missing {
    color: hsl(0, 70%, 60%);
    border-color: hsl(0, 70%, 60%);
    opacity: 0.6;
  }

  .source-link {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
  }

  .source-link:hover {
    color: var(--color-accent);
  }
</style>
