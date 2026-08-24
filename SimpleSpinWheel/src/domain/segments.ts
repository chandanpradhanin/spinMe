import type { WheelSegment } from '../types';

import { DEFAULT_FULL_SPINS, WHEEL_POINTER_ANGLE } from './constants';
import { getSegmentWeight } from './validation';

export type SegmentLayout = {
  index: number;
  segment: WheelSegment;
  startAngle: number;
  sweepAngle: number;
  midAngle: number;
};

export function layoutSegments(segments: WheelSegment[]): SegmentLayout[] {
  const totalWeight = segments.reduce(
    (sum, segment) => sum + getSegmentWeight(segment),
    0,
  );

  let cursor = WHEEL_POINTER_ANGLE;

  return segments.map((segment, index) => {
    const sweepAngle = (getSegmentWeight(segment) / totalWeight) * 360;
    const startAngle = cursor;
    const midAngle = startAngle + sweepAngle / 2;
    cursor += sweepAngle;

    return {
      index,
      segment,
      startAngle,
      sweepAngle,
      midAngle,
    };
  });
}

export function computeSpinRotation(
  layouts: SegmentLayout[],
  winnerIndex: number,
  fullSpins = DEFAULT_FULL_SPINS,
): number {
  const winner = layouts[winnerIndex];

  if (!winner) {
    throw new Error(`Invalid winner index: ${winnerIndex}`);
  }

  const baseRotation = WHEEL_POINTER_ANGLE - winner.midAngle;
  return fullSpins * 360 + baseRotation;
}

export function computeNextRotation(
  currentRotation: number,
  targetRotation: number,
  fullSpins = DEFAULT_FULL_SPINS,
): number {
  const remainder = normalizeRotationDegrees(currentRotation);
  const targetMod = normalizeRotationDegrees(targetRotation);
  let delta = targetMod - remainder;

  if (delta <= 0) {
    delta += 360;
  }

  return currentRotation + fullSpins * 360 + delta;
}

export function normalizeRotationDegrees(rotation: number): number {
  return ((rotation % 360) + 360) % 360;
}

/** Stable 0–360° resting angle with the winning segment under the pointer. */
export function getRestingRotation(
  segments: WheelSegment[],
  winnerIndex: number,
): number {
  const layouts = layoutSegments(segments);
  const winner = layouts[winnerIndex];

  if (!winner) {
    return 0;
  }

  return normalizeRotationDegrees(WHEEL_POINTER_ANGLE - winner.midAngle);
}

export function getSegmentLayout(
  segments: WheelSegment[],
  segmentId: string,
): SegmentLayout | undefined {
  return layoutSegments(segments).find(layout => layout.segment.id === segmentId);
}
