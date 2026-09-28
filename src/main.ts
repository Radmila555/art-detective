import './style.css';
import { AudioController } from './audio';
import { ARTWORK_CREDITS } from './credits';
import { getPainting, paintingImage } from './data';
import { GameSession } from './game';
import { isInsideHitRadius, pointerToImagePoint } from './geometry';
import { getPaintingCopy, isLocale, LocaleState, UI_COPY } from './i18n';
import { scheduleEducationCard } from './reveal';

const appNode = document.querySelector<HTMLElement>('#app');
if (!appNode) throw new Error('App root element was not found');
const app: HTMLElement = appNode;

const game = new GameSession();
const audio = new AudioController();
const localeState = new LocaleState();
let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
let revealTimer: ReturnType<typeof setTimeout> | undefined;
let developerMode = false;

function soundButton(): string {
  const copy = UI_COPY[localeState.current];
  const label = audio.enabled ? copy.soundOn : copy.soundOff;
  const icon = audio.enabled ? '♪' : '♪̸';
  return `<button class="sound-toggle" type="button" aria-label="${label}" title="${label}">${icon}</button>`;
}

function languageToggle(): string {
  const locale = localeState.current;
  const copy = UI_COPY[locale];
  return `
    <div class="language-switch" role="group" aria-label="${copy.languageLabel}">
      <button type="button" data-locale="ru" aria-pressed="${locale === 'ru'}">RU</button>
      <span aria-hidden="true">|</span>
      <button type="button" data-locale="en" aria-pressed="${locale === 'en'}">EN</button>
    </div>`;
}

function screenControls(): string {
  return `<div class="screen-controls">${languageToggle()}${soundButton()}</div>`;
}

function museumButton(label: string, className = ''): string {
  return `<button class="museum-button ${className}" type="button"><span>${label}</span></button>`;
}

function creditsEntryLink(label: string): string {
  return `<button class="credits-entry-link" type="button">${label}</button>`;
}

function renderTitle(): string {
  const copy = UI_COPY[localeState.current];
  return `
    <section class="screen screen--title" aria-labelledby="game-title">
      ${screenControls()}
      <div class="title-layout">
        <h1 id="game-title">${copy.title}</h1>
        <p class="author-credit">${copy.authorCredit}</p>
        ${museumButton(copy.start, 'start-button')}
      </div>
      ${creditsEntryLink(copy.credits.entryLabel)}
    </section>`;
}

function renderPlot(): string {
  const copy = UI_COPY[localeState.current];
  return `
    <section class="screen screen--plot" aria-labelledby="plot-heading">
      ${screenControls()}
      <div class="plot-layout">
        <h2 id="plot-heading" class="visually-hidden">${copy.plotHeading}</h2>
        <p class="story-text">${copy.story}</p>
        ${museumButton(copy.enterGallery, 'gallery-button')}
      </div>
    </section>`;
}

function renderGameplay(): string {
  const copy = UI_COPY[localeState.current];
  const painting = getPainting(game.currentLevel);
  const paintingCopy = getPaintingCopy(painting.level, localeState.current);
  const imageKind = game.answerRevealed ? 'orig' : 'fake';
  const education = game.educationVisible
    ? `<div class="answer-details">
        <div class="education-panel" role="region" aria-label="${copy.artworkInfo}">
          <p><strong>${copy.author}:</strong> ${paintingCopy.artist}</p>
          <p><strong>${copy.artworkTitle}:</strong> ${paintingCopy.title}</p>
          <p><strong>${copy.fact}:</strong> ${paintingCopy.fact}</p>
          <p><strong>${copy.artifact}:</strong> ${paintingCopy.artifact}</p>
        </div>
        ${museumButton(copy.next, 'next-button')}
      </div>`
    : '';

  const imageAlt = game.answerRevealed
    ? copy.originalAlt(paintingCopy.title)
    : copy.modifiedAlt(painting.level);

  return `
    <section class="screen screen--gameplay" aria-label="${copy.gameplayLabel(painting.level)}">
      ${screenControls()}
      <div class="painting-stage">
        <img class="painting" src="${paintingImage(painting.level, imageKind)}" alt="${imageAlt}" draggable="false" />
        <div class="feedback" role="status" aria-live="assertive"></div>
        ${developerMode ? '<div class="developer-indicator">DEV MODE ACTIVE</div>' : ''}
      </div>
      ${education}
    </section>`;
}

