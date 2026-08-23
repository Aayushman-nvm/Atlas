import type { Settings } from '@/types';
import type { SQLiteDatabase } from 'expo-sqlite';

const DEFAULTS: Settings = {
  theme: 'system',
  strictMode: 'flexible',
  units: 'kg',
  defaultRestSeconds: 90,
  soundEnabled: true,
  vibrationEnabled: true,
};

export async function loadSettings(db: SQLiteDatabase): Promise<Settings> {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    `SELECT key, value FROM settings`
  );
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }

  return {
    theme: (map.theme as Settings['theme']) ?? DEFAULTS.theme,
    strictMode: (map.strictMode as Settings['strictMode']) ?? DEFAULTS.strictMode,
    units: (map.units as Settings['units']) ?? DEFAULTS.units,
    defaultRestSeconds: map.defaultRestSeconds ? parseInt(map.defaultRestSeconds, 10) : DEFAULTS.defaultRestSeconds,
    soundEnabled: map.soundEnabled !== undefined ? map.soundEnabled === 'true' : DEFAULTS.soundEnabled,
    vibrationEnabled: map.vibrationEnabled !== undefined ? map.vibrationEnabled === 'true' : DEFAULTS.vibrationEnabled,
  };
}

export async function saveSetting(
  db: SQLiteDatabase,
  key: keyof Settings,
  value: string
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
    [key, value]
  );
}

export async function saveSettings(
  db: SQLiteDatabase,
  settings: Partial<Settings>
): Promise<void> {
  for (const [key, value] of Object.entries(settings)) {
    await db.runAsync(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      [key, String(value)]
    );
  }
}
