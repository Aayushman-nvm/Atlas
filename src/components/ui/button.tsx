import { FontSize, FontWeight, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    type PressableProps,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) {
  const colors = useTheme();
  const isDisabled = disabled || loading;

  const bgColor = {
    primary: colors.primary,
    secondary: colors.backgroundElement,
    ghost: 'transparent',
    danger: colors.danger,
    success: colors.success,
  }[variant];

  const textColor = {
    primary: '#FFFFFF',
    secondary: colors.text,
    ghost: colors.primary,
    danger: '#FFFFFF',
    success: '#FFFFFF',
  }[variant];

  const height = { sm: TouchTarget.min, md: TouchTarget.comfortable, lg: TouchTarget.large }[size];
  const fontSize = { sm: FontSize.sm, md: FontSize.base, lg: FontSize.md }[size];
  const px = { sm: Spacing.three, md: Spacing.five, lg: Spacing.six }[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bgColor,
          height,
          paddingHorizontal: px,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: variant === 'secondary' ? colors.border : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {leftIcon}
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: textColor, fontSize, fontWeight: FontWeight.semibold }]}>
          {label}
        </Text>
      )}
      {rightIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    gap: Spacing.two,
  },
  label: {
    textAlign: 'center',
  },
});
