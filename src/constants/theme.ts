import '@/global.css';
import { Platform } from 'react-native';

// ─── Color Palette ────────────────────────────────────────────────────────────

export const Colors = {
  light: {
    // Base
    text: '#0A0A0A',
    textSecondary: '#5C5F6B',
    textTertiary: '#9499A8',
    background: '#F5F5F7',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8E9EF',
    backgroundCard: '#FFFFFF',
    // Brand
    primary: '#2563EB',
    primaryMuted: '#DBEAFE',
    success: '#16A34A',
    successMuted: '#DCFCE7',
    warning: '#D97706',
    warningMuted: '#FEF3C7',
    danger: '#DC2626',
    dangerMuted: '#FEE2E2',
    // Borders
    border: '#E2E4EC',
    borderStrong: '#C7CAD6',
    // Timer
    timerActive: '#2563EB',
    timerDone: '#16A34A',
    // Tab bar
    tabActive: '#2563EB',
    tabInactive: '#9499A8',
    tabBar: '#FFFFFF',
  },
  dark: {
    // Base
    text: '#F0F0F5',
    textSecondary: '#9499A8',
    textTertiary: '#5C5F6B',
    background: '#0A0A0F',
    backgroundElement: '#141418',
    backgroundSelected: '#1E1E25',
    backgroundCard: '#18181E',
    // Brand
    primary: '#3B82F6',
    primaryMuted: '#1E3A5F',
    success: '#22C55E',
    successMuted: '#14432A',
    warning: '#F59E0B',
    warningMuted: '#433010',
    danger: '#EF4444',
    dangerMuted: '#431C1C',
    // Borders
    border: '#242430',
    borderStrong: '#35354A',
    // Timer
    timerActive: '#3B82F6',
    timerDone: '#22C55E',
    // Tab bar
    tabActive: '#3B82F6',
    tabInactive: '#5C5F6B',
    tabBar: '#141418',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 40,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 48,
  ten: 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

// ─── Touch Targets ────────────────────────────────────────────────────────────

export const TouchTarget = {
  min: 44,
  comfortable: 52,
  large: 60,
} as const;
