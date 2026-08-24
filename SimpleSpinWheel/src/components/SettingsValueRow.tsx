import { useMemo, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useTheme } from '../theme';

import { SettingsRowLeading } from './SettingsRowLeading';

type SettingsValueRowProps = {
  label: string;
  icon: ComponentProps<typeof SettingsRowLeading>['icon'];
  value: string;
};

export function SettingsValueRow({ label, icon, value }: SettingsValueRowProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          minHeight: 54,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        },
        label: {
          ...typography.body,
          color: colors.text,
        },
        value: {
          ...typography.body,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.row}>
      <SettingsRowLeading icon={icon}>
        <Text style={styles.label}>{label}</Text>
      </SettingsRowLeading>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
