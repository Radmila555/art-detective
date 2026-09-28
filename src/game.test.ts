import { afterEach, describe, expect, it, vi } from 'vitest';
import { GameSession, gradeForScore } from './game';
import { EDUCATION_CARD_DELAY_MS, scheduleEducationCard } from './reveal';

afterEach(() => {
  vi.useRealTimers();
});

function enterGame(game: GameSession): void {
  game.openPlot();
  game.beginInvestigation();
}

function finishCurrentLevel(game: GameSession, firstTry = true): void {
  if (!firstTry) expect(game.submitGuess(false)).toBe('wrong');
  expect(game.submitGuess(true)).toBe('correct');
  game.revealAnswer();
  game.showEducation();
  game.advance();
}

describe('состояние игры', () => {
  it('проходит титульный экран, сюжет и начинает первый уровень', () => {
    const game = new GameSession();
    expect(game.screen).toBe('title');
    game.openPlot();
    expect(game.screen).toBe('plot');
    game.beginInvestigation();
    expect(game.screen).toBe('gameplay');
    expect(game.currentLevel).toBe(1);
    expect(game.totalScore).toBe(0);
  });

  it('открывает credits со стартового и финального экранов и возвращается назад', () => {
    const game = new GameSession();
    game.openCredits();
    expect(game.screen).toBe('credits');
    game.closeCredits();
    expect(game.screen).toBe('title');

    enterGame(game);
    for (let level = 1; level <= 10; level += 1) finishCurrentLevel(game);
    expect(game.screen).toBe('results');
    game.openCredits();
    expect(game.screen).toBe('credits');
    game.closeCredits();
    expect(game.screen).toBe('results');
  });

  it('начисляет 10 баллов только за правильный ответ с первой попытки', () => {
    const game = new GameSession();
    enterGame(game);
    expect(game.submitGuess(true)).toBe('correct');
    expect(game.totalScore).toBe(10);
    expect(game.submitGuess(true)).toBe('ignored');
    expect(game.totalScore).toBe(10);
  });

  it('первая ошибка лишает уровень баллов, но не запрещает продолжать поиск', () => {
    const game = new GameSession();
    enterGame(game);
    expect(game.submitGuess(false)).toBe('wrong');
    expect(game.levelHasMistakes).toBe(true);
    expect(game.levelAnsweredCorrectly).toBe(false);
    expect(game.submitGuess(false)).toBe('wrong');
    expect(game.submitGuess(true)).toBe('correct');
    expect(game.levelAnsweredCorrectly).toBe(true);
    expect(game.totalScore).toBe(0);
  });

  it('не переходит дальше до показа правильного ответа', () => {
    const game = new GameSession();
    enterGame(game);
    game.advance();
    expect(game.currentLevel).toBe(1);
    game.submitGuess(true);
    game.advance();
    expect(game.currentLevel).toBe(1);
    game.revealAnswer();
    game.showEducation();
    game.advance();
    expect(game.currentLevel).toBe(2);
  });

  it('сразу показывает оригинал, а образовательную карточку — через 1800 мс', () => {
    vi.useFakeTimers();
    const game = new GameSession();
    enterGame(game);

    expect(game.submitGuess(true)).toBe('correct');
    game.revealAnswer();
    scheduleEducationCard(() => game.showEducation());

    expect(game.answerRevealed).toBe(true);
    expect(game.educationVisible).toBe(false);

    vi.advanceTimersByTime(EDUCATION_CARD_DELAY_MS - 1);
    expect(game.educationVisible).toBe(false);

    vi.advanceTimersByTime(1);
    expect(game.educationVisible).toBe(true);
  });

  it('сбрасывает флаги попытки при переходе на следующий уровень', () => {
    const game = new GameSession();
    enterGame(game);
    finishCurrentLevel(game, false);
    expect(game.currentLevel).toBe(2);
    expect(game.levelHasMistakes).toBe(false);
    expect(game.levelAnsweredCorrectly).toBe(false);
    expect(game.answerRevealed).toBe(false);
    expect(game.educationVisible).toBe(false);
  });

  it.each([
    [0, '3'],
    [69, '3'],
    [70, '4'],
    [89, '4'],
    [90, '5'],
    [100, '5'],
  ] as const)('выставляет оценку для результата %i', (score, grade) => {
    expect(gradeForScore(score)).toBe(grade);
  });

  it('проходит полный игровой цикл и полностью сбрасывает прогресс', () => {
    const game = new GameSession();
    enterGame(game);

    for (let level = 1; level <= 10; level += 1) {
      expect(game.currentLevel).toBe(level);
      finishCurrentLevel(game);
    }

    expect(game.screen).toBe('results');
    expect(game.totalScore).toBe(100);
    expect(game.grade).toBe('5');

    game.playAgain();
    expect(game.screen).toBe('title');
    expect(game.currentLevel).toBe(1);
    expect(game.totalScore).toBe(0);
    expect(game.levelHasMistakes).toBe(false);
    expect(game.levelAnsweredCorrectly).toBe(false);
    expect(game.answerRevealed).toBe(false);
    expect(game.educationVisible).toBe(false);
  });

  it('сохраняет накопленный счёт при переходах между уровнями', () => {
    const game = new GameSession();
    enterGame(game);
    finishCurrentLevel(game);
    expect(game.currentLevel).toBe(2);
    expect(game.totalScore).toBe(10);
    finishCurrentLevel(game, false);
    expect(game.currentLevel).toBe(3);
    expect(game.totalScore).toBe(10);
  });
});
