import { StyleSheet, View } from 'react-native';

import { ONBOARDING_COLORS } from './constants';

type OnboardingPageIndicatorProps = {
  count: number;
  currentIndex: number;
};

export function OnboardingPageIndicator({
  count,
  currentIndex,
}: OnboardingPageIndicatorProps) {
  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === currentIndex;

        return (
          <View
            key={index}
            style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: ONBOARDING_COLORS.primary,
    borderRadius: 999,
    height: 8,
  },
  dotActive: {
    opacity: 1,
    width: 24,
  },
  dotInactive: {
    opacity: 0.35,
    width: 8,
  },
});
