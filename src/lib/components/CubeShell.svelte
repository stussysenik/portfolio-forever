<script lang="ts">
	import { onMount } from 'svelte';
	import { resolveComponentKey } from '$lib/sections/registry';

	type SectionItem = { sectionType: string; visible?: boolean; config?: any; order: number };
	type FaceId = 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom';

	let {
		sections = [] as SectionItem[],
		componentMap = {} as Record<string, any>,
		entriesByTable = {} as Record<string, any[]>,
		heroConfig = null as any,
		cvProfile = null as any,
	} = $props();

	const FACE_ORDER: FaceId[] = ['front', 'right', 'back', 'left', 'top', 'bottom'];

	function resolveCubeFaces(secs: SectionItem[]) {
		const visible = secs
			.filter((s: SectionItem) => s.visible !== false)
			.sort((a: SectionItem, b: SectionItem) => a.order - b.order);

		const faces: Array<{ face: FaceId; sectionType: string; componentKey: string }> = [];
		for (let i = 0; i < 6; i++) {
			const section = visible[i];
			if (section) {
				const key = resolveComponentKey(section.sectionType);
				faces.push({ face: FACE_ORDER[i], sectionType: section.sectionType, componentKey: key });
			} else {
				faces.push({ face: FACE_ORDER[i], sectionType: 'empty', componentKey: '' });
			}
		}
		return faces;
	}

	let rotX = $state(0);
	let rotY = $state(0);
	let targetRotX = 0;
	let targetRotY = 0;
	let isDragging = $state(false);
	let activePointerId: number | null = null;
	let lastPointerX = 0;
	let lastPointerY = 0;
	let animFrame = 0;
	let prefersReducedMotion = $state(false);
	let activeFace = $state<FaceId>('front');
	let cubeSize = $state(500);

	type VelocitySample = { dx: number; dy: number; t: number };
	const velocityBuffer: VelocitySample[] = [];
	const VELOCITY_SAMPLES = 5;
	const DRAG_SENSITIVITY = 0.4;

	let faceConfigs = $derived(resolveCubeFaces(sections));

	function snapToNearest90(val: number): number {
		return Math.round(val / 90) * 90;
	}

	function getFaceFromRotation(rx: number, ry: number): FaceId {
		const normY = (((Math.round(ry / 90) % 4) + 4) % 4);
		const normX = Math.round(rx / 90);
		if (normX === -1 || normX === 3) return 'top';
		if (normX === 1 || normX === -3) return 'bottom';
		const map: Record<number, FaceId> = { 0: 'front', 1: 'right', 2: 'back', 3: 'left' };
		return map[normY] ?? 'front';
	}

	function handlePointerDown(e: PointerEvent) {
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		activePointerId = e.pointerId;
		lastPointerX = e.clientX;
		lastPointerY = e.clientY;
		velocityBuffer.length = 0;
		isDragging = true;
		if (animFrame) { cancelAnimationFrame(animFrame); animFrame = 0; }
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || e.pointerId !== activePointerId) return;
		const dx = e.clientX - lastPointerX;
		const dy = e.clientY - lastPointerY;
		lastPointerX = e.clientX;
		lastPointerY = e.clientY;
		rotY += dx * DRAG_SENSITIVITY;
		rotX -= dy * DRAG_SENSITIVITY;
		velocityBuffer.push({ dx, dy, t: performance.now() });
		if (velocityBuffer.length > VELOCITY_SAMPLES) velocityBuffer.shift();
	}

	function handlePointerEnd(e: PointerEvent) {
		if (e.pointerId !== activePointerId) return;
		try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
		activePointerId = null;
		isDragging = false;

		let sumDx = 0, sumDy = 0;
		for (const s of velocityBuffer) { sumDx += s.dx; sumDy += s.dy; }
		const count = velocityBuffer.length || 1;
		const vY = (sumDx / count) * DRAG_SENSITIVITY;
		const vX = -(sumDy / count) * DRAG_SENSITIVITY;
		velocityBuffer.length = 0;

		if (prefersReducedMotion) {
			targetRotY = snapToNearest90(rotY);
			targetRotX = snapToNearest90(rotX);
			rotY = targetRotY;
			rotX = targetRotX;
			activeFace = getFaceFromRotation(rotX, rotY);
			return;
		}

		const DECAY_MS = 600;
		const startTime = performance.now();
		const startRotX = rotX;
		const startRotY = rotY;
		targetRotX = snapToNearest90(rotX + vX * 8);
		targetRotY = snapToNearest90(rotY + vY * 8);

		function inertiaLoop(now: number) {
			const t = Math.min(1, (now - startTime) / DECAY_MS);
			const ease = 1 - Math.pow(1 - t, 3);
			rotX = startRotX + (targetRotX - startRotX) * ease;
			rotY = startRotY + (targetRotY - startRotY) * ease;
			activeFace = getFaceFromRotation(rotX, rotY);
			if (t < 1) {
				animFrame = requestAnimationFrame(inertiaLoop);
			} else {
				animFrame = 0;
			}
		}
		animFrame = requestAnimationFrame(inertiaLoop);
	}

	function navigateToFace(face: FaceId) {
		const map: Record<FaceId, [number, number]> = {
			front: [0, 0], right: [0, 90], back: [0, 180], left: [0, -90],
			top: [-90, 0], bottom: [90, 0],
		};
		const [tx, ty] = map[face];
		targetRotX = tx;
		targetRotY = ty;
		const startRotX = rotX;
		const startRotY = rotY;
		const startTime = performance.now();
		const DURATION = 600;

		if (animFrame) { cancelAnimationFrame(animFrame); animFrame = 0; }

		function animate(now: number) {
			const t = Math.min(1, (now - startTime) / DURATION);
			const ease = 1 - Math.pow(1 - t, 3);
			rotX = startRotX + (tx - startRotX) * ease;
			rotY = startRotY + (ty - startRotY) * ease;
			activeFace = getFaceFromRotation(rotX, rotY);
			if (t < 1) {
				animFrame = requestAnimationFrame(animate);
			} else {
				animFrame = 0;
			}
		}
		animFrame = requestAnimationFrame(animate);
	}

	function handleKeydown(e: KeyboardEvent) {
		const faceNav: Record<string, FaceId | null> = {
			ArrowRight: 'right', ArrowLeft: 'left', ArrowUp: 'top', ArrowDown: 'bottom',
		};
		const target = faceNav[e.key];
		if (target) { e.preventDefault(); navigateToFace(target); }
		if (e.key === 'Escape') window.dispatchEvent(new CustomEvent('cube:exit'));
	}

	let cubeTransform = $derived(`rotateX(${rotX}deg) rotateY(${rotY}deg)`);
	let halfSize = $derived(cubeSize / 2);

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = mq.matches;
		const handler = (e: MediaQueryListEvent) => { prefersReducedMotion = e.matches; };
		mq.addEventListener('change', handler);

		function updateSize() {
			const w = window.innerWidth;
			if (w < 480) cubeSize = Math.min(w * 0.9, 400);
			else if (w < 768) cubeSize = Math.min(w * 0.8, 450);
			else if (w < 1024) cubeSize = Math.min(w * 0.6, 500);
			else cubeSize = Math.min(500, w * 0.4);
		}
		updateSize();
		window.addEventListener('resize', updateSize);
		window.addEventListener('keydown', handleKeydown);

		return () => {
			mq.removeEventListener('change', handler);
			window.removeEventListener('resize', updateSize);
			window.removeEventListener('keydown', handleKeydown);
			if (animFrame) cancelAnimationFrame(animFrame);
		};
	});
