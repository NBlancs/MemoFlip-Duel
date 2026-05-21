import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { Platform, AppState } from 'react-native';
import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    let mounted = true;

    const applyImmersive = async () => {
      try {
        const NavigationBar = await import('expo-navigation-bar');
        if (!mounted) return;
        // Prefer immersive-sticky so gestures briefly show system bars
        if (NavigationBar?.setBehaviorAsync) {
          await NavigationBar.setBehaviorAsync('immersive-sticky');
        }
        if (NavigationBar?.setVisibilityAsync) {
          await NavigationBar.setVisibilityAsync('hidden');
        }
      } catch (e) {
        // module not installed — inform developer in console
        // To install: `npx expo install expo-navigation-bar`
        // This is non-fatal; app continues to run.
        // eslint-disable-next-line no-console
        console.warn('expo-navigation-bar not available. Run: npx expo install expo-navigation-bar');
      }
    };

    applyImmersive();

    const sub = AppState.addEventListener('change', nextState => {
      // re-apply when app becomes active
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        applyImmersive();
      }
      appState.current = nextState;
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" backgroundColor={colors.background} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
