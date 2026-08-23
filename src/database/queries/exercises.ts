import type { Exercise } from '@/types';
import type { SQLiteDatabase } from 'expo-sqlite';

function rowToExercise(row: Record<string, unknown>): Exercise {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as Exercise['category'],
    subCategory: row.sub_category as string,
    muscleGroup: row.muscle_group as Exercise['muscleGroup'],
    equipment: row.equipment as Exercise['equipment'],
    tutorialUrl: row.tutorial_url as string,
    difficulty: row.difficulty as Exercise['difficulty'],
    notes: row.notes as string,
  };
}

export async function getAllExercises(db: SQLiteDatabase): Promise<Exercise[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM exercises ORDER BY category, name`
  );
  return rows.map(rowToExercise);
}

export async function getExercisesByCategory(
  db: SQLiteDatabase,
  category: Exercise['category']
): Promise<Exercise[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM exercises WHERE category = ? ORDER BY name`,
    [category]
  );
  return rows.map(rowToExercise);
}

export async function getExerciseById(
  db: SQLiteDatabase,
  id: string
): Promise<Exercise | null> {
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM exercises WHERE id = ?`,
    [id]
  );
  return row ? rowToExercise(row) : null;
}

export async function searchExercises(
  db: SQLiteDatabase,
  query: string
): Promise<Exercise[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM exercises WHERE name LIKE ? OR muscle_group LIKE ? ORDER BY name`,
    [`%${query}%`, `%${query}%`]
  );
  return rows.map(rowToExercise);
}

export async function getWarmupExercises(db: SQLiteDatabase): Promise<Exercise[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM exercises WHERE category = 'Warmup' ORDER BY name`
  );
  return rows.map(rowToExercise);
}
