import type { SpinResult, WheelSegment } from '../types';
import { createId } from '../utils/id';

import { DEFAULT_FULL_SPINS } from './constants';
import { computeSpinRotation, layoutSegments } from './segments';
import { canSpin, getSegmentWeight } from './validation';

export type SpinOutcome = {
  result: SpinResult;
  winnerIndex: number;
  winner: WheelSegment;
  targetRotation: number;
};

export function pickWinner(
  segments: WheelSegment[],
  random: () => number = Math.random,
): { segment: WheelSegment; index: number } {
  if (!canSpin(segments)) {
    throw new Error('Cannot pick a winner from an invalid wheel.');
  }

  const totalWeight = segments.reduce(
    (sum, segment) => sum + getSegmentWeight(segment),
    0,
  );

  let threshold = random() * totalWeight;

  for (let index = 0; index < segments.length; index += 1) {
    threshold -= getSegmentWeight(segments[index]);
    if (threshold <= 0) {
      return { segment: segments[index], index };
    }
  }

  const lastIndex = segments.length - 1;
  return { segment: segments[lastIndex], index: lastIndex };
}

export function createSpinOutcome(
  wheelId: string,
  segments: WheelSegment[],
  options?: {
    random?: () => number;
    fullSpins?: number;
    spunAt?: number;
  },
): SpinOutcome {
  const { segment, index } = pickWinner(segments, options?.random);
  const layouts = layoutSegments(segments);
  const targetRotation = computeSpinRotation(
    layouts,
    index,
    options?.fullSpins ?? DEFAULT_FULL_SPINS,
  );

  return {
    winner: segment,
    winnerIndex: index,
    targetRotation,
    result: {
      id: createId(),
      wheelId,
      segmentId: segment.id,
      segmentLabel: segment.label,
      segmentColor: segment.color,
      spunAt: options?.spunAt ?? Date.now(),
    },
  };
}
