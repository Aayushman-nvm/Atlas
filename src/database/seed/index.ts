import * as SQLite from 'expo-sqlite';
import { EXERCISES } from './exercises';
import { PRESET_SPLITS } from './splits';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export async function seedDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  const seeded = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'seeded'"
  );
  if (seeded) return;

  await db.withTransactionAsync(async () => {
    // Seed exercises
    for (const ex of EXERCISES) {
      await db.runAsync(
        `INSERT OR IGNORE INTO exercises
           (id, name, category, sub_category, muscle_group, equipment, tutorial_url, difficulty, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ex.id, ex.name, ex.category, ex.subCategory, ex.muscleGroup, ex.equipment, ex.tutorialUrl, ex.difficulty, ex.notes]
      );
    }

    // Seed preset splits
    for (const split of PRESET_SPLITS) {
      await db.runAsync(
        `INSERT OR IGNORE INTO splits (id, name, description, is_preset) VALUES (?, ?, ?, 1)`,
        [split.id, split.name, split.description]
      );

      for (const ex of split.exercises) {
        const id = generateId();
        await db.runAsync(
          `INSERT OR IGNORE INTO split_exercises
             (id, split_id, exercise_id, day, sort_order, sets, reps, rest_seconds)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, split.id, ex.exerciseId, ex.day, ex.order, ex.sets, ex.reps, ex.restSeconds]
        );
      }
    }

    // Default settings
    const defaults: Record<string, string> = {
      theme: 'system',
      strictMode: 'flexible',
      units: 'kg',
      defaultRestSeconds: '90',
      soundEnabled: 'true',
      vibrationEnabled: 'true',
    };
    for (const [key, value] of Object.entries(defaults)) {
      await db.runAsync(
        `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
        [key, value]
      );
    }

    // Mark as seeded
    await db.runAsync(
      `INSERT INTO settings (key, value) VALUES ('seeded', 'true')`
    );
  });
}
