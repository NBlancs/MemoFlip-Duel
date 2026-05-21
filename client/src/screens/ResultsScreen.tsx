import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { Screen } from '../components/Screen';
import { TerminalHeader } from '../components/TerminalHeader';
import { gameBootstrapService } from '../services/gameBootstrapService';
import { buildMatchResult, MatchResult, persistenceService } from '../services/persistenceService';
import { useGameStore } from '../state/gameStore';
import { colors, formatTime, spacing, type } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export function ResultsScreen({ navigation }: Props) {
  const cards = useGameStore((state) => state.cards);
  const moves = useGameStore((state) => state.moves);
  const elapsedTime = useGameStore((state) => state.elapsedTime);
  const [best, setBest] = useState<MatchResult | null>(null);
  const result = buildMatchResult(cards, moves, elapsedTime);

  useEffect(() => {
    void persistenceService.getBestResult().then(setBest);
  }, []);

  const retry = async () => {
    await gameBootstrapService.initializeNewGame();
    navigation.replace('Game');
  };

  return (
    <Screen>
      <TerminalHeader path="ROOT/RUN/RESULT >" title="Run Complete" subtitle="" />
      <View style={styles.panel}>
        <ScoreDisplay label="Final Score" value={result.score} accent="primary" />
        <ScoreDisplay label="Moves" value={moves} accent="secondary" />
        <ScoreDisplay label="Time" value={formatTime(elapsedTime)} accent="primary" />
        <ScoreDisplay label="Pairs" value={result.matchedPairs} accent="secondary" />
      </View>
      <View style={styles.bestPanel}>
        <Text style={styles.bestLabel}>Best Stored Run</Text>
        <Text style={styles.bestValue}>
          {best
            ? `${best.username ?? 'Player'}: ${best.score} pts / ${best.moves} moves / ${formatTime(best.elapsedTime)}`
            : 'No high score yet'}
        </Text>
      </View>
      <View style={styles.actions}>
        <AppButton label="Retry" onPress={retry} />
        <AppButton label="Main Menu" onPress={() => navigation.replace('MainMenu')} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.sm,
  },
  bestPanel: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    padding: spacing.md,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  bestLabel: {
    color: colors.secondary,
    fontFamily: type.fallback,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bestValue: {
    color: colors.onSurface,
    fontFamily: type.fallback,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
  },
  actions: {
    gap: spacing.sm,
  },
});
