<script lang="ts">
  import { onMount, afterUpdate, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { profile } from '$lib/data/content';
  import {
    executeCommand,
    getCompletions,
    createShellState,
    type OutputLine,
  } from '$lib/terminal/commands';

  let inputElement: HTMLInputElement;
  let outputEl: HTMLDivElement;
  let matrixCanvas: HTMLCanvasElement;
  let matrixAnimId: number;

  const state = createShellState();

  interface HistoryEntry {
    type: 'input' | 'output';
    lines?: OutputLine[];
    content?: string;
    path?: string;
  }

  let terminalHistory: HistoryEntry[] = [];
  let currentInput = '';
  let historyIndex = -1;
  let commandHistory: string[] = [];
  let tabSuggestions: string[] = [];
  let activeAnimation: 'matrix' | 'pipes' | null = null;

  function showWelcome() {
    terminalHistory = [
      ...terminalHistory,
      { type: 'output', content: `<span class="t-accent">Portfolio Terminal</span> <span class="t-muted">v2.0.0</span>` },
      { type: 'output', content: `<span class="t-muted">Type</span> <span class="t-accent">help</span> <span class="t-muted">to see available commands, or try</span> <span class="t-accent">neofetch</span><span class="t-muted">.</span>` },
    ];
  }

  function processOutput(lines: OutputLine[]) {
    for (const line of lines) {
      if (line.type === 'text') {
        // Handle special commands
        if (line.content === '__CLEAR__') {
          terminalHistory = [];
          activeAnimation = null;
          return;
        }
        if (line.content === '__WELCOME__') {
          showWelcome();
          continue;
        }
        if (line.content.startsWith('__NAV__')) {
          const route = line.content.replace('__NAV__', '');
          goto(route);
          continue;
        }
        if (line.content.startsWith('__THEME__')) {
          const theme = line.content.replace('__THEME__', '');
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('preferred-theme', theme);
          terminalHistory = [...terminalHistory, {
            type: 'output',
            content: `<span class="t-success">Theme switched to ${theme}.</span>`,
          }];
          continue;
        }
        terminalHistory = [...terminalHistory, { type: 'output', content: line.content }];
      } else if (line.type === 'iframe') {
        terminalHistory = [...terminalHistory, {
          type: 'output',
          lines: [line],
        }];
      } else if (line.type === 'image') {
        terminalHistory = [...terminalHistory, {
          type: 'output',
          lines: [line],
        }];
      } else if (line.type === 'animation') {
        activeAnimation = line.id;
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    tabSuggestions = [];

    if (e.key === 'Enter') {
      const command = currentInput.trim();
      terminalHistory = [...terminalHistory, {
        type: 'input',
        content: command,
        path: state.cwd,
      }];

      if (command) {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
        const output = executeCommand(command, state);
        processOutput(output);
      }

      currentInput = '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const completions = getCompletions(currentInput, state);
      if (completions.length === 1) {
        // Single match — auto-complete
        const parts = currentInput.split(/\s+/);
        if (parts.length <= 1) {
          currentInput = completions[0] + ' ';
        } else {
          parts[parts.length - 1] = completions[0];
          currentInput = parts.join(' ');
        }
      } else if (completions.length > 1) {
        tabSuggestions = completions;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        currentInput = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        currentInput = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        currentInput = '';
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      // Ctrl+C: cancel current input or stop animation
      if (activeAnimation) {
        stopAnimation();
      } else {
        terminalHistory = [...terminalHistory, {
          type: 'input',
          content: currentInput + '^C',
          path: state.cwd,
        }];
        currentInput = '';
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      terminalHistory = [];
      activeAnimation = null;
    }
  }

  function stopAnimation() {
    activeAnimation = null;
    if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
  }

  function closeIframe(index: number) {
    terminalHistory = terminalHistory.filter((_, i) => i !== index);
  }

  // Matrix rain animation
  function startMatrix(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    matrixCanvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01234567890ABCDEF';

    function draw() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx!.fillStyle = '#00D9FF';
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx!.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00D9FF';
        ctx!.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      matrixAnimId = requestAnimationFrame(draw);
    }

    draw();
  }

  // Pipes animation
  function startPipes(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cellSize = 16;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);
    let x = Math.floor(cols / 2);
    let y = Math.floor(rows / 2);
    let dir = 0; // 0=right, 1=down, 2=left, 3=up
    const colors = ['#00D9FF', '#f7768e', '#9ece6a', '#e0af68', '#bb9af7', '#7aa2f7'];
    let color = colors[0];
    let steps = 0;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function draw() {
      ctx!.fillStyle = color;
      ctx!.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);

      // Random direction change
      if (Math.random() < 0.3) {
        dir = (dir + (Math.random() > 0.5 ? 1 : 3)) % 4;
      }

      if (dir === 0) x++;
      else if (dir === 1) y++;
      else if (dir === 2) x--;
      else y--;

      // Wrap around
      if (x >= cols) x = 0;
      if (x < 0) x = cols - 1;
      if (y >= rows) y = 0;
      if (y < 0) y = rows - 1;

      steps++;
      if (steps % 30 === 0) {
        color = colors[Math.floor(Math.random() * colors.length)];
      }

      matrixAnimId = requestAnimationFrame(draw);
    }

    draw();
  }

  onMount(() => {
    showWelcome();
    inputElement?.focus();
  });

  afterUpdate(async () => {
    await tick();
    if (outputEl) {
      outputEl.scrollTop = outputEl.scrollHeight;
    }
    // Start animation if canvas is ready
    if (activeAnimation && matrixCanvas) {
      if (activeAnimation === 'matrix') startMatrix(matrixCanvas);
      else if (activeAnimation === 'pipes') startPipes(matrixCanvas);
    }
  });

  function focusInput() {
    if (!activeAnimation) inputElement?.focus();
  }

  // Time for tmux bar
  let time = '';
  onMount(() => {
    const update = () => {
      const now = new Date();
      time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  });
</script>

<svelte:head>
  <title>Terminal | {profile.name}</title>
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="terminal-page" on:click={focusInput}>

  {#if activeAnimation}
    <div class="animation-overlay" on:click={stopAnimation}>
      <canvas
        class="animation-canvas"
        bind:this={matrixCanvas}
      ></canvas>
      <div class="animation-hint">
        <kbd>Ctrl+C</kbd> or click to exit
      </div>
    </div>
  {/if}

  <div class="output" bind:this={outputEl}>
    {#each terminalHistory as entry, i}
      <div class="line" class:input-line={entry.type === 'input'}>
        {#if entry.type === 'input'}
          <span class="prompt">➜ <span class="prompt-path">{entry.path || '~'}</span></span>
        {/if}

        {#if entry.lines}
          {#each entry.lines as line}
            {#if line.type === 'iframe'}
              <div class="inline-browser">
                <div class="browser-chrome">
                  <div class="browser-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                  </div>
                  <div class="browser-url">{line.url}</div>
                  <button class="browser-close" on:click|stopPropagation={() => closeIframe(i)}>×</button>
                </div>
                <div class="iframe-wrap">
                  <iframe
                    src={line.url}
                    title={line.title}
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            {:else if line.type === 'image'}
              <div class="inline-image">
                <img src={line.src} alt={line.alt} />
              </div>
            {/if}
          {/each}
        {:else if entry.content !== undefined}
          <span class="content">{@html entry.content}</span>
        {/if}
      </div>
    {/each}
  </div>

  <div class="input-area">
    {#if tabSuggestions.length > 0}
      <div class="tab-suggestions">
        {#each tabSuggestions as suggestion}
          <span class="suggestion">{suggestion}</span>
        {/each}
      </div>
    {/if}
    <div class="input-line active">
      <span class="prompt">➜ <span class="prompt-path">{state.cwd}</span></span>
      <input
        bind:this={inputElement}
        bind:value={currentInput}
        on:keydown={handleKeydown}
        type="text"
        class="terminal-input"
        spellcheck="false"
        autocomplete="off"
      />
    </div>
  </div>

  <!-- tmux status bar -->
  <div class="tmux-bar">
    <span class="tmux-session"><span class="t-accent">●</span> main</span>
    <span class="tmux-sep">│</span>
    <span class="tmux-path">{state.cwd}</span>
    <span class="tmux-right">
      <span class="tmux-info">{state.history.length} cmds</span>
      <span class="tmux-sep">│</span>
      <span class="tmux-time">{time}</span>
    </span>
  </div>
</div>

<style>
  .terminal-page {
    min-height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
    padding: var(--space-md);
    padding-bottom: 40px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
    cursor: text;
    position: relative;
  }

  .output {
    flex: 1;
    overflow-y: auto;
    padding-bottom: var(--space-md);
  }

  .line {
    display: flex;
    gap: 1ch;
    margin-bottom: 2px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .line .content {
    flex: 1;
    min-width: 0;
  }

  /* ── Prompt ── */
  .prompt {
    color: var(--color-text-muted);
    font-weight: bold;
    user-select: none;
    white-space: nowrap;
  }

  .prompt-path {
    color: var(--color-accent);
  }

  /* ── Input ── */
  .input-area {
    flex-shrink: 0;
    position: sticky;
    bottom: 40px;
    background: var(--color-bg);
    padding-top: var(--space-xs);
  }

  .input-line {
    display: flex;
    gap: 1ch;
    align-items: center;
  }

  .terminal-input {
    flex: 1;
    background: transparent;
    border: none;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
    outline: none;
    caret-color: var(--color-accent);
  }

  /* ── Tab Completion ── */
  .tab-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    padding: var(--space-xs) 0;
  }

  .suggestion {
    color: var(--color-accent);
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--color-bg-alt);
    font-size: 12px;
  }

  /* ── Inline Browser ── */
  .inline-browser {
    width: 100%;
    max-width: 800px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    margin: var(--space-sm) 0;
    background: var(--color-surface);
    box-shadow: var(--shadow-md);
  }

  .browser-chrome {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 8px 12px;
    background: var(--color-bg-alt);
    border-bottom: 1px solid var(--border-color);
  }

  .browser-dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot.red { background: #f7768e; }
  .dot.yellow { background: #e0af68; }
  .dot.green { background: #9ece6a; }

  .browser-url {
    flex: 1;
    font-size: 11px;
    color: var(--color-text-muted);
    background: var(--color-bg);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .browser-close {
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
  }

  .browser-close:hover {
    color: #f7768e;
  }

  .inline-browser .iframe-wrap {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
  }

  .inline-browser iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 300%;
    height: 540px;
    border: none;
    transform: scale(0.333);
    transform-origin: top left;
    pointer-events: auto;
  }

  /* ── Inline Image ── */
  .inline-image {
    max-width: 400px;
    margin: var(--space-sm) 0;
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 1px solid var(--border-color);
  }

  .inline-image img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* ── Animation Overlay ── */
  .animation-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: #000;
  }

  .animation-canvas {
    width: 100%;
    height: 100%;
  }

  .animation-hint {
    position: absolute;
    bottom: 20px;
    right: 20px;
    color: rgba(255, 255, 255, 0.3);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }

  .animation-hint kbd {
    padding: 2px 6px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  /* ── tmux Status Bar ── */
  .tmux-bar {
    position: fixed;
    bottom: 60px;
    left: var(--space-md);
    right: var(--space-md);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 4px var(--space-md);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--color-text-subtle);
    background: var(--color-bg-alt);
    border: 1px solid var(--border-color-subtle);
    border-radius: var(--radius-sm);
    z-index: 10;
  }

  .tmux-sep {
    opacity: 0.3;
  }

  .tmux-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .tmux-time {
    color: var(--color-accent);
  }

  /* ── Terminal Colors (global, used in command output) ── */
  :global(.t-accent) { color: var(--color-accent); }
  :global(.t-muted) { color: var(--color-text-muted); }
  :global(.t-info) { color: #7aa2f7; }
  :global(.t-error) { color: #f7768e; }
  :global(.t-success) { color: #9ece6a; }
  :global(.t-warning) { color: #e0af68; }

  /* ── Responsive ── */
  @media (max-width: 767px) {
    .terminal-page {
      font-size: 12px;
      padding: var(--space-sm);
    }

    .inline-browser {
      max-width: 100%;
    }

    .tmux-bar {
      left: var(--space-sm);
      right: var(--space-sm);
      font-size: 10px;
      bottom: 52px;
    }
  }
</style>
