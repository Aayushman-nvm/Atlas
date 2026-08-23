import { getDatabase } from '@/database/db';
import { completeSession, createSession, logSet } from '@/database/queries/sessions';
import { getSplitExercises } from '@/database/queries/splits';
import { useSettingsStore } from '@/store/settings-store';
import type { ActiveExercise, ActiveSet, ActiveWorkout } from '@/types';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { create } from 'zustand';

interface WorkoutStore {
  // Active workout state
  activeWorkout: ActiveWorkout | null;
  isRestTimerActive: boolean;
  restSecondsRemaining: number;
  restTimerInterval: ReturnType<typeof setInterval> | null;

  // Actions
  startWorkout: (splitId: string, day: number) => Promise<void>;
  completeSet: (exerciseIndex: number, setIndex: number, weight: number, reps: number) => Promise<void>;
  completeCurrentExercise: () => void;
  nextExercise: () => void;
  jumpToExercise: (index: number) => void;
  finishWorkout: () => Promise<string | null>;
  abandonWorkout: () => void;

  // Rest timer
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;

  // Workout manipulation (flexible mode)
  updateSetTarget: (exerciseIndex: number, sets: number, reps: number) => void;
}

/** Fire haptic feedback, gated by user setting, web-safe. */
function fireTimerEndFeedback() {
  if (Platform.OS === 'web') return;
  const { vibrationEnabled } = useSettingsStore.getState();
  if (!vibrationEnabled) return;
  // Three pulses — unmistakable rest-end signal
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    .then(() => new Promise<void>((r) => setTimeout(r, 200)))
    .then(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success))
    .then(() => new Promise<void>((r) => setTimeout(r, 200)))
    .then(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success))
    .catch(() => {});
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  activeWorkout: null,
  isRestTimerActive: false,
  restSecondsRemaining: 0,
  restTimerInterval: null,

  startWorkout: async (splitId, day) => {
    const db = await getDatabase();
    const splitExercises = await getSplitExercises(db, splitId, day);
    const sessionId = await createSession(db, splitId);

    const exercises: ActiveExercise[] = splitExercises.map((se) => ({
      splitExercise: se,
      sets: Array.from({ length: se.sets }, (_, i) => ({
        setNumber: i + 1,
        weight: 0,
        repsCompleted: 0,
        completed: false,
      })),
      completed: false,
    }));

    set({
      activeWorkout: {
        sessionId,
        splitId,
        startTime: Date.now(),
        currentExerciseIndex: 0,
        warmupCompleted: false,
        exercises,
      },
    });
  },

  completeSet: async (exerciseIndex, setIndex, weight, reps) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const db = await getDatabase();
    const exercise = activeWorkout.exercises[exerciseIndex];
    if (!exercise) return;

    await logSet(
      db,
      activeWorkout.sessionId,
      exercise.splitExercise.exerciseId,
      setIndex + 1,
      weight,
      reps
    );

    const updatedExercises = activeWorkout.exercises.map((ex, eIdx) => {
      if (eIdx !== exerciseIndex) return ex;
      const updatedSets = ex.sets.map((s, sIdx) =>
        sIdx === setIndex ? { ...s, weight, repsCompleted: reps, completed: true } : s
      );
      const allSetsCompleted = updatedSets.every((s) => s.completed);
      return { ...ex, sets: updatedSets, completed: allSetsCompleted };
    });

    set({ activeWorkout: { ...activeWorkout, exercises: updatedExercises } });

    // Tap feedback when marking a set done
    if (Platform.OS !== 'web' && useSettingsStore.getState().vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }

    // Start rest timer
    const restSeconds = exercise.splitExercise.restSeconds;
    get().startRestTimer(restSeconds);
  },

  completeCurrentExercise: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    const updatedExercises = activeWorkout.exercises.map((ex, idx) =>
      idx === activeWorkout.currentExerciseIndex ? { ...ex, completed: true } : ex
    );
    set({ activeWorkout: { ...activeWorkout, exercises: updatedExercises } });
  },

  nextExercise: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    const next = Math.min(activeWorkout.currentExerciseIndex + 1, activeWorkout.exercises.length - 1);
    set({ activeWorkout: { ...activeWorkout, currentExerciseIndex: next } });
  },

  jumpToExercise: (index) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    if (index < 0 || index >= activeWorkout.exercises.length) return;
    set({ activeWorkout: { ...activeWorkout, currentExerciseIndex: index } });
  },

  finishWorkout: async () => {
    const { activeWorkout, stopRestTimer } = get();
    if (!activeWorkout) return null;
    stopRestTimer();
    const db = await getDatabase();
    await completeSession(db, activeWorkout.sessionId);
    const sessionId = activeWorkout.sessionId;
    set({ activeWorkout: null });
    return sessionId;
  },

  abandonWorkout: () => {
    get().stopRestTimer();
    set({ activeWorkout: null });
  },

  startRestTimer: (seconds) => {
    get().stopRestTimer();
    set({ isRestTimerActive: true, restSecondsRemaining: seconds });

    const interval = setInterval(() => {
      const { restSecondsRemaining } = get();
      if (restSecondsRemaining <= 1) {
        // Timer done — fire feedback before clearing
        fireTimerEndFeedback();
        get().stopRestTimer();
      } else {
        set({ restSecondsRemaining: restSecondsRemaining - 1 });
      }
    }, 1000);

    set({ restTimerInterval: interval });
  },

  stopRestTimer: () => {
    const { restTimerInterval } = get();
    if (restTimerInterval) clearInterval(restTimerInterval);
    set({ isRestTimerActive: false, restSecondsRemaining: 0, restTimerInterval: null });
  },

  updateSetTarget: (exerciseIndex, sets, reps) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const updatedExercises = activeWorkout.exercises.map((ex, idx) => {
      if (idx !== exerciseIndex) return ex;
      const newSets: ActiveSet[] = Array.from({ length: sets }, (_, i) => {
        const existing = ex.sets[i];
        return existing ?? {
          setNumber: i + 1,
          weight: 0,
          repsCompleted: reps,
          completed: false,
        };
      });
      return {
        ...ex,
        sets: newSets,
        splitExercise: { ...ex.splitExercise, sets, reps },
      };
    });

    set({ activeWorkout: { ...activeWorkout, exercises: updatedExercises } });
  },
}));
