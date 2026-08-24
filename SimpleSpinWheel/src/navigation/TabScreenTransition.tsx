import { useIsFocused, useNavigationState } from '@react-navigation/native';
import { useEffect, useRef, type ReactNode } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useMotion } from '../hooks';

type TabScreenTransitionProps = {
  children: ReactNode;
};

const TAB_ENTER_SPRING = {
  damping: 26,
  mass: 0.85,
  stiffness: 165,
};

let lastFocusedTabIndex = 0;

export function TabScreenTransition({ children }: TabScreenTransitionProps) {
  const isFocused = useIsFocused();
  const { motionEnabled } = useMotion();
  const focusedTabIndex = useNavigationState(state => state.index);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const wasFocused = useRef(isFocused);

  useEffect(() => {
    if (!motionEnabled) {
      opacity.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
      return;
    }

    if (isFocused && !wasFocused.current) {
      const direction = focusedTabIndex >= lastFocusedTabIndex ? 1 : -1;
      lastFocusedTabIndex = focusedTabIndex;

      opacity.value = 0.72;
      translateX.value = direction * 18;
      translateY.value = 6;
      scale.value = 0.985;

      opacity.value = withTiming(1, {
        duration: 340,
        easing: Easing.out(Easing.cubic),
      });
      translateX.value = withSpring(0, TAB_ENTER_SPRING);
      translateY.value = withSpring(0, TAB_ENTER_SPRING);
      scale.value = withSpring(1, TAB_ENTER_SPRING);
    }

    if (!isFocused) {
      opacity.value = withTiming(1, { duration: 120 });
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
    }

    wasFocused.current = isFocused;
  }, [
    focusedTabIndex,
    isFocused,
    motionEnabled,
    opacity,
    scale,
    translateX,
    translateY,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
