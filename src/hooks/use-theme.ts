import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettingsStore } from '@/store/settings-store';

export function useTheme() {
  const systemScheme = useColorScheme();
  const { theme, loaded } = useSettingsStore();

  // Resolve which color scheme to use
  const resolvedScheme =
    !loaded || theme === 'system'
      ? systemScheme ?? 'light'
      : theme;

  const safescheme = resolvedScheme === 'dark' ? 'dark' : 'light';
  return Colors[safescheme];
}
