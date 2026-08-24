import { useEffect, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useMotion } from '../../hooks';

type FadeInListItemProps = {
  children: ReactNode;
  index: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeInListItem({
  children,
  index,
  style,
}: FadeInListItemProps) {
  const { motionEnabled } = useMotion();
  const opacity = useSharedValue(motionEnabled ? 0 : 1);
  const translateY = useSharedValue(motionEnabled ? 12 : 0);

  useEffect(() => {
    if (!motionEnabled) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    const delay = Math.min(index * 45, 240);
    opacity.value = withDelay(delay, withTiming(1, { duration: 320 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 320 }));
  }, [index, motionEnabled, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
