import { Audio } from 'expo-av';

import { settingsService } from './settingsService';

type SoundName = 'button_clicked' | 'flip_card' | 'game_over' | 'good_result';

type AudioSource = number;

const soundSources: Record<SoundName, AudioSource> = {
  button_clicked: require('../../assets/sounds/button_click.mp3'),
  flip_card: require('../../assets/sounds/flip_card.mp3'),
  game_over: require('../../assets/sounds/gameover.mp3'),
  good_result: require('../../assets/sounds/good_result.mp3'),
};

const bgMusicSource = require('../../assets/sounds/bg_music.mp3');

const clampVolume = (volume: number) => Math.max(0, Math.min(1, volume / 100));

let configured = false;
let preloaded = false;
const sounds = new Map<SoundName, Audio.Sound>();
let bgMusic: Audio.Sound | null = null;

export const audioService = {
  async configure() {
    if (configured) {
      return;
    }

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      allowsRecordingIOS: false,
      shouldDuckAndroid: false,
      staysActiveInBackground: false,
    });
    configured = true;
  },

  async preloadAll() {
    if (preloaded) {
      return;
    }

    await this.configure();

    const entries = await Promise.all(
      (Object.entries(soundSources) as Array<[SoundName, AudioSource]>).map(async ([name, source]) => {
        const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false, volume: 1 });
        return [name, sound] as const;
      }),
    );

    for (const [name, sound] of entries) {
      sounds.set(name, sound);
    }

    const { sound } = await Audio.Sound.createAsync(bgMusicSource, {
      shouldPlay: false,
      isLooping: true,
      volume: 1,
    });

    bgMusic = sound;
    preloaded = true;
  },

  async applySettings() {
    const settings = await settingsService.loadSettings();

    if (bgMusic) {
      await bgMusic.setVolumeAsync(clampVolume(settings.musicVolume));
    }
  },

  async playSound(name: SoundName) {
    const settings = await settingsService.loadSettings();

    if (!settings.soundEnabled) {
      return;
    }

    if (!preloaded) {
      await this.preloadAll();
    }

    const sound = sounds.get(name);

    if (!sound) {
      return;
    }

    await sound.replayAsync();
  },

  async startMusic() {
    const settings = await settingsService.loadSettings();

    if (!preloaded) {
      await this.preloadAll();
    }

    if (!bgMusic) {
      return;
    }

    await bgMusic.setIsLoopingAsync(true);
    await bgMusic.setVolumeAsync(clampVolume(settings.musicVolume));

    const status = await bgMusic.getStatusAsync();

    if (!status.isLoaded) {
      return;
    }

    if (!status.isPlaying) {
      await bgMusic.playAsync();
    }
  },

  async pauseAll() {
    if (bgMusic) {
      const status = await bgMusic.getStatusAsync();

      if (status.isLoaded && status.isPlaying) {
        await bgMusic.pauseAsync();
      }
    }
  },

  async resumeMusic() {
    await this.startMusic();
  },

  async stopMusic() {
    if (bgMusic) {
      const status = await bgMusic.getStatusAsync();

      if (status.isLoaded) {
        await bgMusic.stopAsync();
      }
    }
  },
};
