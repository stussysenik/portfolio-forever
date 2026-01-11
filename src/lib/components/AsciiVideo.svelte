<!-- 
  AsciiVideo Component
  Enhanced video player with terminal-aesthetic controls
  Features: ASCII progress bar, fullscreen, loop toggle, playback rate
  Updates: Supports YouTube embeds, removed title overlay, text-based progress
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let src: string;
  export let poster: string = '';
  export let title: string = '';
  export let aspectRatio: string = '16/9';

  let containerElement: HTMLDivElement;
  let videoElement: HTMLVideoElement;
  let progressBarElement: HTMLDivElement;
  
  // YouTube State
  let isYoutube = false;
  let youtubeId = '';
  let ytPlayer: any;
  let ytPollInterval: any;

  // Playback state
  let isPlaying = false;
  let isMuted = true;
  let isLooping = true;
  let isFullscreen = false;
  let playbackRate = 1;
  
  // Progress state
  let currentTime = 0;
  let duration = 0;
  let percentage = 0;
  let loadedPercentage = 0;
  
  // UI state
  let isLoaded = false;
  let isHovering = false;
  let hasStarted = false;

  // ASCII Config Removed
  
  // Detect YouTube
  $: {
    const ytMatch = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) {
      isYoutube = true;
      youtubeId = ytMatch[1];
      hasStarted = false;
    } else {
      isYoutube = false;
      youtubeId = '';
    }
  }
  
  // YouTube Thumbnail
  $: coverUrl = poster || (isYoutube ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : '');

  // ASCII Bar Generation Removed

  function togglePlay() {
    if (isYoutube && ytPlayer && ytPlayer.playVideo) {
       hasStarted = true;
       if (isPlaying) {
         ytPlayer.pauseVideo();
       } else {
         ytPlayer.playVideo();
       }
    } else if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (isYoutube && ytPlayer && ytPlayer.mute) {
      if (isMuted) ytPlayer.mute(); else ytPlayer.unMute();
    } else if (videoElement) {
      videoElement.muted = isMuted;
    }
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

  function handleTimeUpdate() {
    if (!isYoutube && videoElement) {
        currentTime = videoElement.currentTime;
        duration = videoElement.duration || 1; // avoid divide by zero
        percentage = (currentTime / duration) * 100;
        
        if (videoElement.buffered.length > 0) {
            loadedPercentage = (videoElement.buffered.end(videoElement.buffered.length - 1) / duration) * 100;
        }
    }
  }

  function handleLoadedMetadata() {
    if (!isYoutube && videoElement) {
        duration = videoElement.duration;
        isLoaded = true;
        videoElement.loop = isLooping;
    }
  }

  function handleSeek(event: MouseEvent) {
    const rect = progressBarElement.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const seekTime = pos * duration;
    
    if (isYoutube && ytPlayer && ytPlayer.seekTo) {
        ytPlayer.seekTo(seekTime, true);
        currentTime = seekTime;
        percentage = pos * 100;
    } else if (videoElement) {
        videoElement.currentTime = seekTime;
    }
  }

  function formatTime(seconds: number): string {
    if (!isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // YouTube Logic
  function initYoutubePlayer() {
     if (typeof window === 'undefined') return;
     
     // @ts-ignore
     if (!window.YT || !window.YT.Player) {
         if (!document.querySelector('#yt-api-script')) {
            const tag = document.createElement('script');
            tag.id = 'yt-api-script';
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
         }
         const check = setInterval(() => {
             // @ts-ignore
             if (window.YT && window.YT.Player) {
                 clearInterval(check);
                 createYTPlayer();
             }
         }, 100);
     } else {
         createYTPlayer();
     }
  }

  function createYTPlayer() {
      if (!youtubeId) return;
      // @ts-ignore
      ytPlayer = new window.YT.Player(`yt-player-${youtubeId}`, {
          height: '100%',
          width: '100%',
          videoId: youtubeId,
          playerVars: {
              'playsinline': 1,
              'controls': 0,
              'disablekb': 1,
              'rel': 0,
              'iv_load_policy': 3,
              'modestbranding': 1,
              'fs': 0
          },
          events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
          }
      });
  }

  function onPlayerReady(event: any) {
      isLoaded = true;
      duration = ytPlayer.getDuration();
      ytPlayer.mute();
      isMuted = true;
      
      ytPollInterval = setInterval(() => {
         if (ytPlayer && isPlaying) {
             currentTime = ytPlayer.getCurrentTime();
             duration = ytPlayer.getDuration();
             percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
             loadedPercentage = (ytPlayer.getVideoLoadedFraction() * 100) || 0;
             
             if (isLooping && duration > 0 && currentTime >= duration - 0.5) {
                ytPlayer.seekTo(0);
                ytPlayer.playVideo();
             }
         }
      }, 200);
  }

  function onPlayerStateChange(event: any) {
      if (event.data === 1) {
          isPlaying = true;
          hasStarted = true;
      } else if (event.data === 2) {
          isPlaying = false;
      } else if (event.data === 0) {
          isPlaying = false;
          if (isLooping) {
             ytPlayer.seekTo(0);
             ytPlayer.playVideo();
          }
      }
  }

  onMount(() => {
    const handleFullscreenChange = () => {
      isFullscreen = !!document.fullscreenElement;
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    if (isYoutube) {
        setTimeout(initYoutubePlayer, 100);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (ytPollInterval) clearInterval(ytPollInterval);
      if (ytPlayer && ytPlayer.destroy) ytPlayer.destroy();
    };
  });
  
  // Watch for src change
  $: if (isYoutube && youtubeId && ytPlayer && ytPlayer.loadVideoById) {
      ytPlayer.loadVideoById(youtubeId);
  }

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
  {#if isYoutube}
      <div class="yt-wrapper">
          <div id="yt-player-{youtubeId}"></div>
      </div>
      {#if !hasStarted && coverUrl}
          <div class="yt-cover" style="background-image: url('{coverUrl}')"></div>
      {/if}
      <div class="yt-blocker" on:click={togglePlay}></div>
  {:else}
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
  {/if}

  <!-- Overlay Controls -->
  <div class="controls-overlay" class:visible={isHovering || !isPlaying}>
    
    <!-- Large Play Button (center) only show if paused -->
    {#if !isPlaying && isLoaded}
      <button 
        class="play-button-large" 
        on:click={togglePlay}
        aria-label="Play video"
      >
        ▶
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
        {isPlaying ? '[ II ]' : '[ > ]'}
      </button>

      <!-- Retro Progress Bar -->
      <div 
        bind:this={progressBarElement}
        class="progress-track-container"
        on:click={handleSeek}
        on:keydown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') handleSeek(e as any); }}
        role="slider"
        aria-label="Seek to position"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        tabindex="0"
      >
        <div class="progress-track">
           <!-- Buffered -->
           <div class="progress-buffer" style="width: {loadedPercentage}%"></div>
           <!-- Play Progress -->
           <div class="progress-fill" style="width: {percentage}%"></div>
           <!-- Retro Thumb -->
           <div class="progress-thumb" style="left: {percentage}%"></div>
        </div>
      </div>

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
        {isMuted ? '[ M ]' : '[ ♪ ]'}
      </button>

      <!-- Fullscreen -->
      <button 
        class="control-button"
        on:click={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
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

  /* YouTube Specifics */
  .yt-wrapper {
      width: 100%;
      height: 100%;
      pointer-events: none;
  }
  
  .yt-blocker {
      position: absolute;
      inset: 0;
      z-index: 5;
      background: transparent;
  }
  
  .yt-cover {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      z-index: 6; 
      pointer-events: none;
  }

  .controls-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Push content to bottom */
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .controls-overlay.visible {
    opacity: 1;
    pointer-events: all;
  }

  .play-button-large {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: inherit;
    font-size: var(--font-size-xl);
    color: hsl(60, 100%, 95%);
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid hsl(60, 100%, 95%);
    border-radius: var(--radius-sm);
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
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
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    margin: var(--space-sm);
    border-radius: var(--radius-sm);
  }

  .control-button {
    font-family: inherit;
    font-size: var(--font-size-xs);
    color: hsl(60, 100%, 95%);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--space-xs) var(--space-2xs);
    transition: color var(--duration-fast) var(--easing);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .control-button:hover {
    color: hsl(140, 60%, 50%);
  }

  /* ASCII Progress Bar */
  /* Retro Progress Bar */
  .progress-track-container {
    flex: 1;
    min-width: 0;
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0 var(--space-xs);
    position: relative;
    user-select: none;
    -webkit-user-select: none;
  }

  .progress-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    position: relative;
  }

  .progress-buffer {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    pointer-events: none;
  }

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: hsl(140, 60%, 50%); /* Terminal Green */
    border-radius: 2px;
    pointer-events: none;
  }

  .progress-thumb {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    background: #ff4444; /* Retro Red */
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 
        inset 1px 1px 2px rgba(255, 255, 255, 0.4),
        inset -1px -1px 2px rgba(0, 0, 0, 0.4),
        0 1px 3px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    z-index: 2;
  }

  .progress-track-container:hover .progress-thumb {
    transform: translate(-50%, -50%) scale(1.2);
    /* Make it pop on hover */
    background: #ff5555;
    box-shadow: 
        inset 1px 1px 3px rgba(255, 255, 255, 0.5),
        inset -1px -1px 3px rgba(0, 0, 0, 0.3),
        0 2px 6px rgba(0, 0, 0, 0.6);
  }

  /* Responsive tweak for mobile */
  @media (max-width: 640px) {
      .progress-thumb {
          width: 12px;
          height: 12px;
      }
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
    pointer-events: none;
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

  /* Responsive */
  @media (max-width: 640px) {
    .controls-bar {
      gap: var(--space-2xs);
      padding: var(--space-xs) var(--space-sm);
      margin: 0;
      border-radius: 0;
    }

    .control-button {
      font-size: 10px;
      padding: var(--space-2xs);
    }

    .time-display {
      font-size: 10px;
      min-width: 8ch;
    }
    
    .progress-container-ascii {
       font-size: 10px;
    }
  }
</style>
