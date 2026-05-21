import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Screen } from '../components/Screen';
import { TerminalHeader } from '../components/TerminalHeader';
import { MatchResult, persistenceService } from '../services/persistenceService';
import { colors, formatTime, spacing, type } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Leaderboard'>;

type LeaderboardEntry = Pick<MatchResult, 'id' | 'username' | 'score' | 'moves' | 'elapsedTime' | 'matchedPairs'> & {
  source: 'local' | 'mock';
};

const mockEntries: LeaderboardEntry[] = [
  { id: 'mock-1', username: 'Nova', score: 17820, moves: 20, elapsedTime: 42, matchedPairs: 18, source: 'mock' },
  { id: 'mock-2', username: 'Pixel', score: 16470, moves: 25, elapsedTime: 55, matchedPairs: 18, source: 'mock' },
  { id: 'mock-3', username: 'Echo', score: 7388, moves: 13, elapsedTime: 47, matchedPairs: 8, source: 'mock' },
  { id: 'mock-4', username: 'Byte', score: 7020, moves: 15, elapsedTime: 51, matchedPairs: 8, source: 'mock' },
];

const sortEntries = (entries: LeaderboardEntry[]) =>
  [...entries].sort((a, b) => b.score - a.score || a.moves - b.moves || a.elapsedTime - b.elapsedTime);

export function LeaderboardScreen({ navigation }: Props) {
  const [localResults, setLocalResults] = useState<MatchResult[]>([]);

  useEffect(() => {
    void persistenceService.getLocalResults().then(setLocalResults);
  }, []);

  const localEntries = useMemo<LeaderboardEntry[]>(
    () => localResults.map((result) => ({ ...result, source: 'local' })),
    [localResults],
  );
  const highScores = useMemo(() => sortEntries([...localEntries, ...mockEntries]).slice(0, 10), [localEntries]);

  return (
    <Screen>
      <TerminalHeader
        path="ROOT/SCORES >"
        title="Leaderboards"
        subtitle=""
      />
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionLabel}>High Scores</Text>
        {highScores.map((entry, index) => (
          <View key={`${entry.source}-${entry.id}`} style={styles.row}>
            <Text style={styles.rank}>{String(index + 1).padStart(2, '0')}</Text>
            <View style={styles.identity}>
              <Text style={styles.name}>{entry.username}</Text>
              <Text style={styles.meta}>
                {entry.matchedPairs} pairs / {entry.moves} moves / {formatTime(entry.elapsedTime)}
              </Text>
            </View>
            <Text style={styles.score}>{entry.score}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Your Local Scores</Text>
        {localEntries.length ? (
          sortEntries(localEntries).map((entry, index) => (
            <View key={entry.id} style={styles.row}>
              <Text style={styles.rank}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={styles.identity}>
                <Text style={styles.name}>{entry.username}</Text>
                <Text style={styles.meta}>
                  {entry.matchedPairs} pairs / {entry.moves} moves / {formatTime(entry.elapsedTime)}
                </Text>
              </View>
              <Text style={styles.score}>{entry.score}</Text>
            </View>
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No completed local runs yet.</Text>
          </View>
        )}
      </ScrollView>
      <AppButton label="Back" onPress={() => navigation.goBack()} variant="ghost" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  sectionLabel: {
    color: colors.secondary,
    fontFamily: type.fallback,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: {
    minHeight: 64,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rank: {
    width: 30,
    color: colors.primary,
    fontFamily: type.fallback,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  identity: {
    flex: 1,
    gap: spacing.xxs,
  },
  name: {
    color: colors.onSurface,
    fontFamily: type.fallback,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  meta: {
    color: colors.onSurfaceMuted,
    fontFamily: type.fallback,
    fontSize: 11,
    letterSpacing: 0,
  },
  score: {
    color: colors.onSurface,
    fontFamily: type.fallback,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    padding: spacing.md,
  },
  emptyText: {
    color: colors.onSurfaceMuted,
    fontFamily: type.fallback,
    fontSize: 14,
  },
  schemaPanel: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  schemaText: {
    color: colors.onSurfaceMuted,
    fontFamily: type.fallback,
    fontSize: 12,
    lineHeight: 18,
  },
});
