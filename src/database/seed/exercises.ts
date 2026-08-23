import type { Exercise } from '@/types';

export const EXERCISES: Exercise[] = [
  // ─── Warmups ──────────────────────────────────────────────────────────────
  { id: 'w-treadmill',        name: 'Treadmill Walk',        category: 'Warmup', subCategory: 'Cardio',    muscleGroup: 'Full Body', equipment: 'Treadmill',        tutorialUrl: '', difficulty: 'Beginner', notes: '5 min light pace' },
  { id: 'w-arm-circles',      name: 'Arm Circles',           category: 'Warmup', subCategory: 'Mobility',  muscleGroup: 'Shoulders', equipment: 'Bodyweight',       tutorialUrl: '', difficulty: 'Beginner', notes: '30 sec each direction' },
  { id: 'w-band-pull-apart',  name: 'Band Pull Apart',       category: 'Warmup', subCategory: 'Mobility',  muscleGroup: 'Back',      equipment: 'Resistance Band',  tutorialUrl: '', difficulty: 'Beginner', notes: '15 reps' },
  { id: 'w-shoulder-rot',     name: 'Shoulder Rotations',    category: 'Warmup', subCategory: 'Mobility',  muscleGroup: 'Shoulders', equipment: 'Bodyweight',       tutorialUrl: '', difficulty: 'Beginner', notes: '10 each side' },
  { id: 'w-scapular-pulls',   name: 'Scapular Pull-ups',     category: 'Warmup', subCategory: 'Mobility',  muscleGroup: 'Back',      equipment: 'Bodyweight',       tutorialUrl: '', difficulty: 'Beginner', notes: '10 reps' },
  { id: 'w-band-rows',        name: 'Band Rows',             category: 'Warmup', subCategory: 'Mobility',  muscleGroup: 'Back',      equipment: 'Resistance Band',  tutorialUrl: '', difficulty: 'Beginner', notes: '15 reps' },
  { id: 'w-hip-mobility',     name: 'Hip Circles',           category: 'Warmup', subCategory: 'Mobility',  muscleGroup: 'Glutes',    equipment: 'Bodyweight',       tutorialUrl: '', difficulty: 'Beginner', notes: '10 each direction' },
  { id: 'w-leg-swings',       name: 'Leg Swings',            category: 'Warmup', subCategory: 'Mobility',  muscleGroup: 'Hamstrings',equipment: 'Bodyweight',       tutorialUrl: '', difficulty: 'Beginner', notes: '10 each leg' },
  { id: 'w-bw-squats',        name: 'Bodyweight Squats',     category: 'Warmup', subCategory: 'Compound',  muscleGroup: 'Quads',     equipment: 'Bodyweight',       tutorialUrl: '', difficulty: 'Beginner', notes: '15 reps' },

  // ─── Chest ────────────────────────────────────────────────────────────────
  { id: 'ch-bench-press',       name: 'Barbell Bench Press',      category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Chest', equipment: 'Barbell',   tutorialUrl: 'https://youtu.be/vcBig73ojpE', difficulty: 'Intermediate', notes: '' },
  { id: 'ch-incline-bench',     name: 'Incline Barbell Press',    category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Chest', equipment: 'Barbell',   tutorialUrl: 'https://youtu.be/SrqOu55lrYU', difficulty: 'Intermediate', notes: '' },
  { id: 'ch-db-bench',          name: 'Dumbbell Bench Press',     category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Chest', equipment: 'Dumbbell',  tutorialUrl: 'https://youtu.be/QsYre__-aro', difficulty: 'Beginner',      notes: '' },
  { id: 'ch-db-flye',           name: 'Dumbbell Flye',            category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Chest', equipment: 'Dumbbell',  tutorialUrl: 'https://youtu.be/eozdVDA78K0', difficulty: 'Beginner',      notes: '' },
  { id: 'ch-cable-flye',        name: 'Cable Flye',               category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Chest', equipment: 'Cable',     tutorialUrl: 'https://youtu.be/Iwe6AmxVf7o', difficulty: 'Beginner',      notes: '' },
  { id: 'ch-pushup',            name: 'Push-up',                  category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Chest', equipment: 'Bodyweight',tutorialUrl: 'https://youtu.be/IODxDxX7oi4', difficulty: 'Beginner',      notes: '' },
  { id: 'ch-dips',              name: 'Chest Dips',               category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Chest', equipment: 'Bodyweight',tutorialUrl: 'https://youtu.be/2z8JmcrW-As', difficulty: 'Intermediate', notes: 'Forward lean' },

  // ─── Back ─────────────────────────────────────────────────────────────────
  { id: 'ba-deadlift',         name: 'Barbell Deadlift',          category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Back', equipment: 'Barbell',   tutorialUrl: 'https://youtu.be/op9kVnSso6Q', difficulty: 'Advanced',      notes: '' },
  { id: 'ba-row',              name: 'Barbell Bent-Over Row',     category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Back', equipment: 'Barbell',   tutorialUrl: 'https://youtu.be/G8l_8chR5BE', difficulty: 'Intermediate', notes: '' },
  { id: 'ba-pullup',           name: 'Pull-up',                   category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Back', equipment: 'Bodyweight',tutorialUrl: 'https://youtu.be/eGo4IYlbE5g', difficulty: 'Intermediate', notes: '' },
  { id: 'ba-lat-pulldown',     name: 'Lat Pulldown',              category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Back', equipment: 'Cable',     tutorialUrl: 'https://youtu.be/CAwf7n6Luuc', difficulty: 'Beginner',      notes: '' },
  { id: 'ba-cable-row',        name: 'Seated Cable Row',          category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Back', equipment: 'Cable',     tutorialUrl: 'https://youtu.be/GZbfZ033f74', difficulty: 'Beginner',      notes: '' },
  { id: 'ba-db-row',           name: 'Dumbbell Row',              category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Back', equipment: 'Dumbbell',  tutorialUrl: 'https://youtu.be/roCP6wCXPqo', difficulty: 'Beginner',      notes: '' },
  { id: 'ba-face-pull',        name: 'Face Pull',                 category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Back', equipment: 'Cable',     tutorialUrl: 'https://youtu.be/rep-qVOkqgk', difficulty: 'Beginner',      notes: '' },

  // ─── Shoulders ────────────────────────────────────────────────────────────
  { id: 'sh-ohp',             name: 'Overhead Press',             category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Shoulders', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/2yjwXTZQDDI', difficulty: 'Intermediate', notes: '' },
  { id: 'sh-db-press',        name: 'Dumbbell Shoulder Press',    category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Shoulders', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/qEwKCR5JCog', difficulty: 'Beginner',      notes: '' },
  { id: 'sh-lateral-raise',   name: 'Lateral Raise',              category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Shoulders', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/3VcKaXpzqRo', difficulty: 'Beginner',      notes: '' },
  { id: 'sh-front-raise',     name: 'Front Raise',                category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Shoulders', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/sOoBMJ2sTNk', difficulty: 'Beginner',      notes: '' },
  { id: 'sh-rear-delt',       name: 'Rear Delt Flye',             category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Shoulders', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/EA7u4Q_8HQ0', difficulty: 'Beginner',      notes: '' },

  // ─── Biceps ───────────────────────────────────────────────────────────────
  { id: 'bi-barbell-curl',    name: 'Barbell Curl',               category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Biceps', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/kwG2ipFRgfo', difficulty: 'Beginner', notes: '' },
  { id: 'bi-db-curl',         name: 'Dumbbell Curl',              category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Biceps', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/ykJmrZ5v0Oo', difficulty: 'Beginner', notes: '' },
  { id: 'bi-hammer-curl',     name: 'Hammer Curl',                category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Biceps', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/zC3nLlEvin4', difficulty: 'Beginner', notes: '' },
  { id: 'bi-incline-curl',    name: 'Incline Dumbbell Curl',      category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Biceps', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/MkD6M53T9oE', difficulty: 'Intermediate', notes: '' },
  { id: 'bi-cable-curl',      name: 'Cable Curl',                 category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Biceps', equipment: 'Cable',    tutorialUrl: 'https://youtu.be/NFzTWp2qpiE', difficulty: 'Beginner', notes: '' },

  // ─── Triceps ──────────────────────────────────────────────────────────────
  { id: 'tr-skullcrusher',    name: 'Skull Crusher',              category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Triceps', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/ir5PsbniVSc', difficulty: 'Intermediate', notes: '' },
  { id: 'tr-pushdown',        name: 'Cable Pushdown',             category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Triceps', equipment: 'Cable',    tutorialUrl: 'https://youtu.be/2-LAMcpzODU', difficulty: 'Beginner',      notes: '' },
  { id: 'tr-overhead-ext',    name: 'Overhead Tricep Extension',  category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Triceps', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/YbX7Wd8jQ-Q', difficulty: 'Beginner',      notes: '' },
  { id: 'tr-dips',            name: 'Tricep Dips',                category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Triceps', equipment: 'Bodyweight',tutorialUrl: 'https://youtu.be/6kALZikXxLc', difficulty: 'Intermediate', notes: '' },
  { id: 'tr-close-bench',     name: 'Close Grip Bench Press',     category: 'Upper Body', subCategory: 'Compound', muscleGroup: 'Triceps', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/nEF0bv2FW94', difficulty: 'Intermediate', notes: '' },

  // ─── Forearms ─────────────────────────────────────────────────────────────
  { id: 'fo-wrist-curl',      name: 'Wrist Curl',                 category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Forearms', equipment: 'Dumbbell', tutorialUrl: '', difficulty: 'Beginner', notes: '' },
  { id: 'fo-reverse-curl',    name: 'Reverse Curl',               category: 'Upper Body', subCategory: 'Isolation',muscleGroup: 'Forearms', equipment: 'Barbell',  tutorialUrl: '', difficulty: 'Beginner', notes: '' },

  // ─── Quads ────────────────────────────────────────────────────────────────
  { id: 'qu-squat',           name: 'Barbell Back Squat',         category: 'Lower Body', subCategory: 'Compound', muscleGroup: 'Quads', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/ultWZbUMPL8', difficulty: 'Intermediate', notes: '' },
  { id: 'qu-front-squat',     name: 'Front Squat',                category: 'Lower Body', subCategory: 'Compound', muscleGroup: 'Quads', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/m4ytaCJZpl0', difficulty: 'Advanced',      notes: '' },
  { id: 'qu-leg-press',       name: 'Leg Press',                  category: 'Lower Body', subCategory: 'Compound', muscleGroup: 'Quads', equipment: 'Machine',  tutorialUrl: 'https://youtu.be/IZxyjW7MPJQ', difficulty: 'Beginner',      notes: '' },
  { id: 'qu-leg-extension',   name: 'Leg Extension',              category: 'Lower Body', subCategory: 'Isolation',muscleGroup: 'Quads', equipment: 'Machine',  tutorialUrl: 'https://youtu.be/YyvSfVjQeL0', difficulty: 'Beginner',      notes: '' },
  { id: 'qu-lunge',           name: 'Lunges',                     category: 'Lower Body', subCategory: 'Compound', muscleGroup: 'Quads', equipment: 'Dumbbell', tutorialUrl: 'https://youtu.be/QOVaHwm-Q6U', difficulty: 'Beginner',      notes: '' },
  { id: 'qu-hack-squat',      name: 'Hack Squat',                 category: 'Lower Body', subCategory: 'Compound', muscleGroup: 'Quads', equipment: 'Machine',  tutorialUrl: 'https://youtu.be/0tn5K9NlCfo', difficulty: 'Intermediate', notes: '' },

  // ─── Hamstrings ───────────────────────────────────────────────────────────
  { id: 'ha-rdl',             name: 'Romanian Deadlift',          category: 'Lower Body', subCategory: 'Compound', muscleGroup: 'Hamstrings', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/JCXUYuzwNrM', difficulty: 'Intermediate', notes: '' },
  { id: 'ha-leg-curl',        name: 'Lying Leg Curl',             category: 'Lower Body', subCategory: 'Isolation',muscleGroup: 'Hamstrings', equipment: 'Machine',  tutorialUrl: 'https://youtu.be/1Tq3QdYUuHs', difficulty: 'Beginner',      notes: '' },
  { id: 'ha-seated-curl',     name: 'Seated Leg Curl',            category: 'Lower Body', subCategory: 'Isolation',muscleGroup: 'Hamstrings', equipment: 'Machine',  tutorialUrl: 'https://youtu.be/ELOCsoDSmrg', difficulty: 'Beginner',      notes: '' },
  { id: 'ha-sumo-dl',         name: 'Sumo Deadlift',              category: 'Lower Body', subCategory: 'Compound', muscleGroup: 'Hamstrings', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/WmJ7BnPdeSg', difficulty: 'Intermediate', notes: '' },

  // ─── Glutes ───────────────────────────────────────────────────────────────
  { id: 'gl-hip-thrust',      name: 'Hip Thrust',                 category: 'Lower Body', subCategory: 'Compound', muscleGroup: 'Glutes', equipment: 'Barbell',  tutorialUrl: 'https://youtu.be/xDmFkJxPzeM', difficulty: 'Intermediate', notes: '' },
  { id: 'gl-glute-bridge',    name: 'Glute Bridge',               category: 'Lower Body', subCategory: 'Isolation',muscleGroup: 'Glutes', equipment: 'Bodyweight',tutorialUrl: 'https://youtu.be/OUgsJ8-Vi0E', difficulty: 'Beginner',      notes: '' },
  { id: 'gl-cable-kickback',  name: 'Cable Kickback',             category: 'Lower Body', subCategory: 'Isolation',muscleGroup: 'Glutes', equipment: 'Cable',    tutorialUrl: 'https://youtu.be/TcGKxRPTiJQ', difficulty: 'Beginner',      notes: '' },

  // ─── Calves ───────────────────────────────────────────────────────────────
  { id: 'ca-standing-raise',  name: 'Standing Calf Raise',        category: 'Lower Body', subCategory: 'Isolation',muscleGroup: 'Calves', equipment: 'Machine',  tutorialUrl: 'https://youtu.be/JbyjNymZOt0', difficulty: 'Beginner', notes: '' },
  { id: 'ca-seated-raise',    name: 'Seated Calf Raise',          category: 'Lower Body', subCategory: 'Isolation',muscleGroup: 'Calves', equipment: 'Machine',  tutorialUrl: 'https://youtu.be/JbyjNymZOt0', difficulty: 'Beginner', notes: '' },

  // ─── Core ─────────────────────────────────────────────────────────────────
  { id: 'co-crunch',          name: 'Crunch',                     category: 'Core', subCategory: 'Isolation', muscleGroup: 'Abs',      equipment: 'Bodyweight', tutorialUrl: 'https://youtu.be/MKmrqcoCZ-M', difficulty: 'Beginner', notes: '' },
  { id: 'co-plank',           name: 'Plank',                      category: 'Core', subCategory: 'Isometric', muscleGroup: 'Abs',      equipment: 'Bodyweight', tutorialUrl: 'https://youtu.be/ASdvN_XEl_c', difficulty: 'Beginner', notes: '30-60 sec hold' },
  { id: 'co-leg-raise',       name: 'Hanging Leg Raise',          category: 'Core', subCategory: 'Compound',  muscleGroup: 'Abs',      equipment: 'Bodyweight', tutorialUrl: 'https://youtu.be/JB2oyawG9KI', difficulty: 'Intermediate', notes: '' },
  { id: 'co-cable-crunch',    name: 'Cable Crunch',               category: 'Core', subCategory: 'Isolation', muscleGroup: 'Abs',      equipment: 'Cable',      tutorialUrl: 'https://youtu.be/2fbujeH3F0E', difficulty: 'Beginner', notes: '' },
  { id: 'co-russian-twist',   name: 'Russian Twist',              category: 'Core', subCategory: 'Rotation',  muscleGroup: 'Obliques', equipment: 'Bodyweight', tutorialUrl: 'https://youtu.be/wkD8rjkodUI', difficulty: 'Beginner', notes: '' },
  { id: 'co-side-plank',      name: 'Side Plank',                 category: 'Core', subCategory: 'Isometric', muscleGroup: 'Obliques', equipment: 'Bodyweight', tutorialUrl: 'https://youtu.be/K2VljzCC16g', difficulty: 'Beginner', notes: '' },
  { id: 'co-ab-wheel',        name: 'Ab Wheel Rollout',           category: 'Core', subCategory: 'Compound',  muscleGroup: 'Abs',      equipment: 'None',       tutorialUrl: 'https://youtu.be/rEBDNjBjPFM', difficulty: 'Intermediate', notes: '' },
];
