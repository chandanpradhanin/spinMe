import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import { useEffect, useMemo, type ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticPressable } from '../components/HapticPressable';
import { radius, shadows, spacing, useTheme } from '../theme';

const TAB_BAR_HEIGHT = 52;
const ACTIVE_PILL_WIDTH = 54;
const ACTIVE_PILL_HEIGHT = 38;
const BAR_HORIZONTAL_INSET = spacing.lg;
const BAR_INNER_PADDING = spacing.xs;

const PILL_SPRING = {
  damping: 24,
  mass: 0.82,
  stiffness: 155,
};

const ICON_SPRING = {
  damping: 18,
  mass: 0.7,
  stiffness: 210,
};

/** Space occupied by the floating tab bar above the safe-area inset. */
export const TAB_BAR_OVERLAY_HEIGHT =
  TAB_BAR_HEIGHT + spacing.xs + spacing.sm * 2;

type TabBarIconSlotProps = {
  focused: boolean;
  children: ReactNode;
  onLongPress: () => void;
  onPress: () => void;
  accessibilityLabel?: string;
  style: object;
};

function TabBarIconSlot({
  focused,
  children,
  onLongPress,
  onPress,
  accessibilityLabel,
  style,
}: TabBarIconSlotProps) {
  const scale = useSharedValue(focused ? 1 : 0.9);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.9, ICON_SPRING);
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <HapticPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      hapticType="selection"
      onLongPress={onLongPress}
      onPress={onPress}
      style={style}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </HapticPressable>
  );
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const tabCount = state.routes.length;
  const barWidth = screenWidth - BAR_HORIZONTAL_INSET * 2;
  const slotWidth =
    (barWidth - BAR_INNER_PADDING * 2) / Math.max(tabCount, 1);

  const pillOffset = useSharedValue(
    state.index * slotWidth + (slotWidth - ACTIVE_PILL_WIDTH) / 2,
  );

  useEffect(() => {
    pillOffset.value = withSpring(
      state.index * slotWidth + (slotWidth - ACTIVE_PILL_WIDTH) / 2,
      PILL_SPRING,
    );
  }, [pillOffset, slotWidth, state.index]);

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillOffset.value }],
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          backgroundColor: 'transparent',
          bottom: 0,
          left: 0,
          paddingBottom: Math.max(insets.bottom, spacing.sm) + spacing.sm,
          paddingHorizontal: BAR_HORIZONTAL_INSET,
          paddingTop: spacing.xs,
          position: 'absolute',
          right: 0,
        },
        barOuter: {
          ...shadows.medium,
          borderRadius: radius.full,
        },
        bar: {
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.18)'
            : 'rgba(255, 255, 255, 0.85)',
          borderRadius: radius.full,
          borderWidth: 1,
          height: TAB_BAR_HEIGHT,
          overflow: 'hidden',
        },
        blur: {
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        },
        glassTint: {
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          backgroundColor: isDark
            ? 'rgba(15, 23, 42, 0.28)'
            : 'rgba(255, 255, 255, 0.22)',
        },
        tabsRow: {
          alignItems: 'center',
          flexDirection: 'row',
          height: TAB_BAR_HEIGHT,
          paddingHorizontal: BAR_INNER_PADDING,
          position: 'relative',
        },
        activePill: {
          backgroundColor: isDark ? '#F8FAFC' : '#111827',
          borderRadius: ACTIVE_PILL_HEIGHT / 2,
          height: ACTIVE_PILL_HEIGHT,
          left: BAR_INNER_PADDING,
          position: 'absolute',
          top: (TAB_BAR_HEIGHT - ACTIVE_PILL_HEIGHT) / 2,
          width: ACTIVE_PILL_WIDTH,
        },
        tab: {
          alignItems: 'center',
          height: TAB_BAR_HEIGHT,
          justifyContent: 'center',
          width: slotWidth,
        },
      }),
    [insets.bottom, isDark, slotWidth],
  );

  const blurType =
    Platform.OS === 'ios'
      ? isDark
        ? 'chromeMaterialDark'
        : 'chromeMaterialLight'
      : isDark
        ? 'dark'
        : 'light';

  return (
    <View pointerEvents="box-none" style={styles.shell}>
      <View style={styles.barOuter}>
        <View style={styles.bar}>
          <BlurView
            blurAmount={Platform.OS === 'ios' ? 20 : 24}
            blurType={blurType}
            overlayColor={
              Platform.OS === 'android'
                ? isDark
                  ? 'rgba(15, 23, 42, 0.45)'
                  : 'rgba(255, 255, 255, 0.35)'
                : undefined
            }
            reducedTransparencyFallbackColor={
              isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.82)'
            }
            style={styles.blur}
          />
          <View pointerEvents="none" style={styles.glassTint} />

          <View style={styles.tabsRow}>
            <Animated.View style={[styles.activePill, pillAnimatedStyle]} />

            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              const iconColor = isFocused
                ? isDark
                  ? '#0F172A'
                  : '#FFFFFF'
                : isDark
                  ? 'rgba(248, 250, 252, 0.62)'
                  : 'rgba(17, 24, 39, 0.5)';

              const icon = options.tabBarIcon?.({
                focused: isFocused,
                color: iconColor,
                size: 21,
              });

              return (
                <TabBarIconSlot
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  focused={isFocused}
                  key={route.key}
                  onLongPress={onLongPress}
                  onPress={onPress}
                  style={styles.tab}>
                  {icon}
                </TabBarIconSlot>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
