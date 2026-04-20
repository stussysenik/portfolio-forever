import { test, expect } from 'vitest';
import { get_cv_hiccup } from '../src/lib/clj/portfolio/sections/cv.mjs';
import { process_steps } from '../src/lib/clj/portfolio/data/content.mjs';

test('CV hiccup returns a valid array structure', () => {
    const hiccup = get_cv_hiccup(false);
    expect(Array.isArray(hiccup)).toBe(true);
    expect(hiccup[0]).toBe('section');
    expect(hiccup[1].class).toBe('cv-wrapper');
    // Verify experience entries are appended correctly
    const expSection = hiccup.find(el => Array.isArray(el) && el[1]?.class === 'cv-section' && el[2][2] === 'Experience');
    expect(expSection).toBeDefined();
});

test('Process steps have ascii property', () => {
    const step = process_steps[0];
    expect(step.ascii).toBeDefined();
    expect(typeof step.ascii).toBe('string');
    expect(step.ascii.includes('┌')).toBe(true);
});
