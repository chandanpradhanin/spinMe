import { useMemo, type ComponentProps, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { spacing, useTheme } from '../theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const SETTINGS_ROW_DIVIDER_INSET =
  spacing.lg + 20 + spacing.md;

type SettingsRowLeadingProps = {
  icon: IoniconName;
  children: ReactNode;
};

export function SettingsRowLeading({ icon, children }: SettingsRowLeadingProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        leading: {
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          gap: spacing.md,
        },
      }),
    [],
  );

  return (
    <View style={styles.leading}>
      <Ionicons color={colors.text} name={icon} size={20} />
      {children}
    </View>
  );
}

export type { IoniconName };
