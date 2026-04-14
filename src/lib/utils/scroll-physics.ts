import type { PhysicsMode } from "$lib/stores/controls";

const PARALLAX_MULTIPLIERS: Record<PhysicsMode, number> = {
	spring: 0.1,        // current default behavior
	frictionless: 0,    // no parallax — instant response
	string: 0.25,       // exaggerated elastic parallax
};

const SCROLL_BEHAVIORS: Record<PhysicsMode, ScrollBehavior> = {
	spring: "smooth",
	frictionless: "auto",   // instant snap
	string: "smooth",
};

/** Get parallax multiplier for the given physics mode */
export function getParallaxMultiplier(mode: PhysicsMode): number {
	return PARALLAX_MULTIPLIERS[mode];
}

/** Get scroll behavior for the given physics mode */
export function getScrollBehavior(mode: PhysicsMode): ScrollBehavior {
	return SCROLL_BEHAVIORS[mode];
}
