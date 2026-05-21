import { memo, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, touchTarget, type } from '../theme';

interface VolumeSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export const VolumeSlider = memo(function VolumeSlider({ label, value, onValueChange }: VolumeSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const thumbPosition = useMemo(() => {
    if (trackWidth <= 0) {
      return 0;
    }

    return (clamp(value) / 100) * trackWidth;
  }, [trackWidth, value]);

  const updateFromX = (x: number) => {
    if (trackWidth <= 0) {
      return;
    }

    const nextValue = clamp(Math.round((x / trackWidth) * 100));
    onValueChange(nextValue);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{clamp(value)}%</Text>
      </View>
      <View
        onLayout={handleLayout}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event) => updateFromX(event.nativeEvent.locationX)}
        onResponderMove={(event) => updateFromX(event.nativeEvent.locationX)}
        onStartShouldSetResponder={() => true}
        style={styles.trackTouchArea}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${clamp(value)}%` }]} />
          <View style={[styles.thumb, { left: Math.max(0, thumbPosition - 10) }]} />
        </View>
      </View>
      <Text style={styles.caption}>Music volume only. Sound effects use their own level.</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  header: {
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
  value: {
    color: colors.secondary,
    fontFamily: type.fallback,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  trackTouchArea: {
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  track: {
    height: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  thumb: {
    position: 'absolute',
    top: -4,
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.onSurface,
    backgroundColor: colors.primaryOn,
  },
  caption: {
    color: colors.onSurfaceMuted,
    fontFamily: type.fallback,
    fontSize: 12,
    lineHeight: 18,
  },
});
