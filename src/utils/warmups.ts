import type { WarmupExercise } from '@/types';

const PUSH_WARMUP: WarmupExercise[] = [
  { name: 'Treadmill Walk', durationSeconds: 300, description: '5 minutes at comfortable pace' },
  { name: 'Arm Circles', durationSeconds: 60, description: '30 sec forward, 30 sec backward' },
  { name: 'Band Pull Apart', durationSeconds: 45, description: '15 reps with light resistance band' },
  { name: 'Shoulder Rotations', durationSeconds: 45, description: '10 rotations each arm' },
];

const PULL_WARMUP: WarmupExercise[] = [
  { name: 'Treadmill Walk', durationSeconds: 300, description: '5 minutes at comfortable pace' },
  { name: 'Scapular Pull-ups', durationSeconds: 60, description: '10 slow and controlled reps' },
  { name: 'Band Rows', durationSeconds: 45, description: '15 reps with light resistance band' },
  { name: 'Arm Circles', durationSeconds: 45, description: '30 sec forward, 30 sec backward' },
];

const LEGS_WARMUP: WarmupExercise[] = [
  { name: 'Walking', durationSeconds: 300, description: '5 minutes brisk walk' },
  { name: 'Hip Circles', durationSeconds: 60, description: '10 circles each direction per leg' },
  { name: 'Leg Swings', durationSeconds: 60, description: '10 swings per leg, front-to-back' },
  { name: 'Bodyweight Squats', durationSeconds: 60, description: '15 slow, controlled reps' },
];

const UPPER_WARMUP: WarmupExercise[] = [
  { name: 'Treadmill Walk', durationSeconds: 300, description: '5 minutes at comfortable pace' },
  { name: 'Arm Circles', durationSeconds: 60, description: '30 sec forward, 30 sec backward' },
  { name: 'Shoulder Rotations', durationSeconds: 45, description: '10 rotations each direction' },
  { name: 'Band Pull Apart', durationSeconds: 45, description: '15 reps' },
];

const FULL_WARMUP: WarmupExercise[] = [
  { name: 'Treadmill Walk', durationSeconds: 300, description: '5 minutes at comfortable pace' },
  { name: 'Arm Circles', durationSeconds: 60, description: '30 sec each direction' },
  { name: 'Hip Circles', durationSeconds: 60, description: '10 circles each direction' },
  { name: 'Bodyweight Squats', durationSeconds: 60, description: '15 slow reps' },
];

/**
 * Determine warmup exercises based on split name or muscle groups in session.
 * Falls back to full body warmup.
 */
export function getWarmupsForSplit(splitName: string): WarmupExercise[] {
  const lower = splitName.toLowerCase();
  if (lower.includes('push')) return PUSH_WARMUP;
  if (lower.includes('pull')) return PULL_WARMUP;
  if (lower.includes('leg') || lower.includes('lower')) return LEGS_WARMUP;
  if (lower.includes('upper') || lower.includes('chest') || lower.includes('back') || lower.includes('shoulder')) return UPPER_WARMUP;
  return FULL_WARMUP;
}

export function getWarmupsForDay(splitName: string, day: number): WarmupExercise[] {
  // PPL pattern
  if (splitName.toLowerCase().includes('push pull')) {
    if (day % 3 === 1) return PUSH_WARMUP;
    if (day % 3 === 2) return PULL_WARMUP;
    return LEGS_WARMUP;
  }
  // Upper Lower pattern
  if (splitName.toLowerCase().includes('upper lower') || splitName.toLowerCase().includes('phul')) {
    return day % 2 === 1 ? UPPER_WARMUP : LEGS_WARMUP;
  }
  return FULL_WARMUP;
}

export function totalWarmupDuration(warmups: WarmupExercise[]): number {
  return warmups.reduce((sum, w) => sum + w.durationSeconds, 0);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}
