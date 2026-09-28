import { describe, expect, it } from 'vitest';
import { getPainting, PAINTINGS, paintingImage } from './data';

describe('painting geometry and assets', () => {
  it('keeps all ten production hit zones unchanged', () => {
    expect(PAINTINGS).toEqual([
      { level: 1, correctX: 0.7953, correctY: 0.7116 },
      { level: 2, correctX: 0.4266, correctY: 0.4997 },
      { level: 3, correctX: 0.6323, correctY: 0.3469 },
      { level: 4, correctX: 0.8245, correctY: 0.3153 },
      { level: 5, correctX: 0.6316, correctY: 0.1549 },
      { level: 6, correctX: 0.5682, correctY: 0.2799 },
      { level: 7, correctX: 0.1594, correctY: 0.4745 },
      { level: 8, correctX: 0.1474, correctY: 0.7431 },
      { level: 9, correctX: 0.0516, correctY: 0.5388 },
      { level: 10, correctX: 0.487, correctY: 0.2484 },
    ]);
  });

  it('keeps the GitHub Pages production asset paths', () => {
    PAINTINGS.forEach(({ level }) => {
      expect(paintingImage(level, 'fake')).toBe(`${import.meta.env.BASE_URL}assets/img.${level}_fake.png`);
      expect(paintingImage(level, 'orig')).toBe(`${import.meta.env.BASE_URL}assets/img.${level}_orig.png`);
    });
  });

  it('rejects a missing level', () => {
    expect(() => getPainting(0)).toThrow(RangeError);
    expect(() => getPainting(11)).toThrow(RangeError);
  });
});
