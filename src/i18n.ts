export const LOCALES = ['ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'art-detective-locale';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface PaintingCopy {
  readonly artist: string;
  readonly title: string;
  readonly fact: string;
  readonly artifact: string;
}

interface CreditsCopy {
  readonly pageTitle: string;
  readonly entryLabel: string;
  readonly back: string;
  readonly intro: string;
  readonly paintings: string;
  readonly level: string;
  readonly source: string;
  readonly modified: string;
  readonly modifiedText: string;
  readonly backgrounds: string;
  readonly backgroundsText: string;
  readonly sounds: string;
  readonly font: string;
}

interface UiCopy {
  readonly documentTitle: string;
  readonly documentDescription: string;
  readonly languageLabel: string;
  readonly soundOn: string;
  readonly soundOff: string;
  readonly title: string;
  readonly authorCredit: string;
  readonly start: string;
  readonly plotHeading: string;
  readonly story: string;
  readonly enterGallery: string;
  readonly artworkInfo: string;
  readonly author: string;
  readonly artworkTitle: string;
  readonly fact: string;
  readonly artifact: string;
  readonly next: string;
  readonly gameplayHint: string;
  readonly gameplayLabel: (level: number) => string;
  readonly originalAlt: (title: string) => string;
  readonly modifiedAlt: (level: number) => string;
  readonly wrong: string;
  readonly caseClosed: string;
  readonly score: (score: number) => string;
  readonly grade: (grade: string) => string;
  readonly playAgain: string;
  readonly credits: CreditsCopy;
}

export const UI_COPY = {
  ru: {
    documentTitle: 'Арт-Детектив: Дело о подделке',
    documentDescription: 'Арт-Детектив: Дело о подделке — образовательная игра об искусстве',
    languageLabel: 'Язык',
    soundOn: 'Выключить звук',
    soundOff: 'Включить звук',
    title: 'Арт-Детектив: Дело о подделке',
    authorCredit: 'Авторская разработка и программный код Гимадеевой Радмилы Искандеровны, ДШИ г. Колпашево, 2026 г.',
    start: 'Начать расследование',
    plotHeading: 'Сюжет',
    story: 'Злобный Художник-Тролль пробрался в музей и испортил великие шедевры! Он добавил на картины современные предметы. Ты — эксперт-искусствовед. Найди все подделки, чтобы спасти выставку! Найдите современный предмет, добавленный в картину, и нажмите на него мышкой. На смартфоне или планшете — коснитесь предмета пальцем.',
    enterGallery: 'В галерею!',
    artworkInfo: 'Информация о картине',
    author: 'Автор',
    artworkTitle: 'Название',
    fact: 'Факт',
    artifact: 'Найденный объект',
    next: 'Дальше',
    gameplayHint: 'Найдите лишний предмет и нажмите на него.',
    gameplayLabel: (level) => `Игровой экран, уровень ${level}`,
    originalAlt: (title) => `Оригинал картины «${title}»`,
    modifiedAlt: (level) => `Изменённая картина, уровень ${level}`,
    wrong: 'Неверно!',
    caseClosed: 'Расследование завершено!',
    score: (score) => `Ваш счёт: ${score}`,
    grade: (grade) => `Оценка: ${grade}`,
    playAgain: 'Играть снова',
    credits: {
      pageTitle: 'Источники и лицензии',
      entryLabel: 'Источники и лицензии',
      back: 'Назад',
      intro: 'Краткая информация об изображениях, звуках и шрифте, использованных в игре.',
      paintings: 'Картины',
      level: 'Уровень',
      source: 'Источник',
      modified: 'Модифицированные изображения',
      modifiedText: 'Игровые fake-версии были цифрово модифицированы для механики Art Detective и содержат добавленные современные объекты.',
      backgrounds: 'Фоны',
      backgroundsText: 'Созданы Радмилой Г. с помощью Google Gemini для проекта Art Detective.',
      sounds: 'Звуки',
      font: 'Шрифт',
    },
  },
  en: {
    documentTitle: 'Art Detective: The Forgery Case',
    documentDescription: 'Art Detective: The Forgery Case — an educational game about art',
    languageLabel: 'Language',
    soundOn: 'Turn sound off',
    soundOff: 'Turn sound on',
    title: 'Art Detective: The Forgery Case',
    authorCredit: 'Original concept and code by Radmila Iskanderovna Gimadeeva, Kolpashevo School of Arts, 2026.',
    start: 'Start the investigation',
    plotHeading: 'The case',
    story: 'A mischievous Artist-Troll has broken into the museum and tampered with famous masterpieces! He has added modern objects to the paintings. You are the art expert. Find every fake detail and save the exhibition! Find the modern object added to the painting and click it. On a phone or tablet, tap the object with your finger.',
    enterGallery: 'Enter the gallery!',
    artworkInfo: 'About the painting',
    author: 'Artist',
    artworkTitle: 'Title',
    fact: 'Art fact',
    artifact: 'Object found',
    next: 'Next',
    gameplayHint: 'Find the odd object and click it.',
    gameplayLabel: (level) => `Game screen, level ${level}`,
    originalAlt: (title) => `Original painting: ${title}`,
    modifiedAlt: (level) => `Modified painting, level ${level}`,
    wrong: 'Not quite!',
    caseClosed: 'Case closed!',
    score: (score) => `Your score: ${score}`,
    grade: (grade) => `Rating: ${grade}/5`,
    playAgain: 'Play again',
    credits: {
      pageTitle: 'Sources & Licenses',
      entryLabel: 'Sources & Licenses',
      back: 'Back',
      intro: 'A concise record of the images, sounds, and font used in the game.',
      paintings: 'Paintings',
      level: 'Level',
      source: 'Source',
      modified: 'Modified images',
      modifiedText: 'The in-game fake versions were digitally modified for the Art Detective mechanic and contain added modern objects.',
      backgrounds: 'Backgrounds',
      backgroundsText: 'Generated by Radmila G. with Google Gemini for the Art Detective project.',
      sounds: 'Sounds',
      font: 'Font',
    },
  },
} as const satisfies Record<Locale, UiCopy>;

