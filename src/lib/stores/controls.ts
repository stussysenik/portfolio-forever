import { writable, derived } from "svelte/store";

export type DepthLevel = "5-min" | "15-min" | "full";
export type ThemeMode = "minimalist" | "brutalist" | "night-vision";
export type PhysicsMode = "frictionless" | "spring" | "string";

export const depthController = writable<DepthLevel>("full");
export const themeMatrix = writable<ThemeMode>("minimalist");
export const physicsEngine = writable<PhysicsMode>("spring");
export const embellishmentsEnabled = writable<boolean>(false);

// Derived stores for easier access in components
export const isScreenPass = derived(depthController, $depth => $depth === "5-min");
export const isDeepDive = derived(depthController, $depth => $depth === "15-min");
export const isFullArchive = derived(depthController, $depth => $depth === "full");

export const isNightVision = derived(themeMatrix, $theme => $theme === "night-vision");
export const isBrutalist = derived(themeMatrix, $theme => $theme === "brutalist");

export const isFluidString = derived(physicsEngine, $physics => $physics === "string");
export const isFrictionless = derived(physicsEngine, $physics => $physics === "frictionless");
