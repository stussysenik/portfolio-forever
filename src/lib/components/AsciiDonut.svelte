<script lang="ts">
        import { onMount } from "svelte";

        // Donut.c algorithm ported to TypeScript for ASCII rendering
        // Original by Andy Sloane (a1k0n), adapted from C

        let asciiOutput = "";
        let animationFrame: number;
        let lastFrameTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;
        let A = 0;
        let B = 0;

        const width = 100;
        const height = 32;

        // Reuse arrays to reduce memory allocations
        const bufferSize = width * height;
        const bArray = new Uint8Array(bufferSize);
        const zArray = new Float32Array(bufferSize);
        const outputArray = new Uint8Array(bufferSize + height); // Extra space for newlines

        function renderFrame(timestamp: number = 0) {
                // Throttle frame rate to reduce CPU usage
                const elapsed = timestamp - lastFrameTime;
                if (elapsed < frameInterval) {
                        animationFrame = requestAnimationFrame(renderFrame);
                        return;
                }
                lastFrameTime = timestamp;

                // Clear arrays instead of creating new ones
                bArray.fill(32); // ASCII space
                zArray.fill(0);

                const chars = ".,-~:;=!*%#";

                // Cache sin/cos for better performance
                const sinA = Math.sin(A);
                const cosA = Math.cos(A);
                const sinB = Math.sin(B);
                const cosB = Math.cos(B);

                for (let j = 0; j < 6.28; j += 0.07) {
                        const sinJ = Math.sin(j);
                        const cosJ = Math.cos(j);

                        for (let i = 0; i < 6.28; i += 0.02) {
                                const c = Math.sin(i);
                                const l = Math.cos(i);
                                const d = cosJ;
                                const e = sinA;
                                const f = sinJ;
                                const g = cosA;
                                const h = d + 2;
                                const D = 1 / (c * h * e + f * g + 5);
                                const m = cosB;
                                const n = sinB;
                                const t = c * h * g - f * e;

                                const x = Math.floor(
                                        40 + 30 * D * (l * h * m - t * n),
                                );
                                const y = Math.floor(
                                        12 + 15 * D * (l * h * n + t * m),
                                );
                                const o = x + width * y;
                                const N = Math.floor(
                                        8 *
                                                ((f * e - c * d * g) * m -
                                                        c * d * e -
                                                        f * g -
                                                        l * d * n),
                                );

                                if (
                                        y > 0 &&
                                        y < height &&
                                        x > 0 &&
                                        x < width &&
                                        D > zArray[o]
                                ) {
                                        zArray[o] = D;
                                        bArray[o] = chars.charCodeAt(
                                                Math.max(0, N),
                                        );
                                }
                        }
                }

                // Build output string efficiently
                let outputIndex = 0;
                for (let k = 0; k < height; k++) {
                        const rowStart = k * width;
                        const rowEnd = rowStart + width;
                        for (let i = rowStart; i < rowEnd; i++) {
                                outputArray[outputIndex++] = bArray[i];
                        }
                        outputArray[outputIndex++] = 10; // newline character
                }
                asciiOutput = String.fromCharCode.apply(
                        null,
                        Array.from(outputArray.slice(0, outputIndex)),
                );

                A += 0.04;
                B += 0.02;

                animationFrame = requestAnimationFrame(renderFrame);
        }

        onMount(() => {
                renderFrame();
                return () => {
                        if (animationFrame) {
                                cancelAnimationFrame(animationFrame);
                        }
                };
        });

        // Zig source code for the donut (display only)
        const zigSource = `// donut.zig - ASCII torus renderer
 const std = @import("std");
 const math = std.math;

 pub fn main() !void {
     var A: f32 = 0;
     var B: f32 = 0;

     while (true) {
         var b = [_]u8{' '} ** (80 * 24);
         var z = [_]f32{0} ** (80 * 24);

         var j: f32 = 0;
         while (j < 6.28) : (j += 0.07) {
             var i: f32 = 0;
             while (i < 6.28) : (i += 0.02) {
                 const c = @sin(i);
                 const d = @cos(j);
                 const e = @sin(A);
                 const f = @sin(j);
                 const g = @cos(A);
                 const h = d + 2;
                 const D = 1 / (c * h * e + f * g + 5);
                 const l = @cos(i);
                 const m = @cos(B);
                 const n = @sin(B);
                 const t = c * h * g - f * e;

                 const x: usize = @intFromFloat(40 + 30 * D * (l * h * m - t * n));
                 const y: usize = @intFromFloat(12 + 15 * D * (l * h * n + t * m));
                 const o = x + 80 * y;
                 const N: usize = @intFromFloat(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));

                 if (D > z[o]) {
                     z[o] = D;
                     b[o] = ".,-~:;=!*%#"[N];
                 }
             }
         }

         std.debug.print("\\x1b[H{s}", .{&b});
         A += 0.04;
         B += 0.02;
     }
 }`;

        let showSource = false;
</script>

<div class="donut-container">
        <div class="donut-display">
                <pre class="donut-ascii">{asciiOutput}</pre>
        </div>

        <button
                class="source-toggle"
                on:click={() => (showSource = !showSource)}
                aria-expanded={showSource}
        >
                {showSource ? "[ hide source ]" : "[ view zig source ]"}
        </button>

        {#if showSource}
                <div class="source-panel">
                        <header class="source-header">
                                <span class="source-filename">donut.zig</span>
                                <span class="source-lang">Zig</span>
                        </header>
                        <pre class="source-code">{zigSource}</pre>
                </div>
        {/if}
</div>

<style>
        .donut-container {
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
        }

        .donut-display {
                overflow: hidden;
                max-width: 100%;
                will-change: transform;
        }

        .donut-ascii {
                will-change: opacity, transform;
                font-family: var(--font-mono);
                font-size: clamp(5px, 1.6vw, 11px);
                line-height: 1.1;
                letter-spacing: 0.1em;
                color: var(--color-accent);
                margin: 0;
                text-align: center;
                white-space: pre;
                overflow: hidden;
        }

        @media (min-width: 768px) {
                .donut-ascii {
                        font-size: clamp(8px, 1.35vw, 13px);
                }
        }

        .source-toggle {
                align-self: center;
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: var(--color-text-subtle);
                background: transparent;
                border: none;
                cursor: pointer;
                padding: var(--space-sm) 0;
                margin-top: var(--space-sm);
                transition: color var(--duration-fast) var(--easing);
        }

        .source-toggle:hover {
                color: var(--color-text);
        }

        .source-panel {
                background: var(--color-surface);
                border: var(--border-width) solid var(--border-color);
                border-radius: var(--radius-md);
                overflow: hidden;
                animation: slideDown 0.2s ease-out;
                align-self: stretch;
        }

        .source-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-sm) var(--space-md);
                background: var(--color-bg-alt);
                border-bottom: var(--border-width) solid var(--border-color);
        }

        .source-filename {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                color: var(--color-text);
        }

        .source-lang {
                font-family: var(--font-mono);
                font-size: var(--font-size-2xs);
                color: var(--color-text-subtle);
                text-transform: uppercase;
                letter-spacing: var(--letter-spacing-wider);
        }

        .source-code {
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                line-height: var(--line-height-relaxed);
                color: var(--color-text-secondary);
                margin: 0;
                padding: var(--space-md);
                overflow-x: auto;
                max-height: 400px;
                overflow-y: auto;
                white-space: pre;
        }

        @keyframes slideDown {
                from {
                        opacity: 0;
                        transform: translateY(-10px);
                }
                to {
                        opacity: 1;
                        transform: translateY(0);
                }
        }
</style>
