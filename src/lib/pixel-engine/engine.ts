// Pixel engine: 30fps entity loop with Canvas 2D sprite rendering
// Entities are Lua-scripted via Fengari, culled when off-screen

export interface Entity {
	id: string;
	type: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
	width: number;
	height: number;
	frame: number;
	frameCount: number;
	frameTimer: number;
	frameInterval: number;
	section: string;
	color: string;
	visible: boolean;
	luaUpdate?: (dt: number, entity: Entity, ctx: EngineContext) => void;
}

export interface EngineContext {
	scrollY: number;
	scrollVelocity: number;
	mouseX: number;
	mouseY: number;
	viewportW: number;
	viewportH: number;
	visibleSections: Set<string>;
}

export type RenderCallback = (ctx: CanvasRenderingContext2D, entities: Entity[]) => void;

const TARGET_FPS = 30;
const FRAME_TIME = 1000 / TARGET_FPS;
const MAX_ENTITIES = 50;

let entities: Entity[] = [];
let running = false;
let rafId: number | null = null;
let lastTime = 0;
let canvas: HTMLCanvasElement | null = null;
let ctx2d: CanvasRenderingContext2D | null = null;
let postRender: RenderCallback | null = null;

const engineCtx: EngineContext = {
	scrollY: 0,
	scrollVelocity: 0,
	mouseX: 0,
	mouseY: 0,
	viewportW: 0,
	viewportH: 0,
	visibleSections: new Set(),
};

let prevScrollY = 0;

export function init(c: HTMLCanvasElement, afterRender?: RenderCallback) {
	canvas = c;
	ctx2d = c.getContext("2d")!;
	postRender = afterRender ?? null;
	resize();
}

export function resize() {
	if (!canvas) return;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	engineCtx.viewportW = canvas.width;
	engineCtx.viewportH = canvas.height;
}

export function start() {
	if (running) return;
	running = true;
	lastTime = performance.now();
	tick(lastTime);
}

export function stop() {
	running = false;
	if (rafId !== null) cancelAnimationFrame(rafId);
	rafId = null;
}

export function destroy() {
	stop();
	entities = [];
	canvas = null;
	ctx2d = null;
}

export function spawn(partial: Partial<Entity> & { type: string }): Entity | null {
	if (entities.length >= MAX_ENTITIES) return null;
	const e: Entity = {
		id: `${partial.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		type: partial.type,
		x: partial.x ?? Math.random() * engineCtx.viewportW,
		y: partial.y ?? Math.random() * engineCtx.viewportH,
		vx: partial.vx ?? 0,
		vy: partial.vy ?? 0,
		width: partial.width ?? 8,
		height: partial.height ?? 8,
		frame: 0,
		frameCount: partial.frameCount ?? 1,
		frameTimer: 0,
		frameInterval: partial.frameInterval ?? 200,
		section: partial.section ?? "hero",
		color: partial.color ?? "#00ff88",
		visible: true,
		luaUpdate: partial.luaUpdate,
	};
	entities.push(e);
	return e;
}

export function despawn(id: string) {
	entities = entities.filter((e) => e.id !== id);
}

export function clearAll() {
	entities = [];
}

export function getEntities(): Entity[] {
	return entities;
}

export function updateContext(partial: Partial<EngineContext>) {
	Object.assign(engineCtx, partial);
}

function tick(now: number) {
	if (!running) return;
	rafId = requestAnimationFrame(tick);

	const elapsed = now - lastTime;
	if (elapsed < FRAME_TIME) return;
	lastTime = now - (elapsed % FRAME_TIME);

	const dt = FRAME_TIME / 1000;

	// Scroll velocity
	engineCtx.scrollVelocity = engineCtx.scrollY - prevScrollY;
	prevScrollY = engineCtx.scrollY;

	// Update entities
	for (const e of entities) {
		// Cull off-section entities
		e.visible = engineCtx.visibleSections.has(e.section) || e.section === "*";

		if (!e.visible) continue;

		// Lua update
		if (e.luaUpdate) {
			e.luaUpdate(dt, e, engineCtx);
		}

		// Default physics
		e.x += e.vx * dt;
		e.y += e.vy * dt;

		// Animate frames
		e.frameTimer += FRAME_TIME;
		if (e.frameTimer >= e.frameInterval) {
			e.frame = (e.frame + 1) % e.frameCount;
			e.frameTimer = 0;
		}

		// Wrap around viewport
		if (e.x > engineCtx.viewportW + e.width) e.x = -e.width;
		if (e.x < -e.width) e.x = engineCtx.viewportW + e.width;
		if (e.y > engineCtx.viewportH + e.height) e.y = -e.height;
		if (e.y < -e.height) e.y = engineCtx.viewportH + e.height;
	}

	// Render
	render();
}

function render() {
	if (!ctx2d || !canvas) return;
	ctx2d.clearRect(0, 0, canvas.width, canvas.height);

	for (const e of entities) {
		if (!e.visible) continue;
		drawEntity(ctx2d, e);
	}

	// Post-processing hook (shader pipeline reads this canvas)
	if (postRender) {
		postRender(ctx2d, entities);
	}
}

function drawEntity(ctx: CanvasRenderingContext2D, e: Entity) {
	// Pixel art style: crisp squares
	ctx.imageSmoothingEnabled = false;

	// Simple pixel sprite — each entity type gets a distinct look
	ctx.fillStyle = e.color;
	ctx.globalAlpha = 0.9;

	// Draw a simple pixel character based on type
	const px = Math.round(e.x);
	const py = Math.round(e.y);
	const s = e.width;

	switch (e.type) {
		case "electron":
			// Small glowing dot
			ctx.beginPath();
			ctx.arc(px, py, s / 2, 0, Math.PI * 2);
			ctx.fill();
			// Glow
			ctx.globalAlpha = 0.3;
			ctx.beginPath();
			ctx.arc(px, py, s, 0, Math.PI * 2);
			ctx.fill();
			break;

		case "card":
			// Poker card outline
			ctx.fillRect(px, py, s * 2, s * 3);
			ctx.fillStyle = "#fff";
			ctx.globalAlpha = 0.8;
			ctx.fillRect(px + 1, py + 1, s * 2 - 2, s * 3 - 2);
			ctx.fillStyle = e.color;
			ctx.globalAlpha = 0.9;
			// Suit symbol (diamond)
			const cx = px + s;
			const cy = py + s * 1.5;
			ctx.beginPath();
			ctx.moveTo(cx, cy - s * 0.6);
			ctx.lineTo(cx + s * 0.4, cy);
			ctx.lineTo(cx, cy + s * 0.6);
			ctx.lineTo(cx - s * 0.4, cy);
			ctx.closePath();
			ctx.fill();
			break;

		case "wanderer":
			// 8x8 pixel creature
			const pixels = [
				[0,0,1,1,1,1,0,0],
				[0,1,1,1,1,1,1,0],
				[1,1,0,1,1,0,1,1],
				[1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1],
				[0,1,1,0,0,1,1,0],
				[0,0,1,0,0,1,0,0],
				[0,1,1,0,0,1,1,0],
			];
			const ps = s / 8;
			for (let row = 0; row < 8; row++) {
				for (let col = 0; col < 8; col++) {
					if (pixels[row][col]) {
						ctx.fillRect(px + col * ps, py + row * ps, ps, ps);
					}
				}
			}
			break;

		default:
			// Fallback: simple square
			ctx.fillRect(px, py, s, s);
	}

	ctx.globalAlpha = 1;
}
