import { FontSize, FontWeight, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  suffix?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  suffix,
}: NumberInputProps) {
  const colors = useTheme();

  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <View style={[styles.row, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Pressable
          onPress={decrement}
          disabled={value <= min}
          style={({ pressed }) => [
            styles.btn,
            { opacity: value <= min ? 0.3 : pressed ? 0.6 : 1 },
          ]}
          accessibilityLabel={`Decrease ${label ?? ''}`}
        >
          <Text style={[styles.btnText, { color: colors.text }]}>−</Text>
        </Pressable>

        <Text style={[styles.value, { color: colors.text }]}>
          {value}{suffix ? ` ${suffix}` : ''}
        </Text>

        <Pressable
          onPress={increment}
          disabled={value >= max}
          style={({ pressed }) => [
            styles.btn,
            { opacity: value >= max ? 0.3 : pressed ? 0.6 : 1 },
          ]}
          accessibilityLabel={`Increase ${label ?? ''}`}
        >
          <Text style={[styles.btnText, { color: colors.text }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  btn: {
    width: TouchTarget.comfortable,
    height: TouchTarget.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.regular,
    lineHeight: 26,
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    minWidth: 64,
    textAlign: 'center',
  },
});
