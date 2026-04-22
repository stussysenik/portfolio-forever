import { writable } from 'svelte/store';

/** Display capability detection */
export function createColorProfileStore() {
  const gamut = writable<'p3' | 'srgb'>('srgb');
  const hdr = writable(false);
  const reducedMotion = writable(false);
  
  if (typeof window !== 'undefined') {
    // Detect wide gamut
    if (window.matchMedia('(color-gamut: p3)').matches) {
      gamut.set('p3');
    }
    
    // Detect HDR
    if (window.matchMedia('(dynamic-range: high)').matches) {
      hdr.set(true);
    }
    
    // Detect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.set(mq.matches);
    const listener = (e: MediaQueryListEvent) => reducedMotion.set(e.matches);
    mq.addEventListener('change', listener);
    
    // Return a cleanup function for Svelte components
    const destroy = () => {
      mq.removeEventListener('change', listener);
    };
    
    return { gamut, hdr, reducedMotion, destroy };
  }
  
  // Return non-functional stores for SSR
  return { gamut, hdr, reducedMotion, destroy: () => {} };
}

export const colorProfileStore = createColorProfileStore();
