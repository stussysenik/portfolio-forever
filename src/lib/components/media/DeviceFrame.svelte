<script lang="ts">
  export let type: 'ios' | 'terminal' | 'browser' | 'none' = 'browser';
</script>

<div class="device-frame" data-type={type}>
  {#if type === 'browser'}
    <div class="browser-header">
      <div class="dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="address-bar"></div>
    </div>
  {/if}
  {#if type === 'terminal'}
    <div class="terminal-header">
      <span></span>
    </div>
  {/if}
  
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .device-frame {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-lg, 12px);
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 1px 8px rgba(0,0,0,0.1);
    background: #1e1e1e; /* A generic dark background */
  }

  /* Browser Frame */
  .device-frame[data-type="browser"] {
    border: 1px solid #444;
  }
  .browser-header {
    height: 2.5rem;
    background: #333;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    gap: 0.5rem;
  }
  .dots {
    display: flex;
    gap: 0.5rem;
  }
  .dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
  }
  .dot.red { background: #ff5f56; }
  .dot.yellow { background: #ffbd2e; }
  .dot.green { background: #27c93f; }
  .address-bar {
    flex-grow: 1;
    height: 1.25rem;
    border-radius: var(--radius-sm);
    background: #555;
    opacity: 0.5;
  }

  /* Terminal Frame */
  .device-frame[data-type="terminal"] {
    border: 1px solid #000;
    background: #000;
  }

  .content {
    /* The video player will fill this */
  }
</style>