export const PAINTING_COPY: readonly {
  readonly level: number;
  readonly ru: PaintingCopy;
  readonly en: PaintingCopy;
}[] = [
  { level: 1, ru: { artist: 'Клод Моне', title: 'Впечатление. Восход солнца', fact: 'Клод Моне написал эту картину в 1872 году в порту Гавр. Именно от названия этой картины произошло название всего направления — импрессионизм.', artifact: 'Ветрогенераторы' }, en: { artist: 'Claude Monet', title: 'Impression, Sunrise', fact: 'Claude Monet painted this work in 1872 in the port of Le Havre. Its title gave the Impressionist movement its name.', artifact: 'Wind turbines' } },
  { level: 2, ru: { artist: 'Эдуард Мане', title: 'Бар в Фоли-Бержер', fact: 'Эдуард Мане был одним из первых художников XIX века, кто изображал сцены современной городской жизни. Эта картина была написана в 1882 году.', artifact: 'Вывеска McDonald’s' }, en: { artist: 'Édouard Manet', title: 'A Bar at the Folies-Bergère', fact: 'Édouard Manet was one of the first nineteenth-century artists to depict modern urban life. He painted this work in 1882.', artifact: 'McDonald’s sign' } },
  { level: 3, ru: { artist: 'Клод Моне', title: 'Руанский собор', fact: 'Клод Моне создал серию из более чем 30 картин Руанского собора, изображая его в разное время суток и при разном освещении.', artifact: 'Камера наблюдения' }, en: { artist: 'Claude Monet', title: 'Rouen Cathedral', fact: 'Claude Monet created a series of more than 30 paintings of Rouen Cathedral, showing it at different times of day and in changing light.', artifact: 'Security camera' } },
  { level: 4, ru: { artist: 'Эдгар Дега', title: 'Голубые танцовщицы', fact: 'Эдгар Дега посвятил большую часть своего творчества изображению балерин. Он создал более 1500 работ на эту тему.', artifact: 'Умные часы' }, en: { artist: 'Edgar Degas', title: 'Blue Dancers', fact: 'Edgar Degas devoted much of his art to ballet dancers. He created more than 1,500 works on this subject.', artifact: 'Smartwatch' } },
  { level: 5, ru: { artist: 'Берта Моризо', title: 'Колыбель', fact: 'Берта Моризо была одной из немногих женщин-художниц в движении импрессионистов. Эта картина изображает её сестру Эдму с дочерью.', artifact: 'Смартфон' }, en: { artist: 'Berthe Morisot', title: 'The Cradle', fact: 'Berthe Morisot was one of the few women at the heart of the Impressionist movement. This painting shows her sister Edma with her daughter.', artifact: 'Smartphone' } },
  { level: 6, ru: { artist: 'Винсент ван Гог', title: 'Спальня в Арле', fact: 'Винсент ван Гог написал три версии этой картины. Он хотел передать ощущение покоя и отдыха через простые формы и яркие цвета.', artifact: 'Кроссовок' }, en: { artist: 'Vincent van Gogh', title: 'The Bedroom', fact: 'Vincent van Gogh painted three versions of this scene. He used simple forms and bright colors to create a feeling of rest and calm.', artifact: 'Sneaker' } },
  { level: 7, ru: { artist: 'Винсент ван Гог', title: 'Ночная терраса кафе', fact: 'Эта картина была написана в 1888 году в Арле. Ван Гог был одним из первых художников, кто изображал ночные сцены без использования чёрного цвета.', artifact: 'Табличка Free Wi-Fi' }, en: { artist: 'Vincent van Gogh', title: 'Café Terrace at Night', fact: 'Van Gogh painted this scene in Arles in 1888. Instead of using black for the night sky, he relied on rich blues, greens, and yellows.', artifact: 'Free Wi-Fi sign' } },
  { level: 8, ru: { artist: 'Жорж Сёра', title: 'Воскресный день на острове Гранд-Жатт', fact: 'Жорж Сёра создал эту картину в технике пуантилизма, используя тысячи маленьких точек чистого цвета. Работа заняла у него два года.', artifact: 'Дрон' }, en: { artist: 'Georges Seurat', title: 'A Sunday on La Grande Jatte', fact: 'Georges Seurat created this painting with thousands of tiny dots of pure color, a technique known as Pointillism. It took him two years.', artifact: 'Drone' } },
  { level: 9, ru: { artist: 'Поль Синьяк', title: 'Сосна в Сен-Тропе', fact: 'Поль Синьяк был учеником Жоржа Сёра и продолжил развивать технику пуантилизма. Он много работал на юге Франции.', artifact: 'Солнечная панель' }, en: { artist: 'Paul Signac', title: 'The Pine Tree at Saint-Tropez', fact: 'Paul Signac worked alongside Georges Seurat and helped develop Pointillism. He created many paintings in the south of France.', artifact: 'Solar panel' } },
  { level: 10, ru: { artist: 'Поль Сезанн', title: 'Корзина с яблоками', fact: 'Сезанна называют «отцом современного искусства». Он не использовал точки, а «строил» свои картины с помощью геометрии и плотных мазков цвета, стараясь передать саму суть предметов.', artifact: 'Предмет Kinder' }, en: { artist: 'Paul Cézanne', title: 'The Basket of Apples', fact: 'Cézanne is often called the “father of modern art.” He built his compositions using geometric forms and firm brushstrokes to capture the structure of objects.', artifact: 'Kinder Surprise egg' } },
] as const;

export function isLocale(value: unknown): value is Locale {
  return value === 'ru' || value === 'en';
}

export function readStoredLocale(storage?: StorageLike | null): Locale {
  try {
    const value = storage?.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : 'ru';
  } catch {
    return 'ru';
  }
}

export class LocaleState {
  current: Locale;

  constructor(private readonly storage: StorageLike | null = browserStorage()) {
    this.current = readStoredLocale(storage);
  }

  set(locale: Locale): void {
    this.current = locale;
    try {
      this.storage?.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // The interface still works when storage is disabled or unavailable.
    }
  }
}

export function getPaintingCopy(level: number, locale: Locale): PaintingCopy {
  const painting = PAINTING_COPY[level - 1];
  if (!painting || painting.level !== level) throw new RangeError(`Missing localized painting data for level ${level}`);
  return painting[locale];
}

export function getGameplayHint(level: number, locale: Locale): string | null {
  return level === 1 ? UI_COPY[locale].gameplayHint : null;
}

function browserStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}
