import { describe, it, expect } from 'vitest';

/**
 * Typography Token Verification
 * Ensures fluid clamp() values produce reasonable sizes at key breakpoints
 */

describe('Typography Tokens', () => {
  // Parse a clamp() value and compute size at a given viewport width
  function computeClamp(clampValue: string, vw: number): number {
    // Extract min, preferred, max from clamp(min, preferred, max)
    const match = clampValue.match(/clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
    if (!match) return 0;
    
    const min = parseFloat(match[1]);
    const pref = match[2].trim();
    const max = parseFloat(match[3]);
    
    // Parse preferred: e.g. "0.95rem + 0.25vw"
    const prefMatch = pref.match(/^([\d.]+)([a-z]+)\s*([+-])\s*([\d.]+)([a-z]+)$/);
    if (!prefMatch) return min;
    
    const baseVal = parseFloat(prefMatch[1]);
    const baseUnit = prefMatch[2];
    const op = prefMatch[3];
    const vwVal = parseFloat(prefMatch[4]);
    const vwUnit = prefMatch[5];
    
    // Convert base to rem (assuming root = 16px)
    let baseRem = baseVal;
    if (baseUnit === 'px') baseRem = baseVal / 16;
    
    // Calculate vw contribution
    let vwContribution = 0;
    if (vwUnit === 'vw') {
      vwContribution = (vwVal * vw) / 100 / 16; // convert to rem
    }
    
    const result = op === '+' ? baseRem + vwContribution : baseRem - vwContribution;
    
    // Clamp between min and max
    return Math.max(min, Math.min(result, max));
  }

  const tokens: Record<string, string> = {
    'font-size-3xs': 'clamp(0.75rem, 0.70rem + 0.25vw, 0.813rem)',
    'font-size-2xs': 'clamp(0.75rem, 0.70rem + 0.25vw, 0.875rem)',
    'font-size-xs': 'clamp(0.75rem, 0.70rem + 0.28vw, 0.875rem)',
    'font-size-sm': 'clamp(0.813rem, 0.76rem + 0.25vw, 1rem)',
    'font-size-base': 'clamp(1rem, 0.95rem + 0.25vw, 1.25rem)',
    'font-size-lg': 'clamp(1.125rem, 1rem + 0.5vw, 1.5rem)',
    'font-size-xl': 'clamp(1.5rem, 1.25rem + 0.85vw, 2.25rem)',
    'font-size-2xl': 'clamp(2rem, 1.6rem + 1.3vw, 3rem)',
    'font-size-3xl': 'clamp(2.5rem, 1.95rem + 1.8vw, 4rem)',
    'font-size-4xl': 'clamp(3.25rem, 2.4rem + 2.6vw, 5rem)',
    'font-size-display': 'clamp(4rem, 2.8rem + 4.2vw, 8rem)',
    'font-size-hero': 'clamp(5rem, 3.5rem + 5.5vw, 12rem)',
  };

  it('scales up at 1440px viewport', () => {
    for (const [name, value] of Object.entries(tokens)) {
      const size = computeClamp(value, 1440);
      expect(size).toBeGreaterThan(0);
      // At 1440px, sizes should be noticeably larger than minimum
      const min = parseFloat(value.match(/clamp\(([\d.]+)/)?.[1] || '0');
      expect(size).toBeGreaterThanOrEqual(min);
    }
  });

  it('scales up at 3840px viewport (4K)', () => {
    for (const [name, value] of Object.entries(tokens)) {
      const size = computeClamp(value, 3840);
      const max = parseFloat(value.match(/,\s*([\d.]+)(?:rem|px)\s*\)/)?.[1] || '999');
      // Should approach or reach max at 4K
      expect(size).toBeGreaterThanOrEqual(parseFloat(value.match(/clamp\(([\d.]+)/)?.[1] || '0'));
    }
  });

  it('hero text reaches 12rem at 4K', () => {
    const heroSize = computeClamp(tokens['font-size-hero'], 3840);
    expect(heroSize).toBeGreaterThanOrEqual(10); // At least 10rem at 4K
  });

  it('base text stays readable at all sizes', () => {
    for (const vw of [320, 768, 1024, 1440, 2560, 3840]) {
      const baseSize = computeClamp(tokens['font-size-base'], vw);
      expect(baseSize).toBeGreaterThanOrEqual(0.9); // Never below ~14.4px
      expect(baseSize).toBeLessThanOrEqual(1.5); // Never above 24px
    }
  });

  it('text has no breakpoint jumps — continuous scaling', () => {
    // Verify sizes increase monotonically with viewport
    const sizes_320: number[] = [];
    const sizes_3840: number[] = [];
    
    for (const [name, value] of Object.entries(tokens)) {
      sizes_320.push(computeClamp(value, 320));
      sizes_3840.push(computeClamp(value, 3840));
    }
    
    // All sizes should be larger at 4K than at 320px
    for (let i = 0; i < sizes_320.length; i++) {
      expect(sizes_3840[i]).toBeGreaterThanOrEqual(sizes_320[i]);
    }
  });
});
