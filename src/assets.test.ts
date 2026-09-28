import { describe, expect, it } from 'vitest';
import { assetUrl } from './assets';

describe('assetUrl', () => {
  it('normalizes asset paths for the GitHub Pages repository base', () => {
    expect(assetUrl('/assets/background.png', '/art-detective/')).toBe(
      '/art-detective/assets/background.png',
    );
  });
});
