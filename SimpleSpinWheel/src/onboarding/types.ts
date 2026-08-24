export type OnboardingIllustrationVariant = 'decide' | 'together' | 'create';

export type OnboardingPage = {
  id: string;
  title: string;
  description: string;
  illustration: OnboardingIllustrationVariant;
  chips?: string[];
};
