import type { AppSettings } from '../types';

import { DEFAULT_SETTINGS } from '../types/settings';
import { readJson, writeJson } from './jsonStorage';
import { STORAGE_KEYS } from './keys';

export function getSettings(): AppSettings {
  return readJson<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  writeJson(STORAGE_KEYS.settings, settings);
}

export function updateSettings(changes: Partial<AppSettings>): AppSettings {
  const next = { ...getSettings(), ...changes };
  saveSettings(next);
  return next;
}
