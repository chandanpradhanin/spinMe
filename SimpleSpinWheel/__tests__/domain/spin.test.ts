import {
  canSpin,
  computeNextRotation,
  computeSpinRotation,
  createSpinOutcome,
  createWheel,
  getRestingRotation,
  layoutSegments,
  normalizeRotationDegrees,
  pickWinner,
  validateWheel,
} from '../../src/domain';
import type { WheelSegment } from '../../src/types';

const segments: WheelSegment[] = [
  { id: 'a', label: 'A', color: '#6366F1', weight: 1 },
  { id: 'b', label: 'B', color: '#EC4899', weight: 1 },
  { id: 'c', label: 'C', color: '#F59E0B', weight: 2 },
];

describe('validateWheel', () => {
  it('accepts a valid wheel', () => {
    const wheel = createWheel('Lunch');
    expect(validateWheel(wheel)).toEqual([]);
    expect(canSpin(wheel.segments)).toBe(true);
  });

  it('rejects wheels with fewer than two segments', () => {
    const errors = validateWheel({
      id: '1',
      name: 'Invalid',
      segments: [{ id: 'a', label: 'Only one', color: '#6366F1' }],
      createdAt: 0,
      updatedAt: 0,
    });

    expect(errors.some(error => error.field === 'segments')).toBe(true);
  });
});

describe('layoutSegments', () => {
  it('covers the full circle using weights', () => {
    const layouts = layoutSegments(segments);
    const totalSweep = layouts.reduce((sum, layout) => sum + layout.sweepAngle, 0);

    expect(layouts).toHaveLength(3);
    expect(totalSweep).toBeCloseTo(360, 5);
    expect(layouts[2].sweepAngle).toBeCloseTo(180, 5);
  });
});

describe('pickWinner', () => {
  it('respects weighted randomness', () => {
    const winner = pickWinner(segments, () => 0.74);
    expect(winner.index).toBe(2);
    expect(winner.segment.label).toBe('C');
  });

  it('selects the first segment for low random values', () => {
    const winner = pickWinner(segments, () => 0.1);
    expect(winner.index).toBe(0);
  });
});

describe('createSpinOutcome', () => {
  it('returns a rotation that targets the winning segment', () => {
    const outcome = createSpinOutcome('wheel-1', segments, {
      random: () => 0.1,
      fullSpins: 5,
      spunAt: 1000,
    });

    const layouts = layoutSegments(segments);
    expect(outcome.targetRotation).toBe(
      computeSpinRotation(layouts, outcome.winnerIndex, 5),
    );
    expect(outcome.result).toMatchObject({
      wheelId: 'wheel-1',
      segmentId: 'a',
      segmentLabel: 'A',
      segmentColor: '#6366F1',
      spunAt: 1000,
    });
  });

  it('aligns resting rotation with the animated end angle', () => {
    const outcome = createSpinOutcome('wheel-1', segments, {
      random: () => 0.1,
      fullSpins: 5,
    });
    const nextRotation = computeNextRotation(0, outcome.targetRotation);
    const restingRotation = getRestingRotation(segments, outcome.winnerIndex);

    expect(normalizeRotationDegrees(nextRotation)).toBe(restingRotation);
  });
});
