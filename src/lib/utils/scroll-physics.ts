/**
 * Scroll physics utilities — parallax multipliers and scroll behaviors.
 * Ported from clj/portfolio/utils/scroll_physics.cljs
 */

export type PhysicsMode = "spring" | "frictionless" | "string";

export const parallaxMultipliers: Record<PhysicsMode, number> = {
	spring: 0.1,
	frictionless: 0,
	string: 0.25,
};

export const scrollBehaviors: Record<PhysicsMode, ScrollBehavior> = {
	spring: "smooth",
	frictionless: "auto",
	string: "smooth",
};

export const getParallaxMultiplier = (mode: PhysicsMode) => {
	return parallaxMultipliers[mode] ?? 0.1;
};

export const getScrollBehavior = (mode: PhysicsMode) => {
	return scrollBehaviors[mode] ?? "smooth";
};