</script>

<div
	class="cube-viewport"
	role="region"
	aria-roledescription="3D cube navigation"
	aria-label="Portfolio sections on a rotating cube"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerEnd}
	onpointercancel={handlePointerEnd}
>
	<div
		class="cube-container"
		style="--cube-size: {cubeSize}px"
		style:transform={cubeTransform}
	>
		{#each faceConfigs as fc (fc.face)}
			<div class="cube-face face-{fc.face}" style="transform: {fc.face === 'front' ? 'rotateY(0deg)' : fc.face === 'right' ? 'rotateY(90deg)' : fc.face === 'back' ? 'rotateY(180deg)' : fc.face === 'left' ? 'rotateY(-90deg)' : fc.face === 'top' ? 'rotateX(90deg)' : 'rotateX(-90deg)'} translateZ({halfSize}px)">
				{#if fc.componentKey && componentMap[fc.componentKey]}
					<svelte:component this={componentMap[fc.componentKey]} id={fc.sectionType} />
				{:else}
					<div class="empty-face">
						<span class="empty-face-label">{fc.face}</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<nav class="cube-nav" aria-label="Cube face navigation">
		{#each FACE_ORDER as face (face)}
			{@const config = faceConfigs.find((f) => f.face === face)}
			<button
				class="cube-nav-dot"
				class:cube-nav-dot--active={activeFace === face}
				title={config?.componentKey ?? face}
				aria-label="Navigate to {config?.componentKey ?? face} face"
				onclick={() => navigateToFace(face)}
			>
				<span class="dot-indicator"></span>
				<span class="dot-label">{config?.componentKey ?? face}</span>
			</button>
		{/each}
	</nav>
</div>

<style>
	.cube-viewport {
		perspective: 1200px;
		perspective-origin: 50% 50%;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		background: var(--color-bg, #0a0a0a);
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	.cube-container {
		transform-style: preserve-3d;
		width: var(--cube-size);
		height: var(--cube-size);
		position: relative;
		will-change: transform;
	}

	.cube-face {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--cube-size);
		height: var(--cube-size);
		overflow-y: auto;
		overflow-x: hidden;
		backface-visibility: hidden;
		background: var(--color-bg, #0a0a0a);
		border: 1px solid var(--border-color, #222);
		padding: 16px;
		color: var(--color-text);
	}

	.empty-face {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-family: var(--font-mono);
		color: var(--color-text-subtle, #444);
	}

	.empty-face-label {
		font-size: var(--font-size-lg, 18px);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.3;
	}

	.cube-nav {
		position: absolute;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 12px;
		z-index: 10;
	}

	.cube-nav-dot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
	}

	.dot-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-text-subtle, #444);
		opacity: 0.4;
		transition: all 200ms ease;
	}

	.cube-nav-dot--active :global(.dot-indicator) {
		background: var(--color-accent, #2563eb);
		opacity: 1;
		transform: scale(1.4);
	}

	.cube-nav-dot:hover :global(.dot-indicator) {
		opacity: 0.8;
	}

	.dot-label {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs, 0.75rem);
		color: var(--color-text-subtle, #444);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0;
		transition: opacity 200ms ease;
	}

	.cube-nav-dot:hover .dot-label,
	.cube-nav-dot--active .dot-label {
		opacity: 1;
	}

	.cube-nav-dot--active .dot-label {
		color: var(--color-accent, #2563eb);
	}
</style>
