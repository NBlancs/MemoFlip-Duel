import { storageService } from './storage';

export interface PlayerProfile {
  username: string;
}

const key = 'memoflip-player-profile';

let memoryProfile: PlayerProfile | null = null;

const sanitizeUsername = (username: string) => username.trim().replace(/\s+/g, ' ').slice(0, 24);

export const playerService = {
  async getProfile(): Promise<PlayerProfile | null> {
    const stored = await storageService.getItem(key);

    if (!stored) {
      return memoryProfile;
    }

    try {
      const parsed = JSON.parse(stored) as PlayerProfile;
      memoryProfile = parsed.username ? { username: sanitizeUsername(parsed.username) } : null;
    } catch {
      memoryProfile = null;
    }

    return memoryProfile;
  },

  async saveUsername(username: string): Promise<PlayerProfile> {
    const profile = { username: sanitizeUsername(username) };
    memoryProfile = profile;
    await storageService.setItem(key, JSON.stringify(profile));
    return profile;
  },
};
