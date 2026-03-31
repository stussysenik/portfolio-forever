<script lang="ts">
	/* Static preview — no props needed */
</script>

<div class="terminal-preview">
	<div class="terminal-line">
		<span class="terminal-prompt">$</span>
		<span class="terminal-cmd"> whoami</span>
	</div>
	<div class="terminal-line">
		<span class="terminal-output">stussysenik</span>
	</div>
	<div class="terminal-line">
		<span class="terminal-prompt">$</span>
		<span class="terminal-cursor">&#9608;</span>
	</div>
</div>

<style>
	.terminal-preview {
		background: #0a0a0a;
		border-radius: var(--radius-sm);
		padding: 8px 10px;
		font-family: var(--font-mono);
		font-size: 9px;
		line-height: 1.6;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.terminal-line {
		display: flex;
		align-items: center;
		gap: 4px;
		white-space: pre;
	}

	.terminal-prompt {
		color: var(--bento-green, #44D62C);
	}

	.terminal-cmd {
		color: #e5e5e5;
	}

	.terminal-output {
		color: #a3a3a3;
	}

	.terminal-cursor {
		color: var(--bento-green, #44D62C);
		animation: blink-cursor 1s step-end infinite;
	}

	@keyframes blink-cursor {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}
</style>
