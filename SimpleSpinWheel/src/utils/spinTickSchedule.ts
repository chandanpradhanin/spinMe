import { DEFAULT_FULL_SPINS, SPIN_DURATION_MS } from '../domain/constants';

const MIN_TICKS = 14;
const MAX_TICKS = 42;
const MIN_TICK_GAP_MS = 52;

/** Slowing tick cadence that matches the wheel easing — fast at first, slower at the end. */
export function buildSpinTickSchedule(
  durationMs: number = SPIN_DURATION_MS,
  segmentCount: number,
): number[] {
  const safeSegments = Math.max(segmentCount, 2);
  const crossingEstimate = DEFAULT_FULL_SPINS * safeSegments;
  const tickCount = Math.min(
    Math.max(crossingEstimate, MIN_TICKS),
    MAX_TICKS,
  );

  if (tickCount <= 1) {
    return [0];
  }

  const weights = Array.from({ length: tickCount - 1 }, (_, index) => {
    const progress = index / (tickCount - 1);
    return 0.45 + progress * progress * 2.75;
  });

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const playableWindow = Math.max(durationMs - 80, MIN_TICK_GAP_MS);

  const times: number[] = [0];
  let elapsed = 0;

  for (const weight of weights) {
    elapsed += (weight / totalWeight) * playableWindow;

    if (elapsed - times[times.length - 1]! < MIN_TICK_GAP_MS) {
      elapsed = times[times.length - 1]! + MIN_TICK_GAP_MS;
    }

    if (elapsed >= playableWindow) {
      break;
    }

    times.push(Math.round(elapsed));
  }

  return times;
}
