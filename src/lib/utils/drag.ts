/**
 * Svelte action to handle drag interactions.
 * Ported from clj/portfolio/ui/drag.cljs
 */

export function makeDraggable(node: HTMLElement, _params?: any) {
	let state = {
		dragging: false,
		startX: 0,
		startY: 0,
		posX: 0,
		posY: 0,
		startMouseX: 0,
		startMouseY: 0,
	};

	function updateTransform() {
		node.style.transform = `translate(${state.posX}px, ${state.posY}px)`;
	}

	function handlePointerDown(e: PointerEvent) {
		state.dragging = true;
		state.startMouseX = e.clientX;
		state.startMouseY = e.clientY;
		state.startX = state.posX;
		state.startY = state.posY;

		node.setPointerCapture(e.pointerId);
		node.style.cursor = "grabbing";
		node.style.zIndex = "100";

		const container = node.querySelector(".donut-container");
		if (container) {
			container.classList.add("dragging");
		}
	}

	function handlePointerMove(e: PointerEvent) {
		if (!state.dragging) return;

		const dx = e.clientX - state.startMouseX;
		const dy = e.clientY - state.startMouseY;

		state.posX = state.startX + dx;
		state.posY = state.startY + dy;

		updateTransform();
	}

	function handlePointerUp(e: PointerEvent) {
		state.dragging = false;
		node.releasePointerCapture(e.pointerId);
		node.style.cursor = "grab";
		node.style.zIndex = "50";

		const container = node.querySelector(".donut-container");
		if (container) {
			container.classList.remove("dragging");
		}
	}

	node.style.cursor = "grab";
	node.style.touchAction = "none";
	node.style.userSelect = "none";
	node.style.position = "relative";
	node.style.zIndex = "50";

	node.addEventListener("pointerdown", handlePointerDown);
	node.addEventListener("pointermove", handlePointerMove);
	node.addEventListener("pointerup", handlePointerUp);
	node.addEventListener("pointercancel", handlePointerUp);

	return {
		destroy() {
			node.removeEventListener("pointerdown", handlePointerDown);
			node.removeEventListener("pointermove", handlePointerMove);
			node.removeEventListener("pointerup", handlePointerUp);
			node.removeEventListener("pointercancel", handlePointerUp);
		},
	};
}
