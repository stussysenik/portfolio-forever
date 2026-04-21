import { atom } from "nanostores";

export const shellState = atom<"folded" | "spread">("folded");

export function toggleShellState() {
	shellState.set(shellState.get() === "folded" ? "spread" : "folded");
}
