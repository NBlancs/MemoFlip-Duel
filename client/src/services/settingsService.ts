import { storageService } from './storage';

export type Difficulty = 'easy' | 'medium';

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  hapticsEnabled: boolean;
  difficulty: Difficulty;
  tutorialSeen: boolean;
}

const key = 'memoflip-settings';

const defaults: GameSettings = {
  soundEnabled: true,
  musicVolume: 100,
  hapticsEnabled: true,
  difficulty: 'easy',
  tutorialSeen: false,
};

let memorySettings = defaults;

export const settingsService = {
  async loadSettings(): Promise<GameSettings> {
    const stored = await storageService.getItem(key);

    if (!stored) {
      return memorySettings;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<GameSettings> & { musicEnabled?: boolean };
      memorySettings = {
        ...defaults,
        ...parsed,
        musicVolume:
          typeof parsed.musicVolume === 'number'
            ? parsed.musicVolume
            : parsed.musicEnabled === false
              ? 0
              : defaults.musicVolume,
      };
    } catch {
      memorySettings = defaults;
    }

    return memorySettings;
  },

  async saveSettings(nextSettings: GameSettings): Promise<GameSettings> {
    memorySettings = nextSettings;
    await storageService.setItem(key, JSON.stringify(nextSettings));
    return memorySettings;
  },

  async updateSettings(partial: Partial<GameSettings>): Promise<GameSettings> {
    const current = await this.loadSettings();
    return this.saveSettings({ ...current, ...partial });
  },
};
