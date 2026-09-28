import { assetUrl } from './assets';

export type EffectName = 'click' | 'correct' | 'wrong' | 'next';

const STORAGE_KEY = 'art-detective.sound-enabled';

export class AudioController {
  private readonly ambient = new Audio(assetUrl('assets/sounds/intro_ambient.wav'));
  private readonly effects: Record<EffectName, HTMLAudioElement> = {
    click: new Audio(assetUrl('assets/sounds/click.wav')),
    correct: new Audio(assetUrl('assets/sounds/correct.wav')),
    wrong: new Audio(assetUrl('assets/sounds/wrong.wav')),
    next: new Audio(assetUrl('assets/sounds/next.wav')),
  };

  private ambientWasStarted = false;
  enabled = this.readPreference();

  constructor() {
    this.ambient.loop = true;
    this.ambient.volume = 0.2;
    this.ambient.preload = 'auto';

    this.effects.click.volume = 0.45;
    this.effects.correct.volume = 0.55;
    this.effects.wrong.volume = 0.5;
    this.effects.next.volume = 0.5;
    Object.values(this.effects).forEach((audio) => {
      audio.preload = 'auto';
    });
  }

  startAmbient(): void {
    this.ambientWasStarted = true;
    if (this.enabled) void this.safePlay(this.ambient);
  }

  stopAmbient(): void {
    this.ambientWasStarted = false;
    this.ambient.pause();
    this.ambient.currentTime = 0;
  }

  playEffect(name: EffectName): void {
    if (!this.enabled) return;
    const audio = this.effects[name];
    audio.currentTime = 0;
    void this.safePlay(audio);
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    this.storePreference();

    if (!this.enabled) {
      this.ambient.pause();
      Object.values(this.effects).forEach((audio) => audio.pause());
    } else if (this.ambientWasStarted) {
      void this.safePlay(this.ambient);
    }

    return this.enabled;
  }

  private readPreference(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'false';
    } catch {
      return true;
    }
  }

  private storePreference(): void {
    try {
      localStorage.setItem(STORAGE_KEY, String(this.enabled));
    } catch {
      // The game remains usable when storage is blocked.
    }
  }

  private async safePlay(audio: HTMLAudioElement): Promise<void> {
    try {
      await audio.play();
    } catch {
      // Browsers may deny audio before a user gesture; game logic must continue.
    }
  }
}
