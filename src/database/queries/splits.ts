import type { Split, SplitExercise } from '@/types';
import type { SQLiteDatabase } from 'expo-sqlite';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function rowToSplit(row: Record<string, unknown>): Split {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    isPreset: Boolean(row.is_preset),
  };
}

function rowToSplitExercise(row: Record<string, unknown>): SplitExercise {
  return {
    id: row.id as string,
    splitId: row.split_id as string,
    exerciseId: row.exercise_id as string,
    day: row.day as number,
    order: row.sort_order as number,
    sets: row.sets as number,
    reps: row.reps as number,
    restSeconds: row.rest_seconds as number,
  };
}

export async function getAllSplits(db: SQLiteDatabase): Promise<Split[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM splits ORDER BY is_preset DESC, name`
  );
  return rows.map(rowToSplit);
}

export async function getSplitById(
  db: SQLiteDatabase,
  id: string
): Promise<Split | null> {
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM splits WHERE id = ?`,
    [id]
  );
  return row ? rowToSplit(row) : null;
}

export async function getSplitExercises(
  db: SQLiteDatabase,
  splitId: string,
  day?: number
): Promise<SplitExercise[]> {
  const query = day != null
    ? `SELECT se.*, e.name, e.category, e.sub_category, e.muscle_group, e.equipment, e.tutorial_url, e.difficulty, e.notes
       FROM split_exercises se
       JOIN exercises e ON se.exercise_id = e.id
       WHERE se.split_id = ? AND se.day = ?
       ORDER BY se.sort_order`
    : `SELECT se.*, e.name, e.category, e.sub_category, e.muscle_group, e.equipment, e.tutorial_url, e.difficulty, e.notes
       FROM split_exercises se
       JOIN exercises e ON se.exercise_id = e.id
       WHERE se.split_id = ?
       ORDER BY se.day, se.sort_order`;

  const args = day != null ? [splitId, day] : [splitId];
  const rows = await db.getAllAsync<Record<string, unknown>>(query, args);

  return rows.map((row) => ({
    ...rowToSplitExercise(row),
    exercise: {
      id: row.exercise_id as string,
      name: row.name as string,
      category: row.category as SplitExercise['exercise']['category'],
      subCategory: row.sub_category as string,
      muscleGroup: row.muscle_group as SplitExercise['exercise']['muscleGroup'],
      equipment: row.equipment as SplitExercise['exercise']['equipment'],
      tutorialUrl: row.tutorial_url as string,
      difficulty: row.difficulty as SplitExercise['exercise']['difficulty'],
      notes: row.notes as string,
    },
  }));
}

export async function createSplit(
  db: SQLiteDatabase,
  name: string,
  description?: string
): Promise<string> {
  const id = generateId();
  await db.runAsync(
    `INSERT INTO splits (id, name, description, is_preset) VALUES (?, ?, ?, 0)`,
    [id, name, description ?? '']
  );
  return id;
}

export async function deleteSplit(db: SQLiteDatabase, id: string): Promise<void> {
  await db.withTransactionAsync(async () => {
    // Explicitly remove child rows first — foreign key cascade isn't
    // guaranteed when PRAGMA is set via execAsync in the same connection init.
    await db.runAsync(`DELETE FROM split_exercises WHERE split_id = ?`, [id]);
    await db.runAsync(`DELETE FROM splits WHERE id = ? AND is_preset = 0`, [id]);
  });
}

export async function addExerciseToSplit(
  db: SQLiteDatabase,
  splitId: string,
  exerciseId: string,
  day: number,
  sets: number,
  reps: number,
  restSeconds: number
): Promise<string> {
  const id = generateId();
  // Get current max order for this day
  const maxRow = await db.getFirstAsync<{ max_order: number | null }>(
    `SELECT MAX(sort_order) as max_order FROM split_exercises WHERE split_id = ? AND day = ?`,
    [splitId, day]
  );
  const order = (maxRow?.max_order ?? 0) + 1;
  await db.runAsync(
    `INSERT INTO split_exercises (id, split_id, exercise_id, day, sort_order, sets, reps, rest_seconds)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, splitId, exerciseId, day, order, sets, reps, restSeconds]
  );
  return id;
}

export async function updateSplitExercise(
  db: SQLiteDatabase,
  id: string,
  updates: Partial<{ sets: number; reps: number; restSeconds: number; order: number }>
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (updates.sets !== undefined) { fields.push('sets = ?'); values.push(updates.sets); }
  if (updates.reps !== undefined) { fields.push('reps = ?'); values.push(updates.reps); }
  if (updates.restSeconds !== undefined) { fields.push('rest_seconds = ?'); values.push(updates.restSeconds); }
  if (updates.order !== undefined) { fields.push('sort_order = ?'); values.push(updates.order); }

  if (fields.length === 0) return;
  values.push(id);
  await db.runAsync(`UPDATE split_exercises SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function removeSplitExercise(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(`DELETE FROM split_exercises WHERE id = ?`, [id]);
}

export async function getSplitDayCount(db: SQLiteDatabase, splitId: string): Promise<number> {
  const row = await db.getFirstAsync<{ days: number }>(
    `SELECT MAX(day) as days FROM split_exercises WHERE split_id = ?`,
    [splitId]
  );
  return row?.days ?? 1;
}
