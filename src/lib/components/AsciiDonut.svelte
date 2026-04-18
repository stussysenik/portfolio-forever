<script lang="ts">
        import { onMount } from "svelte";

        // Donut.c algorithm ported to TypeScript for ASCII rendering
        // Original by Andy Sloane (a1k0n), adapted from C

        let asciiOutput = $state("");
        let animationFrame: number = 0;
        let inertiaFrame: number = 0;
        let lastFrameTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;
        let A = $state(0);
        let B = $state(0);
        let prefersReducedMotion = $state(false);

        // Rotation drag state
        let isDragging = $state(false);
        let activePointerId: number | null = null;
        let lastPointerX = 0;
        let lastPointerY = 0;

        // Positional drag state (Shift+drag to move donut around)
        let donutPos = $state({ x: 0, y: 0 });
        let isPositionalDrag = $state(false);
        let isShiftHeld = $state(false);

        // Velocity ring buffer for inertia seeding
        type VelocitySample = { dx: number; dy: number; t: number };
        const velocityBuffer: VelocitySample[] = [];
        const VELOCITY_SAMPLES = 5;

        // Pixel-to-radian mapping
        const SENSITIVITY = 0.01;

        // Baseline auto-rotation rates (match renderFrame increments)
        const BASELINE_VA = 0.04;
        const BASELINE_VB = 0.02;

        const width = 100;
        const height = 32;
        const decoder = new TextDecoder();

        // Reuse arrays to reduce memory allocations
        const bufferSize = width * height;
        const bArray = new Uint8Array(bufferSize);
        const zArray = new Float32Array(bufferSize);
        const outputArray = new Uint8Array(bufferSize + height); // Extra space for newlines

        function drawFrame() {
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
                asciiOutput = decoder.decode(outputArray.subarray(0, outputIndex));
        }

        function renderFrame(timestamp: number = 0) {
                if (prefersReducedMotion || isDragging) {
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

                A += BASELINE_VA;
                B += BASELINE_VB;

                animationFrame = requestAnimationFrame(renderFrame);
        }

        function cancelAnim() {
                if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                        animationFrame = 0;
                }
                if (inertiaFrame) {
                        cancelAnimationFrame(inertiaFrame);
                        inertiaFrame = 0;
                }
        }

        function startAuto() {
                if (prefersReducedMotion || animationFrame) return;
                lastFrameTime = 0;
                animationFrame = requestAnimationFrame(renderFrame);
        }

        function handlePointerDown(event: PointerEvent) {
                cancelAnim();
                activePointerId = event.pointerId;
                (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
                lastPointerX = event.clientX;
                lastPointerY = event.clientY;
                velocityBuffer.length = 0;
                isDragging = true;
                isPositionalDrag = isShiftHeld || event.shiftKey;
        }

        function handlePointerMove(event: PointerEvent) {
                if (!isDragging || event.pointerId !== activePointerId) return;
                const dx = event.clientX - lastPointerX;
                const dy = event.clientY - lastPointerY;
                lastPointerX = event.clientX;
                lastPointerY = event.clientY;

                if (isPositionalDrag) {
                        const clamped = clampPosition(donutPos.x + dx, donutPos.y + dy);
                        donutPos = clamped;
                } else {
                        B += dx * SENSITIVITY;
                        A += dy * SENSITIVITY;
                        drawFrame();
                }

                velocityBuffer.push({ dx, dy, t: performance.now() });
                if (velocityBuffer.length > VELOCITY_SAMPLES) {
                        velocityBuffer.shift();
                }
        }

        function handlePointerEnd(event: PointerEvent) {
                if (event.pointerId !== activePointerId) return;
                try {
                        (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
                } catch {}
                activePointerId = null;

                if (isPositionalDrag) {
                        isPositionalDrag = false;
                        isDragging = false;
                        savePosition();
                        startAuto();
                        return;
                }

                isDragging = false;

                if (prefersReducedMotion) {
                        velocityBuffer.length = 0;
                        return;
                }

                let sumDx = 0;
                let sumDy = 0;
                for (const sample of velocityBuffer) {
                        sumDx += sample.dx;
                        sumDy += sample.dy;
                }
                const count = velocityBuffer.length || 1;
                let vB = (sumDx / count) * SENSITIVITY;
                let vA = (sumDy / count) * SENSITIVITY;
                velocityBuffer.length = 0;

                const DECAY_MS = 600;
                const startTime = performance.now();

                function inertiaLoop(now: number) {
                        const t = Math.min(1, (now - startTime) / DECAY_MS);
                        const ease = 1 - t;
                        A += vA * ease + BASELINE_VA * t;
                        B += vB * ease + BASELINE_VB * t;
                        drawFrame();
                        if (t < 1) {
                                inertiaFrame = requestAnimationFrame(inertiaLoop);
                        } else {
                                inertiaFrame = 0;
                                startAuto();
                        }
                }
                inertiaFrame = requestAnimationFrame(inertiaLoop);
        }

        function handleKeyDown(e: KeyboardEvent) {
                if (e.key === 'Shift') isShiftHeld = true;
        }

        function handleKeyUp(e: KeyboardEvent) {
                if (e.key === 'Shift') isShiftHeld = false;
        }

        function clampPosition(x: number, y: number): { x: number; y: number } {
                const container = document.querySelector('.hero-visual') as HTMLElement | null;
                if (!container) return { x, y };
                const rect = container.getBoundingClientRect();
                const donutEl = document.querySelector('.donut-display') as HTMLElement | null;
                const dw = donutEl?.offsetWidth ?? 300;
                const dh = donutEl?.offsetHeight ?? 200;
                const margin = 8;
                const maxX = (rect.width / 2 - dw / 2) + margin;
                const maxY = (rect.height / 2 - dh / 2) + margin;
                return {
                        x: Math.max(-maxX, Math.min(maxX, x)),
                        y: Math.max(-maxY, Math.min(maxY, y)),
                };
        }

        function loadSavedPosition() {
                try {
                        const saved = localStorage.getItem('donut-position');
                        if (saved) {
                                const parsed = JSON.parse(saved);
                                if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                                        donutPos = clampPosition(parsed.x, parsed.y);
                                }
                        }
                } catch {}
        }

        function savePosition() {
                try {
                        localStorage.setItem('donut-position', JSON.stringify(donutPos));
                } catch {}
                if (typeof window !== 'undefined') {
                        const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe[src*="preview=true"]');
                        iframes.forEach((iframe) => {
                                iframe.contentWindow?.postMessage(
                                        { type: 'admin:donutPosition', x: donutPos.x, y: donutPos.y },
                                        '*',
                                );
                        });
                }
        }

        onMount(() => {
                const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
                const syncMotionPreference = (matches: boolean) => {
                        prefersReducedMotion = matches;
                        if (prefersReducedMotion) {
                                cancelAnim();
                                drawFrame();
                                return;
                        }
                        if (!isDragging && !animationFrame) {
                                startAuto();
                        }
                };

                const handleMotionChange = (event: MediaQueryListEvent) => {
                        syncMotionPreference(event.matches);
                };

                syncMotionPreference(mediaQuery.matches);
                mediaQuery.addEventListener("change", handleMotionChange);

                loadSavedPosition();
                window.addEventListener('keydown', handleKeyDown);
                window.addEventListener('keyup', handleKeyUp);

                return () => {
                        cancelAnim();
                        mediaQuery.removeEventListener("change", handleMotionChange);
                        window.removeEventListener('keydown', handleKeyDown);
                        window.removeEventListener('keyup', handleKeyUp);
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
        <div
                class="donut-display"
                class:is-dragging={isDragging}
                class:is-positional={isPositionalDrag}
                class:shift-ready={isShiftHeld}
                style:transform="translate({donutPos.x}px, {donutPos.y}px)"
                onpointerdown={handlePointerDown}
                onpointermove={handlePointerMove}
                onpointerup={handlePointerEnd}
                onpointercancel={handlePointerEnd}
        >
                <pre class="donut-ascii" aria-hidden="true">{asciiOutput}</pre>
                {#if isDragging || isPositionalDrag}
                        <div class="recognition-box">
                                <span class="recognition-label">donut</span>
                        </div>
                {/if}
        </div>

        <button
                class="source-toggle"
                onclick={() => (showSource = !showSource)}
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
                touch-action: none;
                cursor: grab;
                user-select: none;
                -webkit-user-select: none;
        }

        .donut-display.is-dragging {
                cursor: grabbing;
        }

        .donut-display.shift-ready {
                cursor: move;
        }

        .donut-display.is-positional {
                cursor: move;
        }

        .donut-display.is-positional.is-dragging {
                cursor: grabbing;
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
                touch-action: none;
                pointer-events: none;
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

        .recognition-box {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 2px solid var(--color-accent);
                pointer-events: none;
                animation: fadeIn 0.1s ease-out;
        }

        .recognition-label {
                position: absolute;
                top: -1px;
                left: -2px;
                background: var(--color-accent);
                color: var(--color-bg);
                padding: 2px 6px;
                font-family: var(--font-mono);
                font-size: var(--font-size-xs);
                text-transform: uppercase;
                letter-spacing: var(--letter-spacing-wider);
        }

        @keyframes fadeIn {
                from {
                        opacity: 0;
                }
                to {
                        opacity: 1;
                }
        }
</style>
