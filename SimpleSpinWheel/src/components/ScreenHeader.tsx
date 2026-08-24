import { useMemo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useTheme } from '../theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  compact?: boolean;
};

export function ScreenHeader({
  title,
  subtitle,
  action,
  compact = false,
}: ScreenHeaderProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          alignItems: 'flex-start',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: compact ? spacing.sm : spacing.lg,
        },
        textBlock: {
          flex: 1,
          paddingRight: spacing.md,
        },
        title: {
          ...(compact ? typography.title : typography.largeTitle),
          color: colors.text,
        },
        subtitle: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '400',
          marginTop: spacing.xs,
          textTransform: 'none',
        },
      }),
    [colors, compact],
  );

  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}
