<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { isReaderMode, featureFlags } from "$lib/stores/siteMode";
	import * as engine from "$lib/pixel-engine/engine";
	import { loadLuaRuntime, compileBehavior } from "$lib/pixel-engine/lua-runtime";
	import { ShaderPipeline } from "$lib/pixel-engine/shader-pipeline";

	// Lua scripts (imported as raw strings)
	import electronScript from "$lib/pixel-engine/scripts/electron.lua?raw";
	import wandererScript from "$lib/pixel-engine/scripts/wanderer.lua?raw";
	import cardScript from "$lib/pixel-engine/scripts/card.lua?raw";

	let spriteCanvas: HTMLCanvasElement;
	let shaderCanvas: HTMLCanvasElement;
	let pipeline: ShaderPipeline | null = null;
	let mouseX = 0;
	let mouseY = 0;
	let enabled = true;

	// Check feature flag
	$: {
		const flags = $featureFlags;
		enabled = flags.get("pixel-engine") ?? false;
	}

	// Disable in reader mode
	$: active = enabled && !$isReaderMode;

	let cleanupFns: (() => void)[] = [];

	onMount(() => {
		if (!active) return;
		setup();
		return () => cleanupFns.forEach((fn) => fn());
	});

	async function setup() {

		// Init sprite canvas (Canvas 2D)
		engine.init(spriteCanvas, () => {
			// After each sprite render, run shader pipeline
			pipeline?.render(spriteCanvas, mouseX, mouseY);
		});

		// Init shader pipeline (WebGL)
		pipeline = new ShaderPipeline(shaderCanvas);

		// Load Lua runtime
		const luaReady = await loadLuaRuntime();

		// Compile Lua behaviors
		const behaviors: Record<string, ReturnType<typeof compileBehavior>> = {};
		if (luaReady) {
			behaviors.electron = compileBehavior(electronScript);
			behaviors.wanderer = compileBehavior(wandererScript);
			behaviors.card = compileBehavior(cardScript);
		}

		// Spawn initial entities
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		// Electrons orbiting
		for (let i = 0; i < 6; i++) {
			engine.spawn({
				type: "electron",
				x: vw * 0.3 + Math.random() * vw * 0.4,
				y: vh * 0.2 + Math.random() * vh * 0.3,
				width: 4,
				height: 4,
				color: "#00ffaa",
				section: "*",
				luaUpdate: behaviors.electron ?? undefined,
			});
		}

		// Wanderers
		for (let i = 0; i < 4; i++) {
			engine.spawn({
				type: "wanderer",
				x: Math.random() * vw,
				y: Math.random() * vh,
				vx: (Math.random() - 0.5) * 40,
				vy: (Math.random() - 0.5) * 20,
				width: 16,
				height: 16,
				color: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a8e6cf"][i % 4],
				section: "*",
				luaUpdate: behaviors.wanderer ?? undefined,
			});
		}

		// Cards
		for (let i = 0; i < 3; i++) {
			engine.spawn({
				type: "card",
				x: vw * 0.2 + Math.random() * vw * 0.6,
				y: Math.random() * vh,
				vx: (Math.random() - 0.5) * 10,
				vy: Math.random() * 5,
				width: 6,
				height: 6,
				color: ["#e74c3c", "#2c3e50", "#e74c3c"][i % 3],
				section: "*",
				luaUpdate: behaviors.card ?? undefined,
			});
		}

		// Start engine
		engine.start();

		// Track mouse
		const onMouse = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};
		window.addEventListener("mousemove", onMouse);

		// Track scroll
		const onScroll = () => {
			engine.updateContext({ scrollY: window.scrollY });
		};
		window.addEventListener("scroll", onScroll, { passive: true });

		// Track resize
		const onResize = () => engine.resize();
		window.addEventListener("resize", onResize);

		cleanupFns.push(
			() => window.removeEventListener("mousemove", onMouse),
			() => window.removeEventListener("scroll", onScroll),
			() => window.removeEventListener("resize", onResize),
		);
	}

	onDestroy(() => {
		engine.destroy();
		pipeline?.destroy();
		pipeline = null;
	});
</script>

{#if active}
	<!-- Sprite canvas (Canvas 2D, hidden — feeds into shader) -->
	<canvas
		bind:this={spriteCanvas}
		class="pixel-canvas pixel-canvas--sprites"
		aria-hidden="true"
	></canvas>
	<!-- Shader canvas (WebGL, visible overlay) -->
	<canvas
		bind:this={shaderCanvas}
		class="pixel-canvas pixel-canvas--shaders"
		aria-hidden="true"
	></canvas>
{/if}

<style>
	.pixel-canvas {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 100;
	}

	.pixel-canvas--sprites {
		opacity: 0;
		z-index: -1;
	}

	.pixel-canvas--shaders {
		image-rendering: pixelated;
	}
</style>
