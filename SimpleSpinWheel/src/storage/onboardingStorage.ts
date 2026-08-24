import { STORAGE_KEYS } from './keys';
import { storage } from './mmkv';

export function hasCompletedOnboarding(): boolean {
  return storage.getBoolean(STORAGE_KEYS.onboardingComplete) ?? false;
}

export function setOnboardingComplete(): void {
  storage.set(STORAGE_KEYS.onboardingComplete, true);
}

export function resetOnboarding(): void {
  storage.remove(STORAGE_KEYS.onboardingComplete);
}
