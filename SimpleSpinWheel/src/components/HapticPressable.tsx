import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';

import { triggerButtonHaptic, type ButtonHapticType } from '../utils/haptics';

type HapticPressableProps = PressableProps & {
  hapticType?: ButtonHapticType;
  forceHaptic?: boolean;
};

export function HapticPressable({
  hapticType = 'selection',
  forceHaptic = false,
  disabled,
  onPressIn,
  ...props
}: HapticPressableProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={event => {
        if (!disabled) {
          triggerButtonHaptic(hapticType, { force: forceHaptic });
        }
        onPressIn?.(event);
      }}
    />
  );
}
