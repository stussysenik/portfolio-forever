<!-- 
  AsciiVideo Component
  Custom video player with terminal-aesthetic controls
  Uses ASCII glyphs for UI elements as per design spec
-->
<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string;
  export let poster: string = '';
  export let title: string = '';
  export let aspectRatio: string = '16/9';

  let videoElement: HTMLVideoElement;
  let isPlaying = false;
  let isMuted = true;
  let currentTime = 0;
  let duration = 0;
  let progress = 0;
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

  function handleTimeUpdate() {
    currentTime = videoElement.currentTime;
    progress = (currentTime / duration) * 100;
  }

  function handleLoadedMetadata() {
    duration = videoElement.duration;
    isLoaded = true;
  }

  function handleSeek(event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    videoElement.currentTime = pos * duration;
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Generate ASCII progress bar
  function getProgressBar(progress: number, width: number = 30): string {
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
</script>

<div 
  class="ascii-video" 
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
    loop
    playsinline
    preload="metadata"
    on:play={() => isPlaying = true}
    on:pause={() => isPlaying = false}
    on:timeupdate={handleTimeUpdate}
    on:loadedmetadata={handleLoadedMetadata}
    class="video-element"
  >
    <track kind="captions" />
  </video>

  <!-- Overlay Controls -->
  <div class="controls-overlay" class:visible={isHovering || !isPlaying}>
    {#if title}
      <div class="video-title">{title}</div>
    {/if}

    <!-- Large Play Button (center) -->
    {#if !isPlaying}
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
      >
        {isPlaying ? '[ ❚❚ ]' : '[ ▶ ]'}
      </button>

      <!-- Progress Bar -->
      <button 
        class="progress-container"
        on:click={handleSeek}
        aria-label="Seek to position"
      >
        <span class="progress-bar">{getProgressBar(progress)}</span>
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
      >
        {isMuted ? '[ 🔇 ]' : '[ 🔊 ]'}
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
    background: #000;
    border-radius: var(--radius-md);
    overflow: hidden;
    font-family: var(--font-mono);
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
      transparent 30%,
      transparent 70%,
      rgba(0, 0, 0, 0.9) 100%
    );
    opacity: 0;
    transition: opacity var(--duration-fast) var(--easing);
    pointer-events: none;
  }

  .controls-overlay.visible {
    opacity: 1;
    pointer-events: all;
  }

  .video-title {
    padding: var(--space-md);
    font-size: var(--font-size-sm);
    color: hsl(60, 100%, 95%);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }

  .play-button-large {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: inherit;
    font-size: var(--font-size-2xl);
    color: hsl(60, 100%, 95%);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform var(--duration-fast) var(--easing);
  }

  .play-button-large:hover {
    transform: translate(-50%, -50%) scale(1.1);
    color: hsl(140, 60%, 50%);
  }

  .controls-bar {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background: rgba(0, 0, 0, 0.5);
  }

  .control-button {
    font-family: inherit;
    font-size: var(--font-size-xs);
    color: hsl(60, 100%, 95%);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--space-xs);
    transition: color var(--duration-fast) var(--easing);
  }

  .control-button:hover {
    color: hsl(140, 60%, 50%);
  }

  .progress-container {
    flex: 1;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: var(--space-xs) 0;
    font-family: inherit;
  }

  .progress-bar {
    font-size: var(--font-size-xs);
    color: hsl(140, 60%, 50%);
    letter-spacing: -0.1em;
    display: block;
    text-align: left;
  }

  .time-display {
    font-size: var(--font-size-xs);
    color: hsl(60, 100%, 85%);
    font-variant-numeric: tabular-nums;
    min-width: 10ch;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
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
</style>
