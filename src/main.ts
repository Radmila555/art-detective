import './style.css';
import { AudioController } from './audio';
import { getPainting, paintingImage } from './data';
import { GameSession } from './game';
import { isInsideHitRadius, pointerToImagePoint } from './geometry';
import { scheduleEducationCard } from './reveal';

const appNode = document.querySelector<HTMLElement>('#app');
if (!appNode) throw new Error('Не найден корневой элемент приложения');
const app: HTMLElement = appNode;

const game = new GameSession();
const audio = new AudioController();
let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
let revealTimer: ReturnType<typeof setTimeout> | undefined;
let developerMode = false;

function soundButton(): string {
  const label = audio.enabled ? 'Выключить звук' : 'Включить звук';
  const icon = audio.enabled ? '♪' : '♪̸';
  return `<button class="sound-toggle" type="button" aria-label="${label}" title="${label}">${icon}</button>`;
}

function museumButton(label: string, className = ''): string {
  return `<button class="museum-button ${className}" type="button"><span>${label}</span></button>`;
}

function renderTitle(): string {
  return `
    <section class="screen screen--title" aria-labelledby="game-title">
      ${soundButton()}
      <div class="title-layout">
        <h1 id="game-title">Арт-Детектив: Дело о подделке</h1>
        <p class="author-credit">Авторская разработка и программный код Гимадеевой Радмилы Искандеровны, ДШИ г. Колпашево, 2026 г.</p>
        ${museumButton('Начать расследование', 'start-button')}
      </div>
    </section>`;
}

function renderPlot(): string {
  return `
    <section class="screen screen--plot" aria-labelledby="plot-heading">
      ${soundButton()}
      <div class="plot-layout">
        <h2 id="plot-heading" class="visually-hidden">Сюжет</h2>
        <p class="story-text">Злобный Художник-Тролль пробрался в музей и испортил великие шедевры! Он добавил на картины современные предметы. Ты — эксперт-искусствовед. Найди все подделки, чтобы спасти выставку!</p>
        ${museumButton('В галерею!', 'gallery-button')}
      </div>
    </section>`;
}

function renderGameplay(): string {
  const painting = getPainting(game.currentLevel);
  const imageKind = game.answerRevealed ? 'orig' : 'fake';
  const education = game.educationVisible
    ? `<div class="answer-details">
        <div class="education-panel" role="region" aria-label="Информация о картине">
          <p><strong>Автор:</strong> ${painting.artist}</p>
          <p><strong>Название:</strong> ${painting.title}</p>
          <p><strong>Факт:</strong> ${painting.fact}</p>
        </div>
        ${museumButton('Дальше', 'next-button')}
      </div>`
    : '';

  return `
    <section class="screen screen--gameplay" aria-label="Игровой экран, уровень ${painting.level}">
      ${soundButton()}
      <div class="painting-stage">
        <img
          class="painting"
          src="${paintingImage(painting.level, imageKind)}"
          alt="${game.answerRevealed ? `Оригинал картины «${painting.title}»` : `Изменённая картина, уровень ${painting.level}`}"
          draggable="false"
        />
        <div class="feedback" role="status" aria-live="assertive"></div>
        ${developerMode ? '<div class="developer-indicator">DEV MODE ACTIVE</div>' : ''}
      </div>
      ${education}
    </section>`;
}

function renderResults(): string {
  return `
    <section class="screen screen--results" aria-labelledby="results-heading">
      ${soundButton()}
      <div class="results-layout">
        <h2 id="results-heading" class="score-text">Ваш счёт: ${game.totalScore}</h2>
        <p class="grade-text">Оценка: ${game.grade}</p>
        ${museumButton('Играть снова', 'again-button')}
      </div>
    </section>`;
}

function clearTimers(): void {
  if (feedbackTimer !== undefined) window.clearTimeout(feedbackTimer);
  if (revealTimer !== undefined) window.clearTimeout(revealTimer);
  feedbackTimer = undefined;
  revealTimer = undefined;
}

