import { PAINTINGS } from './data';

export type ScreenName = 'title' | 'plot' | 'gameplay' | 'results';
export type GuessResult = 'correct' | 'wrong' | 'ignored';

export function gradeForScore(score: number): '3' | '4' | '5' {
  if (score >= 90) return '5';
  if (score >= 70) return '4';
  return '3';
}

export class GameSession {
  screen: ScreenName = 'title';
  currentLevel = 1;
  totalScore = 0;
  levelHasMistakes = false;
  levelAnsweredCorrectly = false;
  answerRevealed = false;
  educationVisible = false;

  openPlot(): void {
    this.screen = 'plot';
  }

  beginInvestigation(): void {
    this.resetProgress();
    this.screen = 'gameplay';
  }

  submitGuess(isCorrect: boolean): GuessResult {
    if (this.screen !== 'gameplay' || this.levelAnsweredCorrectly) return 'ignored';

    if (!isCorrect) {
      this.levelHasMistakes = true;
      return 'wrong';
    }

    if (!this.levelHasMistakes) this.totalScore += 10;
    this.levelAnsweredCorrectly = true;
    return 'correct';
  }

  revealAnswer(): void {
    if (this.levelAnsweredCorrectly) this.answerRevealed = true;
  }

  showEducation(): void {
    if (this.answerRevealed) this.educationVisible = true;
  }

  advance(): void {
    if (this.screen !== 'gameplay' || !this.educationVisible) return;

    if (this.currentLevel >= PAINTINGS.length) {
      this.screen = 'results';
      return;
    }

    this.currentLevel += 1;
    this.resetLevel();
  }

  playAgain(): void {
    this.resetProgress();
    this.screen = 'title';
  }

  get grade(): '3' | '4' | '5' {
    return gradeForScore(this.totalScore);
  }

  private resetProgress(): void {
    this.currentLevel = 1;
    this.totalScore = 0;
    this.resetLevel();
  }

  private resetLevel(): void {
    this.levelHasMistakes = false;
    this.levelAnsweredCorrectly = false;
    this.answerRevealed = false;
    this.educationVisible = false;
  }
}
