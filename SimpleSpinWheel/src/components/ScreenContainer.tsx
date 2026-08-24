import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gradients, spacing, useTheme } from '../theme';

type ScreenContainerProps = ViewProps & {
  padded?: boolean;
  gradient?: boolean;
  /** When true, content can extend behind the bottom safe area (gradient fills edge-to-edge). */
  edgeToEdge?: boolean;
  contentStyle?: ViewStyle;
};

export function ScreenContainer({
  children,
  padded = true,
  gradient = false,
  edgeToEdge = false,
  style,
  contentStyle,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const useGradient = gradient && !isDark;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
        },
        gradientRoot: {
          backgroundColor: gradients.screen[1],
          flex: 1,
        },
        solid: {
          backgroundColor: colors.background,
        },
      }),
    [colors.background],
  );

  const paddingStyle = {
    paddingTop: insets.top + spacing.sm,
    paddingBottom: edgeToEdge ? 0 : spacing.sm,
    paddingHorizontal: padded ? spacing.lg : 0,
  };

  if (useGradient) {
    return (
      <View style={[styles.gradientRoot, style]}>
        <LinearGradient
          colors={[...gradients.screen]}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[styles.container, paddingStyle, contentStyle]}
          {...props}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, styles.solid, paddingStyle, style, contentStyle]}
      {...props}>
      {children}
    </View>
  );
}