function render(): void {
  clearTimers();
  const html = {
    title: renderTitle,
    plot: renderPlot,
    gameplay: renderGameplay,
    results: renderResults,
  }[game.screen]();

  app.innerHTML = html;
  bindSoundToggle();

  if (game.screen === 'title') bindTitle();
  if (game.screen === 'plot') bindPlot();
  if (game.screen === 'gameplay') bindGameplay();
  if (game.screen === 'results') bindResults();
}

function bindSoundToggle(): void {
  const button = app.querySelector<HTMLButtonElement>('.sound-toggle');
  button?.addEventListener('click', () => {
    audio.toggle();
    if (!button) return;
    const label = audio.enabled ? 'Выключить звук' : 'Включить звук';
    button.textContent = audio.enabled ? '♪' : '♪̸';
    button.title = label;
    button.setAttribute('aria-label', label);
  });
}

function bindTitle(): void {
  app.querySelector<HTMLButtonElement>('.start-button')?.addEventListener('click', () => {
    audio.startAmbient();
    audio.playEffect('click');
    game.openPlot();
    render();
  });
}

function bindPlot(): void {
  app.querySelector<HTMLButtonElement>('.gallery-button')?.addEventListener('click', () => {
    audio.stopAmbient();
    audio.playEffect('click');
    game.beginInvestigation();
    render();
  });
}

function setFeedback(text: string, kind: 'correct' | 'wrong'): void {
  const feedback = app.querySelector<HTMLElement>('.feedback');
  if (!feedback) return;
  feedback.textContent = text;
  feedback.className = `feedback feedback--${kind} feedback--visible`;
}

function bindGameplay(): void {
  const stage = app.querySelector<HTMLElement>('.painting-stage');
  const image = app.querySelector<HTMLImageElement>('.painting');
  if (!stage || !image) return;

  if (!game.levelAnsweredCorrectly) {
    stage.addEventListener('pointerdown', (event) => {
      const rect = stage.getBoundingClientRect();
      const point = pointerToImagePoint(
        event.clientX,
        event.clientY,
        { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        image.naturalWidth,
        image.naturalHeight,
      );

      if (!point) return;
      event.preventDefault();

      if (developerMode) {
        console.info(`[DEV MODE] Relative coordinates: X=${point.x.toFixed(4)}, Y=${point.y.toFixed(4)}`);
        const oldMarker = stage.querySelector('.debug-marker');
        oldMarker?.remove();
        const marker = document.createElement('span');
        marker.className = 'debug-marker';
        marker.style.left = `${event.clientX - rect.left}px`;
        marker.style.top = `${event.clientY - rect.top}px`;
        stage.append(marker);
      }

      const painting = getPainting(game.currentLevel);
      const hit = isInsideHitRadius(point, { x: painting.correctX, y: painting.correctY }, 0.05);
      const result = game.submitGuess(hit);

      if (result === 'wrong') {
        audio.playEffect('wrong');
        setFeedback('Не верно!', 'wrong');
        feedbackTimer = window.setTimeout(() => {
          app.querySelector('.feedback')?.classList.remove('feedback--visible');
          feedbackTimer = undefined;
        }, 1000);
      }

      if (result === 'correct') {
        audio.playEffect('correct');
        game.revealAnswer();
        render();
        revealTimer = scheduleEducationCard(() => {
          game.showEducation();
          revealTimer = undefined;
          render();
        });
      }
    });
  }

  app.querySelector<HTMLButtonElement>('.next-button')?.addEventListener('click', () => {
    // Unlike ordinary buttons, "Дальше" uses only its dedicated transition sound.
    audio.playEffect('next');
    game.advance();
    render();
  });
}

function bindResults(): void {
  app.querySelector<HTMLButtonElement>('.again-button')?.addEventListener('click', () => {
    audio.playEffect('click');
    game.playAgain();
    render();
  });
}

window.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'd') {
    event.preventDefault();
    developerMode = !developerMode;
    if (game.screen === 'gameplay') render();
  }
});

render();
