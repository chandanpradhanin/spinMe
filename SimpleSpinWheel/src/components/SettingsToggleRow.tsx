import { useMemo, type ComponentProps } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { spacing, typography, useTheme } from '../theme';
import { triggerButtonHaptic } from '../utils';

import {
  SETTINGS_ROW_DIVIDER_INSET,
  SettingsRowLeading,
} from './SettingsRowLeading';

type SettingsToggleRowProps = {
  label: string;
  icon: ComponentProps<typeof SettingsRowLeading>['icon'];
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
};

export function SettingsToggleRow({
  label,
  icon,
  value,
  onValueChange,
  showDivider = true,
}: SettingsToggleRowProps) {
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
        divider: {
          backgroundColor: colors.border,
          height: StyleSheet.hairlineWidth,
          marginLeft: SETTINGS_ROW_DIVIDER_INSET,
        },
      }),
    [colors],
  );

  return (
    <>
      <View style={styles.row}>
        <SettingsRowLeading icon={icon}>
          <Text style={styles.label}>{label}</Text>
        </SettingsRowLeading>
        <Switch
          onValueChange={value => {
            triggerButtonHaptic('selection');
            onValueChange(value);
          }}
          thumbColor="#FFFFFF"
          trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
          value={value}
        />
      </View>
      {showDivider ? <View style={styles.divider} /> : null}
    </>
  );
}
