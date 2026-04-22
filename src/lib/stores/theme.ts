import { atom, computed } from 'nanostores';

export const accentHueAtom = atom<number>(250);
export const spacingAtom = atom<number>(1.0);

export const oklchAccentColor = computed(accentHueAtom, (hue) => {
	return `oklch(0.6 0.15 ${hue})`;
});
