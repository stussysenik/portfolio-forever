import { expect, test } from 'vitest';
import { formatIndustrialDate } from '../../src/lib/utils/industrial-date';

test('formats date to industrial standard YYYY.MM.DD', () => {
  const date = new Date(2026, 3, 22); // April 22
  expect(formatIndustrialDate(date)).toBe('2026.04.22');
});
