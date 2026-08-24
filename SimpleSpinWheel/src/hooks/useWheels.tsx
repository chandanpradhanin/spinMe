import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { createWheel } from '../domain';
import {
  deleteWheel,
  getActiveWheel,
  getActiveWheelId,
  getWheels,
  saveWheel,
  setActiveWheelId,
} from '../storage';
import type { Wheel } from '../types';

type WheelsContextValue = {
  wheels: Wheel[];
  activeWheel: Wheel | undefined;
  activeWheelId: string | null;
  refresh: () => void;
  selectWheel: (wheelId: string) => void;
  upsertWheel: (wheel: Wheel) => void;
  removeWheel: (wheelId: string) => void;
  addWheel: () => Wheel;
};

const WheelsContext = createContext<WheelsContextValue | null>(null);

type WheelsProviderProps = {
  children: ReactNode;
};

export function WheelsProvider({ children }: WheelsProviderProps) {
  const [wheels, setWheels] = useState<Wheel[]>(() => getWheels());
  const [activeWheelId, setActiveId] = useState<string | null>(() =>
    getActiveWheelId(),
  );

  const refresh = useCallback(() => {
    setWheels(getWheels());
    setActiveId(getActiveWheelId());
  }, []);

  const activeWheel = useMemo(() => {
    if (!activeWheelId) {
      return undefined;
    }

    return wheels.find(wheel => wheel.id === activeWheelId) ?? getActiveWheel();
  }, [activeWheelId, wheels]);

  const selectWheel = useCallback(
    (wheelId: string) => {
      setActiveWheelId(wheelId);
      refresh();
    },
    [refresh],
  );

  const upsertWheel = useCallback(
    (wheel: Wheel) => {
      saveWheel(wheel);
      refresh();
    },
    [refresh],
  );

  const removeWheel = useCallback(
    (wheelId: string) => {
      deleteWheel(wheelId);

      if (getActiveWheelId() === wheelId) {
        const remaining = getWheels();
        setActiveWheelId(remaining[0]?.id ?? null);
      }

      refresh();
    },
    [refresh],
  );

  const addWheel = useCallback(() => {
    const wheel = createWheel();
    saveWheel(wheel);
    setActiveWheelId(wheel.id);
    refresh();
    return wheel;
  }, [refresh]);

  const value = useMemo(
    () => ({
      wheels,
      activeWheel,
      activeWheelId,
      refresh,
      selectWheel,
      upsertWheel,
      removeWheel,
      addWheel,
    }),
    [
      activeWheel,
      activeWheelId,
      addWheel,
      refresh,
      removeWheel,
      selectWheel,
      upsertWheel,
      wheels,
    ],
  );

  return (
    <WheelsContext.Provider value={value}>{children}</WheelsContext.Provider>
  );
}

export function useWheels() {
  const context = useContext(WheelsContext);

  if (!context) {
    throw new Error('useWheels must be used within WheelsProvider');
  }

  return context;
}
