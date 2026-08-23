import * as SQLite from 'expo-sqlite';
import { initDatabase } from './schema';
import { seedDatabase } from './seed';

export { DB_NAME } from './schema';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('atlas.db');
  await initDatabase(_db);
  await seedDatabase(_db);
  return _db;
}
