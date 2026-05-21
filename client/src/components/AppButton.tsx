import { PropsWithChildren, memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { audioService } from '../services/audioService';
import { hapticsService } from '../services/hapticsService';
import { colors, spacing, touchTarget, type } from '../theme';

interface AppButtonProps extends PropsWithChildren {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

export const AppButton = memo(function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: AppButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 28,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    void hapticsService.selection();
    void audioService.playSound('button_clicked');
    onPress();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={handlePress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        style={({ pressed }) => [
          styles.base,
          styles[variant],
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.label, variant === 'primary' && styles.primaryLabel, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.transparent,
    borderColor: colors.secondary,
  },
  ghost: {
    backgroundColor: colors.transparent,
    borderColor: colors.outlineVariant,
  },
  danger: {
    backgroundColor: colors.dangerContainer,
    borderColor: colors.danger,
  },
  pressed: {
    borderColor: colors.onSurface,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    color: colors.onSurface,
    fontFamily: type.fallback,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  primaryLabel: {
    color: colors.primaryOn,
  },
  disabledLabel: {
    color: colors.onSurfaceMuted,
  },
});
