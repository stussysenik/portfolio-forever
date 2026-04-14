<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { isReaderMode, featureFlags } from "$lib/stores/siteMode";
	import { isNightVision } from "$lib/stores/controls";
	import * as engine from "$lib/pixel-engine/engine";
	import { loadLuaRuntime, compileBehavior } from "$lib/pixel-engine/lua-runtime";
	import { ShaderPipeline, type ShaderParams } from "$lib/pixel-engine/shader-pipeline";

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
	let runtimeDisabled = false;

	type RuntimeProfile = {
		disabled: boolean;
		useLua: boolean;
		trackPointer: boolean;
		shaderParams?: Partial<ShaderParams>;
		counts: {
			electrons: number;
			wanderers: number;
			cards: number;
		};
	};

	type NavigatorHints = Navigator & {
		connection?: { saveData?: boolean };
		deviceMemory?: number;
	};

	// Check feature flag (night-vision force-enables pixel engine for CRT)
	$: enabled = $isNightVision || ($featureFlags.get("pixel-engine") ?? false);

	// Disable in reader mode
	$: active = enabled && !$isReaderMode;
	$: shouldRender = active && !runtimeDisabled;

	// Night-vision: override shader params to green CRT when toggled
	$: if (pipeline && $isNightVision) {
		pipeline.params = { crt: 1.0, chromatic: 2.0, bloom: 0.3, holographic: 0 };
	}

	let cleanupFns: (() => void)[] = [];

	onMount(() => {
		if (!active) return;
		const profile = getRuntimeProfile();
		runtimeDisabled = profile.disabled;
		if (profile.disabled) return;
		setup(profile);
		return () => cleanupFns.forEach((fn) => fn());
	});

	function getRuntimeProfile(): RuntimeProfile {
		const nav = navigator as NavigatorHints;
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const saveData = nav.connection?.saveData === true;
		const lowMemory = (nav.deviceMemory ?? 8) <= 4;
		const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
		const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
		const smallViewport = window.innerWidth < 768;
		const constrained = lowMemory || lowCpu || coarsePointer || smallViewport;

		if (prefersReducedMotion || saveData) {
			return {
				disabled: true,
				useLua: false,
				trackPointer: false,
				counts: { electrons: 0, wanderers: 0, cards: 0 },
			};
		}

		if (constrained) {
			return {
				disabled: false,
				useLua: false,
				trackPointer: false,
				shaderParams: {
					crt: 0.2,
					chromatic: 0.5,
					bloom: 0,
					holographic: 0,
				},
				counts: {
					electrons: 3,
					wanderers: 2,
					cards: 1,
				},
			};
		}

		return {
			disabled: false,
			useLua: true,
			trackPointer: true,
			counts: {
				electrons: 6,
				wanderers: 4,
				cards: 3,
			},
		};
	}

	async function setup(profile: RuntimeProfile) {

		// Init sprite canvas (Canvas 2D)
		engine.init(spriteCanvas, () => {
			// After each sprite render, run shader pipeline
			pipeline?.render(spriteCanvas, mouseX, mouseY);
		});

		// Init shader pipeline (WebGL)
		pipeline = new ShaderPipeline(shaderCanvas, profile.shaderParams);

		// Load Lua runtime
		const luaReady = profile.useLua ? await loadLuaRuntime() : false;

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
		for (let i = 0; i < profile.counts.electrons; i++) {
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
		for (let i = 0; i < profile.counts.wanderers; i++) {
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
		for (let i = 0; i < profile.counts.cards; i++) {
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

		if (profile.trackPointer) {
			const onPointerMove = (e: PointerEvent) => {
				mouseX = e.clientX;
				mouseY = e.clientY;
			};
			window.addEventListener("pointermove", onPointerMove, { passive: true });
			cleanupFns.push(() => window.removeEventListener("pointermove", onPointerMove));
		}

		// Track scroll
		const onScroll = () => {
			engine.updateContext({ scrollY: window.scrollY });
		};
		window.addEventListener("scroll", onScroll, { passive: true });

		// Track resize
		const onResize = () => engine.resize();
		window.addEventListener("resize", onResize);

		const onVisibilityChange = () => {
			if (document.hidden) {
				engine.stop();
				return;
			}
			engine.start();
		};
		document.addEventListener("visibilitychange", onVisibilityChange);

		cleanupFns.push(
			() => window.removeEventListener("scroll", onScroll),
			() => window.removeEventListener("resize", onResize),
			() => document.removeEventListener("visibilitychange", onVisibilityChange),
			() => engine.stop(),
		);
	}

	onDestroy(() => {
		engine.destroy();
		pipeline?.destroy();
		pipeline = null;
	});
</script>

{#if shouldRender}
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
