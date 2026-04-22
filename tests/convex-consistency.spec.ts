import { test, expect } from '@playwright/test';

// This test doesn't run against a real browser but checks if the Convex functions are defined
// by looking at the generated api. In a real CI environment, we'd use the convex client.
test('Convex API should have expected queries', async () => {
  // We check the source files directly as a fallback to ensure we didn't break the contract
  const fs = require('fs');
  const path = require('path');

  const likesContent = fs.readFileSync(path.join(process.cwd(), 'convex/likes.ts'), 'utf8');
  expect(likesContent).toContain('export const getAllCategories');

  const giftsContent = fs.readFileSync(path.join(process.cwd(), 'convex/gifts.ts'), 'utf8');
  expect(giftsContent).toContain('export const getConfig');

  const osContent = fs.readFileSync(path.join(process.cwd(), 'convex/os.ts'), 'utf8');
  expect(osContent).toContain('export const getConfig');
});
