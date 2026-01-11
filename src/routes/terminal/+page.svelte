<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  
  let inputElement: HTMLInputElement;
  let terminalHistory: { type: 'input' | 'output', content: string }[] = [
    { type: 'output', content: 'Welcome to Portfolio Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ];
  let currentInput = '';
  let historyIndex = -1;
  let commandHistory: string[] = [];
  
  /* commands with updated colors */
  const commands: Record<string, (args: string[]) => string> = {
    help: () => 'Available commands: <span class="cmd-help">help</span>, <span class="cmd-help">clear</span>, <span class="cmd-help">ls</span>, <span class="cmd-help">cat</span>, <span class="cmd-help">whoami</span>, <span class="cmd-help">echo</span>, <span class="cmd-help">date</span>',
    clear: () => {
      terminalHistory = [];
      return '';
    },
    ls: () => '<span class="file">about.txt</span>  <span class="dir">works/</span>  <span class="file">contact.nfo</span>  <span class="dir">secrets/</span>',
    whoami: () => '<span class="user">guest</span>',
    echo: (args) => args.join(' '),
    date: () => `<span class="date">${new Date().toLocaleString()}</span>`,
    cat: (args) => {
      const file = args[0];
      if (!file) return 'Usage: cat <filename>';
      if (file === 'about.txt') return 'Creative Technologist & Digital Craftsman.';
      if (file === 'contact.nfo') return 'Find me on GitHub, LinkedIn, or Email.';
      return `<span class="error">cat: ${file}: No such file or directory</span>`;
    }
  };
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const command = currentInput.trim();
      if (command) {
        terminalHistory = [...terminalHistory, { type: 'input', content: command }];
        commandHistory.push(command);
        historyIndex = commandHistory.length;
        
        const [cmd, ...args] = command.split(' ');
        if (commands[cmd]) {
          const output = commands[cmd](args);
          if (output) {
            terminalHistory = [...terminalHistory, { type: 'output', content: output }];
          }
        } else {
          terminalHistory = [...terminalHistory, { type: 'output', content: `command not found: ${cmd}` }];
        }
      } else {
         terminalHistory = [...terminalHistory, { type: 'input', content: '' }];
      }
      currentInput = '';
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
    }
  }
  
  onMount(() => {
    inputElement.focus();
  });
  
  afterUpdate(() => {
    // Removed auto-scroll - let user control scrolling
  });
  
  function focusInput() {
    inputElement.focus();
  }
</script>

<svelte:head>
  <title>Terminal</title>
  <meta name="theme-color" content="#1a1b26" />
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="terminal-page" on:click={focusInput}>
  <div class="output">
    {#each terminalHistory as line}
      <div class="line" class:input-line={line.type === 'input'}>
        {#if line.type === 'input'}
          <span class="prompt">➜ ~</span>
        {/if}
        <span class="content">{@html line.content}</span>
      </div>
    {/each}
  </div>
  
  <div class="input-line active">
    <span class="prompt">➜ ~</span>
    <input 
      bind:this={inputElement}
      bind:value={currentInput}
      on:keydown={handleKeydown}
      type="text" 
      class="terminal-input" 
      spellcheck="false"
      autoComplete="off"
    />
  </div>
</div>

<style>
  :global(body) {
    /* remove troublesome black override */
    /* background-color: #1a1b26 !important; */
    /* color: #a9b1d6 !important; */
    font-family: 'JetBrains Mono', monospace !important;
  }
  
  .terminal-page {
    min-height: 80vh;
    padding: var(--space-md);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    cursor: text;
  }
  
  .line {
    display: flex;
    gap: 1ch;
    margin-bottom: 4px;
    white-space: pre-wrap;
    word-break: break-all;
  }
  
  .prompt {
    color: #7aa2f7;
    font-weight: bold;
    user-select: none;
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
    caret-color: #7aa2f7;
  }

  /* Command Colors */
  :global(.cmd-help) { color: #bb9af7; }
  :global(.file) { color: #9aa5ce; }
  :global(.dir) { color: #7aa2f7; font-weight: bold; }
  :global(.user) { color: #e0af68; }
  :global(.date) { color: #2ac3de; }
  :global(.error) { color: #f7768e; }
</style>
