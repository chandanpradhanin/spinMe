import { createWheel } from '../domain';

import { getActiveWheelId, setActiveWheelId } from './activeWheelStorage';
import { hasCompletedOnboarding } from './onboardingStorage';
import { getWheels, saveWheel } from './wheelsStorage';

let bootstrapped = false;

export function bootstrapStorage(): void {
  if (bootstrapped || !hasCompletedOnboarding()) {
    return;
  }

  bootstrapped = true;

  const wheels = getWheels();

  if (wheels.length === 0) {
    const wheel = createWheel();
    saveWheel(wheel);
    setActiveWheelId(wheel.id);
    return;
  }

  if (!getActiveWheelId()) {
    setActiveWheelId(wheels[0].id);
  }
}
