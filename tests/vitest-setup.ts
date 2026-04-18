import { vi } from 'vitest';

// Global mocks for Vitest
vi.mock('$lib/app-shims', () => ({
  goto: vi.fn(),
  browser: true,
  env: {},
  api: {}
}));
