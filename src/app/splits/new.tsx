import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import {
    FontSize, FontWeight, MaxContentWidth, Radius, Spacing, TouchTarget,
} from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { getAllExercises } from '@/database/queries/exercises';
import { addExerciseToSplit, createSplit } from '@/database/queries/splits';
import { useTheme } from '@/hooks/use-theme';
import type { Exercise, ExerciseCategory } from '@/types';
import { router } from 'expo-router';
import { CheckCircle2, ChevronLeft, Circle, Minus, Plus, Search, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Modal as RNModal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Step = 'name' | 'exercises' | 'configure';

const CATEGORIES: ExerciseCategory[] = ['Upper Body', 'Lower Body', 'Core', 'Cardio'];

interface SelectedExercise {
  exercise: Exercise;
  day: number;
  sets: number;
  reps: number;
  restSeconds: number;
}

export default function NewSplitScreen() {
  const colors = useTheme();
  const [step, setStep] = useState<Step>('name');
  const [splitName, setSplitName] = useState('');
  const [numDays, setNumDays] = useState(1);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory>('Upper Body');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [saving, setSaving] = useState(false);
  // Day picker modal state
  const [dayPickerVisible, setDayPickerVisible] = useState(false);
  const [pendingExercise, setPendingExercise] = useState<Exercise | null>(null);

  useEffect(() => { loadExercises(); }, []);

  useEffect(() => { filterExercises(); }, [exercises, selectedCategory, searchQuery]);

  async function loadExercises() {
    const db = await getDatabase();
    const all = await getAllExercises(db);
    setExercises(all.filter((e) => e.category !== 'Warmup'));
  }

  function filterExercises() {
    let filtered = exercises.filter((e) => e.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) => e.name.toLowerCase().includes(q) || e.muscleGroup.toLowerCase().includes(q)
      );
    }
    setFilteredExercises(filtered);
  }

  function handleExerciseTap(ex: Exercise) {
    const alreadySelected = selected.find((s) => s.exercise.id === ex.id);
    if (alreadySelected) {
      // Remove it
      setSelected((prev) => prev.filter((s) => s.exercise.id !== ex.id));
    } else if (numDays === 1) {
      // Single day — just add to day 1 directly
      setSelected((prev) => [...prev, { exercise: ex, day: 1, sets: 3, reps: 10, restSeconds: 90 }]);
    } else {
      // Multi-day — show day picker
      setPendingExercise(ex);
      setDayPickerVisible(true);
    }
  }

  function confirmDay(day: number) {
    if (!pendingExercise) return;
    setSelected((prev) => [
      ...prev,
      { exercise: pendingExercise, day, sets: 3, reps: 10, restSeconds: 90 },
    ]);
    setPendingExercise(null);
    setDayPickerVisible(false);
  }

  function isSelected(id: string) {
    return selected.some((s) => s.exercise.id === id);
  }

  function getExerciseDay(id: string): number | null {
    return selected.find((s) => s.exercise.id === id)?.day ?? null;
  }

  function updateSelected(id: string, key: 'sets' | 'reps' | 'restSeconds' | 'day', value: number) {
    setSelected((prev) => prev.map((s) => s.exercise.id === id ? { ...s, [key]: value } : s));
  }

  function removeSelected(id: string) {
    setSelected((prev) => prev.filter((s) => s.exercise.id !== id));
  }

  async function handleSave() {
    if (!splitName.trim() || selected.length === 0) return;
    setSaving(true);
    try {
      const db = await getDatabase();
      const splitId = await createSplit(db, splitName.trim());
      for (const item of selected) {
        await addExerciseToSplit(db, splitId, item.exercise.id, item.day, item.sets, item.reps, item.restSeconds);
      }
      router.replace({ pathname: '/splits/[id]' as any, params: { id: splitId } });
    } finally {
      setSaving(false);
    }
  }

  // Group configure list by day
  const byDay = selected.reduce<Map<number, SelectedExercise[]>>((map, item) => {
    const arr = map.get(item.day) ?? [];
    arr.push(item);
    map.set(item.day, arr);
    return map;
  }, new Map());

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable
            onPress={() => {
              if (step === 'name') router.back();
              else if (step === 'exercises') setStep('name');
              else setStep('exercises');
            }}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ChevronLeft size={24} color={colors.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {step === 'name' ? 'New Split' : step === 'exercises' ? 'Choose Exercises' : 'Configure'}
          </Text>
          {step === 'exercises' && selected.length > 0 && (
            <Pressable onPress={() => setStep('configure')}>
              <Text style={[styles.nextBtn, { color: colors.primary }]}>
                Next ({selected.length})
              </Text>
            </Pressable>
          )}
          {(step === 'name' || step === 'configure') && <View style={styles.headerRight} />}
        </View>

        {/* ── Step 1: Name + days ── */}
        {step === 'name' && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
            <ScrollView contentContainerStyle={styles.nameContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Name your split</Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Give your workout plan a name and choose how many training days it has.
              </Text>
              <TextInput
                value={splitName}
                onChangeText={setSplitName}
                placeholder="e.g. My PPL Split"
                placeholderTextColor={colors.textTertiary}
                style={[styles.nameInput, { color: colors.text, backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => splitName.trim() && setStep('exercises')}
              />
              {/* Number of days */}
              <View style={[styles.daysRow, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                <Text style={[styles.daysLabel, { color: colors.text }]}>Training days</Text>
                <View style={styles.daysControl}>
                  <Pressable
                    onPress={() => setNumDays((d) => Math.max(1, d - 1))}
                    style={({ pressed }) => [styles.dayBtn, { backgroundColor: colors.backgroundSelected, opacity: pressed ? 0.6 : 1 }]}
                    disabled={numDays <= 1}
                  >
                    <Minus size={16} color={colors.text} />
                  </Pressable>
                  <Text style={[styles.daysValue, { color: colors.text }]}>{numDays}</Text>
                  <Pressable
                    onPress={() => setNumDays((d) => Math.min(7, d + 1))}
                    style={({ pressed }) => [styles.dayBtn, { backgroundColor: colors.backgroundSelected, opacity: pressed ? 0.6 : 1 }]}
                    disabled={numDays >= 7}
                  >
                    <Plus size={16} color={colors.text} />
                  </Pressable>
                </View>
              </View>
              {numDays > 1 && (
                <Text style={[styles.daysHint, { color: colors.textTertiary }]}>
                  You'll assign each exercise to a day when selecting.
                </Text>
              )}
            </ScrollView>
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <Button
                label="Choose Exercises"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!splitName.trim()}
                onPress={() => setStep('exercises')}
              />
            </View>
          </KeyboardAvoidingView>
        )}

        {/* ── Step 2: Exercise picker ── */}
        {step === 'exercises' && (
          <View style={styles.flex}>
            <View style={[styles.searchBar, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Search size={18} color={colors.textSecondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search exercises..."
                placeholderTextColor={colors.textTertiary}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[styles.categoryPill, {
                    backgroundColor: cat === selectedCategory ? colors.primary : colors.backgroundElement,
                    borderColor: cat === selectedCategory ? colors.primary : colors.border,
                  }]}
                >
                  <Text style={[styles.categoryPillText, { color: cat === selectedCategory ? '#FFF' : colors.textSecondary }]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <FlatList
              data={filteredExercises}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.exerciseList}
              renderItem={({ item }) => {
                const sel = isSelected(item.id);
                const dayNum = getExerciseDay(item.id);
                return (
                  <Pressable
                    onPress={() => handleExerciseTap(item)}
                    style={[styles.exerciseItem, {
                      backgroundColor: sel ? colors.primaryMuted : colors.backgroundElement,
                      borderColor: sel ? colors.primary : colors.border,
                    }]}
                  >
                    {sel ? <CheckCircle2 size={22} color={colors.primary} /> : <Circle size={22} color={colors.border} />}
                    <View style={styles.exerciseItemInfo}>
                      <Text style={[styles.exerciseItemName, { color: sel ? colors.primary : colors.text }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.exerciseItemMeta, { color: colors.textSecondary }]}>
                        {item.muscleGroup} · {item.equipment}
                      </Text>
                    </View>
                    {sel && numDays > 1 && dayNum !== null && (
                      <View style={[styles.dayBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.dayBadgeText}>Day {dayNum}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              }}
              ListEmptyComponent={() => (
                <Text style={[styles.empty, { color: colors.textTertiary }]}>No exercises found</Text>
              )}
            />
          </View>
        )}

        {/* ── Step 3: Configure ── */}
        {step === 'configure' && (
          <>
            <ScrollView contentContainerStyle={styles.configContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Configure exercises</Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Set sets, reps, rest, and day for each exercise.
              </Text>

              {Array.from(byDay.entries()).sort((a, b) => a[0] - b[0]).map(([day, items]) => (
                <View key={day}>
                  {numDays > 1 && (
                    <Text style={[styles.configDayHeader, { color: colors.textSecondary }]}>
                      DAY {day}
                    </Text>
                  )}
                  {items.map((item) => (
                    <View key={item.exercise.id} style={[styles.configCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                      <View style={styles.configCardHeader}>
                        <Text style={[styles.configExName, { color: colors.text }]} numberOfLines={1}>
                          {item.exercise.name}
                        </Text>
                        <View style={styles.configCardActions}>
                          {numDays > 1 && (
                            <Pressable
                              onPress={() => { setPendingExercise(item.exercise); setDayPickerVisible(true); }}
                              style={[styles.configDayBtn, { backgroundColor: colors.primaryMuted }]}
                            >
                              <Text style={[styles.configDayBtnText, { color: colors.primary }]}>Day {item.day}</Text>
                            </Pressable>
                          )}
                          <Pressable onPress={() => removeSelected(item.exercise.id)} style={styles.removeBtn}>
                            <Trash2 size={16} color={colors.danger} />
                          </Pressable>
                        </View>
                      </View>
                      <View style={styles.configInputs}>
                        <NumberInput value={item.sets} onChange={(v) => updateSelected(item.exercise.id, 'sets', v)} min={1} max={10} label="Sets" />
                        <NumberInput value={item.reps} onChange={(v) => updateSelected(item.exercise.id, 'reps', v)} min={1} max={50} label="Reps" />
                        <NumberInput value={item.restSeconds} onChange={(v) => updateSelected(item.exercise.id, 'restSeconds', v)} min={30} max={300} step={15} label="Rest" suffix="s" />
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <Button label="Save Split" variant="primary" size="lg" fullWidth loading={saving} onPress={handleSave} />
            </View>
          </>
        )}
      </SafeAreaView>

      {/* Day Picker Modal */}
      <RNModal visible={dayPickerVisible} transparent animationType="fade" onRequestClose={() => setDayPickerVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setDayPickerVisible(false)}>
          <Pressable
            style={[styles.modalDialog, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Assign to Day
            </Text>
            {pendingExercise && (
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {pendingExercise.name}
              </Text>
            )}
            <View style={styles.dayGrid}>
              {Array.from({ length: numDays }, (_, i) => i + 1).map((d) => (
                <Pressable
                  key={d}
                  onPress={() => {
                    if (pendingExercise) {
                      // If already selected, update day; otherwise add
                      const existing = selected.find((s) => s.exercise.id === pendingExercise.id);
                      if (existing) {
                        updateSelected(pendingExercise.id, 'day', d);
                        setPendingExercise(null);
                        setDayPickerVisible(false);
                      } else {
                        confirmDay(d);
                      }
                    }
                  }}
                  style={[styles.dayGridBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
                >
                  <Text style={[styles.dayGridBtnText, { color: colors.text }]}>Day {d}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: TouchTarget.comfortable,
    height: TouchTarget.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  headerRight: { width: TouchTarget.comfortable },
  nextBtn: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, paddingHorizontal: Spacing.two },
  nameContent: {
    padding: Spacing.five,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  stepTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.heavy },
  stepSubtitle: { fontSize: FontSize.base, lineHeight: 22 },
  nameInput: {
    height: 52,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    fontSize: FontSize.lg,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  daysLabel: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  daysControl: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  dayBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, minWidth: 32, textAlign: 'center' },
  daysHint: { fontSize: FontSize.sm, lineHeight: 18 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginHorizontal: Spacing.five,
    marginVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: FontSize.base },
  categoryScroll: {
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  categoryPill: {
    paddingHorizontal: Spacing.four,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPillText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  exerciseList: { paddingHorizontal: Spacing.five, paddingBottom: Spacing.seven },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.two,
  },
  exerciseItemInfo: { flex: 1 },
  exerciseItemName: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  exerciseItemMeta: { fontSize: FontSize.sm, marginTop: 2 },
  dayBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  dayBadgeText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  empty: { textAlign: 'center', fontSize: FontSize.base, paddingVertical: Spacing.seven },
  configContent: {
    padding: Spacing.five,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  configDayHeader: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.two,
    marginTop: Spacing.three,
  },
  configCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  configCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  configExName: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  configCardActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  configDayBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  configDayBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  removeBtn: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  configInputs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  footer: { padding: Spacing.five, borderTopWidth: StyleSheet.hairlineWidth },
  // Day picker modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.six,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.six,
    gap: Spacing.four,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, textAlign: 'center' },
  modalSubtitle: { fontSize: FontSize.sm, textAlign: 'center' },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  dayGridBtn: {
    minWidth: 80,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayGridBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
});
