import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { Platform, AppState } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';

import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.onSurface,
    border: colors.outlineVariant,
    primary: colors.primary,
  },
};

export default function App() {
  const appState = useRef(AppState.currentState);
  const mounted = useRef(true);
  const immersiveTimers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const applyImmersive = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      const NavigationBar = await import('expo-navigation-bar');

      if (!mounted.current) {
        return;
      }

      await NavigationBar.setBehaviorAsync('overlay-swipe');
      await NavigationBar.setBackgroundColorAsync(colors.background);
      await NavigationBar.setButtonStyleAsync('light');
      await NavigationBar.setVisibilityAsync('hidden');
    } catch {
      // Expo Go and Android navigation settings can block this on some devices.
    }
  }, []);

  const scheduleImmersive = useCallback(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    void applyImmersive();

    const timer = setTimeout(() => {
      void applyImmersive();
    }, 350);

    immersiveTimers.current.push(timer);
  }, [applyImmersive]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    mounted.current = true;
    scheduleImmersive();

    const sub = AppState.addEventListener('change', nextState => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        scheduleImmersive();
      }
      appState.current = nextState;
    });

    return () => {
      mounted.current = false;
      immersiveTimers.current.forEach(clearTimeout);
      immersiveTimers.current = [];
      sub.remove();
    };
  }, [scheduleImmersive]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" backgroundColor={colors.background} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
