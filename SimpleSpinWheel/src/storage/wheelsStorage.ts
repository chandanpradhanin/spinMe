import type { Wheel } from '../types';

import { readJson, writeJson } from './jsonStorage';
import { STORAGE_KEYS } from './keys';

export function getWheels(): Wheel[] {
  return readJson<Wheel[]>(STORAGE_KEYS.wheels, []);
}

export function getWheelById(id: string): Wheel | undefined {
  return getWheels().find(wheel => wheel.id === id);
}

export function saveWheel(wheel: Wheel): void {
  const wheels = getWheels();
  const existingIndex = wheels.findIndex(item => item.id === wheel.id);

  if (existingIndex >= 0) {
    wheels[existingIndex] = wheel;
  } else {
    wheels.push(wheel);
  }

  writeJson(
    STORAGE_KEYS.wheels,
    wheels.sort((left, right) => right.updatedAt - left.updatedAt),
  );
}

export function deleteWheel(id: string): void {
  writeJson(
    STORAGE_KEYS.wheels,
    getWheels().filter(wheel => wheel.id !== id),
  );
}

export function replaceWheels(wheels: Wheel[]): void {
  writeJson(STORAGE_KEYS.wheels, wheels);
}
