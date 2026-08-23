import { getDatabase } from '@/database/db';
import { loadSettings, saveSettings } from '@/database/queries/settings';
import type { Settings } from '@/types';
import { create } from 'zustand';

interface SettingsState extends Settings {
  loaded: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'system',
  strictMode: 'flexible',
  units: 'kg',
  defaultRestSeconds: 90,
  soundEnabled: true,
  vibrationEnabled: true,
  loaded: false,

  load: async () => {
    const db = await getDatabase();
    const settings = await loadSettings(db);
    set({ ...settings, loaded: true });
  },

  update: async (patch) => {
    set(patch);
    const db = await getDatabase();
    await saveSettings(db, patch);
  },
}));
