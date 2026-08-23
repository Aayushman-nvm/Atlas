/**
 * Preset splits seeded on first launch.
 * Each entry defines the split metadata + its exercises per day.
 */

interface PresetSplitExercise {
  exerciseId: string;
  day: number;
  order: number;
  sets: number;
  reps: number;
  restSeconds: number;
}

interface PresetSplit {
  id: string;
  name: string;
  description: string;
  exercises: PresetSplitExercise[];
}

export const PRESET_SPLITS: PresetSplit[] = [
  // ─── Push Pull Legs ───────────────────────────────────────────────────────
  {
    id: 'split-ppl',
    name: 'Push Pull Legs',
    description: 'Classic 3-day split. Push, Pull, and Legs days. Great for intermediate lifters.',
    exercises: [
      // Push (Day 1)
      { exerciseId: 'ch-bench-press',    day: 1, order: 1, sets: 4, reps: 8,  restSeconds: 120 },
      { exerciseId: 'ch-incline-bench',  day: 1, order: 2, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'sh-db-press',       day: 1, order: 3, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'sh-lateral-raise',  day: 1, order: 4, sets: 3, reps: 15, restSeconds: 60  },
      { exerciseId: 'tr-pushdown',       day: 1, order: 5, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'tr-overhead-ext',   day: 1, order: 6, sets: 3, reps: 12, restSeconds: 60  },
      // Pull (Day 2)
      { exerciseId: 'ba-deadlift',       day: 2, order: 1, sets: 4, reps: 5,  restSeconds: 180 },
      { exerciseId: 'ba-pullup',         day: 2, order: 2, sets: 3, reps: 8,  restSeconds: 120 },
      { exerciseId: 'ba-cable-row',      day: 2, order: 3, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'ba-face-pull',      day: 2, order: 4, sets: 3, reps: 15, restSeconds: 60  },
      { exerciseId: 'bi-barbell-curl',   day: 2, order: 5, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'bi-hammer-curl',    day: 2, order: 6, sets: 3, reps: 12, restSeconds: 60  },
      // Legs (Day 3)
      { exerciseId: 'qu-squat',          day: 3, order: 1, sets: 4, reps: 6,  restSeconds: 180 },
      { exerciseId: 'qu-leg-press',      day: 3, order: 2, sets: 3, reps: 10, restSeconds: 120 },
      { exerciseId: 'ha-rdl',            day: 3, order: 3, sets: 3, reps: 10, restSeconds: 120 },
      { exerciseId: 'ha-leg-curl',       day: 3, order: 4, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'ca-standing-raise', day: 3, order: 5, sets: 4, reps: 15, restSeconds: 60  },
    ],
  },

  // ─── Upper Lower ──────────────────────────────────────────────────────────
  {
    id: 'split-upper-lower',
    name: 'Upper Lower',
    description: '4-day split alternating upper and lower body. Good frequency with recovery time.',
    exercises: [
      // Upper A (Day 1)
      { exerciseId: 'ch-bench-press',   day: 1, order: 1, sets: 4, reps: 8,  restSeconds: 120 },
      { exerciseId: 'ba-row',           day: 1, order: 2, sets: 4, reps: 8,  restSeconds: 120 },
      { exerciseId: 'sh-ohp',           day: 1, order: 3, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'ba-lat-pulldown',  day: 1, order: 4, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'bi-db-curl',       day: 1, order: 5, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'tr-pushdown',      day: 1, order: 6, sets: 3, reps: 12, restSeconds: 60  },
      // Lower A (Day 2)
      { exerciseId: 'qu-squat',         day: 2, order: 1, sets: 4, reps: 6,  restSeconds: 180 },
      { exerciseId: 'ha-rdl',           day: 2, order: 2, sets: 3, reps: 10, restSeconds: 120 },
      { exerciseId: 'qu-leg-press',     day: 2, order: 3, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'ha-leg-curl',      day: 2, order: 4, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'ca-standing-raise',day: 2, order: 5, sets: 4, reps: 15, restSeconds: 60  },
      // Upper B (Day 3)
      { exerciseId: 'ch-incline-bench', day: 3, order: 1, sets: 4, reps: 8,  restSeconds: 120 },
      { exerciseId: 'ba-db-row',        day: 3, order: 2, sets: 4, reps: 10, restSeconds: 90  },
      { exerciseId: 'sh-db-press',      day: 3, order: 3, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'ba-cable-row',     day: 3, order: 4, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'bi-hammer-curl',   day: 3, order: 5, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'tr-skullcrusher',  day: 3, order: 6, sets: 3, reps: 10, restSeconds: 60  },
      // Lower B (Day 4)
      { exerciseId: 'ha-sumo-dl',       day: 4, order: 1, sets: 4, reps: 5,  restSeconds: 180 },
      { exerciseId: 'qu-hack-squat',    day: 4, order: 2, sets: 3, reps: 10, restSeconds: 120 },
      { exerciseId: 'gl-hip-thrust',    day: 4, order: 3, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'ha-seated-curl',   day: 4, order: 4, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'ca-seated-raise',  day: 4, order: 5, sets: 4, reps: 15, restSeconds: 60  },
    ],
  },

  // ─── Bro Split ────────────────────────────────────────────────────────────
  {
    id: 'split-bro',
    name: 'Bro Split',
    description: '5-day split. One muscle group per day. Classic gym approach.',
    exercises: [
      // Chest (Day 1)
      { exerciseId: 'ch-bench-press',    day: 1, order: 1, sets: 4, reps: 8,  restSeconds: 120 },
      { exerciseId: 'ch-incline-bench',  day: 1, order: 2, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'ch-db-bench',       day: 1, order: 3, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'ch-cable-flye',     day: 1, order: 4, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'ch-dips',           day: 1, order: 5, sets: 3, reps: 10, restSeconds: 90  },
      // Back (Day 2)
      { exerciseId: 'ba-deadlift',       day: 2, order: 1, sets: 4, reps: 5,  restSeconds: 180 },
      { exerciseId: 'ba-pullup',         day: 2, order: 2, sets: 4, reps: 8,  restSeconds: 120 },
      { exerciseId: 'ba-row',            day: 2, order: 3, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'ba-lat-pulldown',   day: 2, order: 4, sets: 3, reps: 10, restSeconds: 90  },
      { exerciseId: 'ba-face-pull',      day: 2, order: 5, sets: 3, reps: 15, restSeconds: 60  },
      // Shoulders (Day 3)
      { exerciseId: 'sh-ohp',            day: 3, order: 1, sets: 4, reps: 8,  restSeconds: 120 },
      { exerciseId: 'sh-lateral-raise',  day: 3, order: 2, sets: 4, reps: 15, restSeconds: 60  },
      { exerciseId: 'sh-front-raise',    day: 3, order: 3, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'sh-rear-delt',      day: 3, order: 4, sets: 3, reps: 15, restSeconds: 60  },
      // Arms (Day 4)
      { exerciseId: 'bi-barbell-curl',   day: 4, order: 1, sets: 4, reps: 10, restSeconds: 60  },
      { exerciseId: 'tr-skullcrusher',   day: 4, order: 2, sets: 4, reps: 10, restSeconds: 60  },
      { exerciseId: 'bi-incline-curl',   day: 4, order: 3, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'tr-pushdown',       day: 4, order: 4, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'bi-hammer-curl',    day: 4, order: 5, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'tr-overhead-ext',   day: 4, order: 6, sets: 3, reps: 12, restSeconds: 60  },
      // Legs (Day 5)
      { exerciseId: 'qu-squat',          day: 5, order: 1, sets: 4, reps: 8,  restSeconds: 180 },
      { exerciseId: 'qu-leg-press',      day: 5, order: 2, sets: 3, reps: 10, restSeconds: 120 },
      { exerciseId: 'ha-rdl',            day: 5, order: 3, sets: 3, reps: 10, restSeconds: 120 },
      { exerciseId: 'ha-leg-curl',       day: 5, order: 4, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'gl-hip-thrust',     day: 5, order: 5, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'ca-standing-raise', day: 5, order: 6, sets: 4, reps: 15, restSeconds: 60  },
    ],
  },

  // ─── PHUL ─────────────────────────────────────────────────────────────────
  {
    id: 'split-phul',
    name: 'PHUL',
    description: 'Power Hypertrophy Upper Lower. 4-day strength + size focus.',
    exercises: [
      // Power Upper (Day 1)
      { exerciseId: 'ch-bench-press',   day: 1, order: 1, sets: 4, reps: 3,  restSeconds: 180 },
      { exerciseId: 'ba-row',           day: 1, order: 2, sets: 4, reps: 3,  restSeconds: 180 },
      { exerciseId: 'sh-ohp',           day: 1, order: 3, sets: 3, reps: 5,  restSeconds: 120 },
      { exerciseId: 'ba-pullup',        day: 1, order: 4, sets: 3, reps: 6,  restSeconds: 120 },
      { exerciseId: 'bi-barbell-curl',  day: 1, order: 5, sets: 3, reps: 8,  restSeconds: 60  },
      { exerciseId: 'tr-skullcrusher',  day: 1, order: 6, sets: 3, reps: 8,  restSeconds: 60  },
      // Power Lower (Day 2)
      { exerciseId: 'qu-squat',         day: 2, order: 1, sets: 5, reps: 3,  restSeconds: 240 },
      { exerciseId: 'ba-deadlift',      day: 2, order: 2, sets: 4, reps: 3,  restSeconds: 240 },
      { exerciseId: 'qu-leg-press',     day: 2, order: 3, sets: 3, reps: 8,  restSeconds: 120 },
      { exerciseId: 'ha-leg-curl',      day: 2, order: 4, sets: 3, reps: 8,  restSeconds: 90  },
      { exerciseId: 'ca-standing-raise',day: 2, order: 5, sets: 4, reps: 10, restSeconds: 60  },
      // Hypertrophy Upper (Day 3)
      { exerciseId: 'ch-incline-bench', day: 3, order: 1, sets: 4, reps: 10, restSeconds: 90  },
      { exerciseId: 'ch-cable-flye',    day: 3, order: 2, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'ba-lat-pulldown',  day: 3, order: 3, sets: 4, reps: 10, restSeconds: 90  },
      { exerciseId: 'ba-cable-row',     day: 3, order: 4, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'sh-lateral-raise', day: 3, order: 5, sets: 4, reps: 15, restSeconds: 60  },
      { exerciseId: 'bi-cable-curl',    day: 3, order: 6, sets: 3, reps: 12, restSeconds: 60  },
      { exerciseId: 'tr-pushdown',      day: 3, order: 7, sets: 3, reps: 12, restSeconds: 60  },
      // Hypertrophy Lower (Day 4)
      { exerciseId: 'qu-hack-squat',    day: 4, order: 1, sets: 4, reps: 10, restSeconds: 120 },
      { exerciseId: 'ha-rdl',           day: 4, order: 2, sets: 4, reps: 10, restSeconds: 120 },
      { exerciseId: 'qu-lunge',         day: 4, order: 3, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'ha-seated-curl',   day: 4, order: 4, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'gl-hip-thrust',    day: 4, order: 5, sets: 3, reps: 12, restSeconds: 90  },
      { exerciseId: 'ca-seated-raise',  day: 4, order: 6, sets: 4, reps: 15, restSeconds: 60  },
    ],
  },
];
