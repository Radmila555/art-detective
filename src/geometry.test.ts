import { describe, expect, it } from 'vitest';
import { containedImageBounds, isInsideHitRadius, pointerToImagePoint } from './geometry';

describe('геометрия object-fit: contain', () => {
  it('добавляет поля сверху и снизу для широкого изображения', () => {
    expect(containedImageBounds({ width: 1000, height: 1000 }, 2000, 1000)).toEqual({
      left: 0,
      top: 250,
      width: 1000,
      height: 500,
    });
  });

  it('добавляет поля слева и справа для высокого изображения', () => {
    expect(containedImageBounds({ width: 1000, height: 500 }, 1000, 1000)).toEqual({
      left: 250,
      top: 0,
      width: 500,
      height: 500,
    });
  });

  it('учитывает положение контейнера в окне', () => {
    const point = pointerToImagePoint(
      600,
      450,
      { left: 100, top: 200, width: 1000, height: 500 },
      2000,
      1000,
    );
    expect(point).toEqual({ x: 0.5, y: 0.5 });
  });

  it('инвертирует вертикальную координату браузера в систему Kivy', () => {
    const container = { left: 0, top: 0, width: 100, height: 100 };
    expect(pointerToImagePoint(50, 0, container, 100, 100)?.y).toBe(1);
    expect(pointerToImagePoint(50, 100, container, 100, 100)?.y).toBe(0);
    expect(pointerToImagePoint(50, 25, container, 100, 100)?.y).toBe(0.75);
  });

  it('игнорирует клики по полям вокруг картины', () => {
    const container = { left: 0, top: 0, width: 1000, height: 1000 };
    expect(pointerToImagePoint(500, 100, container, 2000, 1000)).toBeNull();
    expect(pointerToImagePoint(500, 900, container, 2000, 1000)).toBeNull();
    expect(pointerToImagePoint(500, 500, container, 2000, 1000)).not.toBeNull();
  });

  it('сохраняет радиус попадания 0.05', () => {
    const answer = { x: 0.5, y: 0.5 };
    expect(isInsideHitRadius({ x: 0.529, y: 0.54 }, answer)).toBe(true);
    expect(isInsideHitRadius({ x: 0.551, y: 0.5 }, answer)).toBe(false);
  });

  it('отклоняет невозможные размеры', () => {
    expect(() => containedImageBounds({ width: 0, height: 100 }, 100, 100)).toThrow(RangeError);
  });
});
