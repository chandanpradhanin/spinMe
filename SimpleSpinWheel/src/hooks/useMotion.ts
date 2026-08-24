import { useSettings } from './useSettings';
import { useSystemReduceMotion } from './useSystemReduceMotion';

export function useMotion() {
  const { settings } = useSettings();
  const systemReduceMotion = useSystemReduceMotion();

  return {
    motionEnabled: !settings.reduceMotionEnabled && !systemReduceMotion,
    systemReduceMotion,
  };
}
