<script lang="ts">
        import { onMount, onDestroy } from "svelte";
        import { goto } from "$app/navigation";
        import { readerOverride } from "$lib/stores/siteMode";
        import { getConvexClient } from "$lib/convex";
        import { api } from "../../../convex/_generated/api";
        import { toast } from "$lib/stores/toast";

        interface Command {
                keys: string;
                label: string;
                action: () => void;
                category: "navigation" | "action" | "system";
        }

        let isOpen = false;

        const commands: Command[] = [
                // Navigation
                {
                        keys: "g h",
                        label: "Go Home",
                        action: () => goto("/"),
                        category: "navigation",
                },
                {
                        keys: "g w",
                        label: "Go to Works",
                        action: () => goto("/works"),
                        category: "navigation",
                },
                {
                        keys: "g t",
                        label: "Go to Talks",
                        action: () => goto("/talks"),
                        category: "navigation",
                },
                {
                        keys: "g c",
                        label: "Go to CV",
                        action: () => goto("/cv"),
                        category: "navigation",
                },
                {
                        keys: "g n",
                        label: "Go to Blog",
                        action: () => goto("/blog"),
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
                        keys: "g m",
                        label: "Go to Terminal",
                        action: () => goto("/terminal"),
                        category: "navigation",
                },
                {
                        keys: "g g",
                        label: "Go to Gifts",
                        action: () => goto("/gifts"),
                        category: "navigation",
                },
                // Actions
                {
                        keys: "r",
                        label: "Toggle Reader Mode",
                        action: () => {
                                readerOverride.update((c) => c === null ? true : !c);
                        },
                        category: "action",
                },
                {
                        keys: "s t",
                        label: "Toggle Status",
                        action: async () => {
                                const profileId = (window as any).profileId;
                                const profileAvailable = (window as any).profileAvailable;
                                if (profileId) {
                                        try {
                                                const client = getConvexClient();
                                                await client.mutation(api.cv.updateProfile, {
                                                        id: profileId,
                                                        available: !profileAvailable
                                                });
                                                toast.success(`Status updated: ${!profileAvailable ? 'Available' : 'Unavailable'}`);
                                        } catch (e) {
                                                console.error(e);
                                                toast.error("Failed to update status");
                                        }
                                } else {
                                        toast.error("Profile not loaded yet");
                                }
                        },
                        category: "system",
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

        let inputElement: HTMLInputElement;

        function handleKeydown(e: KeyboardEvent) {
                // Ignore if input is focused (unless it's OUR input)
                if (isInputFocused() && document.activeElement !== inputElement && e.key !== "Escape") return;

                // Toggle with ?
                // Also handle Shift+/ (e.key="/", shiftKey=true) when our own input is
                // focused — browsers report the physical key instead of the character
                const isQuestionMark = e.key === "?" ||
                        (e.key === "/" && e.shiftKey && document.activeElement === inputElement);
                if (isQuestionMark && !e.metaKey && !e.ctrlKey) {
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
                        const potentialBuffer = keyBuffer + e.key;

                        // Check if this keystroke could be part of a command
                        const hasPartialMatch = commands.some((cmd) =>
                                cmd.keys
                                        .replace(/\s/g, "")
                                        .startsWith(potentialBuffer),
                        );

                        // Prevent scroll if we're building a command sequence
                        if (hasPartialMatch) {
                                e.preventDefault();
                        }

                        keyBuffer = potentialBuffer;

                        // Check for matching command
                        const matchedCommand = commands.find(
                                (cmd) =>
                                        cmd.keys.replace(/\s/g, "") ===
                                        keyBuffer,
                        );
                        if (matchedCommand) {
                                matchedCommand.action();
                                keyBuffer = "";
                                return;
                        }

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
                system: commands.filter((c) => c.category === "system"),
        };
        
        $: if (isOpen && inputElement) {
                // Small delay to ensure render
                setTimeout(() => inputElement.focus(), 50);
        }
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

                        <section class="command-group">
                                <h3 class="group-title">System</h3>
                                <ul class="command-list">
                                        {#each groupedCommands.system as cmd}
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

                <!-- Hidden input to capture focus on mobile and prevent scroll on desktop -->
                <input
                        bind:this={inputElement}
                        type="text"
                        style="opacity: 0; position: absolute; pointer-events: none; height: 1px; width: 1px;"
                        autocomplete="off"
                        aria-hidden="true"
                />
        </div>
{/if}

<style>
        .overlay {
                position: fixed;
                inset: 0;
                background: hsl(0, 0%, 0%, 0.5);
                backdrop-filter: blur(2px);
                z-index: 2000;
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
                width: min(90vw, 560px);
                max-height: 70vh;
                background: var(--color-surface);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 2001;
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
                border-bottom: 1px solid var(--border-color-subtle);
        }

        .palette-title {
                font-size: var(--font-size-lg);
                font-weight: var(--font-weight-medium);
                color: var(--color-text);
                margin: 0 0 var(--space-xs) 0;
        }

        .palette-hint {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: var(--color-text-muted);
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
                color: var(--color-text);
                margin: 0 0 var(--space-md) 0;
                padding-bottom: var(--space-xs);
                border-bottom: 1px solid var(--border-color-subtle);
        }

        .command-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--space-xs) var(--space-lg);
        }

        @media (min-width: 481px) {
                .command-list {
                        grid-template-columns: repeat(2, 1fr);
                }
        }

        .command-item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: var(--space-sm) 0;
        }

        .command-keys-container {
                flex-shrink: 0;
                margin-right: var(--space-md);
        }

        .command-keys {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: var(--color-surface);
                background: var(--color-accent);
                padding: var(--space-2xs) var(--space-sm);
                border-radius: var(--radius-sm);
                min-width: 4em;
                text-align: center;
                display: inline-block;
        }

        .command-label {
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
                font-weight: 500;
        }

        .palette-footer {
                padding: var(--space-md) var(--space-xl);
                border-top: 1px solid var(--border-color-subtle);
                font-size: var(--font-size-xs);
                color: var(--color-text-subtle);
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
