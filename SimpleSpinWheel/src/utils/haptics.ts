import { trigger } from 'react-native-haptic-feedback';

import { getSettings } from '../storage';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
} as const;

export type ButtonHapticType = 'selection' | 'impact';

type HapticOptions = {
  force?: boolean;
};

function shouldTriggerHaptic(force = false): boolean {
  return force || getSettings().hapticsEnabled;
}

/** Kept for API compatibility — gating is handled in JS, not via native kill switch. */
export function syncNativeHapticsEnabled(_enabled: boolean): void {
  // Intentionally empty: setEnabled(false) blocks forced onboarding haptics too.
}

export function hapticImpact(force = false) {
  if (!shouldTriggerHaptic(force)) {
    return;
  }

  trigger('impactMedium', options);
}

export function hapticSuccess() {
  if (!shouldTriggerHaptic()) {
    return;
  }

  trigger('notificationSuccess', options);
}

export function hapticSelection(force = false) {
  if (!shouldTriggerHaptic(force)) {
    return;
  }

  trigger('selection', options);
}

export function triggerButtonHaptic(
  type: ButtonHapticType = 'selection',
  hapticOptions: HapticOptions = {},
) {
  if (!shouldTriggerHaptic(hapticOptions.force)) {
    return;
  }

  trigger(type === 'impact' ? 'impactMedium' : 'selection', options);
}

export function withHapticPress(
  onPress?: () => void,
  type: ButtonHapticType = 'selection',
  hapticOptions: HapticOptions = {},
): () => void {
  return () => {
    triggerButtonHaptic(type, hapticOptions);
    onPress?.();
  };
}
