import { useEffect, useRef } from 'react';

import { useGameStore } from '../state/gameStore';
import { audioService } from './audioService';
import { hapticsService } from './hapticsService';

export function useGameFeedbackEvents() {
  const gameState = useGameStore((state) => state.gameState);
  const matchedCount = useGameStore((state) => state.cards.filter((card) => card.isMatched).length);
  const flippedUnmatchedCount = useGameStore(
    (state) => state.cards.filter((card) => card.isFlipped && !card.isMatched).length,
  );
  const matchedPairs = matchedCount / 2;
  const previousMatchedPairs = useRef(matchedPairs);
  const streakRef = useRef(0);
  const previousFlippedUnmatched = useRef(flippedUnmatchedCount);
  const previousGameState = useRef(gameState);

  useEffect(() => {
    if (matchedPairs > previousMatchedPairs.current) {
      streakRef.current += 1;
      void hapticsService.score();

      if (streakRef.current >= 2) {
        void audioService.playSound('good_result');
      }
    }

    previousMatchedPairs.current = matchedPairs;
  }, [matchedPairs]);

  useEffect(() => {
    const wasMismatchReset =
      previousGameState.current !== 'PEEKING' &&
      previousFlippedUnmatched.current >= 2 &&
      flippedUnmatchedCount === 0 &&
      matchedPairs === previousMatchedPairs.current;

    if (wasMismatchReset) {
      streakRef.current = 0;
      void hapticsService.collision();
    }

    previousFlippedUnmatched.current = flippedUnmatchedCount;
  }, [flippedUnmatchedCount, matchedPairs]);

  useEffect(() => {
    if (gameState === 'GAME_OVER' && previousGameState.current !== 'GAME_OVER') {
      void hapticsService.finish();

      if (!useGameStore.getState().cards.every((card) => card.isMatched)) {
        void audioService.playSound('game_over');
      }
    }

    previousGameState.current = gameState;
  }, [gameState]);
}
