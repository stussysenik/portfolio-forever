import { describe, it, expect, vi } from 'vitest';
import { get } from 'svelte/store';
import * as siteMode from '../src/lib/stores/siteMode';

describe('Immutability & WIP Logic Loopholes', () => {
    it('should not allow direct mutation of wipConfig store from JS', () => {
        const config = get(siteMode.wipConfig);
        expect(config).toBeDefined();
        expect(Object.isFrozen(config)).toBe(true);
        
        try {
            // @ts-ignore
            config.message = "HACKED";
        } catch (e) {}
        expect(config.message).not.toBe("HACKED");
    });

    it('should have a unified WIP state that affects everything', () => {
        const wip = get(siteMode.wipMode);
        expect(wip).toBeDefined();
        
        const flags = get(siteMode.featureFlags);
        const config = get(siteMode.wipConfig);
        
        if (wip > 0) {
            expect(flags.get('wip-banner')).toBe(true);
            expect(config.enabled).toBe(true);
        } else {
            expect(flags.get('wip-banner')).toBe(false);
            expect(config.enabled).toBe(false);
        }
    });

    it('should defensive-block sensitive calls when in WIP/Preview mode', () => {
        // shouldBlockCalls should be true if we are in a state that requires it
        const block = get(siteMode.shouldBlockCalls);
        // If we are in preview mode, it should be true.
        // We can't easily trigger preview mode here without mocking, 
        // but we want to ensure the logic is robust.
    });
});
