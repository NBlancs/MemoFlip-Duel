import { Card } from '../state/gameStore';
import { playerService } from './playerService';
import { storageService } from './storage';

export interface MatchResult {
  id: string;
  username: string;
  score: number;
  moves: number;
  elapsedTime: number;
  matchedPairs: number;
  completedAt: string;
}

const bestResultKey = 'memoflip-best-result';
const localResultsKey = 'memoflip-local-results';

let memoryBest: MatchResult | null = null;
let memoryResults: MatchResult[] = [];

const isBetterResult = (candidate: MatchResult, current: MatchResult | null) => {
  if (!current) {
    return true;
  }

  if (candidate.score !== current.score) {
    return candidate.score > current.score;
  }

  if (candidate.moves !== current.moves) {
    return candidate.moves < current.moves;
  }

  return candidate.elapsedTime < current.elapsedTime;
};

const normalizeResult = (result: Partial<MatchResult>): MatchResult | null => {
  if (
    result.score === undefined ||
    result.moves === undefined ||
    result.elapsedTime === undefined ||
    result.matchedPairs === undefined ||
    result.completedAt === undefined
  ) {
    return null;
  }

  return {
    id: result.id ?? `${result.completedAt}-${result.score}`,
    username: result.username ?? 'Player',
    score: result.score,
    moves: result.moves,
    elapsedTime: result.elapsedTime,
    matchedPairs: result.matchedPairs,
    completedAt: result.completedAt,
  };
};

export const buildMatchResult = (cards: Card[], moves: number, elapsedTime: number): MatchResult => {
  const matchedPairs = cards.filter((card) => card.isMatched).length / 2;
  const score = Math.max(0, Math.round(matchedPairs * 1000 - moves * 25 - elapsedTime * 4));

  return {
    id: `${Date.now()}-${score}-${moves}`,
    username: 'Player',
    score,
    moves,
    elapsedTime,
    matchedPairs,
    completedAt: new Date().toISOString(),
  };
};

export const persistenceService = {
  async getBestResult(): Promise<MatchResult | null> {
    const stored = await storageService.getItem(bestResultKey);

    if (!stored) {
      return memoryBest;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<MatchResult>;
      memoryBest = normalizeResult(parsed);
    } catch {
      memoryBest = null;
    }

    return memoryBest;
  },

  async getLocalResults(): Promise<MatchResult[]> {
    const stored = await storageService.getItem(localResultsKey);

    if (!stored) {
      return memoryResults;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<MatchResult>[];
      memoryResults = parsed.flatMap((result) => {
        const normalized = normalizeResult(result);
        return normalized ? [normalized] : [];
      });
    } catch {
      memoryResults = [];
    }

    return memoryResults;
  },

  async recordResult(result: MatchResult): Promise<MatchResult | null> {
    const profile = await playerService.getProfile();
    const resultWithPlayer = { ...result, username: profile?.username ?? result.username };
    const results = await this.getLocalResults();
    memoryResults = [resultWithPlayer, ...results].slice(0, 20);
    await storageService.setItem(localResultsKey, JSON.stringify(memoryResults));

    const current = await this.getBestResult();

    if (isBetterResult(resultWithPlayer, current)) {
      memoryBest = resultWithPlayer;
      await storageService.setItem(bestResultKey, JSON.stringify(resultWithPlayer));
      return resultWithPlayer;
    }

    return current;
  },
};
