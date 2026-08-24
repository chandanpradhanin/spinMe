import type { Wheel, WheelSegment } from '../types';
import { createId } from '../utils/id';

import {
  DEFAULT_SEGMENT_COLORS,
  DEFAULT_SEGMENT_LABELS,
  DEFAULT_WHEEL_NAME,
} from './constants';

export function createSegment(
  label: string,
  color: string,
  weight?: number,
): WheelSegment {
  return {
    id: createId(),
    label,
    color,
    weight,
  };
}

export function createDefaultSegments(): WheelSegment[] {
  return DEFAULT_SEGMENT_LABELS.map((label, index) =>
    createSegment(label, DEFAULT_SEGMENT_COLORS[index % DEFAULT_SEGMENT_COLORS.length]),
  );
}

export function createWheel(name = DEFAULT_WHEEL_NAME): Wheel {
  const timestamp = Date.now();

  return {
    id: createId(),
    name,
    segments: createDefaultSegments(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function touchWheel(wheel: Wheel, changes: Partial<Pick<Wheel, 'name' | 'segments'>>): Wheel {
  return {
    ...wheel,
    ...changes,
    updatedAt: Date.now(),
  };
}

export function duplicateWheel(wheel: Wheel, name?: string): Wheel {
  const timestamp = Date.now();

  return {
    id: createId(),
    name: name ?? `${wheel.name} Copy`,
    segments: wheel.segments.map(segment => ({
      ...segment,
      id: createId(),
    })),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
