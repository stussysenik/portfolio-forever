import { describe, it, expect, beforeEach } from 'vitest';
import { createNavParadigmMachine } from './navParadigmMachine';

describe('NavParadigmMachine', () => {
  let machine: ReturnType<typeof createNavParadigmMachine>;

  beforeEach(() => {
    machine = createNavParadigmMachine('sidebar');
  });

  it('initializes with the given paradigm', () => {
    expect(machine.getState().current).toBe('sidebar');
    expect(machine.getState().status).toBe('idle');
  });

  it('transitions to switching when a new paradigm is selected', () => {
    machine.send({ type: 'SWITCH', to: 'drawer' });
    expect(machine.getState().status).toBe('switching');
    expect(machine.getState().target).toBe('drawer');
  });

  it('completes transition and sets new current paradigm', () => {
    machine.send({ type: 'SWITCH', to: 'drawer' });
    machine.send({ type: 'TRANSITION_END' });
    expect(machine.getState().status).toBe('idle');
    expect(machine.getState().current).toBe('drawer');
    expect(machine.getState().previous).toBe('sidebar');
  });

  it('ignores SWITCH to the same paradigm', () => {
    machine.send({ type: 'SWITCH', to: 'sidebar' });
    expect(machine.getState().status).toBe('idle');
    expect(machine.getState().current).toBe('sidebar');
  });

  it('allows all four paradigms', () => {
    const paradigms: Array<'sidebar' | 'drawer' | 'hybrid' | 'none'> = ['sidebar', 'drawer', 'hybrid', 'none'];
    for (const p of paradigms) {
      const m = createNavParadigmMachine('sidebar');
      m.send({ type: 'SWITCH', to: p });
      m.send({ type: 'TRANSITION_END' });
      expect(m.getState().current).toBe(p);
    }
  });

  it('queues preview during transition and applies after', () => {
    machine.send({ type: 'SWITCH', to: 'hybrid' });
    machine.send({ type: 'PREVIEW', route: '/works' });
    expect(machine.getState().previewRoute).toBe('/works');
    expect(machine.getState().status).toBe('switching');
    
    machine.send({ type: 'TRANSITION_END' });
    expect(machine.getState().status).toBe('previewing');
    expect(machine.getState().current).toBe('hybrid');
    expect(machine.getState().previewRoute).toBe('/works');
  });

  it('exits preview and returns to idle', () => {
    machine.send({ type: 'PREVIEW', route: '/cv' });
    expect(machine.getState().status).toBe('previewing');
    
    machine.send({ type: 'EXIT_PREVIEW' });
    expect(machine.getState().status).toBe('idle');
    expect(machine.getState().previewRoute).toBeNull();
  });

  it('notifies subscribers on state changes', () => {
    const changes: string[] = [];
    const unsub = machine.subscribe((state) => {
      changes.push(`${state.status}:${state.current}`);
    });

    machine.send({ type: 'SWITCH', to: 'drawer' });
    machine.send({ type: 'TRANSITION_END' });

    expect(changes.length).toBeGreaterThanOrEqual(2);
    expect(changes).toContain('switching:sidebar');
    expect(changes).toContain('idle:drawer');

    unsub();
  });

  it('does not notify after unsubscribe', () => {
    let count = 0;
    const unsub = machine.subscribe(() => count++);
    unsub();
    machine.send({ type: 'SWITCH', to: 'drawer' });
    expect(count).toBe(0);
  });
});
