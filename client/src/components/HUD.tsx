import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Difficulty } from '../services/settingsService';
import { formatTime } from '../theme';
import { ScoreDisplay } from './ScoreDisplay';

interface HUDProps {
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  elapsedTime: number;
  lives: number;
  difficulty: Difficulty;
}

const labelByDifficulty: Record<Difficulty, string> = {
  easy: 'Normal',
  medium: 'Hard',
};

export const HUD = memo(function HUD({ matchedPairs, totalPairs, moves, elapsedTime, lives, difficulty }: HUDProps) {
  const score = Math.max(0, matchedPairs * 1000 - moves * 25 - elapsedTime * 4);

  return (
    <View style={styles.container}>
      <ScoreDisplay label="Score" value={score} accent="primary" />
      <ScoreDisplay label="Lives" value={lives} accent="danger" />
      <ScoreDisplay label="Pairs" value={`${matchedPairs}/${totalPairs}`} accent="secondary" />
      <ScoreDisplay label="Time" value={formatTime(elapsedTime)} accent="primary" />
      <ScoreDisplay label="Mode" value={labelByDifficulty[difficulty]} accent="secondary" />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
