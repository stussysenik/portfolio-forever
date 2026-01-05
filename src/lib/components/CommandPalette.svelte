<script lang="ts">
        import { onMount, onDestroy } from "svelte";
        import { goto } from "$app/navigation";

        interface Command {
                keys: string;
                label: string;
                action: () => void;
                category: "navigation" | "action";
        }

        let isOpen = false;

        const commands: Command[] = [
                // Navigation
                {
                        keys: "g w",
                        label: "Go to Works",
                        action: () => goto("/"),
                        category: "navigation",
                },
                {
                        keys: "g g",
                        label: "Go to Gallery",
                        action: () => goto("/gallery"),
                        category: "navigation",
                },
                {
                        keys: "g c",
                        label: "Go to CV",
                        action: () => goto("/cv"),
                        category: "navigation",
                },
                {
                        keys: "g l",
                        label: "Go to Labs",
                        action: () => goto("/labs"),
                        category: "navigation",
                },
                {
                        keys: "g n",
                        label: "Go to Notes",
                        action: () => goto("/notes"),
                        category: "navigation",
                },
                {
                        keys: "g p",
                        label: "Go to Process",
                        action: () => goto("/process"),
                        category: "navigation",
                },
                {
                        keys: "g k",
                        label: "Go to Likes",
                        action: () => goto("/likes"),
                        category: "navigation",
                },
                {
                        keys: "g t",
                        label: "Go to Terminal",
                        action: () => goto("/terminal"),
                        category: "navigation",
                },
                {
                        keys: "g o",
                        label: "Go to OS",
                        action: () => goto("/os"),
                        category: "navigation",
                },
        ];

        let keyBuffer = "";
        let keyBufferTimeout: ReturnType<typeof setTimeout>;

        function open() {
                isOpen = true;
        }

        function close() {
                isOpen = false;
                keyBuffer = "";
        }

        function isInputFocused(): boolean {
                if (typeof document === "undefined") return false;
                const active = document.activeElement;
                return (
                        active instanceof HTMLInputElement ||
                        active instanceof HTMLTextAreaElement ||
                        active?.getAttribute("contenteditable") === "true"
                );
        }

        function handleKeydown(e: KeyboardEvent) {
                // Ignore if input is focused
                if (isInputFocused() && e.key !== "Escape") return;

                // Toggle with ?
                if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        isOpen = !isOpen;
                        return;
                }

                // Close on Escape
                if (e.key === "Escape") {
                        close();
                        return;
                }

                // Don't process key sequences when palette is open
                if (isOpen) return;

                // Key sequence handling
                if (
                        e.key.length === 1 &&
                        !e.metaKey &&
                        !e.ctrlKey &&
                        !e.altKey
                ) {
                        clearTimeout(keyBufferTimeout);
                        keyBuffer += e.key;

                        // Check for matching command
                        const matchedCommand = commands.find(
                                (cmd) =>
                                        cmd.keys.replace(/\s/g, "") ===
                                        keyBuffer,
                        );
                        if (matchedCommand) {
                                e.preventDefault();
                                matchedCommand.action();
                                keyBuffer = "";
                                return;
                        }

                        // Check if any command starts with buffer
                        const hasPartialMatch = commands.some((cmd) =>
                                cmd.keys
                                        .replace(/\s/g, "")
                                        .startsWith(keyBuffer),
                        );
                        if (!hasPartialMatch) {
                                keyBuffer = "";
                        } else {
                                // Clear buffer after delay
                                keyBufferTimeout = setTimeout(() => {
                                        keyBuffer = "";
                                }, 1000);
                        }
                }
        }

        onMount(() => {
                window.addEventListener("keydown", handleKeydown);
        });

        onDestroy(() => {
                if (typeof window !== "undefined") {
                        window.removeEventListener("keydown", handleKeydown);
                }
                clearTimeout(keyBufferTimeout);
        });

        $: groupedCommands = {
                navigation: commands.filter((c) => c.category === "navigation"),
        };
