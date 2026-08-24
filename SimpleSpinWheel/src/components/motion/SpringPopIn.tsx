import { useEffect, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useMotion } from '../../hooks';

type SpringPopInProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SpringPopIn({ children, style }: SpringPopInProps) {
  const { motionEnabled } = useMotion();
  const opacity = useSharedValue(motionEnabled ? 0 : 1);
  const scale = useSharedValue(motionEnabled ? 0.88 : 1);

  useEffect(() => {
    if (!motionEnabled) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    opacity.value = 0;
    scale.value = 0.88;
    opacity.value = withTiming(1, { duration: 220 });
    scale.value = withSpring(1, {
      damping: 11,
      stiffness: 220,
    });
  }, [motionEnabled, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
