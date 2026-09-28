import { describe, expect, it } from 'vitest';
import { GameSession } from './game';
import {
  getPaintingCopy,
  LOCALE_STORAGE_KEY,
  LocaleState,
  PAINTING_COPY,
  readStoredLocale,
  UI_COPY,
  type StorageLike,
} from './i18n';

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function structuralKeys(value: unknown): unknown {
  if (typeof value === 'function') return 'function';
  if (value === null || typeof value !== 'object') return typeof value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, structuralKeys(entry)]));
}

describe('localization', () => {
  it('provides complete matching RU and EN interface dictionaries', () => {
    expect(structuralKeys(UI_COPY.ru)).toEqual(structuralKeys(UI_COPY.en));
  });

  it('provides localized start, result, and credits screens', () => {
    expect(UI_COPY.ru.title).toBe('Арт-Детектив: Дело о подделке');
    expect(UI_COPY.en.title).toBe('Art Detective: The Forgery Case');
    expect(UI_COPY.ru.caseClosed).not.toBe('');
    expect(UI_COPY.en.caseClosed).not.toBe('');
    expect(UI_COPY.ru.credits.pageTitle).toBe('Источники и лицензии');
    expect(UI_COPY.en.credits.pageTitle).toBe('Sources & Licenses');
  });

  it('contains complete RU and EN text for all ten levels', () => {
    expect(PAINTING_COPY).toHaveLength(10);
    PAINTING_COPY.forEach((painting, index) => {
      expect(painting.level).toBe(index + 1);
      for (const locale of ['ru', 'en'] as const) {
        expect(Object.values(painting[locale]).every((value) => value.trim().length > 0)).toBe(true);
        expect(getPaintingCopy(painting.level, locale)).toBe(painting[locale]);
      }
    });
  });

  it('defaults to RU and persists switching RU → EN → RU', () => {
    const storage = new MemoryStorage();
    const locale = new LocaleState(storage);
    expect(locale.current).toBe('ru');

    locale.set('en');
    expect(new LocaleState(storage).current).toBe('en');
    expect(storage.getItem(LOCALE_STORAGE_KEY)).toBe('en');

    locale.set('ru');
    expect(new LocaleState(storage).current).toBe('ru');
  });

  it('falls back to RU when storage is empty or invalid', () => {
    const storage = new MemoryStorage();
    expect(readStoredLocale(storage)).toBe('ru');
    storage.setItem(LOCALE_STORAGE_KEY, 'de');
    expect(readStoredLocale(storage)).toBe('ru');
  });

  it('does not alter game progress when the language changes', () => {
    const storage = new MemoryStorage();
    const locale = new LocaleState(storage);
    const game = new GameSession();
    game.openPlot();
    game.beginInvestigation();
    expect(game.submitGuess(true)).toBe('correct');
    const stateBefore = { screen: game.screen, level: game.currentLevel, score: game.totalScore, answered: game.levelAnsweredCorrectly };

    locale.set('en');

    expect({ screen: game.screen, level: game.currentLevel, score: game.totalScore, answered: game.levelAnsweredCorrectly }).toEqual(stateBefore);
    expect(getPaintingCopy(game.currentLevel, locale.current).artist).toBe('Claude Monet');
  });
});
