// ─── Exercise ────────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Forearms'
  | 'Quads' | 'Hamstrings' | 'Glutes' | 'Calves'
  | 'Abs' | 'Obliques'
  | 'Cardio' | 'Full Body';

export type ExerciseCategory = 'Upper Body' | 'Lower Body' | 'Core' | 'Cardio' | 'Warmup';

export type Equipment =
  | 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight'
  | 'Resistance Band' | 'Kettlebell' | 'Treadmill' | 'None';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  subCategory: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  tutorialUrl: string;
  difficulty: Difficulty;
  notes: string;
}

// ─── Split ────────────────────────────────────────────────────────────────────

export interface Split {
  id: string;
  name: string;
  description?: string;
  isPreset: boolean;
}

export interface SplitExercise {
  id: string;
  splitId: string;
  exerciseId: string;
  day: number;         // 1-based day number within the split
  order: number;       // position within the day
  sets: number;
  reps: number;
  restSeconds: number;
  // joined
  exercise?: Exercise;
}

// ─── Workout Session ─────────────────────────────────────────────────────────

export interface WorkoutSession {
  id: string;
  splitId: string;
  startTime: number;   // unix ms
  endTime: number | null;
  duration: number | null; // seconds
  // joined
  split?: Split;
}

export interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  repsCompleted: number;
  completedAt: number; // unix ms
}

// ─── Settings ────────────────────────────────────────────────────────────────

export type ThemePreference = 'light' | 'dark' | 'system';
export type StrictnessLevel = 'flexible' | 'strict' | 'super_strict';
export type WeightUnit = 'kg' | 'lb';

export interface Settings {
  theme: ThemePreference;
  strictMode: StrictnessLevel;
  units: WeightUnit;
  defaultRestSeconds: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

// ─── Active Workout State ─────────────────────────────────────────────────────

export interface ActiveSet {
  setNumber: number;
  weight: number;
  repsCompleted: number;
  completed: boolean;
}

export interface ActiveExercise {
  splitExercise: SplitExercise;
  sets: ActiveSet[];
  completed: boolean;
}

export interface ActiveWorkout {
  sessionId: string;
  splitId: string;
  startTime: number;
  currentExerciseIndex: number;
  warmupCompleted: boolean;
  exercises: ActiveExercise[];
}

// ─── Warmup ───────────────────────────────────────────────────────────────────

export interface WarmupExercise {
  name: string;
  durationSeconds: number;
  description: string;
}
