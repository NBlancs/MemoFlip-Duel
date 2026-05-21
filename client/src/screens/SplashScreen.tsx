import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Screen } from '../components/Screen';
import { assetService } from '../services/assetService';
import { audioService } from '../services/audioService';
import { settingsService } from '../services/settingsService';
import { colors, spacing, type } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        await audioService.configure();
        await Promise.all([
          assetService.preloadAll((nextProgress) => mounted && setProgress(nextProgress)),
          audioService.preloadAll(),
        ]);
        const settings = await settingsService.loadSettings();

        if (!mounted) {
          return;
        }

        await audioService.applySettings();

        navigation.replace(settings.tutorialSeen ? 'MainMenu' : 'Onboarding');
      } catch {
        if (mounted) {
          setFailed(true);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <Screen>
      <View style={styles.container}>
        <Image resizeMode="contain" source={require('../../assets/splash-icon.png')} style={styles.logo} />
        <Text style={styles.title}>MemoFlip</Text>
        <Text style={styles.path}>ROOT/BOOT/PRELOAD</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        {failed ? (
          <AppButton label="Retry Boot" onPress={() => navigation.replace('Splash')} />
        ) : (
          <ActivityIndicator color={colors.primary} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  logo: {
    width: '42%',
    aspectRatio: 1,
  },
  title: {
    color: colors.onSurface,
    fontFamily: type.fallback,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  path: {
    color: colors.secondary,
    fontFamily: type.fallback,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressTrack: {
    width: '78%',
    height: 10,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});
