/**
 * Impeccable Design System layout logic.
 * Ported from clj/portfolio/ui/impeccable.cljs
 */

export const gridColumns = 12;
export const baseUnit = 12; // 12pt design grid

export const px = (units: number) => `${units * baseUnit}px`;
export const rem = (units: number) => `${units * 0.75}rem`; // 12px = 0.75rem

export function getHeroLayout(viewMode: string) {
	switch (viewMode) {
		case "editorial":
			return { identity: 5, visual: 7 };
		case "balanced":
			return { identity: 6, visual: 6 };
		case "focus":
			return { identity: 4, visual: 8 };
		default:
			return { identity: 5, visual: 7 }; // Default split
	}
}

export function verticalSpace(scale: "xs" | "sm" | "md" | "lg" | "xl") {
	switch (scale) {
		case "xs":
			return rem(1); // 12px
		case "sm":
			return rem(2); // 24px
		case "md":
			return rem(4); // 48px
		case "lg":
			return rem(8); // 96px
		case "xl":
			return rem(12); // 144px
		default:
			return rem(4);
	}
}
