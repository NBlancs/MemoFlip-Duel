import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { audioService } from '../services/audioService';
import { colors, spacing, touchTarget, type } from '../theme';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const ToggleRow = memo(function ToggleRow({ label, value, onValueChange }: ToggleRowProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => {
        void audioService.playSound('button_clicked');
        onValueChange(!value);
      }}
      style={styles.row}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    minHeight: touchTarget,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.onSurface,
    fontFamily: type.fallback,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  track: {
    width: 54,
    height: 28,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 3,
  },
  trackOn: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryOn,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: colors.outline,
  },
  thumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.secondary,
  },
});
