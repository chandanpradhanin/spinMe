import SoundPlayer from 'react-native-sound-player';

import { SPIN_DURATION_MS } from '../domain/constants';
import { getSettings } from '../storage';

import { buildSpinTickSchedule } from './spinTickSchedule';

const SPIN_TICK = require('../../assets/sounds/spin-tick.wav');
const SPIN_WIN = require('../../assets/sounds/spin-win.wav');

let spinTickTimeouts: Array<ReturnType<typeof setTimeout>> = [];
let spinActive = false;

function canPlaySound(): boolean {
  return getSettings().soundEnabled;
}

function playTickSafely(): void {
  try {
    SoundPlayer.playAsset(SPIN_TICK);
  } catch {
    // Ignore playback errors when another tick is still finishing.
  }
}

function clearSpinTickTimeouts(): void {
  spinTickTimeouts.forEach(timeout => clearTimeout(timeout));
  spinTickTimeouts = [];
}

export { buildSpinTickSchedule } from './spinTickSchedule';

export function playSpinSound(segmentCount = 8): void {
  if (!canPlaySound()) {
    return;
  }

  stopSpinSound();
  spinActive = true;

  const tickTimes = buildSpinTickSchedule(SPIN_DURATION_MS, segmentCount);

  spinTickTimeouts = tickTimes.map(delay =>
    setTimeout(() => {
      if (spinActive) {
        playTickSafely();
      }
    }, delay),
  );

  spinTickTimeouts.push(
    setTimeout(() => {
      spinActive = false;
    }, SPIN_DURATION_MS + 100),
  );
}

export function stopSpinSound(): void {
  spinActive = false;
  clearSpinTickTimeouts();

  try {
    SoundPlayer.stop();
  } catch {
    // No active sound to stop.
  }
}

export function playWinSound(): void {
  if (!canPlaySound()) {
    return;
  }

  stopSpinSound();

  try {
    SoundPlayer.playAsset(SPIN_WIN);
  } catch {
    // Ignore playback errors on unsupported devices.
  }
}
