import { useMemo, type ComponentProps } from 'react';
import { StyleSheet, Text, type ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { radius, spacing, typography, useTheme } from '../theme';
import type { ButtonHapticType } from '../utils';

import { HapticPressable } from './HapticPressable';

type IconActionButtonProps = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  compact?: boolean;
  hapticType?: ButtonHapticType;
};

export function IconActionButton({
  label,
  icon,
  onPress,
  disabled = false,
  style,
  compact = false,
  hapticType = 'selection',
}: IconActionButtonProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.button,
          borderWidth: 1,
          flex: 1,
          gap: spacing.xs,
          justifyContent: 'center',
          minHeight: compact ? 56 : 72,
          paddingHorizontal: spacing.sm,
          paddingVertical: compact ? spacing.sm : spacing.md,
        },
        pressed: {
          backgroundColor: colors.surfaceAlt,
        },
        disabled: {
          opacity: 0.45,
        },
        label: {
          ...typography.caption,
          color: colors.text,
          fontWeight: '500',
          textAlign: 'center',
          textTransform: 'none',
        },
      }),
    [colors, compact],
  );

  return (
    <HapticPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      hapticType={hapticType}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Ionicons color={colors.text} name={icon} size={22} />
      <Text style={styles.label}>{label}</Text>
    </HapticPressable>
  );
}
