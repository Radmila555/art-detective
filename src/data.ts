import { assetUrl } from './assets';

export interface PaintingData {
  readonly level: number;
  readonly correctX: number;
  readonly correctY: number;
}

export const PAINTINGS: readonly PaintingData[] = [
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
] as const;

export function getPainting(level: number): PaintingData {
  if (!Number.isInteger(level) || level < 1 || level > PAINTINGS.length) {
    throw new RangeError(`Level must be between 1 and ${PAINTINGS.length}: ${level}`);
  }
  return PAINTINGS[level - 1];
}

export function paintingImage(level: number, kind: 'fake' | 'orig'): string {
  return assetUrl(`assets/img.${level}_${kind}.png`);
}
