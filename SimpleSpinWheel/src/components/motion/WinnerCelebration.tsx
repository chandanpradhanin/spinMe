import { memo, useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { hapticSuccess } from '../../utils';

const SPARKLES = [
  { color: '#F59E0B', delay: 0, size: 13, x: -42, y: -28 },
  { color: '#6366F1', delay: 60, size: 11, x: 44, y: -30 },
  { color: '#EC4899', delay: 110, size: 12, x: -38, y: 22 },
  { color: '#10B981', delay: 40, size: 13, x: 40, y: 20 },
  { color: '#FBBF24', delay: 85, size: 14, x: 0, y: -38 },
  { color: '#8B5CF6', delay: 25, size: 10, x: -48, y: -4 },
  { color: '#3B82F6', delay: 95, size: 11, x: 48, y: -6 },
  { color: '#F472B6', delay: 130, size: 12, x: -18, y: 34 },
  { color: '#34D399', delay: 75, size: 10, x: 22, y: 36 },
  { color: '#FB7185', delay: 145, size: 11, x: -52, y: 14 },
  { color: '#A78BFA', delay: 50, size: 12, x: 52, y: 12 },
  { color: '#FCD34D', delay: 100, size: 10, x: 0, y: 34 },
  { color: '#6366F1', delay: 160, size: 9, x: -28, y: -36 },
  { color: '#10B981', delay: 120, size: 9, x: 30, y: -34 },
] as const;

type SparkleProps = {
  celebrationKey: string;
  color: string;
  delay: number;
  size: number;
  x: number;
  y: number;
};

function Sparkle({ celebrationKey, color, delay, size, x, y }: SparkleProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    scale.setValue(0);
    translateX.setValue(0);
    translateY.setValue(0);

    const animation = Animated.parallel([
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          duration: 180,
          easing: Easing.out(Easing.quad),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 580,
          easing: Easing.in(Easing.quad),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scale, {
          duration: 360,
          easing: Easing.out(Easing.quad),
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          duration: 400,
          easing: Easing.in(Easing.quad),
          toValue: 0.3,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateX, {
          duration: 760,
          easing: Easing.out(Easing.cubic),
          toValue: x,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          duration: 760,
          easing: Easing.out(Easing.cubic),
          toValue: y,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [celebrationKey, delay, opacity, scale, size, translateX, translateY, x, y]);

  return (
    <Animated.View
      collapsable={false}
      pointerEvents="none"
      style={[
        styles.sparkle,
        {
          opacity,
          transform: [
            { translateX: Animated.subtract(translateX, size / 2) },
            { translateY: Animated.subtract(translateY, size / 2) },
            { scale },
          ],
        },
      ]}>
      <Ionicons color={color} name="star" size={size} />
    </Animated.View>
  );
}

type WinnerCelebrationProps = {
  children: ReactNode;
  celebrationKey: string;
  style?: StyleProp<ViewStyle>;
};

export const WinnerCelebration = memo(function WinnerCelebration({
  children,
  celebrationKey,
  style,
}: WinnerCelebrationProps) {
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    hapticSuccess();
  }, [celebrationKey]);

  useEffect(() => {
    cardOpacity.setValue(0);
    cardScale.setValue(0.82);
    cardTranslateY.setValue(16);

    const animation = Animated.parallel([
      Animated.timing(cardOpacity, {
        duration: 320,
        easing: Easing.out(Easing.quad),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        damping: 13,
        mass: 0.75,
        stiffness: 185,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslateY, {
        damping: 13,
        mass: 0.75,
        stiffness: 185,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [cardOpacity, cardScale, cardTranslateY, celebrationKey]);

  return (
    <View collapsable={false} pointerEvents="box-none" style={styles.wrap}>
      <Animated.View
        style={[
          style,
          {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
          },
        ]}>
        {children}
      </Animated.View>

      <View collapsable={false} pointerEvents="none" style={styles.sparkleLayer}>
        <View style={styles.sparkleOrigin}>
          {SPARKLES.map((sparkle, index) => (
            <Sparkle
              celebrationKey={celebrationKey}
              color={sparkle.color}
              delay={sparkle.delay}
              key={`${celebrationKey}-${index}`}
              size={sparkle.size}
              x={sparkle.x}
              y={sparkle.y}
            />
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    overflow: 'visible',
    position: 'relative',
  },
  sparkleLayer: {
    ...StyleSheet.absoluteFill,
    elevation: 12,
    overflow: 'visible',
    zIndex: 12,
  },
  sparkleOrigin: {
    height: 0,
    left: '50%',
    overflow: 'visible',
    position: 'absolute',
    top: '50%',
    width: 0,
  },
  sparkle: {
    position: 'absolute',
  },
});
