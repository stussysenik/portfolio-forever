<!-- 
  WaveformPlayer Component
  Audio player with ASCII waveform/EQ visualization
  Uses Web Audio API for real-time frequency analysis
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let src: string;
  export let title: string = '';
  export let artist: string = '';

  let audioElement: HTMLAudioElement;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let dataArray: Uint8Array;

  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  let progress = 0;
  let isLoaded = false;

  // Visualization state
  let waveformBars: string[] = Array(32).fill('░');
  let animationId: number;

  onMount(() => {
    // Setup Web Audio API for visualization
    audioElement.addEventListener('play', setupAudioContext);
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (audioContext) audioContext.close();
  });

  function setupAudioContext() {
    if (audioContext) return;

    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64; // 32 bands

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    dataArray = new Uint8Array(analyser.frequencyBinCount);
    updateVisualization();
  }

  function updateVisualization() {
    if (!analyser || !isPlaying) return;

    analyser.getByteFrequencyData(dataArray as any);

    waveformBars = Array.from(dataArray).map(value => {
      const normalized = value / 255;
      const index = Math.floor(normalized * 8);
      const chars = ['░', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
      return chars[index] || '░';
    });

    animationId = requestAnimationFrame(updateVisualization);
  }

  function togglePlay() {
    if (isPlaying) {
      audioElement.pause();
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      audioElement.play();
      updateVisualization();
    }
  }

  function handleTimeUpdate() {
    currentTime = audioElement.currentTime;
    progress = (currentTime / duration) * 100;
  }

  function handleLoadedMetadata() {
    duration = audioElement.duration;
    isLoaded = true;
  }

  function handleSeek(event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    audioElement.currentTime = pos * duration;
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function getProgressBar(progress: number, width: number = 40): string {
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    return '═'.repeat(filled) + '─'.repeat(empty);
  }
</script>

<div class="waveform-player" role="group" aria-label="Audio player: {title}">
  <audio
    bind:this={audioElement}
    {src}
    preload="metadata"
    on:play={() => isPlaying = true}
    on:pause={() => isPlaying = false}
    on:timeupdate={handleTimeUpdate}
    on:loadedmetadata={handleLoadedMetadata}
  />

  <!-- Header: Title & Artist -->
  <div class="player-header">
    <span class="player-icon">{isPlaying ? '♫' : '♪'}</span>
    <div class="player-info">
      <span class="player-title">{title || 'Untitled Track'}</span>
      {#if artist}
        <span class="player-artist">— {artist}</span>
      {/if}
    </div>
    <span class="player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
  </div>

  <!-- ASCII Waveform Visualization -->
  <div class="waveform-container">
    <div class="waveform-display" aria-hidden="true">
      {#each waveformBars as bar}
        <span class="waveform-bar">{bar}</span>
      {/each}
    </div>
  </div>

  <!-- Progress Bar -->
  <button 
    class="progress-track"
    on:click={handleSeek}
    aria-label="Seek to position"
  >
    <span class="progress-text">{getProgressBar(progress)}</span>
    <span class="progress-indicator" style="left: {progress}%">◆</span>
  </button>

  <!-- Controls -->
  <div class="player-controls">
    <button 
      class="control-btn" 
      on:click={togglePlay}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? '[ ❚❚ PAUSE ]' : '[ ▶ PLAY ]'}
    </button>

    <span class="control-separator">│</span>

    <button 
      class="control-btn"
      on:click={() => audioElement.currentTime = 0}
      aria-label="Restart"
    >
      [ ⟲ ]
    </button>
  </div>

  {#if !isLoaded}
    <div class="loading-indicator">Loading audio...</div>
  {/if}
</div>

<style>
  .waveform-player {
    font-family: var(--font-mono);
    background: var(--color-surface);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .player-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .player-icon {
    font-size: var(--font-size-lg);
    color: var(--color-accent);
  }

  .player-info {
    flex: 1;
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    min-width: 0;
  }

  .player-title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .player-artist {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .player-time {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .waveform-container {
    background: var(--color-bg);
    border-radius: var(--radius-sm);
    padding: var(--space-sm);
    overflow: hidden;
  }

  .waveform-display {
    display: flex;
    justify-content: center;
    gap: 1px;
    height: 2em;
    align-items: flex-end;
  }

  .waveform-bar {
    font-size: var(--font-size-lg);
    line-height: 1;
    color: var(--color-accent);
    transition: color 50ms ease;
  }

  .progress-track {
    position: relative;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: var(--space-xs) 0;
    font-family: inherit;
    text-align: left;
  }

  .progress-text {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    letter-spacing: -0.05em;
  }

  .progress-indicator {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-accent);
    font-size: var(--font-size-xs);
    transition: left 100ms ease;
  }

  .player-controls {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-top: var(--space-xs);
  }

  .control-btn {
    font-family: inherit;
    font-size: var(--font-size-xs);
    color: var(--color-accent);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--space-xs);
    transition: color var(--duration-fast) var(--easing);
  }

  .control-btn:hover {
    color: var(--color-accent-hover);
  }

  .control-separator {
    color: var(--color-text-subtle);
  }

  .loading-indicator {
    font-size: var(--font-size-xs);
    color: var(--color-text-subtle);
    animation: blink 1s steps(1) infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0.5;
    }
  }
</style>
