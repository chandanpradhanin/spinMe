export {
  DEFAULT_FULL_SPINS,
  DEFAULT_SEGMENT_COLORS,
  DEFAULT_SEGMENT_LABELS,
  DEFAULT_SEGMENT_WEIGHT,
  DEFAULT_WHEEL_NAME,
  MIN_SEGMENTS,
  MIN_SEGMENT_WEIGHT,
  SPIN_DURATION_MS,
  WHEEL_POINTER_ANGLE,
} from './constants';
export {
  computeNextRotation,
  computeSpinRotation,
  getRestingRotation,
  getSegmentLayout,
  layoutSegments,
  normalizeRotationDegrees,
} from './segments';
export type { SegmentLayout } from './segments';
export { createSpinOutcome, pickWinner } from './spin';
export type { SpinOutcome } from './spin';
export {
  canSpin,
  getSegmentWeight,
  validateSegment,
  validateWheel,
} from './validation';
export type { ValidationError } from './validation';
export {
  createDefaultSegments,
  createSegment,
  createWheel,
  duplicateWheel,
  touchWheel,
} from './wheelFactory';
