export type AppSettings = {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  darkModeEnabled: boolean;
  reduceMotionEnabled: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  hapticsEnabled: true,
  soundEnabled: true,
  darkModeEnabled: false,
  reduceMotionEnabled: false,
};
