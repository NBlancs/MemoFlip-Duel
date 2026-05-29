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
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const load = async () => {
      try {
        console.log('[SplashScreen] Starting boot sequence');
        
        console.log('[SplashScreen] Configuring audio...');
        await audioService.configure();
        console.log('[SplashScreen] Audio configured');

        console.log('[SplashScreen] Preloading assets and audio...');
        await Promise.all([
          assetService.preloadAll((nextProgress) => {
            console.log(`[SplashScreen] Asset progress: ${Math.round(nextProgress * 100)}%`);
            mounted && setProgress(nextProgress);
          }),
          audioService.preloadAll(),
        ]);
        console.log('[SplashScreen] Assets and audio preloaded');

        console.log('[SplashScreen] Loading settings...');
        const settings = await settingsService.loadSettings();
        console.log('[SplashScreen] Settings loaded', settings);

        if (!mounted) {
          return;
        }

        console.log('[SplashScreen] Applying audio settings...');
        await audioService.applySettings();
        console.log('[SplashScreen] Boot complete, navigating to', settings.tutorialSeen ? 'MainMenu' : 'Onboarding');

        navigation.replace(settings.tutorialSeen ? 'MainMenu' : 'Onboarding');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[SplashScreen] Boot failed:', errorMsg, err);
        if (mounted) {
          setError(errorMsg);
          setFailed(true);
        }
      }
    };

    void load();

    // Add timeout as fallback - if boot takes more than 30 seconds, show error
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.error('[SplashScreen] Boot timeout after 30 seconds');
        setError('Boot timeout - assets may be corrupted or missing');
        setFailed(true);
      }
    }, 30000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
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
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error || 'Boot failed'}</Text>
            <AppButton label="Retry Boot" onPress={() => navigation.replace('Splash')} />
          </View>
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
  errorContainer: {
    alignItems: 'center',
    gap: spacing.md,
    maxWidth: '90%',
  },
  errorText: {
    color: colors.danger,
    fontFamily: type.fallback,
    fontSize: 14,
    textAlign: 'center',
  },
});
