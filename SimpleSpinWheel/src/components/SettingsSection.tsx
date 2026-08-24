import { useMemo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography, useTheme } from '../theme';

import { Card } from './Card';

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
  first?: boolean;
};

export function SettingsSection({
  title,
  children,
  first = false,
}: SettingsSectionProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          marginBottom: spacing.lg,
          marginTop: first ? 0 : spacing.xl,
        },
        header: {
          ...typography.label,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
          marginLeft: spacing.xs,
        },
        group: {
          borderRadius: radius.input,
          overflow: 'hidden',
        },
      }),
    [colors.textSecondary],
  );

  return (
    <View style={styles.section}>
      <Text style={styles.header}>{title}</Text>
      <Card padded={false} style={styles.group}>
        {children}
      </Card>
    </View>
  );
}
