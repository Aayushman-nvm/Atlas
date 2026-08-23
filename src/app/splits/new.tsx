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
import { CheckCircle2, ChevronLeft, Circle, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Step = 'name' | 'exercises' | 'configure';

const CATEGORIES: ExerciseCategory[] = [
  'Upper Body', 'Lower Body', 'Core', 'Cardio',
];

interface SelectedExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  restSeconds: number;
}

export default function NewSplitScreen() {
  const colors = useTheme();
  const [step, setStep] = useState<Step>('name');
  const [splitName, setSplitName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory>('Upper Body');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, selectedCategory, searchQuery]);

  async function loadExercises() {
    const db = await getDatabase();
    const all = await getAllExercises(db);
    // Exclude warmups from selection
    setExercises(all.filter((e) => e.category !== 'Warmup'));
  }

  function filterExercises() {
    let filtered = exercises.filter((e) => e.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.muscleGroup.toLowerCase().includes(q)
      );
    }
    setFilteredExercises(filtered);
  }

  function toggleExercise(ex: Exercise) {
    setSelected((prev) => {
      const exists = prev.find((s) => s.exercise.id === ex.id);
      if (exists) {
        return prev.filter((s) => s.exercise.id !== ex.id);
      }
      return [...prev, { exercise: ex, sets: 3, reps: 10, restSeconds: 90 }];
    });
  }

  function isSelected(id: string) {
    return selected.some((s) => s.exercise.id === id);
  }

  function updateSelected(id: string, key: 'sets' | 'reps' | 'restSeconds', value: number) {
    setSelected((prev) =>
      prev.map((s) =>
        s.exercise.id === id ? { ...s, [key]: value } : s
      )
    );
  }

  async function handleSave() {
    if (!splitName.trim() || selected.length === 0) return;
    setSaving(true);
    try {
      const db = await getDatabase();
      const splitId = await createSplit(db, splitName.trim());
      for (const [idx, item] of selected.entries()) {
        await addExerciseToSplit(
          db,
          splitId,
          item.exercise.id,
          1,
          item.sets,
          item.reps,
          item.restSeconds
        );
      }
      router.replace({ pathname: '/splits/[id]' as any, params: { id: splitId } });
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable
            onPress={() => step === 'name' ? router.back() : setStep(step === 'configure' ? 'exercises' : 'name')}
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
        </View>

        {step === 'name' && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex}
          >
            <ScrollView contentContainerStyle={styles.nameContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                Name your split
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Give your workout plan a name.
              </Text>
              <TextInput
                value={splitName}
                onChangeText={setSplitName}
                placeholder="e.g. My PPL Split"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.nameInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.backgroundElement,
                    borderColor: colors.border,
                  },
                ]}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => splitName.trim() && setStep('exercises')}
              />
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

        {step === 'exercises' && (
          <View style={styles.flex}>
            {/* Search */}
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

            {/* Category pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor:
                        cat === selectedCategory
                          ? colors.primary
                          : colors.backgroundElement,
                      borderColor:
                        cat === selectedCategory ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      {
                        color:
                          cat === selectedCategory ? '#FFF' : colors.textSecondary,
                      },
                    ]}
                  >
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
                return (
                  <Pressable
                    onPress={() => toggleExercise(item)}
                    style={[
                      styles.exerciseItem,
                      {
                        backgroundColor: sel
                          ? colors.primaryMuted
                          : colors.backgroundElement,
                        borderColor: sel ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {sel ? (
                      <CheckCircle2 size={22} color={colors.primary} />
                    ) : (
                      <Circle size={22} color={colors.border} />
                    )}
                    <View style={styles.exerciseItemInfo}>
                      <Text
                        style={[
                          styles.exerciseItemName,
                          { color: sel ? colors.primary : colors.text },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.exerciseItemMeta,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item.muscleGroup} · {item.equipment}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={() => (
                <Text style={[styles.empty, { color: colors.textTertiary }]}>
                  No exercises found
                </Text>
              )}
            />
          </View>
        )}

        {step === 'configure' && (
          <ScrollView contentContainerStyle={styles.configContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Configure exercises
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Set sets, reps, and rest for each exercise.
            </Text>
            {selected.map((item) => (
              <View
                key={item.exercise.id}
                style={[
                  styles.configCard,
                  {
                    backgroundColor: colors.backgroundElement,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.configExName, { color: colors.text }]}>
                  {item.exercise.name}
                </Text>
                <View style={styles.configInputs}>
                  <NumberInput
                    value={item.sets}
                    onChange={(v) => updateSelected(item.exercise.id, 'sets', v)}
                    min={1}
                    max={10}
                    label="Sets"
                  />
                  <NumberInput
                    value={item.reps}
                    onChange={(v) => updateSelected(item.exercise.id, 'reps', v)}
                    min={1}
                    max={50}
                    label="Reps"
                  />
                  <NumberInput
                    value={item.restSeconds}
                    onChange={(v) => updateSelected(item.exercise.id, 'restSeconds', v)}
                    min={30}
                    max={300}
                    step={15}
                    label="Rest"
                    suffix="s"
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {step === 'configure' && (
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              label="Save Split"
              variant="primary"
              size="lg"
              fullWidth
              loading={saving}
              onPress={handleSave}
            />
          </View>
        )}
      </SafeAreaView>
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
    gap: Spacing.two,
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
  nextBtn: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, paddingHorizontal: Spacing.two },
  nameContent: {
    padding: Spacing.five,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  stepTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.heavy },
  stepSubtitle: { fontSize: FontSize.base },
  nameInput: {
    height: 52,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    fontSize: FontSize.lg,
  },
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
  exerciseList: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.seven,
  },
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
  empty: { textAlign: 'center', fontSize: FontSize.base, paddingVertical: Spacing.seven },
  configContent: {
    padding: Spacing.five,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  configCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.four,
  },
  configExName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  configInputs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Spacing.four,
  },
  footer: {
    padding: Spacing.five,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
