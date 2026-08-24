import { useMemo, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useTheme } from '../theme';

import { HapticPressable } from './HapticPressable';
import {
  SETTINGS_ROW_DIVIDER_INSET,
  SettingsRowLeading,
} from './SettingsRowLeading';

type SettingsLinkRowProps = {
  label: string;
  icon: ComponentProps<typeof SettingsRowLeading>['icon'];
  onPress: () => void;
  showDivider?: boolean;
};

export function SettingsLinkRow({
  label,
  icon,
  onPress,
  showDivider = true,
}: SettingsLinkRowProps) {
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
        chevron: {
          ...typography.body,
          color: colors.textSecondary,
          fontSize: 20,
          lineHeight: 22,
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
      <HapticPressable hapticType="selection" onPress={onPress} style={styles.row}>
        <SettingsRowLeading icon={icon}>
          <Text style={styles.label}>{label}</Text>
        </SettingsRowLeading>
        <Text style={styles.chevron}>›</Text>
      </HapticPressable>
      {showDivider ? <View style={styles.divider} /> : null}
    </>
  );
}
