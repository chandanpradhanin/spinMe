import { SPIN_DURATION_MS } from '../../src/domain/constants';
import { buildSpinTickSchedule } from '../../src/utils/spinTickSchedule';

describe('buildSpinTickSchedule', () => {
  it('starts immediately and stays within the spin duration', () => {
    const times = buildSpinTickSchedule(SPIN_DURATION_MS, 8);

    expect(times[0]).toBe(0);
    expect(times.length).toBeGreaterThan(10);
    expect(times[times.length - 1]).toBeLessThan(SPIN_DURATION_MS);
  });

  it('slows down toward the end', () => {
    const times = buildSpinTickSchedule(SPIN_DURATION_MS, 6);
    const earlyGap = times[2]! - times[1]!;
    const lateGap = times[times.length - 1]! - times[times.length - 2]!;

    expect(lateGap).toBeGreaterThan(earlyGap);
  });

  it('scales tick count with segment count', () => {
    const fewSegments = buildSpinTickSchedule(SPIN_DURATION_MS, 4);
    const manySegments = buildSpinTickSchedule(SPIN_DURATION_MS, 12);

    expect(manySegments.length).toBeGreaterThan(fewSegments.length);
  });
});
