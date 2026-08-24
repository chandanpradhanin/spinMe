import type { Wheel, WheelSegment } from '../types';

export type ValidationError = {
  field: string;
  message: string;
};

const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

export function getSegmentWeight(segment: WheelSegment): number {
  return segment.weight ?? 1;
}

export function validateSegment(
  segment: WheelSegment,
  index: number,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `segments[${index}]`;

  if (!segment.label.trim()) {
    errors.push({
      field: `${prefix}.label`,
      message: 'Segment label is required.',
    });
  }

  if (!HEX_COLOR_PATTERN.test(segment.color)) {
    errors.push({
      field: `${prefix}.color`,
      message: 'Segment color must be a valid hex value.',
    });
  }

  const weight = getSegmentWeight(segment);
  if (!Number.isFinite(weight) || weight <= 0) {
    errors.push({
      field: `${prefix}.weight`,
      message: 'Segment weight must be greater than 0.',
    });
  }

  return errors;
}

export function validateWheel(wheel: Wheel): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!wheel.name.trim()) {
    errors.push({
      field: 'name',
      message: 'Wheel name is required.',
    });
  }

  if (wheel.segments.length < 2) {
    errors.push({
      field: 'segments',
      message: 'A wheel must have at least 2 segments.',
    });
  }

  wheel.segments.forEach((segment, index) => {
    errors.push(...validateSegment(segment, index));
  });

  return errors;
}

export function canSpin(segments: WheelSegment[]): boolean {
  return validateWheel({
    id: 'validation-only',
    name: 'validation-only',
    segments,
    createdAt: 0,
    updatedAt: 0,
  }).length === 0;
}
