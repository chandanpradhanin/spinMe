import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  ONBOARDING_COLORS,
  ONBOARDING_RADIUS,
} from './constants';
import { OnboardingIllustration } from './OnboardingIllustrations';
import type { OnboardingPage } from './types';

type OnboardingPageContentProps = {
  page: OnboardingPage;
  width: number;
};

function FeatureChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export const OnboardingPageContent = memo(function OnboardingPageContent({
  page,
  width,
}: OnboardingPageContentProps) {
  return (
    <View style={[styles.page, { width }]}>
      <View style={styles.content}>
        <View style={styles.illustrationWrap}>
          <OnboardingIllustration variant={page.illustration} />
        </View>

        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.description}>{page.description}</Text>

        {page.chips?.length ? (
          <View style={styles.chipsWrap}>
            {page.chips.map(chip => (
              <FeatureChip key={chip} label={chip} />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 28,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    color: ONBOARDING_COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    color: ONBOARDING_COLORS.muted,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 24,
  },
  chip: {
    backgroundColor: ONBOARDING_COLORS.chipBackground,
    borderColor: ONBOARDING_COLORS.chipBorder,
    borderRadius: ONBOARDING_RADIUS,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    color: ONBOARDING_COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
