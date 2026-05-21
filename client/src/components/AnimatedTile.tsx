import { memo, useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, Text } from 'react-native';

import { audioService } from '../services/audioService';
import { Card } from '../state/gameStore';
import { colors, spacing, touchTarget, type } from '../theme';

interface AnimatedTileProps {
  card: Card;
  disabled: boolean;
  size: number;
  onPress: (id: string) => void;
}

const shapeAssets: Record<string, ImageSourcePropType> = {
  circle: require('../../assets/circle.png'),
  cloud: require('../../assets/cloud.png'),
  cross: require('../../assets/cross.png'),
  diamond: require('../../assets/diamond.png'),
  down: require('../../assets/down.png'),
  hexagon: require('../../assets/hexagon.png'),
  hexagon_horizontal: require('../../assets/hexagon_horizontal.png'),
  left: require('../../assets/left.png'),
  octagon: require('../../assets/octagon.png'),
  octagram: require('../../assets/octagram.png'),
  pentagon: require('../../assets/pentagon.png'),
  reverse_triangle: require('../../assets/reverse_triangle.png'),
  right: require('../../assets/right.png'),
  square: require('../../assets/square.png'),
  star_five: require('../../assets/star_five.png'),
  star_four: require('../../assets/star_four.png'),
  triangle: require('../../assets/triangle.png'),
  up: require('../../assets/up.png'),
};

const formatShapeName = (value: string) => value.replace(/_/g, ' ');

export const AnimatedTile = memo(function AnimatedTile({ card, disabled, size, onPress }: AnimatedTileProps) {
  const flip = useRef(new Animated.Value(card.isFlipped || card.isMatched ? 1 : 0)).current;
  const isRevealed = card.isFlipped || card.isMatched;
  const shapeAsset = shapeAssets[card.value];

  useEffect(() => {
    Animated.spring(flip, {
      toValue: isRevealed ? 1 : 0,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  }, [flip, isRevealed]);

  const rotateY = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isRevealed ? `Card ${formatShapeName(card.value)}` : 'Hidden card'}
      disabled={disabled || isRevealed}
      onPress={() => {
        void audioService.playSound('flip_card');
        onPress(card.id);
      }}
      style={[styles.pressable, { width: size, height: size, minHeight: touchTarget, minWidth: touchTarget }]}
    >
      <Animated.View
        style={[
          styles.tile,
          card.isMatched && styles.matched,
          {
            transform: [{ perspective: 800 }, { rotateY }],
          },
        ]}
      >
        {isRevealed && shapeAsset ? (
          <Image resizeMode="contain" source={shapeAsset} style={styles.shape} />
        ) : (
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.face, !isRevealed && styles.hiddenFace]}>
            MF
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: {
    flexGrow: 0,
    flexShrink: 0,
  },
  shape: {
    width: '82%',
    height: '82%',
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    padding: spacing.xs,
  },
  matched: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryOn,
  },
  face: {
    color: colors.primary,
    fontFamily: type.fallback,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0,
  },
  hiddenFace: {
    color: colors.outline,
  },
});