</script>

{#if isOpen}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="overlay" on:click={close}></div>

        <div class="palette" role="dialog" aria-label="Keyboard shortcuts">
                <header class="palette-header">
                        <h2 class="palette-title">Keyboard Shortcuts</h2>
                        <span class="palette-hint">Press ? to toggle</span>
                </header>

                <div class="palette-content">
                        <section class="command-group">
                                <h3 class="group-title">Navigation</h3>
                                <ul class="command-list">
                                        {#each groupedCommands.navigation as cmd}
                                                <li class="command-item">
                                                        <div
                                                                class="command-keys-container"
                                                        >
                                                                <kbd
                                                                        class="command-keys"
                                                                        >{cmd.keys}</kbd
                                                                >
                                                        </div>
                                                        <span
                                                                class="command-label"
                                                                >{cmd.label}</span
                                                        >
                                                </li>
                                        {/each}
                                </ul>
                        </section>
                </div>

                <footer class="palette-footer">
                        <kbd>Esc</kbd> to close
                </footer>
        </div>
{/if}

<style>
        .overlay {
                position: fixed;
                inset: 0;
                background: hsl(0, 0%, 0%, 0.5);
                backdrop-filter: blur(2px);
                z-index: 999;
                animation: fade-in var(--duration-fast) var(--easing);
        }

        @keyframes fade-in {
                from {
                        opacity: 0;
                }
                to {
                        opacity: 1;
                }
        }

        .palette {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: min(90vw, 480px);
                max-height: 70vh;
                background: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: var(--radius-lg);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                overflow: hidden;
                animation: scale-in var(--duration-normal) var(--easing-out);
        }

        @keyframes scale-in {
                from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.95);
                }
                to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                }
        }

        .palette-header {
                padding: var(--space-lg) var(--space-xl);
                border-bottom: 1px solid #f0f0f0;
        }

        .palette-title {
                font-size: var(--font-size-lg);
                font-weight: var(--font-weight-medium);
                color: #1a1a1a;
                margin: 0 0 var(--space-xs) 0;
        }

        .palette-hint {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: #888888;
        }

        .palette-content {
                padding: var(--space-lg) var(--space-xl);
                overflow-y: auto;
                max-height: calc(70vh - 120px);
        }

        .command-group {
                margin-bottom: var(--space-xl);
        }

        .group-title {
                font-size: var(--font-size-md);
                font-weight: var(--font-weight-medium);
                color: #1a1a1a;
                margin: 0 0 var(--space-md) 0;
                padding-bottom: var(--space-xs);
                border-bottom: 1px solid #f0f0f0;
        }

        .command-list {
                list-style: none;
                padding: 0;
                margin: 0;
        }

        .command-item {
                display: flex;
                align-items: center;
                padding: var(--space-sm) 0;
                border-bottom: 1px solid #f8f8f8;
        }

        .command-item:last-child {
                border-bottom: none;
        }

        .command-keys-container {
                flex-shrink: 0;
                margin-right: var(--space-md);
        }

        .command-keys {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: #ffffff;
                background: #61afef;
                padding: var(--space-2xs) var(--space-sm);
                border-radius: var(--radius-sm);
                min-width: 4em;
                text-align: center;
                display: inline-block;
        }

        .command-label {
                font-size: var(--font-size-sm);
                color: #333333;
                font-weight: 500;
        }

        .palette-footer {
                padding: var(--space-md) var(--space-xl);
                border-top: 1px solid #f0f0f0;
                font-size: var(--font-size-xs);
                color: #999999;
                text-align: center;
        }

        .palette-footer kbd {
                font-family: var(--font-mono);
                background: var(--color-bg-alt);
                padding: var(--space-2xs) var(--space-xs);
                border-radius: var(--radius-sm);
                margin-right: var(--space-2xs);
        }
</style>
