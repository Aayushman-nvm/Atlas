import type { WorkoutSession, WorkoutSet } from '@/types';
import type { SQLiteDatabase } from 'expo-sqlite';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function rowToSession(row: Record<string, unknown>): WorkoutSession {
  return {
    id: row.id as string,
    splitId: row.split_id as string,
    startTime: row.start_time as number,
    endTime: (row.end_time as number | null) ?? null,
    duration: (row.duration as number | null) ?? null,
  };
}

function rowToSet(row: Record<string, unknown>): WorkoutSet {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    exerciseId: row.exercise_id as string,
    setNumber: row.set_number as number,
    weight: row.weight as number,
    repsCompleted: row.reps_completed as number,
    completedAt: row.completed_at as number,
  };
}

export async function createSession(
  db: SQLiteDatabase,
  splitId: string
): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO workout_sessions (id, split_id, start_time) VALUES (?, ?, ?)`,
    [id, splitId, now]
  );
  return id;
}

export async function completeSession(
  db: SQLiteDatabase,
  sessionId: string
): Promise<void> {
  const session = await db.getFirstAsync<{ start_time: number }>(
    `SELECT start_time FROM workout_sessions WHERE id = ?`,
    [sessionId]
  );
  if (!session) return;

  const now = Date.now();
  const duration = Math.round((now - session.start_time) / 1000);
  await db.runAsync(
    `UPDATE workout_sessions SET end_time = ?, duration = ? WHERE id = ?`,
    [now, duration, sessionId]
  );
}

export async function logSet(
  db: SQLiteDatabase,
  sessionId: string,
  exerciseId: string,
  setNumber: number,
  weight: number,
  repsCompleted: number
): Promise<string> {
  const id = generateId();
  await db.runAsync(
    `INSERT INTO workout_sets (id, session_id, exercise_id, set_number, weight, reps_completed, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, sessionId, exerciseId, setNumber, weight, repsCompleted, Date.now()]
  );
  return id;
}

export async function getSessionSets(
  db: SQLiteDatabase,
  sessionId: string
): Promise<WorkoutSet[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM workout_sets WHERE session_id = ? ORDER BY completed_at`,
    [sessionId]
  );
  return rows.map(rowToSet);
}

export async function getAllSessions(db: SQLiteDatabase): Promise<WorkoutSession[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT ws.*, s.name as split_name
     FROM workout_sessions ws
     JOIN splits s ON ws.split_id = s.id
     WHERE ws.end_time IS NOT NULL
     ORDER BY ws.start_time DESC`
  );
  return rows.map((row) => ({
    ...rowToSession(row),
    split: {
      id: row.split_id as string,
      name: row.split_name as string,
      isPreset: false,
    },
  }));
}

export async function getLastPerformance(
  db: SQLiteDatabase,
  exerciseId: string
): Promise<{ weight: number; reps: number; date: number } | null> {
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT ws.weight, ws.reps_completed, ws.completed_at
     FROM workout_sets ws
     WHERE ws.exercise_id = ?
     ORDER BY ws.completed_at DESC
     LIMIT 1`,
    [exerciseId]
  );
  if (!row) return null;
  return {
    weight: row.weight as number,
    reps: row.reps_completed as number,
    date: row.completed_at as number,
  };
}

export async function getSessionById(
  db: SQLiteDatabase,
  sessionId: string
): Promise<WorkoutSession | null> {
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM workout_sessions WHERE id = ?`,
    [sessionId]
  );
  return row ? rowToSession(row) : null;
}

export async function getSessionTotalVolume(
  db: SQLiteDatabase,
  sessionId: string
): Promise<number> {
  const row = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(weight * reps_completed), 0) as total FROM workout_sets WHERE session_id = ?`,
    [sessionId]
  );
  return row?.total ?? 0;
}
