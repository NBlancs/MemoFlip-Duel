import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { GameModal } from '../components/GameModal';
import { Screen } from '../components/Screen';
import { TerminalHeader } from '../components/TerminalHeader';
import { gameBootstrapService } from '../services/gameBootstrapService';
import { playerService } from '../services/playerService';
import { colors, spacing, type } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

type ParticleConfig = {
  id: number;
  left: string;
  top: string;
  size: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
};

const particlePalette = [colors.primary, colors.secondary, colors.outlineVariant];

const createParticles = (): ParticleConfig[] => {
  const particles: ParticleConfig[] = [];

  const pushBandParticles = (
    count: number,
    topRange: [number, number],
    leftRange: [number, number],
    driftXRange: [number, number],
    driftYRange: [number, number],
  ) => {
    for (let index = 0; index < count; index += 1) {
      particles.push({
        id: particles.length,
        left: `${leftRange[0] + Math.random() * (leftRange[1] - leftRange[0])}%`,
        top: `${topRange[0] + Math.random() * (topRange[1] - topRange[0])}%`,
        size: 3 + Math.floor(Math.random() * 5),
        driftX: driftXRange[0] + Math.random() * (driftXRange[1] - driftXRange[0]),
        driftY: driftYRange[0] + Math.random() * (driftYRange[1] - driftYRange[0]),
        duration: 3200 + Math.floor(Math.random() * 2400),
        delay: Math.floor(Math.random() * 1600),
        opacity: 0.25 + Math.random() * 0.4,
        color: particlePalette[Math.floor(Math.random() * particlePalette.length)],
      });
    }
  };

  pushBandParticles(4, [6, 18], [10, 88], [-8, 8], [-6, 6]);
  pushBandParticles(4, [82, 94], [12, 86], [-8, 8], [-6, 6]);
  pushBandParticles(4, [22, 72], [4, 16], [-6, 6], [-8, 8]);
  pushBandParticles(4, [24, 74], [84, 96], [-6, 6], [-8, 8]);

  return particles;
};

function Particle({ config }: { config: ParticleConfig }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: config.duration,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: config.duration,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [config.delay, config.duration, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.driftX],
  });

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.driftY],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [config.opacity * 0.55, config.opacity, config.opacity * 0.7],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          left: config.left as any,
          top: config.top as any,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: config.color,
          opacity,
          transform: [{ translateX }, { translateY }] as any,
        },
      ]}
    />
  );
}

function ParticleField() {
  const particles = useMemo(() => createParticles(), []);

  return (
    <View pointerEvents="none" style={styles.particlesLayer}>
      {particles.map((particle) => (
        <Particle key={particle.id} config={particle} />
      ))}
    </View>
  );
}

export function MainMenuScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);

  useEffect(() => {
    void playerService.getProfile().then((profile) => setUsername(profile?.username ?? ''));
  }, []);

  const play = async () => {
    if (!username.trim()) {
      setUsernameModalVisible(true);
      return;
    }

    await gameBootstrapService.initializeNewGame();
    navigation.navigate('Game');
  };

  const startWithUsername = async () => {
    if (!username.trim()) {
      return;
    }

    await playerService.saveUsername(username);
    setUsernameModalVisible(false);
    await gameBootstrapService.initializeNewGame();
    navigation.navigate('Game');
  };

  return (
    <Screen>
      <TerminalHeader
        path="ROOT/MENU >"
        title="MemoFlip"
        subtitle="A fast memory grid built for clean reads, sharp taps, and short runs."
      />
      <View style={styles.hero}>
        <ParticleField />
        <Text style={styles.logoText}>MemoFlip</Text>
        <Text style={styles.status}>SYSTEM ONLINE</Text>
      </View>
      <View style={styles.actions}>
        <AppButton label="Play" onPress={play} />
        <AppButton label="Leaderboards" onPress={() => navigation.navigate('Leaderboard')} variant="secondary" />
        <AppButton label="How to Play" onPress={() => navigation.navigate('Onboarding')} variant="secondary" />
        <AppButton label="Settings" onPress={() => navigation.navigate('Settings')} variant="ghost" />
      </View>
      <GameModal
        visible={usernameModalVisible}
        title="Enter Username"
        primaryLabel="Start"
        secondaryLabel="Cancel"
        onPrimary={startWithUsername}
        onSecondary={() => setUsernameModalVisible(false)}
      >
        <Text style={styles.modalText}>Choose a display name for local score tracking.</Text>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={24}
          onChangeText={setUsername}
          onSubmitEditing={startWithUsername}
          placeholder="Username"
          placeholderTextColor={colors.outline}
          returnKeyType="done"
          style={styles.input}
          value={username}
        />
      </GameModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    gap: spacing.md,
    overflow: 'hidden',
  },
  particlesLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  logoText: {
    color: colors.onSurface,
    fontFamily: type.fallback,
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
    zIndex: 1,
  },
  status: {
    color: colors.secondary,
    fontFamily: type.fallback,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    zIndex: 1,
  },
  modalText: {
    color: colors.onSurfaceMuted,
    fontFamily: type.fallback,
    fontSize: 14,
    lineHeight: 21,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLow,
    color: colors.onSurface,
    fontFamily: type.fallback,
    fontSize: 16,
    paddingHorizontal: spacing.md,
  },
  actions: {
    gap: spacing.sm,
  },
});