function renderResults(): string {
  const copy = UI_COPY[localeState.current];
  return `
    <section class="screen screen--results" aria-labelledby="results-heading">
      ${screenControls()}
      <div class="results-layout">
        <p class="results-kicker">${copy.caseClosed}</p>
        <h2 id="results-heading" class="score-text">${copy.score(game.totalScore)}</h2>
        <p class="grade-text">${copy.grade(game.grade)}</p>
        ${museumButton(copy.playAgain, 'again-button')}
      </div>
      ${creditsEntryLink(copy.credits.entryLabel)}
    </section>`;
}

function renderCredits(): string {
  const locale = localeState.current;
  const copy = UI_COPY[locale].credits;
  const paintings = ARTWORK_CREDITS.map((credit) => {
    const painting = getPaintingCopy(credit.level, locale);
    return `
      <li class="artwork-credit">
        <span class="artwork-credit__number"><span class="visually-hidden">${copy.level} </span>${String(credit.level).padStart(2, '0')}</span>
        <div class="artwork-credit__body">
          <h3>${painting.artist} — <cite>${painting.title}</cite></h3>
          <p class="artwork-credit__meta">
            <span>${credit.status}</span>
            <a href="${credit.sourceUrl}" target="_blank" rel="noreferrer">${copy.source}: ${credit.source}</a>
          </p>
        </div>
      </li>`;
  }).join('');

  return `
    <section class="screen screen--credits" aria-labelledby="credits-heading">
      ${screenControls()}
      <div class="credits-scroll">
        <article class="credits-shell">
          <div class="credits-toolbar">
            <button class="credits-back" type="button">← ${copy.back}</button>
          </div>

          <header class="credits-header">
            <p class="credits-kicker">Art Detective · 2026</p>
            <h2 id="credits-heading" class="credits-heading" tabindex="-1">${copy.pageTitle}</h2>
            <p>${copy.intro}</p>
          </header>

          <section class="credits-section" aria-labelledby="paintings-heading">
            <h2 id="paintings-heading">${copy.paintings}</h2>
            <ol class="artwork-credit-list">${paintings}</ol>
          </section>

          <section class="credits-section credits-section--compact" aria-labelledby="modified-heading">
            <h2 id="modified-heading">${copy.modified}</h2>
            <p>${copy.modifiedText}</p>
          </section>

          <section class="credits-section credits-section--compact" aria-labelledby="backgrounds-heading">
            <h2 id="backgrounds-heading">${copy.backgrounds}</h2>
            <p>${copy.backgroundsText}</p>
          </section>

          <section class="credits-section credits-section--compact" aria-labelledby="sounds-heading">
            <h2 id="sounds-heading">${copy.sounds}</h2>
            <ul class="asset-credit-list">
              <li><a href="https://kenney.nl/assets/interface-sounds" target="_blank" rel="noreferrer">Kenney Interface Sounds</a> — CC0</li>
              <li><code>intro_ambient.wav</code> — <a href="https://opengameart.org/content/sci-fi-adventure-eastern-quiet-piano-loop" target="_blank" rel="noreferrer">KiluaBoy / OpenGameArt</a> — CC0</li>
            </ul>
          </section>

          <section class="credits-section credits-section--compact" aria-labelledby="font-heading">
            <h2 id="font-heading">${copy.font}</h2>
            <p><a href="https://openfontlicense.org/open-font-license-official-text/" target="_blank" rel="noreferrer">Playfair Display — SIL Open Font License 1.1</a></p>
          </section>

          <button class="credits-back credits-back--footer" type="button">← ${copy.back}</button>
        </article>
      </div>
    </section>`;
}

