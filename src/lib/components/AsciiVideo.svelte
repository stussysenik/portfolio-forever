<!-- 
  AsciiVideo Component
  Enhanced video player with terminal-aesthetic controls
  Features: Full-width progress bar, fullscreen, loop toggle, playback rate
-->
<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string;
  export let poster: string = '';
  export let title: string = '';
  export let aspectRatio: string = '16/9';

  let containerElement: HTMLDivElement;
  let videoElement: HTMLVideoElement;
  let progressBarElement: HTMLButtonElement;
  
  // Playback state
  let isPlaying = false;
  let isMuted = true;
  let isLooping = true;
  let isFullscreen = false;
  let playbackRate = 1;
  
  // Progress state
  let currentTime = 0;
  let duration = 0;
  let progress = 0;
  let buffered = 0;
  
  // UI state
  let isLoaded = false;
  let isHovering = false;

  function togglePlay() {
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    videoElement.muted = isMuted;
  }

  function toggleLoop() {
    isLooping = !isLooping;
    videoElement.loop = isLooping;
  }

  function toggleFullscreen() {
    if (typeof document === 'undefined') return;
    
    if (!document.fullscreenElement) {
      containerElement.requestFullscreen().then(() => {
        isFullscreen = true;
      }).catch(err => {
        console.warn('Fullscreen failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        isFullscreen = false;
      });
    }
  }

  function cyclePlaybackRate() {
    const rates = [0.5, 1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    playbackRate = rates[(currentIndex + 1) % rates.length];
    videoElement.playbackRate = playbackRate;
  }

  function handleTimeUpdate() {
    currentTime = videoElement.currentTime;
    progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    
    // Update buffered progress
    if (videoElement.buffered.length > 0) {
      buffered = (videoElement.buffered.end(videoElement.buffered.length - 1) / duration) * 100;
    }
  }

  function handleLoadedMetadata() {
    duration = videoElement.duration;
    isLoaded = true;
    videoElement.loop = isLooping;
  }

  function handleSeek(event: MouseEvent) {
    const rect = progressBarElement.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    videoElement.currentTime = pos * duration;
  }

  function formatTime(seconds: number): string {
    if (!isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onMount(() => {
    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      isFullscreen = !!document.fullscreenElement;
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  });
</script>

<div 
  bind:this={containerElement}
  class="ascii-video" 
  class:fullscreen={isFullscreen}
  style="aspect-ratio: {aspectRatio}"
  on:mouseenter={() => isHovering = true}
  on:mouseleave={() => isHovering = false}
  role="group"
  aria-label="Video player: {title}"
>
  <video
    bind:this={videoElement}
    {src}
    {poster}
    muted={isMuted}
    loop={isLooping}
    playsinline
    preload="metadata"
    on:play={() => isPlaying = true}
    on:pause={() => isPlaying = false}
    on:timeupdate={handleTimeUpdate}
    on:loadedmetadata={handleLoadedMetadata}
    on:click={togglePlay}
    class="video-element"
  >
    <track kind="captions" />
  </video>

  <!-- Overlay Controls -->
  <div class="controls-overlay" class:visible={isHovering || !isPlaying}>
    <!-- Top Bar: Title -->
    {#if title}
      <div class="controls-top">
        <span class="video-title">{title}</span>
      </div>
    {/if}

    <!-- Large Play Button (center) -->
    {#if !isPlaying && isLoaded}
      <button 
        class="play-button-large" 
        on:click={togglePlay}
        aria-label="Play video"
      >
        [ ▶ ]
      </button>
    {/if}

    <!-- Bottom Controls Bar -->
    <div class="controls-bar">
      <!-- Play/Pause -->
      <button 
        class="control-button" 
        on:click={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title="{isPlaying ? 'Pause' : 'Play'} (Space)"
      >
        {isPlaying ? '[ II ]' : '[ > ]'}
      </button>

      <!-- Progress Bar - Full Width -->
      <button 
        bind:this={progressBarElement}
        class="progress-container"
        on:click={handleSeek}
        aria-label="Seek to position"
        title="Click to seek"
      >
        <div class="progress-track">
          <div class="progress-buffered" style="width: {buffered}%"></div>
          <div class="progress-fill" style="width: {progress}%"></div>
          <div class="progress-thumb" style="left: {progress}%"></div>
        </div>
      </button>

      <!-- Time -->
      <span class="time-display">
        {formatTime(currentTime)}/{formatTime(duration)}
      </span>

      <!-- Mute -->
      <button 
        class="control-button" 
        on:click={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title="Toggle mute (M)"
      >
        {isMuted ? '[ M ]' : '[ ♪ ]'}
      </button>

      <!-- Fullscreen -->
      <button 
        class="control-button"
        on:click={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        title="Toggle fullscreen (F)"
      >
        [ :: ]
      </button>
    </div>
  </div>

  <!-- Loading State -->
  {#if !isLoaded}
    <div class="loading-overlay">
      <span class="loading-text">Loading...</span>
    </div>
  {/if}
</div>

<style>
  .ascii-video {
    position: relative;
    background: #0a0a0a;
    border-radius: var(--radius-md);
    overflow: hidden;
    font-family: var(--font-mono);
    cursor: pointer;
  }

  .ascii-video.fullscreen {
    border-radius: 0;
  }

  .video-element {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .controls-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.7) 0%,
      transparent 25%,
      transparent 75%,
      rgba(0, 0, 0, 0.85) 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .controls-overlay.visible {
    opacity: 1;
    pointer-events: all;
  }

  .controls-top {
    padding: var(--space-md) var(--space-lg);
  }

  .video-title {
    font-size: var(--font-size-sm);
    color: hsl(60, 100%, 95%);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    font-weight: 500;
  }

  .play-button-large {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: inherit;
    font-size: var(--font-size-3xl);
    color: hsl(60, 100%, 95%);
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid hsl(60, 100%, 95%);
    border-radius: var(--radius-md);
    padding: var(--space-lg) var(--space-xl);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .play-button-large:hover {
    transform: translate(-50%, -50%) scale(1.05);
    color: hsl(140, 60%, 50%);
    border-color: hsl(140, 60%, 50%);
    background: rgba(0, 0, 0, 0.8);
  }

  .controls-bar {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }

  .control-button {
    font-family: inherit;
    font-size: var(--font-size-xs);
    color: hsl(60, 100%, 95%);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--space-xs) var(--space-2xs);
    transition: color 0.15s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .control-button:hover {
    color: hsl(140, 60%, 50%);
  }

  .control-button.active {
    color: hsl(140, 60%, 50%);
  }

  /* Full-width Progress Bar */
  .progress-container {
    flex: 1;
    min-width: 0;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: var(--space-sm) 0;
    font-family: inherit;
    display: flex;
    align-items: center;
  }

  .progress-track {
    position: relative;
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
    overflow: visible;
  }

  .progress-buffered {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 3px;
    transition: width 0.1s ease;
  }

  .progress-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: hsl(140, 60%, 50%);
    border-radius: 3px;
    transition: width 0.05s linear;
  }

  .progress-thumb {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    background: hsl(140, 60%, 50%);
    border: 2px solid hsl(60, 100%, 95%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .progress-container:hover .progress-thumb {
    transform: translate(-50%, -50%) scale(1.2);
  }

  .time-display {
    font-size: var(--font-size-xs);
    color: hsl(60, 100%, 85%);
    font-variant-numeric: tabular-nums;
    min-width: 10ch;
    text-align: center;
    flex-shrink: 0;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.9);
  }

  .loading-text {
    font-size: var(--font-size-sm);
    color: hsl(140, 60%, 50%);
    animation: blink 1s steps(1) infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  /* Fullscreen adjustments */
  .fullscreen .controls-bar {
    padding: var(--space-md) var(--space-xl);
  }

  .fullscreen .video-title {
    font-size: var(--font-size-lg);
  }

  .fullscreen .control-button {
    font-size: var(--font-size-sm);
  }

  .fullscreen .progress-track {
    height: 8px;
  }

  .fullscreen .progress-thumb {
    width: 18px;
    height: 18px;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .controls-bar {
      gap: var(--space-2xs);
      padding: var(--space-xs) var(--space-sm);
    }

    .control-button {
      font-size: 10px;
      padding: var(--space-2xs);
    }

    .time-display {
      font-size: 10px;
      min-width: 8ch;
    }

    .progress-track {
      height: 4px;
    }

    .progress-thumb {
      width: 10px;
      height: 10px;
    }
  }
</style>
