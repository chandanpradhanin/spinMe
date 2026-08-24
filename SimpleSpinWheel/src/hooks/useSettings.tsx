import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getSettings, updateSettings as persistSettings } from '../storage';
import type { AppSettings } from '../types';

type SettingsContextValue = {
  settings: AppSettings;
  updateSettings: (changes: Partial<AppSettings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

type SettingsProviderProps = {
  children: ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  const updateSettings = useCallback((changes: Partial<AppSettings>) => {
    setSettings(persistSettings(changes));
  }, []);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
    }),
    [settings, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }

  return context;
}
