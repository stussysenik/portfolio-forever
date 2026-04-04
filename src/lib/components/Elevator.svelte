<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let showAfter = 300;

  let visible = false;
  let soundEnabled = true;
  let elevating = false;
  let currentFloor = 0;
  let totalFloors = 0;
  let elevatorFrame: number | null = null;
  let prefersReducedMotion = false;

  let mainAudio: HTMLAudioElement | null = null;
  let dingAudio: HTMLAudioElement | null = null;

  type NavigatorHints = Navigator & {
    connection?: { saveData?: boolean };
  };

  const ELEVATOR_MUSIC = 'https://tholman.com/elevator.js/music/elevator.mp3';
  const DING_SOUND = 'https://tholman.com/elevator.js/music/ding.mp3';

  function shouldAutoMute(): boolean {
    const connection = (navigator as NavigatorHints).connection;
    return prefersReducedMotion || connection?.saveData === true;
  }

  function ensureAudio() {
    if (!browser) return;
    if (!mainAudio) {
      mainAudio = new Audio(ELEVATOR_MUSIC);
      mainAudio.loop = true;
      mainAudio.volume = 0.4;
    }
    if (!dingAudio) {
      dingAudio = new Audio(DING_SOUND);
      dingAudio.volume = 0.6;
    }
  }

  function handleScroll() {
    visible = window.scrollY > showAfter;
    // Update floor based on scroll position (each "floor" = 200px)
    if (!elevating) {
      currentFloor = Math.floor(window.scrollY / 200);
    }
  }

  function elevate() {
    if (elevating || !browser) return;

    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
      currentFloor = 0;
      return;
    }
    
    elevating = true;
    const startPosition = window.scrollY;
    totalFloors = Math.floor(startPosition / 200);
    currentFloor = totalFloors;
    
    // Smart scaling
    const baseDuration = 1500;
    const scaleFactor = Math.sqrt(startPosition) * 30;
    const duration = Math.min(baseDuration + scaleFactor, 6000);
    const startTime = performance.now();

    if (soundEnabled) {
      ensureAudio();
    }

    if (soundEnabled && mainAudio) {
      mainAudio.currentTime = 0;
      mainAudio.play().catch(() => {});
    }

    function animateLoop(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const newPosition = startPosition * (1 - eased);
      window.scrollTo(0, newPosition);
      
      // Update floor counter
      currentFloor = Math.floor(newPosition / 200);

      if (progress < 1) {
        elevatorFrame = requestAnimationFrame(animateLoop);
      } else {
        elevating = false;
        currentFloor = 0;
        elevatorFrame = null;
        
        if (mainAudio) {
          mainAudio.pause();
          mainAudio.currentTime = 0;
        }
        
        if (soundEnabled && dingAudio) {
          dingAudio.currentTime = 0;
          dingAudio.play().catch(() => {});
        }
      }
    }

    elevatorFrame = requestAnimationFrame(animateLoop);
  }

  function toggleSound(e: MouseEvent) {
    e.stopPropagation();
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      ensureAudio();
    }
    
    if (!soundEnabled && mainAudio && !mainAudio.paused) {
      mainAudio.pause();
      mainAudio.currentTime = 0;
    }
  }

  onMount(() => {
    if (!browser) return;

    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    soundEnabled = !shouldAutoMute();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });

  onDestroy(() => {
    if (!browser) return;
    window.removeEventListener('scroll', handleScroll);

    if (elevatorFrame !== null) {
      cancelAnimationFrame(elevatorFrame);
    }
    
    if (mainAudio) {
      mainAudio.pause();
      mainAudio = null;
    }
    dingAudio = null;
  });
</script>

{#if visible}
  <div class="elevator" class:elevating>
    <button
      type="button"
      class="elevator-action"
      on:click={elevate}
      aria-label="Take elevator to top"
    >
      <span class="elevator-panel">
        <span class="floor-display">
          {#if elevating}
            <span class="floor-num">{currentFloor}</span>
          {:else}
            <span class="arrow">↑</span>
          {/if}
        </span>
        <span class="elevator-label">
          {#if elevating}
            going up
          {:else}
            lobby
          {/if}
        </span>
      </span>
    </button>
    <button
      type="button"
      class="sound-btn"
      on:click={toggleSound}
      aria-label={soundEnabled ? 'Mute' : 'Unmute'}
      title={soundEnabled ? '♪ on' : '♪ off'}
    >
      <span class="sound-icon" class:muted={!soundEnabled}>♪</span>
    </button>
  </div>
{/if}

<style>
  .elevator {
    position: fixed;
    bottom: calc(var(--space-md) + 56px);
    right: var(--space-lg);
    
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    
    font-family: var(--font-mono);
    
    background: var(--color-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: var(--space-xs) var(--space-sm);
    
    cursor: pointer;
    z-index: 90;
    
    opacity: 0;
    transform: translateY(8px);
    animation: arrive 0.25s var(--easing-out) forwards;
    transition: border-color var(--duration-fast) var(--easing);
  }

  .elevator-action {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    touch-action: manipulation;
  }

  @keyframes arrive {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .elevator:hover {
    border-color: var(--color-text-muted);
  }

  .elevator-action:focus-visible,
  .sound-btn:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .elevator-panel {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .floor-display {
    display: flex;
    align-items: center;
    justify-content: center;
    
    min-width: 20px;
    height: 20px;
    
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--color-text);
    
    background: var(--color-surface);
    border: 1px solid var(--border-color);
    border-radius: 3px;
  }

  .arrow {
    display: block;
    transition: transform var(--duration-fast) var(--easing);
  }

  .elevator:hover .arrow {
    transform: translateY(-2px);
  }

  .elevating .floor-display {
    background: var(--color-text);
    color: var(--color-bg);
    border-color: var(--color-text);
  }

  .floor-num {
    font-variant-numeric: tabular-nums;
    animation: tick 0.15s var(--easing);
  }

  @keyframes tick {
    0% { transform: translateY(-100%); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  .elevator-label {
    font-size: var(--font-size-2xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color var(--duration-fast) var(--easing);
  }

  .elevator:hover .elevator-label {
    color: var(--color-text-secondary);
  }

  .elevating .elevator-label {
    animation: pulse-label 1s ease infinite;
  }

  @keyframes pulse-label {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .sound-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 18px;
    height: 18px;
    padding: 0;
    
    font-family: inherit;
    font-size: 11px;
    
    background: transparent;
    border: 1px solid transparent;
    border-radius: 2px;
    
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
  }

  .sound-icon {
    color: var(--color-text-subtle);
    transition: opacity var(--duration-fast) var(--easing);
  }

  .sound-icon.muted {
    opacity: 0.3;
    text-decoration: line-through;
  }

  .sound-btn:hover {
    border-color: var(--border-color-subtle);
  }

  .sound-btn:hover .sound-icon {
    color: var(--color-text-muted);
  }

  /* Mobile */
  @media (max-width: 767px) {
    .elevator {
      bottom: calc(var(--space-sm) + 64px);
      right: var(--space-md);
      padding: var(--space-2xs) var(--space-xs);
    }

    .floor-display {
      min-width: 18px;
      height: 18px;
      font-size: var(--font-size-2xs);
    }

    .elevator-label {
      font-size: 9px;
    }

    .sound-btn {
      width: 16px;
      height: 16px;
      font-size: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .elevator,
    .floor-num,
    .elevating .elevator-label {
      animation: none;
    }

    .arrow,
    .elevator,
    .sound-btn,
    .sound-icon,
    .elevator-label {
      transition: none;
    }
  }
</style>
