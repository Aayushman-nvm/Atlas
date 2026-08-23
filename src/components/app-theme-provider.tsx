import { useSettingsStore } from '@/store/settings-store';
import React from 'react';
import { useColorScheme, type ColorSchemeName } from 'react-native';

// We use expo-router's ThemeProvider via its built-in navigation container.
// This component simply resolves and exports the active color scheme for other
// consumers; actual NavigationContainer theming is handled by expo-router.

export function useResolvedColorScheme(): ColorSchemeName {
  const systemScheme = useColorScheme();
  const { theme } = useSettingsStore();
  if (theme === 'system') return systemScheme;
  return theme;
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  // expo-router wraps the app in its own NavigationContainer.
  // We just render children here; theme is picked up via useTheme() which
  // reads from useSettingsStore.
  return <>{children}</>;
}
