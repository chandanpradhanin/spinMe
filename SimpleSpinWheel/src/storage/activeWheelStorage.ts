import { getWheelById } from './wheelsStorage';
import { readJson, removeKey, writeJson } from './jsonStorage';
import { STORAGE_KEYS } from './keys';

export function getActiveWheelId(): string | null {
  return readJson<string | null>(STORAGE_KEYS.activeWheelId, null);
}

export function setActiveWheelId(id: string | null): void {
  if (id === null) {
    removeKey(STORAGE_KEYS.activeWheelId);
    return;
  }

  writeJson(STORAGE_KEYS.activeWheelId, id);
}

export function getActiveWheel() {
  const activeWheelId = getActiveWheelId();

  if (!activeWheelId) {
    return undefined;
  }

  return getWheelById(activeWheelId);
}
