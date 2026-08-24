import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export function useSystemReduceMotion(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }

    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (mounted) {
          setEnabled(value);
        }
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      value => {
        setEnabled(value);
      },
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return enabled;
}
