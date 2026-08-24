import type { SpinResult } from '../types';

import { readJson, writeJson } from './jsonStorage';
import { STORAGE_KEYS } from './keys';

const MAX_HISTORY_ITEMS = 100;

export function getSpinHistory(): SpinResult[] {
  return readJson<SpinResult[]>(STORAGE_KEYS.spinHistory, []);
}

export function addSpinResult(result: SpinResult): void {
  const history = [result, ...getSpinHistory()].slice(0, MAX_HISTORY_ITEMS);
  writeJson(STORAGE_KEYS.spinHistory, history);
}

export function clearSpinHistory(): void {
  writeJson(STORAGE_KEYS.spinHistory, []);
}

export function getSpinHistoryForWheel(wheelId: string): SpinResult[] {
  return getSpinHistory().filter(result => result.wheelId === wheelId);
}
