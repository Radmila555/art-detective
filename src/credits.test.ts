import { describe, expect, it } from 'vitest';
import { ARTWORK_CREDITS } from './credits';

describe('credits data', () => {
  it('contains one complete source entry for every level', () => {
    expect(ARTWORK_CREDITS).toHaveLength(10);
    expect(ARTWORK_CREDITS.map(({ level }) => level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    ARTWORK_CREDITS.forEach((credit) => {
      expect(credit.source).not.toBe('');
      expect(credit.sourceUrl).toMatch(/^https:\/\//);
      expect(credit.status).not.toBe('');
    });
  });
});
