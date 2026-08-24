import { useMemo } from 'react';
import { StyleSheet, Text, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useMotion } from '../hooks';
import { radius, shadows, spacing, typography, useTheme } from '../theme';

import { HapticPressable } from './HapticPressable';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
  compact?: boolean;
};

export function Button({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
  compact = false,
}: ButtonProps) {
  const { colors } = useTheme();
  const { motionEnabled } = useMotion();
  const scale = useSharedValue(1);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scaleWrap: {
          alignSelf: 'stretch',
        },
        base: {
          alignItems: 'center',
          borderRadius: radius.button,
          justifyContent: 'center',
          minHeight: compact ? 40 : 52,
          paddingHorizontal: compact ? spacing.md : spacing.lg,
        },
        primary: {
          backgroundColor: colors.primary,
          ...shadows.soft,
        },
        primaryPressed: {
          backgroundColor: colors.primaryDark,
        },
        secondary: {
          backgroundColor: colors.surface,
          ...shadows.soft,
        },
        ghost: {
          backgroundColor: colors.surfaceAlt,
        },
        disabled: {
          opacity: 0.45,
        },
        label: {
          ...typography.body,
          color: colors.onPrimary,
          fontWeight: '600',
        },
        secondaryLabel: {
          color: colors.text,
        },
        ghostLabel: {
          color: colors.textSecondary,
          fontWeight: '500',
        },
      }),
    [colors, compact],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled || !motionEnabled || variant !== 'primary') {
      return;
    }

    scale.value = withTiming(0.96, { duration: 90 });
  };

  const handlePressOut = () => {
    if (!motionEnabled || variant !== 'primary') {
      scale.value = 1;
      return;
    }

    scale.value = withTiming(1, { duration: 140 });
  };

  return (
    <Animated.View style={[styles.scaleWrap, animatedStyle, style]}>
      <HapticPressable
        accessibilityRole="button"
        disabled={disabled}
        hapticType={variant === 'primary' ? 'impact' : 'selection'}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'primary' && pressed && styles.primaryPressed,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          disabled && styles.disabled,
        ]}>
        <Text
          style={[
            styles.label,
            variant === 'secondary' && styles.secondaryLabel,
            variant === 'ghost' && styles.ghostLabel,
          ]}>
          {label}
        </Text>
      </HapticPressable>
    </Animated.View>
  );
}
