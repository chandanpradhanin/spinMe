import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticPressable } from '../components/HapticPressable';

import { ONBOARDING_COLORS, ONBOARDING_PAGES, ONBOARDING_RADIUS } from './constants';
import { OnboardingPageContent } from './OnboardingPageContent';
import { OnboardingPageIndicator } from './OnboardingPageIndicator';

type OnboardingScreenProps = {
  onComplete: () => void;
};

function deferAction(action: () => void) {
  requestAnimationFrame(action);
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastPage = currentIndex === ONBOARDING_PAGES.length - 1;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ animated: false, x: 0, y: 0 });
    });

    return () => cancelAnimationFrame(frame);
  }, [width]);

  const completeOnboarding = useCallback(() => {
    deferAction(onComplete);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const handlePrimaryAction = useCallback(() => {
    if (currentIndexRef.current >= ONBOARDING_PAGES.length - 1) {
      completeOnboarding();
      return;
    }

    const nextIndex = currentIndexRef.current + 1;
    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    scrollRef.current?.scrollTo({
      animated: true,
      x: nextIndex * width,
    });
  }, [completeOnboarding, width]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    },
    [width],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          backgroundColor: ONBOARDING_COLORS.background,
          flex: 1,
        },
        header: {
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingBottom: 8,
          paddingHorizontal: 20,
          paddingTop: insets.top + 8,
        },
        skipButton: {
          borderRadius: ONBOARDING_RADIUS,
          paddingHorizontal: 14,
          paddingVertical: 8,
        },
        skipButtonPressed: {
          backgroundColor: ONBOARDING_COLORS.chipBackground,
        },
        skipLabel: {
          color: ONBOARDING_COLORS.muted,
          fontSize: 16,
          fontWeight: '600',
        },
        pager: {
          flex: 1,
        },
        pageSlot: {
          flex: 1,
        },
        footer: {
          gap: 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 28,
          paddingTop: 12,
        },
        primaryButton: {
          alignItems: 'center',
          backgroundColor: ONBOARDING_COLORS.primary,
          borderRadius: ONBOARDING_RADIUS,
          justifyContent: 'center',
          minHeight: 56,
          paddingHorizontal: 24,
        },
        primaryButtonPressed: {
          opacity: 0.92,
        },
        primaryButtonLabel: {
          color: '#FFFFFF',
          fontSize: 17,
          fontWeight: '600',
        },
      }),
    [insets.bottom, insets.top],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <HapticPressable
          accessibilityLabel="Skip onboarding"
          accessibilityRole="button"
          forceHaptic
          hapticType="impact"
          hitSlop={8}
          onPress={handleSkip}
          style={({ pressed }) => [
            styles.skipButton,
            pressed && styles.skipButtonPressed,
          ]}>
          <Text style={styles.skipLabel}>Skip</Text>
        </HapticPressable>
      </View>

      <ScrollView
        ref={scrollRef}
        bounces={false}
        decelerationRate="fast"
        horizontal
        onMomentumScrollEnd={handleMomentumScrollEnd}
        pagingEnabled
        removeClippedSubviews
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={styles.pager}>
        {ONBOARDING_PAGES.map((page, index) => (
          <View key={page.id} style={[styles.pageSlot, { width }]}>
            {Math.abs(index - currentIndex) <= 1 ? (
              <OnboardingPageContent page={page} width={width} />
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <OnboardingPageIndicator
          count={ONBOARDING_PAGES.length}
          currentIndex={currentIndex}
        />

        <HapticPressable
          accessibilityLabel={isLastPage ? 'Start spinning' : 'Next onboarding page'}
          accessibilityRole="button"
          forceHaptic
          hapticType="impact"
          onPress={handlePrimaryAction}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}>
          <Text style={styles.primaryButtonLabel}>
            {isLastPage ? 'Start Spinning' : 'Next'}
          </Text>
        </HapticPressable>
      </View>
    </View>
  );
}
