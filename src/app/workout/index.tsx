import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import { NumberInput } from '@/components/ui/number-input';
import {
    FontSize,
    FontWeight,
    MaxContentWidth,
    Radius,
    Spacing,
    TouchTarget,
} from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { getLastPerformance } from '@/database/queries/sessions';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/store/settings-store';
import { useWorkoutStore } from '@/store/workout-store';
import { formatElapsedTime, formatRestTimer, formatWeight } from '@/utils/format';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Circle,
    ExternalLink,
    LayoutList,
    Timer,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Pressable,
    Modal as RNModal,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutScreen() {
  const colors = useTheme();
  const {
    activeWorkout,
    isRestTimerActive,
    restSecondsRemaining,
    completeSet,
    nextExercise,
    jumpToExercise,
    finishWorkout,
    abandonWorkout,
    stopRestTimer,
    updateSetTarget,
  } = useWorkoutStore();
  const { strictMode, units } = useSettingsStore();

  const [showOverview, setShowOverview] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSets, setEditSets] = useState(3);
  const [editReps, setEditReps] = useState(10);
  const [lastPerf, setLastPerf] = useState<{ weight: number; reps: number; date: number } | null>(null);
  const [elapsed, setElapsed] = useState('0:00');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const exerciseIdx = activeWorkout?.currentExerciseIndex ?? 0;
  const currentEntry = activeWorkout?.exercises[exerciseIdx];
  const exercise = currentEntry?.splitExercise.exercise;

  useEffect(() => {
    if (!activeWorkout) {
      router.replace('/' as any);
    }
  }, [activeWorkout]);

  useEffect(() => {
    if (!activeWorkout) return;
    timerRef.current = setInterval(() => {
      setElapsed(formatElapsedTime(activeWorkout.startTime));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeWorkout?.startTime]);

  useEffect(() => {
    if (!exercise) return;
    setLastPerf(null);
    getDatabase().then((db) =>
      getLastPerformance(db, exercise.id).then(setLastPerf)
    );
  }, [exercise?.id]);

  if (!activeWorkout || !currentEntry || !exercise) return null;

  const totalExercises = activeWorkout.exercises.length;
  const progress = (exerciseIdx + 1) / totalExercises;
  const nextEntry = activeWorkout.exercises[exerciseIdx + 1];
  const canJump = strictMode === 'flexible';
  const canEdit = strictMode !== 'super_strict';

  async function handleCompleteSet(setIdx: number, weight: number, reps: number) {
    await completeSet(exerciseIdx, setIdx, weight, reps);
  }

  function handleNextExercise() {
    if (strictMode === 'flexible') {
      setShowSkipModal(true);
    } else {
      nextExercise();
    }
  }

  async function handleFinish() {
    const sessionId = await finishWorkout();
    if (sessionId) {
      router.replace({ pathname: '/workout/complete' as any, params: { sessionId } });
    }
  }

  function handleTutorial() {
    if (exercise?.tutorialUrl) {
      WebBrowser.openBrowserAsync(exercise.tutorialUrl);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top bar */}
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <Pressable
            onPress={() => setShowAbandonModal(true)}
            style={({ pressed }) => [styles.topBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ChevronLeft size={24} color={colors.textSecondary} />
          </Pressable>

          <View style={styles.topCenter}>
            <Text style={[styles.elapsed, { color: colors.text }]}>{elapsed}</Text>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {exerciseIdx + 1} / {totalExercises}
            </Text>
          </View>

          <Pressable
            onPress={() => setShowOverview(!showOverview)}
            style={({ pressed }) => [styles.topBtn, { opacity: pressed ? 0.6 : 1 }]}
            accessibilityLabel="Toggle overview"
          >
            <LayoutList size={22} color={showOverview ? colors.primary : colors.textSecondary} />
          </Pressable>
        </View>

        {/* Progress bar */}
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>

        {showOverview ? (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.overviewContent}>
              <Text style={[styles.overviewTitle, { color: colors.text }]}>
                Workout Overview
              </Text>
              {activeWorkout.exercises.map((entry, idx) => {
                const ex = entry.splitExercise.exercise;
                const isActive = idx === exerciseIdx;
                return (
                  <Pressable
                    key={entry.splitExercise.id}
                    onPress={() => {
                      if (canJump) {
                        jumpToExercise(idx);
                        setShowOverview(false);
                      }
                    }}
                    style={[
                      styles.overviewRow,
                      {
                        backgroundColor: isActive
                          ? colors.primaryMuted
                          : colors.backgroundElement,
                        borderColor: isActive ? colors.primary : colors.border,
                        opacity:
                          !canJump && !isActive && !entry.completed ? 0.5 : 1,
                      },
                    ]}
                  >
                    <View style={styles.overviewLeft}>
                      {entry.completed ? (
                        <CheckCircle2 size={22} color={colors.success} />
                      ) : isActive ? (
                        <View
                          style={[
                            styles.activeDot,
                            { backgroundColor: colors.primary },
                          ]}
                        />
                      ) : (
                        <Circle size={22} color={colors.border} />
                      )}
                    </View>
                    <View style={styles.overviewInfo}>
                      <Text
                        style={[
                          styles.overviewExName,
                          {
                            color: isActive
                              ? colors.primary
                              : entry.completed
                              ? colors.textTertiary
                              : colors.text,
                            fontWeight: isActive
                              ? FontWeight.bold
                              : FontWeight.medium,
                            textDecorationLine: entry.completed
                              ? 'line-through'
                              : 'none',
                          },
                        ]}
                      >
                        {ex?.name ?? '—'}
                      </Text>
                      <Text
                        style={[
                          styles.overviewMeta,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {entry.splitExercise.sets} × {entry.splitExercise.reps}
                      </Text>
                    </View>
                    {canJump && !entry.completed && (
                      <ChevronRight
                        size={18}
                        color={
                          isActive ? colors.primary : colors.textSecondary
                        }
                      />
                    )}
                  </Pressable>
                );
              })}
              <Button
                label="Back to Focus"
                variant="primary"
                size="md"
                fullWidth
                onPress={() => setShowOverview(false)}
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.focusContent}>
              {/* Exercise header */}
              <View style={styles.exHeader}>
                <View style={styles.exTitleRow}>
                  <Text style={[styles.exName, { color: colors.text }]}>
                    {exercise.name}
                  </Text>
                  {exercise.tutorialUrl ? (
                    <Pressable
                      onPress={handleTutorial}
                      style={styles.tutorialBtn}
                    >
                      <ExternalLink size={18} color={colors.primary} />
                    </Pressable>
                  ) : null}
                </View>
                <Text style={[styles.exMeta, { color: colors.textSecondary }]}>
                  {exercise.muscleGroup} · {exercise.equipment}
                </Text>
                {canEdit && (
                  <Pressable
                    onPress={() => {
                      setEditSets(currentEntry.splitExercise.sets);
                      setEditReps(currentEntry.splitExercise.reps);
                      setShowEditModal(true);
                    }}
                  >
                    <Text
                      style={[styles.editLink, { color: colors.primary }]}
                    >
                      Edit sets & reps
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Previous performance */}
              {lastPerf && (
                <Card padding={Spacing.four} style={styles.prevCard}>
                  <Text
                    style={[styles.prevLabel, { color: colors.textSecondary }]}
                  >
                    Last time
                  </Text>
                  <Text style={[styles.prevValue, { color: colors.text }]}>
                    {formatWeight(lastPerf.weight, units)} × {lastPerf.reps}{' '}
                    reps
                  </Text>
                </Card>
              )}

              {/* Sets */}
              <View style={styles.setsContainer}>
                {currentEntry.sets.map((s, setIdx) => (
                  <SetRow
                    key={setIdx}
                    setNumber={s.setNumber}
                    targetReps={currentEntry.splitExercise.reps}
                    defaultWeight={lastPerf?.weight ?? 0}
                    completed={s.completed}
                    weight={s.weight}
                    repsCompleted={s.repsCompleted}
                    onComplete={(w, r) => handleCompleteSet(setIdx, w, r)}
                  />
                ))}
              </View>

              {/* Rest Timer */}
              {isRestTimerActive && (
                <Card style={styles.restCard} padding={Spacing.five}>
                  <View style={styles.restRow}>
                    <Timer size={20} color={colors.timerActive} />
                    <Text
                      style={[
                        styles.restLabel,
                        { color: colors.timerActive },
                      ]}
                    >
                      Rest
                    </Text>
                    <Text
                      style={[
                        styles.restValue,
                        { color: colors.timerActive },
                      ]}
                    >
                      {formatRestTimer(restSecondsRemaining)}
                    </Text>
                    <Pressable onPress={stopRestTimer}>
                      <Text
                        style={[
                          styles.restSkip,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Skip
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              )}

              {/* Notes */}
              {exercise.notes ? (
                <Text style={[styles.notes, { color: colors.textTertiary }]}>
                  💡 {exercise.notes}
                </Text>
              ) : null}

              {/* Next exercise preview */}
              {nextEntry?.splitExercise.exercise && (
                <View
                  style={[
                    styles.nextPreview,
                    {
                      backgroundColor: colors.backgroundElement,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.nextLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Up next
                  </Text>
                  <Text style={[styles.nextName, { color: colors.text }]}>
                    {nextEntry.splitExercise.exercise.name}
                  </Text>
                  <Text
                    style={[
                      styles.nextMeta,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {nextEntry.splitExercise.sets} ×{' '}
                    {nextEntry.splitExercise.reps}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}

        {/* Bottom CTA */}
        {!showOverview && (
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            {exerciseIdx < totalExercises - 1 ? (
              <Button
                label={
                  currentEntry.completed
                    ? 'Next Exercise'
                    : 'Skip Exercise'
                }
                variant={currentEntry.completed ? 'primary' : 'secondary'}
                size="lg"
                fullWidth
                onPress={
                  currentEntry.completed
                    ? () => nextExercise()
                    : handleNextExercise
                }
                rightIcon={
                  <ChevronRight
                    size={20}
                    color={currentEntry.completed ? '#FFF' : colors.text}
                  />
                }
              />
            ) : (
              <Button
                label="Finish Workout"
                variant="success"
                size="lg"
                fullWidth
                onPress={handleFinish}
              />
            )}
          </View>
        )}
      </SafeAreaView>

      <ConfirmModal
        visible={showAbandonModal}
        title="End Workout?"
        message="Your progress will not be saved."
        confirmLabel="End Workout"
        cancelLabel="Keep Going"
        destructive
        onConfirm={() => {
          setShowAbandonModal(false);
          abandonWorkout();
          router.replace('/(tabs)');
        }}
        onCancel={() => setShowAbandonModal(false)}
      />

      <ConfirmModal
        visible={showSkipModal}
        title="Skip Exercise?"
        message="This may affect today's workout."
        confirmLabel="Skip"
        cancelLabel="Cancel"
        onConfirm={() => {
          setShowSkipModal(false);
          nextExercise();
        }}
        onCancel={() => setShowSkipModal(false)}
      />

      <EditSetsModal
        visible={showEditModal}
        sets={editSets}
        reps={editReps}
        onSets={setEditSets}
        onReps={setEditReps}
        onConfirm={() => {
          updateSetTarget(exerciseIdx, editSets, editReps);
          setShowEditModal(false);
        }}
        onCancel={() => setShowEditModal(false)}
      />
    </View>
  );
}

// ─── Set Row ──────────────────────────────────────────────────────────────────

interface SetRowProps {
  setNumber: number;
  targetReps: number;
  defaultWeight: number;
  completed: boolean;
  weight: number;
  repsCompleted: number;
  onComplete: (weight: number, reps: number) => void;
}

function SetRow({
  setNumber,
  targetReps,
  defaultWeight,
  completed,
  weight: savedWeight,
  repsCompleted: savedReps,
  onComplete,
}: SetRowProps) {
  const colors = useTheme();
  const [w, setW] = useState(savedWeight || defaultWeight);
  const [r, setR] = useState(savedReps || targetReps);

  return (
    <View
      style={[
        styles.setRow,
        {
          backgroundColor: completed
            ? colors.successMuted
            : colors.backgroundElement,
          borderColor: completed ? colors.success : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.setNum,
          { color: completed ? colors.success : colors.textSecondary },
        ]}
      >
        {setNumber}
      </Text>

      <View style={styles.setInputs}>
        <NumberInput
          value={w}
          onChange={setW}
          min={0}
          max={500}
          step={2.5}
          label="kg"
        />
        <NumberInput
          value={r}
          onChange={setR}
          min={1}
          max={100}
          step={1}
          label="reps"
        />
      </View>

      <Pressable
        onPress={() => !completed && onComplete(w, r)}
        disabled={completed}
        style={({ pressed }) => [
          styles.setCheckBtn,
          {
            backgroundColor: completed ? colors.success : colors.primary,
            opacity: completed ? 1 : pressed ? 0.8 : 1,
          },
        ]}
        accessibilityLabel={completed ? 'Set completed' : 'Complete set'}
      >
        <CheckCircle2 size={22} color="#FFF" />
      </Pressable>
    </View>
  );
}

// ─── Edit Sets Modal ──────────────────────────────────────────────────────────

interface EditSetsModalProps {
  visible: boolean;
  sets: number;
  reps: number;
  onSets: (v: number) => void;
  onReps: (v: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function EditSetsModal({
  visible,
  sets,
  reps,
  onSets,
  onReps,
  onConfirm,
  onCancel,
}: EditSetsModalProps) {
  const colors = useTheme();
  const { strictMode } = useSettingsStore();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={editStyles.backdrop} onPress={onCancel}>
        <Pressable
          style={[
            editStyles.dialog,
            {
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[editStyles.title, { color: colors.text }]}>
            Edit Sets & Reps
          </Text>
          {strictMode === 'strict' && (
            <Text style={[editStyles.warning, { color: colors.warning }]}>
              You are changing today's planned workout.
            </Text>
          )}
          <View style={editStyles.inputs}>
            <NumberInput value={sets} onChange={onSets} min={1} max={10} label="Sets" />
            <NumberInput value={reps} onChange={onReps} min={1} max={50} label="Reps" />
          </View>
          <View style={editStyles.actions}>
            <Button
              label="Cancel"
              variant="secondary"
              size="md"
              fullWidth
              onPress={onCancel}
            />
            <Button
              label="Save"
              variant="primary"
              size="md"
              fullWidth
              onPress={onConfirm}
            />
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const editStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.six,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.six,
    gap: Spacing.five,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  warning: { fontSize: FontSize.sm, textAlign: 'center' },
  inputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.seven,
  },
  actions: { flexDirection: 'row', gap: Spacing.three },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topBtn: {
    width: TouchTarget.comfortable,
    height: TouchTarget.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCenter: { flex: 1, alignItems: 'center' },
  elapsed: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  progressText: { fontSize: FontSize.sm },
  progressBar: { height: 3 },
  progressFill: { height: 3 },
  scroll: { flexGrow: 1 },
  focusContent: {
    flex: 1,
    padding: Spacing.five,
    gap: Spacing.five,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  overviewContent: {
    padding: Spacing.five,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  overviewTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
    marginBottom: Spacing.two,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  overviewLeft: { width: 28, alignItems: 'center' },
  activeDot: { width: 12, height: 12, borderRadius: Radius.full },
  overviewInfo: { flex: 1 },
  overviewExName: { fontSize: FontSize.base },
  overviewMeta: { fontSize: FontSize.sm, marginTop: 2 },
  exHeader: { gap: Spacing.one },
  exTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  exName: {
    flex: 1,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.heavy,
    lineHeight: 32,
  },
  tutorialBtn: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  exMeta: { fontSize: FontSize.sm },
  editLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginTop: Spacing.one,
  },
  prevCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  prevLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  prevValue: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  setsContainer: { gap: Spacing.three },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  setNum: {
    width: 28,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
    textAlign: 'center',
  },
  setInputs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  setCheckBtn: {
    width: TouchTarget.comfortable,
    height: TouchTarget.comfortable,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restCard: {},
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  restLabel: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  restValue: {
    flex: 1,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.heavy,
    fontVariant: ['tabular-nums'],
  },
  restSkip: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  notes: { fontSize: FontSize.sm, lineHeight: 20 },
  nextPreview: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.one,
  },
  nextLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  nextMeta: { fontSize: FontSize.sm },
  footer: {
    padding: Spacing.five,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
