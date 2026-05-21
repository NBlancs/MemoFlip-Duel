import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { GameBoard } from '../components/GameBoard';
import { GameModal } from '../components/GameModal';
import { HUD } from '../components/HUD';
import { Screen } from '../components/Screen';
import { TerminalHeader } from '../components/TerminalHeader';
import { buildMatchResult, persistenceService } from '../services/persistenceService';
import { gameBootstrapService } from '../services/gameBootstrapService';
import { useGameFeedbackEvents } from '../services/gameFeedbackService';
import { useGameLoopLifecycle } from '../services/gameLoopLifecycle';
import { flipAnimationLockMs, useGameActions, useGameStore } from '../state/gameStore';
import { colors, spacing, type } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;
const peekDurationMs = 4000;

export function GameScreen({ navigation }: Props) {
  const [paused, setPaused] = useState(false);
  const cards = useGameStore((state) => state.cards);
  const gameState = useGameStore((state) => state.gameState);
  const isAnimating = useGameStore((state) => state.isAnimating);
  const difficulty = useGameStore((state) => state.difficulty);
  const moves = useGameStore((state) => state.moves);
  const elapsedTime = useGameStore((state) => state.elapsedTime);
  const actions = useGameActions();
  const matchedPairs = cards.filter((card) => card.isMatched).length / 2;
  const totalPairs = cards.length / 2;
  const lives = Math.max(0, 8 - Math.max(0, moves - matchedPairs));
  const isWin = cards.length > 0 && cards.every((card) => card.isMatched);
  const isLoss = gameState === 'GAME_OVER' && !isWin;
  const isComplete = gameState === 'GAME_OVER' && isWin;
  const inputLocked =
    paused || isAnimating || gameState === 'PEEKING' || gameState === 'PROCESSING_MATCH' || gameState === 'GAME_OVER';
  const recordedGameOverRef = useRef(false);

  useGameLoopLifecycle(paused || gameState === 'GAME_OVER', () => setPaused(true));
  useGameFeedbackEvents();

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        setPaused(true);
        return true;
      });

      return () => subscription.remove();
    }, []),
  );

  useEffect(() => {
    if (cards.length === 0) {
      void gameBootstrapService.initializeNewGame();
    }
  }, [cards.length]);

  useEffect(() => {
    if (gameState !== 'PEEKING') {
      return;
    }

    const timeout = setTimeout(() => actions.finishPeek(), peekDurationMs);
    return () => clearTimeout(timeout);
  }, [actions, gameState]);

  useEffect(() => {
    if (!isAnimating) {
      return;
    }

    const timeout = setTimeout(() => actions.unlockInput(), flipAnimationLockMs);
    return () => clearTimeout(timeout);
  }, [actions, isAnimating]);

  useEffect(() => {
    if (cards.length > 0 && lives === 0 && gameState !== 'GAME_OVER') {
      actions.setGameOver();
    }
  }, [actions, cards.length, gameState, lives]);

  useEffect(() => {
    const recordGameOver = async () => {
      if (gameState !== 'GAME_OVER' || recordedGameOverRef.current) {
        return;
      }

      recordedGameOverRef.current = true;
      const result = buildMatchResult(cards, moves, elapsedTime);
      await persistenceService.recordResult(result);

    };

    void recordGameOver();
  }, [cards, elapsedTime, gameState, isWin, moves, navigation]);

  const retry = async () => {
    setPaused(false);
    recordedGameOverRef.current = false;
    await gameBootstrapService.initializeNewGame();
  };

  const mainMenu = () => {
    setPaused(false);
    navigation.replace('MainMenu');
  };

  const viewResults = () => {
    navigation.replace('Results');
  };

  return (
    <Screen dense>
      <View style={styles.headerRow}>
        <TerminalHeader path="ROOT/RUN/GRID >" title="MemoFlip Grid" subtitle="Loop-driven renderer" />
        <AppButton label="Pause" onPress={() => setPaused(true)} variant="ghost" style={styles.pauseButton} />
      </View>
      <HUD
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        moves={moves}
        elapsedTime={elapsedTime}
        lives={lives}
        difficulty={difficulty}
      />
      {cards.length ? (
        <>
          {gameState === 'PEEKING' ? <Text style={styles.peekText}>Memorize the board...</Text> : null}
          <GameBoard cards={cards} disabled={inputLocked} onTilePress={actions.flipCard} />
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Preparing deck...</Text>
        </View>
      )}
      <GameModal
        visible={paused}
        title="Paused"
        primaryLabel="Resume"
        secondaryLabel="Main Menu"
        onPrimary={() => setPaused(false)}
        onSecondary={mainMenu}
      >
        <Text style={styles.modalText}>The game loop and audio are suspended until you resume.</Text>
        <AppButton label="Retry" onPress={retry} variant="secondary" />
      </GameModal>
      <GameModal
        visible={isComplete}
        title="Congratulations"
        primaryLabel="View Results"
        secondaryLabel="Main Menu"
        onPrimary={viewResults}
        onSecondary={mainMenu}
      >
        <Text style={styles.modalText}>
          You matched every pair. Final score: {Math.max(0, matchedPairs * 1000 - moves * 25 - elapsedTime * 4)}.
        </Text>
      </GameModal>
      <GameModal
        visible={isLoss}
        title="Game Over"
        primaryLabel="Retry"
        secondaryLabel="Main Menu"
        onPrimary={retry}
        onSecondary={mainMenu}
      >
        <Text style={styles.modalText}>
          You ran out of lives after {moves} moves. Final score: {Math.max(0, matchedPairs * 1000 - moves * 25 - elapsedTime * 4)}.
        </Text>
      </GameModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pauseButton: {
    minWidth: 92,
  },
  peekText: {
    color: colors.secondary,
    fontFamily: type.fallback,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  emptyText: {
    color: colors.onSurfaceMuted,
    fontFamily: type.fallback,
    fontSize: 14,
  },
  modalText: {
    color: colors.onSurfaceMuted,
    fontFamily: type.fallback,
    fontSize: 14,
    lineHeight: 21,
  },
});
