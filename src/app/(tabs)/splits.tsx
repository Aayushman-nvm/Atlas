import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/modal';
import {
    FontSize, FontWeight, MaxContentWidth, Radius, Spacing,
} from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { deleteSplit, getAllSplits, getSplitDayCount } from '@/database/queries/splits';
import { useTheme } from '@/hooks/use-theme';
import type { Split } from '@/types';
import { router, useFocusEffect } from 'expo-router';
import { ChevronRight, Lock, Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SplitWithDays extends Split {
  days: number;
}

export default function SplitsScreen() {
  const colors = useTheme();
  const [splits, setSplits] = useState<SplitWithDays[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSplits();
    }, [])
  );

  async function loadSplits() {
    const db = await getDatabase();
    const all = await getAllSplits(db);
    const withDays = await Promise.all(
      all.map(async (s) => ({
        ...s,
        days: await getSplitDayCount(db, s.id),
      }))
    );
    setSplits(withDays);
  }

  async function handleDelete(id: string) {
    const db = await getDatabase();
    await deleteSplit(db, id);
    setDeleteTarget(null);
    loadSplits();
  }

  const presets = splits.filter((s) => s.isPreset);
  const custom = splits.filter((s) => !s.isPreset);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>My Splits</Text>
              <Button
                label="New Split"
                variant="primary"
                size="sm"
                leftIcon={<Plus size={16} color="#FFF" />}
                onPress={() => router.push('/splits/new' as any)}
              />
            </View>

            {/* Custom Splits */}
            {custom.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  MY SPLITS
                </Text>
                {custom.map((split) => (
                  <SplitCard
                    key={split.id}
                    split={split}
                    onPress={() => router.push({ pathname: '/splits/[id]' as any, params: { id: split.id } })}
                    onDelete={() => setDeleteTarget(split.id)}
                  />
                ))}
              </View>
            )}

            {/* Preset Splits */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                PRESETS
              </Text>
              {presets.map((split) => (
                <SplitCard
                  key={split.id}
                  split={split}
                  onPress={() => router.push({ pathname: '/splits/[id]' as any, params: { id: split.id } })}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ConfirmModal
        visible={!!deleteTarget}
        title="Delete Split?"
        message="This will permanently remove this split and all its exercises."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

function SplitCard({
  split,
  onPress,
  onDelete,
}: {
  split: SplitWithDays;
  onPress: () => void;
  onDelete?: () => void;
}) {
  const colors = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.splitCard,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      accessibilityRole="button"
    >
      <View style={styles.splitCardContent}>
        <View style={styles.splitInfo}>
          <View style={styles.splitNameRow}>
            <Text style={[styles.splitName, { color: colors.text }]}>
              {split.name}
            </Text>
            {split.isPreset && (
              <View style={[styles.presetBadge, { backgroundColor: colors.primaryMuted }]}>
                <Lock size={10} color={colors.primary} />
                <Text style={[styles.presetBadgeText, { color: colors.primary }]}>Preset</Text>
              </View>
            )}
          </View>
          {split.description ? (
            <Text
              style={[styles.splitDesc, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {split.description}
            </Text>
          ) : null}
          <Text style={[styles.splitDays, { color: colors.textTertiary }]}>
            {split.days} day{split.days !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.splitActions}>
          {!split.isPreset && onDelete && (
            <Pressable
              onPress={(e) => { e.stopPropagation(); onDelete(); }}
              style={[styles.deleteBtn, { borderColor: colors.danger }]}
            >
              <Text style={[styles.deleteBtnText, { color: colors.danger }]}>Delete</Text>
            </Pressable>
          )}
          <ChevronRight size={20} color={colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: {
    flex: 1,
    padding: Spacing.five,
    gap: Spacing.six,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.four,
  },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.heavy },
  section: { gap: Spacing.three },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
  },
  splitCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  splitCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  splitInfo: { flex: 1, gap: Spacing.one },
  splitNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  splitName: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  presetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  presetBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  splitDesc: { fontSize: FontSize.sm },
  splitDays: { fontSize: FontSize.xs },
  splitActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  deleteBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  deleteBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
});
