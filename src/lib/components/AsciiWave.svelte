<script lang="ts">
        import { onMount } from "svelte";

        // ASCII wave animation using layered sine functions
        // Produces a fluid, organic wave pattern across the grid

        let asciiOutput = "";
        let animationFrame: number;
        let lastFrameTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;
        let time = 0;
        let prefersReducedMotion = false;

        const width = 80;
        const height = 24;
        const decoder = new TextDecoder();

        // Character palette from empty to dense
        const chars = " .,-~:;=!*%#@";

        // Reuse arrays to reduce memory allocations
        const bufferSize = width * height;
        const bArray = new Uint8Array(bufferSize);
        const outputArray = new Uint8Array(bufferSize + height); // Extra space for newlines

        function drawFrame() {
                for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                                const value =
                                        Math.sin(x * 0.1 + time) +
                                        Math.sin(y * 0.15 + time * 0.7) +
                                        Math.sin((x + y) * 0.08 + time * 0.5);

                                // Normalize from [-3, 3] to [0, 1]
                                const normalized = (value + 3) / 6;

                                // Map to character index (0..12)
                                const charIndex = Math.min(
                                        chars.length - 1,
                                        Math.floor(normalized * chars.length),
                                );

                                bArray[y * width + x] = chars.charCodeAt(charIndex);
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
                asciiOutput = decoder.decode(outputArray.subarray(0, outputIndex));
        }

        function renderFrame(timestamp: number = 0) {
                if (prefersReducedMotion) {
                        animationFrame = 0;
                        return;
                }

                // Throttle frame rate to reduce CPU usage
                const elapsed = timestamp - lastFrameTime;
                if (elapsed < frameInterval) {
                        animationFrame = requestAnimationFrame(renderFrame);
                        return;
                }
                lastFrameTime = timestamp;

                drawFrame();

                time += 0.05;

                animationFrame = requestAnimationFrame(renderFrame);
        }

        onMount(() => {
                const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
                const syncMotionPreference = (matches: boolean) => {
                        prefersReducedMotion = matches;
                        if (prefersReducedMotion) {
                                if (animationFrame) {
                                        cancelAnimationFrame(animationFrame);
                                        animationFrame = 0;
                                }
                                drawFrame();
                                return;
                        }
                        if (!animationFrame) {
                                lastFrameTime = 0;
                                animationFrame = requestAnimationFrame(renderFrame);
                        }
                };

                const handleMotionChange = (event: MediaQueryListEvent) => {
                        syncMotionPreference(event.matches);
                };

                syncMotionPreference(mediaQuery.matches);
                mediaQuery.addEventListener("change", handleMotionChange);
                return () => {
                        if (animationFrame) {
                                cancelAnimationFrame(animationFrame);
                        }
                        mediaQuery.removeEventListener("change", handleMotionChange);
                };
        });
</script>

<div class="wave-container">
        <div class="wave-display">
                <pre class="wave-ascii">{asciiOutput}</pre>
        </div>
</div>

<style>
        .wave-container {
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
        }

        .wave-display {
                overflow: hidden;
                max-width: 100%;
                will-change: transform;
        }

        .wave-ascii {
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
                .wave-ascii {
                        font-size: clamp(8px, 1.35vw, 13px);
                }
        }
</style>