function clearTimers(): void {
  if (feedbackTimer !== undefined) window.clearTimeout(feedbackTimer);
  if (revealTimer !== undefined) window.clearTimeout(revealTimer);
  feedbackTimer = undefined;
  revealTimer = undefined;
}

interface RenderOptions {
  readonly focusSelector?: string;
  readonly preserveTimers?: boolean;
}

function render(options: RenderOptions = {}): void {
  if (!options.preserveTimers) clearTimers();
  const html = {
    title: renderTitle,
    plot: renderPlot,
    gameplay: renderGameplay,
    results: renderResults,
    credits: renderCredits,
  }[game.screen]();

  app.innerHTML = html;
  syncDocumentMetadata();
  bindGlobalControls();

  if (game.screen === 'title') bindTitle();
  if (game.screen === 'plot') bindPlot();
  if (game.screen === 'gameplay') bindGameplay();
  if (game.screen === 'results') bindResults();
  if (game.screen === 'credits') bindCredits();

  const focusSelector = options.focusSelector;
  if (focusSelector) {
    window.requestAnimationFrame(() => app.querySelector<HTMLElement>(focusSelector)?.focus());
  }
}

function syncDocumentMetadata(): void {
  const locale = localeState.current;
  const copy = UI_COPY[locale];
  document.documentElement.lang = locale;
  document.title = copy.documentTitle;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', copy.documentDescription);
}

function openCredits(): void {
  audio.playEffect('click');
  game.openCredits();
  render({ focusSelector: '.credits-heading' });
}

function closeCredits(): void {
  audio.playEffect('click');
  game.closeCredits();
  render({ focusSelector: '.credits-entry-link' });
}

function bindGlobalControls(): void {
  const sound = app.querySelector<HTMLButtonElement>('.sound-toggle');
  sound?.addEventListener('click', () => {
    audio.toggle();
    if (!sound) return;
    const copy = UI_COPY[localeState.current];
    const label = audio.enabled ? copy.soundOn : copy.soundOff;
    sound.textContent = audio.enabled ? '♪' : '♪̸';
    sound.title = label;
    sound.setAttribute('aria-label', label);
  });

  app.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((button) => {
    button.addEventListener('click', () => {
      const locale = button.dataset.locale;
      if (!isLocale(locale) || locale === localeState.current) return;
      localeState.set(locale);
      render({ focusSelector: `[data-locale="${locale}"]`, preserveTimers: true });
    });
  });
}

function bindTitle(): void {
  app.querySelector<HTMLButtonElement>('.start-button')?.addEventListener('click', () => {
    audio.startAmbient();
    audio.playEffect('click');
    game.openPlot();
    render();
  });
  app.querySelector<HTMLButtonElement>('.credits-entry-link')?.addEventListener('click', openCredits);
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
      const point = pointerToImagePoint(event.clientX, event.clientY, { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, image.naturalWidth, image.naturalHeight);
      if (!point) return;
      event.preventDefault();

      if (developerMode) {
        console.info(`[DEV MODE] Relative coordinates: X=${point.x.toFixed(4)}, Y=${point.y.toFixed(4)}`);
        stage.querySelector('.debug-marker')?.remove();
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
        setFeedback(UI_COPY[localeState.current].wrong, 'wrong');
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
  app.querySelector<HTMLButtonElement>('.credits-entry-link')?.addEventListener('click', openCredits);
}

function bindCredits(): void {
  app.querySelectorAll<HTMLButtonElement>('.credits-back').forEach((button) => button.addEventListener('click', closeCredits));
}

window.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'd') {
    event.preventDefault();
    developerMode = !developerMode;
    if (game.screen === 'gameplay') render();
  }
});

render();
