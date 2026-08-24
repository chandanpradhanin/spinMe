import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { radius, shadows, spacing, useTheme } from '../theme';

type CardProps = {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  variant?: 'elevated' | 'flat';
};

export function Card({
  children,
  style,
  padded = true,
  variant = 'elevated',
}: CardProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: variant === 'flat' ? colors.surfaceAlt : colors.card,
          borderRadius: radius.card,
          overflow: 'hidden',
          ...(variant === 'elevated' ? shadows.soft : null),
        },
        padded: {
          padding: spacing.lg,
        },
      }),
    [colors.card, colors.surfaceAlt, variant],
  );

  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {children}
    </View>
  );
}
