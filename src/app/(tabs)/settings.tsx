import { Card } from '@/components/ui/card';
import {
    FontSize, FontWeight, MaxContentWidth, Radius, Spacing,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/store/settings-store';
import type { StrictnessLevel, ThemePreference, WeightUnit } from '@/types';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const colors = useTheme();
  const { theme, strictMode, units, soundEnabled, vibrationEnabled, defaultRestSeconds, update } =
    useSettingsStore();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

            {/* Theme */}
            <SettingsSection title="Appearance">
              <SegmentedControl
                label="Theme"
                options={[
                  { label: 'System', value: 'system' as ThemePreference },
                  { label: 'Light', value: 'light' as ThemePreference },
                  { label: 'Dark', value: 'dark' as ThemePreference },
                ]}
                selected={theme}
                onSelect={(v) => update({ theme: v as ThemePreference })}
              />
            </SettingsSection>

            {/* Units */}
            <SettingsSection title="Units">
              <SegmentedControl
                label="Weight Unit"
                options={[
                  { label: 'Kilograms (kg)', value: 'kg' as WeightUnit },
                  { label: 'Pounds (lb)', value: 'lb' as WeightUnit },
                ]}
                selected={units}
                onSelect={(v) => update({ units: v as WeightUnit })}
              />
            </SettingsSection>

            {/* Strictness */}
            <SettingsSection title="Workout Mode">
              <SegmentedControl
                label="Strictness"
                options={[
                  { label: 'Flexible', value: 'flexible' as StrictnessLevel },
                  { label: 'Strict', value: 'strict' as StrictnessLevel },
                  { label: 'Super Strict', value: 'super_strict' as StrictnessLevel },
                ]}
                selected={strictMode}
                onSelect={(v) => update({ strictMode: v as StrictnessLevel })}
                descriptions={{
                  flexible: 'Skip exercises, jump around, edit sets freely.',
                  strict: 'Follow order, confirm edits.',
                  super_strict: 'Order locked. Only weight entry allowed.',
                }}
              />
            </SettingsSection>

            {/* Rest Timer */}
            <SettingsSection title="Rest Timer">
              <View style={[styles.row, { borderBottomColor: colors.border }]}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Default Rest</Text>
                <View style={styles.restOptions}>
                  {[60, 90, 120, 180].map((sec) => (
                    <Pressable
                      key={sec}
                      onPress={() => update({ defaultRestSeconds: sec })}
                      style={[
                        styles.restPill,
                        {
                          backgroundColor:
                            defaultRestSeconds === sec
                              ? colors.primary
                              : colors.backgroundSelected,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.restPillText,
                          {
                            color:
                              defaultRestSeconds === sec ? '#FFF' : colors.textSecondary,
                          },
                        ]}
                      >
                        {sec}s
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </SettingsSection>

            {/* Sound & Haptics */}
            <SettingsSection title="Feedback">
              <ToggleRow
                label="Sound"
                description="Play sound when rest timer ends"
                value={soundEnabled}
                onChange={(v) => update({ soundEnabled: v })}
              />
              <ToggleRow
                label="Vibration"
                description="Vibrate when rest timer ends"
                value={vibrationEnabled}
                onChange={(v) => update({ vibrationEnabled: v })}
                isLast
              />
            </SettingsSection>

            {/* About */}
            <SettingsSection title="About">
              <View style={styles.row}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Atlas</Text>
                <Text style={[styles.rowValue, { color: colors.textSecondary }]}>v1.0.0</Text>
              </View>
              <View style={[styles.row, { borderBottomWidth: 0 }]}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>No internet required</Text>
                <Text style={[styles.rowValue, { color: colors.success }]}>✓ Offline</Text>
              </View>
            </SettingsSection>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const colors = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {title.toUpperCase()}
      </Text>
      <Card padding={0}>{children}</Card>
    </View>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
  isLast,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  const colors = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: colors.border,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.rowTextGroup}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {description && (
          <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor={'#FFFFFF'}
      />
    </View>
  );
}

function SegmentedControl<T extends string>({
  label,
  options,
  selected,
  onSelect,
  descriptions,
}: {
  label: string;
  options: { label: string; value: T }[];
  selected: T;
  onSelect: (v: T) => void;
  descriptions?: Record<string, string>;
}) {
  const colors = useTheme();
  return (
    <View style={[styles.segmentContainer, { borderBottomWidth: 0 }]}>
      <Text style={[styles.segmentLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.segmentRow}>
        {options.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.segmentOption,
              {
                backgroundColor:
                  selected === opt.value ? colors.primary : colors.backgroundSelected,
                flex: 1,
              },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected === opt.value }}
          >
            <Text
              style={[
                styles.segmentOptionText,
                {
                  color: selected === opt.value ? '#FFF' : colors.textSecondary,
                  fontWeight:
                    selected === opt.value ? FontWeight.bold : FontWeight.medium,
                },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {descriptions && descriptions[selected] && (
        <Text style={[styles.segmentDesc, { color: colors.textTertiary }]}>
          {descriptions[selected]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: {
    flex: 1,
    padding: Spacing.five,
    paddingTop: Spacing.four,
    gap: Spacing.five,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.heavy },
  section: { gap: Spacing.two },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
  },
  rowTextGroup: { flex: 1 },
  rowLabel: { fontSize: FontSize.base },
  rowDesc: { fontSize: FontSize.sm, marginTop: 2 },
  rowValue: { fontSize: FontSize.base },
  restOptions: { flexDirection: 'row', gap: Spacing.two },
  restPill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
  },
  restPillText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  segmentContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  segmentLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  segmentRow: { flexDirection: 'row', gap: Spacing.two },
  segmentOption: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  segmentOptionText: { fontSize: FontSize.sm, textAlign: 'center' },
  segmentDesc: { fontSize: FontSize.sm, lineHeight: 18 },
});
