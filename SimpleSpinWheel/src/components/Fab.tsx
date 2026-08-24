import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_OVERLAY_HEIGHT } from '../navigation/FloatingTabBar';
import { shadows, spacing, useTheme } from '../theme';

import { HapticPressable } from './HapticPressable';

type FabProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function Fab({
  onPress,
  accessibilityLabel = 'Create wheel',
}: FabProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        fab: {
          alignItems: 'center',
          backgroundColor: colors.primary,
          borderRadius: 28,
          bottom: insets.bottom + TAB_BAR_OVERLAY_HEIGHT + spacing.md,
          height: 56,
          justifyContent: 'center',
          position: 'absolute',
          right: spacing.lg,
          width: 56,
          ...shadows.medium,
        },
        pressed: {
          backgroundColor: colors.primaryDark,
        },
      }),
    [colors.primary, colors.primaryDark, insets.bottom],
  );

  return (
    <HapticPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hapticType="impact"
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <Ionicons color={colors.onPrimary} name="add" size={28} />
    </HapticPressable>
  );
}
