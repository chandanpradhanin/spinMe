import { useCallback, useRef, useState } from 'react';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  runOnJS,
  runOnUI,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import {
  canSpin,
  computeNextRotation,
  createSpinOutcome,
  SPIN_DURATION_MS,
} from '../domain';
import type { SpinOutcome } from '../domain';
import { getSettings } from '../storage';
import type { WheelSegment } from '../types';
import { playSpinSound, playWinSound, stopSpinSound } from '../utils/sound';

/** Fast start with a long, smooth deceleration — mimics a real wheel slowing down. */
const SPIN_EASING = Easing.bezier(0.08, 0.82, 0.12, 1);

type UseSpinAnimationOptions = {
  onSpinComplete?: (outcome: SpinOutcome) => void;
};

type UseSpinAnimationResult = {
  rotation: SharedValue<number>;
  isSpinning: boolean;
  lastOutcome: SpinOutcome | null;
  spin: (wheelId: string, segments: WheelSegment[]) => SpinOutcome | null;
  resetOutcome: () => void;
};

export function useSpinAnimation(
  options: UseSpinAnimationOptions = {},
): UseSpinAnimationResult {
  const { onSpinComplete } = options;
  const rotation = useSharedValue(0);
  const pendingOutcomeRef = useRef<SpinOutcome | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastOutcome, setLastOutcome] = useState<SpinOutcome | null>(null);

  const finishSpin = useCallback(
    (outcome: SpinOutcome) => {
      stopSpinSound();
      setIsSpinning(false);
      requestAnimationFrame(() => {
        setLastOutcome(outcome);
        onSpinComplete?.(outcome);
        playWinSound();
      });
    },
    [onSpinComplete],
  );

  const finishSpinFromAnimation = useCallback(() => {
    const outcome = pendingOutcomeRef.current;
    pendingOutcomeRef.current = null;

    if (!outcome) {
      return;
    }

    finishSpin(outcome);
  }, [finishSpin]);

  const spin = useCallback(
    (wheelId: string, segments: WheelSegment[]) => {
      if (isSpinning || !canSpin(segments)) {
        return null;
      }

      const outcome = createSpinOutcome(wheelId, segments);
      const nextRotation = computeNextRotation(
        rotation.value,
        outcome.targetRotation,
      );
      const reduceMotion = getSettings().reduceMotionEnabled;

      setIsSpinning(true);
      pendingOutcomeRef.current = outcome;

      if (reduceMotion) {
        rotation.value = nextRotation;
        pendingOutcomeRef.current = null;
        finishSpin(outcome);
        return outcome;
      }

      runOnUI((target: number) => {
        'worklet';

        cancelAnimation(rotation);
        rotation.value = withTiming(
          target,
          {
            duration: SPIN_DURATION_MS,
            easing: SPIN_EASING,
            reduceMotion: ReduceMotion.Never,
          },
          finished => {
            'worklet';

            if (finished) {
              runOnJS(finishSpinFromAnimation)();
            }
          },
        );
      })(nextRotation);

      requestAnimationFrame(() => {
        playSpinSound(segments.length);
      });

      return outcome;
    },
    [finishSpin, finishSpinFromAnimation, isSpinning, rotation],
  );

  const resetOutcome = useCallback(() => {
    setLastOutcome(null);
  }, []);

  return {
    rotation,
    isSpinning,
    lastOutcome,
    spin,
    resetOutcome,
  };
}
