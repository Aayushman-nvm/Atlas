import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import { NumberInput } from '@/components/ui/number-input';
import {
    FontSize, FontWeight, MaxContentWidth, Radius, Spacing, TouchTarget,
} from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { getSplitById, getSplitExercises, removeSplitExercise, updateSplitExercise } from '@/database/queries/splits';
import { useTheme } from '@/hooks/use-theme';
import type { Split, SplitExercise } from '@/types';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ChevronLeft, ExternalLink, Pencil, Trash2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    Pressable,
    Modal as RNModal,
    SectionList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DaySection {
  day: number;
  data: SplitExercise[];
}

export default function SplitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const [split, setSplit] = useState<Split | null>(null);
  const [sections, setSections] = useState<DaySection[]>([]);
  // Edit modal
  const [editTarget, setEditTarget] = useState<SplitExercise | null>(null);
  const [editSets, setEditSets] = useState(3);
  const [editReps, setEditReps] = useState(10);
  const [editRest, setEditRest] = useState(90);
  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [id])
  );

  async function loadData() {
    if (!id) return;
    const db = await getDatabase();
    const [s, exercises] = await Promise.all([
      getSplitById(db, id),
      getSplitExercises(db, id),
    ]);
    setSplit(s);

    const dayMap = new Map<number, SplitExercise[]>();
    for (const ex of exercises) {
      const arr = dayMap.get(ex.day) ?? [];
      arr.push(ex);
      dayMap.set(ex.day, arr);
    }
    const secs: DaySection[] = Array.from(dayMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([day, data]) => ({ day, data }));
    setSections(secs);
  }

  function openEditModal(item: SplitExercise) {
    setEditTarget(item);
    setEditSets(item.sets);
    setEditReps(item.reps);
    setEditRest(item.restSeconds);
  }

  async function saveEdit() {
    if (!editTarget) return;
    const db = await getDatabase();
    await updateSplitExercise(db, editTarget.id, {
      sets: editSets,
      reps: editReps,
      restSeconds: editRest,
    });
    setEditTarget(null);
    loadData();
  }

  async function handleDeleteExercise(exerciseId: string) {
    const db = await getDatabase();
    await removeSplitExercise(db, exerciseId);
    setDeleteTarget(null);
    loadData();
  }

  if (!split) return null;

  const isPreset = split.isPreset;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ChevronLeft size={24} color={colors.primary} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.splitName, { color: colors.text }]} numberOfLines={1}>
              {split.name}
            </Text>
            {split.description ? (
              <Text style={[styles.splitDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                {split.description}
              </Text>
            ) : null}
          </View>
          {isPreset && (
            <View style={[styles.presetTag, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.presetTagText, { color: colors.primary }]}>Preset</Text>
            </View>
          )}
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.dayHeader}>
              <Text style={[styles.dayLabel, { color: colors.text }]}>Day {section.day}</Text>
              <Text style={[styles.dayCount, { color: colors.textSecondary }]}>
                {section.data.length} exercise{section.data.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ExerciseRow
              item={item}
              isPreset={isPreset}
              onEdit={() => openEditModal(item)}
              onDelete={() => setDeleteTarget(item.id)}
            />
          )}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <Button
                label="Start This Workout"
                variant="primary"
                size="lg"
                fullWidth
                onPress={() =>
                  router.push({
                    pathname: '/workout/warmup' as any,
                    params: { splitId: split.id, day: '1' },
                  })
                }
              />
            </View>
          )}
        />
      </SafeAreaView>

      {/* Edit modal */}
      <RNModal
        visible={!!editTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setEditTarget(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setEditTarget(null)}>
          <Pressable
            style={[styles.modalDialog, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Exercise</Text>
            {editTarget?.exercise && (
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {editTarget.exercise.name}
              </Text>
            )}
            <View style={styles.modalInputs}>
              <NumberInput value={editSets} onChange={setEditSets} min={1} max={10} label="Sets" />
              <NumberInput value={editReps} onChange={setEditReps} min={1} max={50} label="Reps" />
              <NumberInput value={editRest} onChange={setEditRest} min={30} max={300} step={15} label="Rest" suffix="s" />
            </View>
            <View style={styles.modalActions}>
              <Button label="Cancel" variant="secondary" size="md" fullWidth onPress={() => setEditTarget(null)} />
              <Button label="Save" variant="primary" size="md" fullWidth onPress={saveEdit} />
            </View>
          </Pressable>
        </Pressable>
      </RNModal>

      <ConfirmModal
        visible={!!deleteTarget}
        title="Remove Exercise?"
        message="This exercise will be removed from the split."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => deleteTarget && handleDeleteExercise(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

function ExerciseRow({
  item,
  isPreset,
  onEdit,
  onDelete,
}: {
  item: SplitExercise;
  isPreset: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const colors = useTheme();
  const ex = item.exercise;

  return (
    <Card style={styles.exCard} padding={Spacing.four}>
      <View style={styles.exRow}>
        <View style={styles.exInfo}>
          <Text style={[styles.exName, { color: colors.text }]}>{ex?.name ?? '—'}</Text>
          <Text style={[styles.exMeta, { color: colors.textSecondary }]}>
            {item.sets} sets × {item.reps} reps · {item.restSeconds}s rest
          </Text>
          {ex?.muscleGroup && (
            <View style={[styles.muscleBadge, { backgroundColor: colors.backgroundSelected }]}>
              <Text style={[styles.muscleText, { color: colors.textSecondary }]}>
                {ex.muscleGroup}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.exActions}>
          {ex?.tutorialUrl ? (
            <Pressable
              onPress={() => ex.tutorialUrl && WebBrowser.openBrowserAsync(ex.tutorialUrl)}
              style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
              accessibilityLabel="Watch tutorial"
            >
              <ExternalLink size={18} color={colors.primary} />
            </Pressable>
          ) : null}
          {!isPreset && (
            <>
              <Pressable
                onPress={onEdit}
                style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
                accessibilityLabel="Edit exercise"
              >
                <Pencil size={18} color={colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={onDelete}
                style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
                accessibilityLabel="Remove exercise"
              >
                <Trash2 size={18} color={colors.danger} />
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  backBtn: {
    width: TouchTarget.comfortable,
    height: TouchTarget.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  splitName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  splitDesc: { fontSize: FontSize.sm, marginTop: 1 },
  presetTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  presetTagText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  listContent: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.seven,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.six,
    paddingBottom: Spacing.three,
  },
  dayLabel: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  dayCount: { fontSize: FontSize.sm },
  exCard: { marginBottom: Spacing.two },
  exRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  exInfo: { flex: 1, gap: Spacing.two },
  exName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  exMeta: { fontSize: FontSize.sm },
  muscleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  muscleText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  exActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  iconBtn: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { paddingTop: Spacing.five },
  // Edit modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.six,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.six,
    gap: Spacing.five,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, textAlign: 'center' },
  modalSubtitle: { fontSize: FontSize.sm, textAlign: 'center' },
  modalInputs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Spacing.four,
  },
  modalActions: { flexDirection: 'row', gap: Spacing.three },
});
