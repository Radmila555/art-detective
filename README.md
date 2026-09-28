# Art Detective

Art Detective is a browser game in which players inspect modified versions of ten public-domain paintings and find a modern object added to each image. A correct click reveals the original painting and a short art-history note.

## Stack

- TypeScript
- Vite
- HTML and CSS
- Vitest

The game is fully static. It does not require a backend, database, API keys, or environment variables.

## Local development

```powershell
npm ci
npm run dev
```

Vite prints the local development URL in the terminal.

## Tests and production build

```powershell
npm test
npm run build
npm run preview
```

The production build is written to `dist/`. The configured Vite base path is `/art-detective/` for deployment at `https://Radmila555.github.io/art-detective/`.

## Project structure

- `src/` — game logic, geometry, audio controller, styles, and tests.
- `public/assets/` — paintings, modified game images, backgrounds, sounds, and font.
- `.github/workflows/` — GitHub Pages deployment workflow.
- `CREDITS.md` — asset sources, licenses, and modification notes.
- `LICENSES/` — third-party license texts.

## Live demo

Live Demo: _to be added after GitHub Pages is enabled_.

## Browser support

The production build is verified in a current Chromium-based browser at desktop and mobile viewport sizes. The interface uses standard modern browser APIs and responsive `object-fit: contain` geometry.

## Credits and assets

See [CREDITS.md](CREDITS.md) for painting sources, modified-image notes, audio credits, generated backgrounds, and font licensing.
