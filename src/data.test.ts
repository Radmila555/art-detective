import { describe, expect, it } from 'vitest';
import { getPainting, PAINTINGS, paintingImage } from './data';

describe('данные картин', () => {
  it('содержат десять полных последовательных уровней', () => {
    expect(PAINTINGS).toHaveLength(10);

    PAINTINGS.forEach((painting, index) => {
      expect(painting.level).toBe(index + 1);
      expect(painting.artist.trim()).not.toBe('');
      expect(painting.title.trim()).not.toBe('');
      expect(painting.fact.trim()).not.toBe('');
      expect(painting.correctX).toBeGreaterThanOrEqual(0);
      expect(painting.correctX).toBeLessThanOrEqual(1);
      expect(painting.correctY).toBeGreaterThanOrEqual(0);
      expect(painting.correctY).toBeLessThanOrEqual(1);
      expect(paintingImage(painting.level, 'fake')).toBe(`/assets/img.${painting.level}_fake.png`);
      expect(paintingImage(painting.level, 'orig')).toBe(`/assets/img.${painting.level}_orig.png`);
    });
  });

  it('сохраняет Синьяка в уровне 9 и Сезанна в уровне 10', () => {
    expect(getPainting(9)).toMatchObject({ artist: 'Поль Синьяк', title: 'Сосна в Сен-Тропе' });
    expect(getPainting(10)).toMatchObject({ artist: 'Поль Сезанн', title: 'Корзина с яблоками' });
    expect(getPainting(10).fact).toContain('Сезанна');
  });

  it('отклоняет отсутствующий уровень', () => {
    expect(() => getPainting(0)).toThrow(RangeError);
    expect(() => getPainting(11)).toThrow(RangeError);
  });
});
